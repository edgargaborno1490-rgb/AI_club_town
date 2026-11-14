#!/usr/bin/env node
// Updates town.json for the villagers. Times are Hawaii time.
//   node tools/town.js new-day [--push]
//   node tools/town.js start <agent> "<task>" [--push]
//   node tools/town.js done <agent> ["<note>"] [--push]
//   node tools/town.js log "<text>" [--push]
//   node tools/town.js balance <amount> [--push]
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

function git(...args) {
  return execFileSync('git', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
}

function push(message) {
  git('add', 'town.json');
  if (!git('status', '--porcelain', 'town.json').trim()) return;
  git('commit', '-m', message);
  for (let attempt = 1; attempt <= 4; attempt++) {
    try { git('push', 'origin', 'HEAD:main'); return; } catch (err) {
      if (attempt === 4) throw err;
      try { git('pull', '--rebase', 'origin', 'main'); } catch (_) { /* retry push anyway */ }
      execFileSync('sleep', [String(2 ** attempt)]);
    }
  }
}

function main(argv) {
  const wantPush = argv.includes('--push');
  const [cmd, a, b] = argv.filter(x => x !== '--push');
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
    case 'close-day': next = ops.closeDay(town, now.time); msg = 'Village: day closed'; break;
    default:
      console.error('Usage: node tools/town.js <new-day|start|done|log|balance|close-day|today> [args] [--push]');
      process.exit(2);
  }
  fs.writeFileSync(FILE, JSON.stringify(next, null, 2) + '\n');
  console.log(`town.json: ${cmd} ok`);
  if (wantPush) push(msg);
}

if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (err) { console.error(err.message); process.exit(1); }
}
module.exports = { honolulu };
