#!/usr/bin/env node
// Updates town.json for the villagers. Times are Hawaii time.
//   node tools/town.js new-day [--push]
//   node tools/town.js start <agent> "<task>" [--push]
//   node tools/town.js done <agent> ["<note>"] [--push]
//   node tools/town.js log "<text>" [--push]
//   node tools/town.js balance <amount> [--push]
//   node tools/town.js followers <youtube|tiktok|instagram|facebook> <n> [--push]
//   node tools/town.js followers <n> [--push]          (only before per-platform counts exist)
//   node tools/town.js bird add|remove <username> [--push]   (only followers who asked)
//   node tools/town.js bird trial <username> [hours=24] [--push]  (commented BIRD, not following yet:
//                                    tiny name, gone after the hours unless `bird keep <username>`)
//   node tools/town.js latest "<video title>" <https link> [--push]
//   node tools/town.js close-day [--push]
//   node tools/town.js today          (prints the Hawaii date, for folder names)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ops = require('./town-ops.js');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'town.json');

function honolulu(d = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Pacific/Honolulu', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: 'numeric', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(d).map(p => [p.type, p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${Number(parts.hour)}:${parts.minute}` };
}

// Commits town.json (plus anything already committed) and pushes to main.
// If main moved, rebases and retries; if that rebase conflicts, it undoes the rebase
// and stops with an error instead of pushing a half-finished state.
function push(message, root = ROOT) {
  const git = (...args) => execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
  git('add', 'town.json');
  if (git('status', '--porcelain', 'town.json').trim()) git('commit', '-m', message, '--', 'town.json');
  for (let attempt = 1; attempt <= 4; attempt++) {
    try { git('push', 'origin', 'HEAD:main'); return; } catch (err) {
      if (attempt === 4) throw err;
    }
    try {
      git('pull', '--rebase', 'origin', 'main');
    } catch (err) {
      try { git('rebase', '--abort'); } catch (_) { /* nothing to abort */ }
      throw new Error('Push stopped: a conflict with newer changes on main (someone else changed the same file). ' +
        'Nothing was lost locally. Run `git pull --rebase origin main`, fix the conflict, then push.');
    }
    execFileSync('sleep', [String(2 ** attempt)]);
  }
}

function main(argv) {
  const wantPush = argv.includes('--push');
  const [cmd, a, b, c] = argv.filter(x => x !== '--push');
  const now = honolulu();
  if (cmd === 'today') { console.log(now.date); return; }
  const town = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  let next, msg;
  switch (cmd) {
    case 'new-day':   next = ops.newDay(town, now.date); msg = `Village: new day ${now.date}`; break;
    case 'start':     next = ops.start(town, a, b || '', now.time); msg = `Village: ${a} started`; break;
    case 'done':      next = ops.done(town, a, now.time, b); msg = `Village: ${a} done`; break;
    case 'log':       next = ops.log(town, a, now.time); msg = 'Village: log'; break;
    case 'balance':   next = ops.setBalance(town, a); msg = `Village: balance ${next.balance}`; break;
    case 'followers':
      next = b !== undefined ? ops.setPlatform(town, a, b) : ops.setFollowers(town, a);
      msg = b !== undefined ? `Village: ${a} ${b} followers (${next.followers} in all)` : `Village: ${next.followers} followers`; break;
    case 'bird':
      if (a === 'add') { next = ops.addBird(town, b); msg = `Village: bird for ${b}`; break; }
      if (a === 'remove') { next = ops.removeBird(town, b); msg = `Village: bird removed`; break; }
      if (a === 'trial') { next = ops.trialBird(town, b, new Date(), c || 24); msg = `Village: trial bird for ${b}`; break; }
      if (a === 'keep') { next = ops.keepBird(town, b); msg = `Village: ${b} followed, bird kept`; break; }
      if (a === 'prune') { next = ops.pruneBirds(town, new Date()); msg = 'Village: expired trial birds removed'; break; }
      throw new Error('Use: node tools/town.js bird add|remove|trial|keep|prune <username> [hours]');
    case 'latest':    next = ops.setLatest(town, a, b); msg = `Village: latest video ${a}`; break;
    case 'close-day': next = ops.closeDay(town, now.time); msg = 'Village: day closed'; break;
    default:
      console.error('Usage: node tools/town.js <new-day|start|done|log|balance|followers|bird|latest|close-day|today> [args] [--push]');
      process.exit(2);
  }
  fs.writeFileSync(FILE, JSON.stringify(next, null, 2) + '\n');
  console.log(`town.json: ${cmd} ok`);
  if (wantPush) push(msg);
}

if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (err) { console.error(err.message); process.exit(1); }
}
module.exports = { honolulu, push };
