#!/usr/bin/env node
// Checks that a day's script follows the WhiteBucket Explains studio format
// (the same layout as whitebucket-studio/video/scripts/*.md).
//   node tools/check-scripts.js [YYYY-MM-DD]   (defaults to today in Hawaii)
const fs = require('fs');
const path = require('path');

const ENDING = 'Comment NEXT and pick the next topic.';
const TYPES = ['money', 'science', 'news'];
const PLATFORMS = ['TikTok', 'Instagram', 'Facebook', 'YouTube'];

function sections(text) {
  const out = {};
  for (const p of text.split(/^## +/m).slice(1)) {
    const nl = p.indexOf('\n');
    const head = (nl === -1 ? p : p.slice(0, nl)).trim().replace(/\s*\(.*\)$/, '');
    out[head] = nl === -1 ? '' : p.slice(nl + 1).trim();
  }
  return out;
}

const hostsOf = text => [...text.matchAll(/https?:\/\/([^/\s)]+)/g)].map(m => m[1].replace(/^www\./, ''));

function checkSourceGroups(text) {
  const problems = [], groups = [];
  for (const line of text.split('\n').map(l => l.trim()).filter(Boolean)) {
    const isLink = /https?:\/\//.test(line);
    if (!isLink || !groups.length) groups.push({ name: isLink ? 'Sources' : line.replace(/:$/, ''), hosts: new Set() });
    for (const h of hostsOf(line)) groups.at(-1).hosts.add(h);
  }
  for (const g of groups) if (g.hosts.size < 2) problems.push(`Sources must come from at least 2 different sites (${g.name})`);
  return problems;
}

function checkScript(text) {
  const problems = [];
  const firstLine = text.split('\n').find(l => l.trim()) || '';
  if (!/^>\s*\*\*Status: DRAFT/.test(firstLine)) problems.push('First line must be "> **Status: DRAFT – needs review.**" (only the owner approves)');
  if (!/^# WhiteBucket Explains: .+/m.test(text)) problems.push('Missing title line "# WhiteBucket Explains: <title>"');
  const type = (text.match(/^Topic type:\s*(\S+)/m) || [])[1];
  if (!TYPES.includes(type)) problems.push(`Topic type must be one of ${TYPES.join(', ')} (got "${type || ''}")`);

  const s = sections(text);
  for (const name of ['Narration', 'Section plan', 'Fact notes', 'Captions']) if (!s[name]) problems.push(`Missing or empty section: ${name}`);

  if (s.Narration) {
    const n = s.Narration.split(/\s+/).filter(Boolean).length;
    if (n < 170 || n > 210) problems.push(`Narration has ${n} words (needs about 180-200, at most 170-210)`);
    if (!s.Narration.trim().endsWith(ENDING)) problems.push(`Narration must end with exactly "${ENDING}"`);
  }
  if (s['Section plan']) {
    const rows = s['Section plan'].split('\n').filter(l => /^\|/.test(l.trim()) && !/^\|\s*#\s*\|/.test(l.trim()) && !/^\|[\s|:-]+\|$/.test(l.trim()));
    if (rows.length < 4 || rows.length > 8) problems.push(`Section plan has ${rows.length} sections (needs 4-8 table rows)`);
  }
  if (s['Fact notes']) {
    if (hostsOf(s['Fact notes']).length < 2) problems.push('Fact notes need a source link for the claims (at least 2 links)');
    if (!/as of/i.test(s['Fact notes'])) problems.push('Fact notes need an "as of" date');
  }
  if (s.Captions) for (const p of PLATFORMS) if (!new RegExp(`\\b${p}\\b`).test(s.Captions)) problems.push(`Captions missing ${p}`);
  if (type === 'money' && !/not financial advice/i.test(text)) problems.push('Money scripts must include a "not financial advice" line');
  if (type === 'news') {
    if (!s.Sources) problems.push('News scripts need a "## Sources" section grouped by story');
    else problems.push(...checkSourceGroups(s.Sources));
  }
  return problems;
}

function checkDay(dir) {
  if (!fs.existsSync(path.join(dir, 'plan.md'))) return ['plan.md: missing'];
  const scripts = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'plan.md');
  if (scripts.length !== 1) return [`expected exactly 1 script besides plan.md, found ${scripts.length}`];
  return checkScript(fs.readFileSync(path.join(dir, scripts[0]), 'utf8')).map(p => `${scripts[0]}: ${p}`);
}

if (require.main === module) {
  const date = process.argv[2] || require('./town.js').honolulu().date;
  const dir = path.join(__dirname, '..', 'scripts', date);
  const problems = fs.existsSync(dir) ? checkDay(dir) : [`scripts/${date}: folder missing`];
  if (problems.length) { console.log(problems.join('\n')); process.exit(1); }
  console.log(`scripts/${date}: script OK`);
}

module.exports = { checkScript, checkDay, ENDING };
