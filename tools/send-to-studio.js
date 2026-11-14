#!/usr/bin/env node
// Copies a day's DRAFT scripts into the studio and lists them in the studio's IDEAS.md,
// then commits and pushes the studio's main branch.
//   node tools/send-to-studio.js <YYYY-MM-DD> [path-to-whitebucket-studio] [--push]
// Never overwrites a script that already exists in the studio.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HEADER = '| Topic | Script | Voiceover |\n|---|---|---|';

function addReadyRow(ideas, { title, slug, date, voice }) {
  const ref = `\`video/scripts/${slug}.md\``;
  if (ideas.includes(ref)) return ideas;
  const row = `| ${title} | ${ref} (DRAFT, AI Club Town ${date}) | ${voice} |`;
  const lines = ideas.split('\n');
  const start = lines.findIndex(l => /^## Researched, script ready/.test(l));
  if (start === -1) return ideas.replace(/\n*$/, '\n') + `\n## Researched, script ready\n${HEADER}\n${row}\n`;
  let end = start + 1;
  while (end < lines.length && !/^## /.test(lines[end])) end++;
  const section = lines.slice(start + 1, end).filter(l => !/^\|\s*\(none\)/.test(l));
  let lastRow = -1;
  section.forEach((l, i) => { if (/^\|/.test(l)) lastRow = i; });
  if (lastRow === -1) section.splice(0, 0, ...HEADER.split('\n'), row);
  else section.splice(lastRow + 1, 0, row);
  return [...lines.slice(0, start + 1), ...section, ...lines.slice(end)].join('\n');
}

function planEntries(plan) {
  // Plan blocks: "## <desk>" then "- Topic:", "- Slug:", "- Voice:" lines.
  const out = [];
  for (const block of plan.split(/^## /m).slice(1)) {
    const get = k => (block.match(new RegExp(`^-\\s*${k}:\\s*(.+)$`, 'm')) || [])[1];
    const slug = get('Slug'); if (!slug) continue;
    out.push({ title: (get('Topic') || slug).trim(), slug: slug.replace(/`/g, '').trim(), voice: (get('Voice') || 'needs a voice').trim() });
  }
  return out;
}

function main(argv) {
  const push = argv.includes('--push');
  const [date, studioArg] = argv.filter(a => a !== '--push');
  if (!date) { console.error('Usage: node tools/send-to-studio.js <YYYY-MM-DD> [studio-path] [--push]'); process.exit(2); }
  const root = path.join(__dirname, '..');
  const studio = path.resolve(studioArg || path.join(root, '..', 'whitebucket-studio'));
  const dayDir = path.join(root, 'scripts', date);
  const ideasFile = path.join(studio, 'video', 'IDEAS.md');
  if (!fs.existsSync(ideasFile)) throw new Error(`Can't find the studio at ${studio}`);
  let ideas = fs.readFileSync(ideasFile, 'utf8');
  const sent = [];
  for (const e of planEntries(fs.readFileSync(path.join(dayDir, 'plan.md'), 'utf8'))) {
    const from = path.join(dayDir, e.slug + '.md');
    const to = path.join(studio, 'video', 'scripts', e.slug + '.md');
    if (!fs.existsSync(from)) { console.error(`skip ${e.slug}: no script in ${dayDir}`); continue; }
    if (fs.existsSync(to)) { console.error(`skip ${e.slug}: the studio already has video/scripts/${e.slug}.md`); continue; }
    fs.copyFileSync(from, to);
    ideas = addReadyRow(ideas, { ...e, date });
    sent.push(e.slug);
  }
  fs.writeFileSync(ideasFile, ideas);
  console.log(sent.length ? `sent to studio: ${sent.join(', ')}` : 'nothing new to send');
  if (!push || !sent.length) return;
  const git = (...a) => execFileSync('git', a, { cwd: studio, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
  git('add', 'video/IDEAS.md', ...sent.map(s => `video/scripts/${s}.md`));
  git('commit', '-m', `AI Club Town: ${sent.length} DRAFT script(s) for ${date}`);
  for (let attempt = 1; attempt <= 4; attempt++) {
    try { git('push', 'origin', 'HEAD:main'); console.log('pushed to whitebucket-studio main'); return; } catch (err) {
      if (attempt === 4) throw err;
    }
    try { git('pull', '--rebase', 'origin', 'main'); } catch (err) {
      try { git('rebase', '--abort'); } catch (_) { /* nothing to abort */ }
      throw new Error('Push stopped: a conflict with newer changes in the studio. Nothing was lost locally.');
    }
    execFileSync('sleep', [String(2 ** attempt)]);
  }
}

if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (err) { console.error(err.message); process.exit(1); }
}
module.exports = { addReadyRow, planEntries };
