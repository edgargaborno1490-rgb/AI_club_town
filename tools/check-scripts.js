#!/usr/bin/env node
// Checks that a day's script follows the WhiteBucket Explains studio format
// (the same layout as whitebucket-studio/video/scripts/*.md).
//   node tools/check-scripts.js [YYYY-MM-DD]   (defaults to today in Hawaii)
const fs = require('fs');
const path = require('path');

// From Nov 17, 2026 (owner's change): short dailies (30-45 s). Hook first, the explainer, then a short
// island checkup at the END, then the BIRD line, then the "See you tomorrow" line.
const ENDING = 'See you tomorrow for another island update!';
const BIRD_LINE = 'Follow and comment BIRD, and your name goes on a bird on our island.';
const DAILY_WORDS = [90, 125]; // about 30-45 s, including the island checkup, BIRD line and ending
const TYPES = ['money', 'science', 'news', 'village', 'island'];
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

// Packaging (from Nov 17, 2026): 5 title + cover ideas, scored, and a pick that is the title line.
//   | # | Title | Cover words | Score | Why |   then a line "Pick: #3"
const PACKAGED = ['money', 'science', 'news'];
function checkPackaging(body, title) {
  const problems = [];
  const rows = body.split('\n').map(l => l.trim())
    .filter(l => /^\|/.test(l) && !/^\|\s*#\s*\|/.test(l) && !/^\|[\s|:-]+\|$/.test(l))
    .map(l => l.replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
  if (rows.length !== 5) problems.push(`Packaging needs exactly 5 ideas (got ${rows.length})`);
  for (const [i, r] of rows.entries()) {
    const [, t = '', cover = '', score = ''] = r;
    if (!t || t.length > 100) problems.push(`Packaging idea ${i + 1}: title must be 1-100 characters`);
    if (!cover || cover.split(/\s+/).length > 6) problems.push(`Packaging idea ${i + 1}: cover words must be 1-6 words`);
    if (!/^(10|\d)\s*\/\s*10$/.test(score)) problems.push(`Packaging idea ${i + 1}: score must look like "8/10"`);
  }
  const pick = (body.match(/^Pick:\s*#?(\d)/m) || [])[1];
  if (!pick || pick < 1 || pick > rows.length) problems.push('Packaging needs a line "Pick: #<1-5>"');
  else if (rows[pick - 1] && title && rows[pick - 1][1] !== title) problems.push(`The title line must be the picked title: "${rows[pick - 1][1]}"`);
  return problems;
}

const ELI6_FROM = '2026-11-20'; // first village day written with "Explain like I'm 6"
function checkScript(text, date) {
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
    // AI Village videos (intro, weekly updates) may run to ~90 s and use their own ending.
    // Island clips are short (15-30 s).
    const [lo, hi] = type === 'island' ? [35, 80] : type === 'village' ? [170, 240] : DAILY_WORDS;
    if (n < lo || n > hi) problems.push(`Narration has ${n} words (needs ${lo}-${hi})`);
    if (!['village', 'island'].includes(type)) {
      const nar = s.Narration.trim();
      if (!nar.endsWith(ENDING)) problems.push(`Narration must end with exactly "${ENDING}"`);
      else if (!nar.slice(0, -ENDING.length).trim().endsWith(BIRD_LINE)) problems.push(`Narration must say "${BIRD_LINE}" right before "${ENDING}"`);
    }
  }
  if (s['Section plan']) {
    const rows = s['Section plan'].split('\n').filter(l => /^\|/.test(l.trim()) && !/^\|\s*#\s*\|/.test(l.trim()) && !/^\|[\s|:-]+\|$/.test(l.trim()));
    const [rlo, rhi] = type === 'island' ? [2, 5] : [4, 10]; // hook, explainer rows, island checkup, end card
    if (rows.length < rlo || rows.length > rhi) problems.push(`Section plan has ${rows.length} sections (needs ${rlo}-${rhi} table rows)`);
  }
  if (s['Fact notes']) {
    if (!['village', 'island'].includes(type) && hostsOf(s['Fact notes']).length < 2) problems.push('Fact notes need a source link for the claims (at least 2 links)');
    if (!/as of/i.test(s['Fact notes'])) problems.push('Fact notes need an "as of" date');
  }
  if (s.Captions) for (const p of PLATFORMS) if (!new RegExp(`\\b${p}\\b`).test(s.Captions)) problems.push(`Captions missing ${p}`);
  if (PACKAGED.includes(type)) {
    if (!s.Packaging) problems.push('Missing or empty section: Packaging (5 scored title + cover ideas; see the packaging skill)');
    else problems.push(...checkPackaging(s.Packaging, (text.match(/^# WhiteBucket Explains: (.+)$/m) || [])[1]?.trim()));
  }
  // Owner, Nov 19, 2026: every video is explained like the viewer is 6 (owner: "I like the kid better", no Minecraft).
  if (['money', 'news'].includes(type) && !(date && date < ELI6_FROM) && !/^Explain like:\s*you'?re 6\b/im.test(text)) problems.push('Money and news scripts need an "Explain like: you\'re 6 · picture: <analogy>" line (brand.md)');
  if (type === 'news') {
    if (!s.Sources) problems.push('News scripts need a "## Sources" section grouped by story');
    else problems.push(...checkSourceGroups(s.Sources));
  }
  return problems;
}

// Every "- Slug: <name>" line in plan.md needs a matching <name>.md that passes.
function checkDay(dir) {
  const planFile = path.join(dir, 'plan.md');
  if (!fs.existsSync(planFile)) return ['plan.md: missing'];
  const slugs = [...fs.readFileSync(planFile, 'utf8').matchAll(/^-\s*Slug:\s*`?([\w-]+)`?\s*$/gm)].map(m => m[1]);
  if (!slugs.length) return ['plan.md: no "- Slug: <name>" lines'];
  const problems = [];
  for (const slug of slugs) {
    const file = path.join(dir, slug + '.md');
    if (!fs.existsSync(file)) { problems.push(`${slug}.md: missing`); continue; }
    for (const p of checkScript(fs.readFileSync(file, 'utf8'), path.basename(dir))) problems.push(`${slug}.md: ${p}`);
  }
  return problems;
}

if (require.main === module) {
  const date = process.argv[2] || require('./town.js').honolulu().date;
  const dir = path.join(__dirname, '..', 'scripts', date);
  const problems = fs.existsSync(dir) ? checkDay(dir) : [`scripts/${date}: folder missing`];
  if (problems.length) { console.log(problems.join('\n')); process.exit(1); }
  console.log(`scripts/${date}: script OK`);
}

module.exports = { checkScript, checkDay, checkPackaging, ENDING };
