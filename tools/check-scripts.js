#!/usr/bin/env node
// Checks that a day's scripts follow the White Bucket format.
//   node tools/check-scripts.js [YYYY-MM-DD]   (defaults to today in Hawaii)
const fs = require('fs');
const path = require('path');

const SERIES = ['what-if', 'how-it-works', 'world-news'];
const SECTIONS = ['Hook', 'Narration', 'Scenes', 'Facts to double-check', 'Title', 'Hashtags', 'Captions'];
const PLATFORMS = ['TikTok', 'YouTube', 'Instagram', 'Facebook'];

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  return Object.fromEntries(m[1].split('\n').map(l => l.split(/:\s*/)).filter(p => p.length >= 2).map(([k, ...v]) => [k.trim(), v.join(': ').trim()]));
}

function sections(text) {
  const out = {};
  const parts = text.split(/^## +/m).slice(1);
  for (const p of parts) {
    const nl = p.indexOf('\n');
    const head = (nl === -1 ? p : p.slice(0, nl)).trim();
    out[head] = nl === -1 ? '' : p.slice(nl + 1).trim();
  }
  return out;
}

function checkScript(text, series) {
  const problems = [];
  const fm = frontMatter(text);
  if (!fm) problems.push('Missing front matter (--- series/title/topic/length ---)');
  else {
    if (fm.series !== series) problems.push(`Front matter series is "${fm.series}", expected "${series}"`);
    if (!fm.title) problems.push('Front matter has no title');
  }
  const s = sections(text);
  const needed = series === 'world-news' ? [...SECTIONS, 'Sources'] : SECTIONS;
  for (const name of needed) if (!s[name]) problems.push(`Missing or empty section: ${name}`);

  if (s.Narration) {
    const n = s.Narration.split(/\s+/).filter(Boolean).length;
    if (n < 150 || n > 190) problems.push(`Narration has ${n} words (needs 150-190)`);
  }
  if (s.Scenes) {
    const secs = [...s.Scenes.matchAll(/^\s*\d+\.\s*\[(\d+(?:\.\d+)?)s\]/gm)].map(m => Number(m[1]));
    if (secs.length < 4) problems.push(`Scenes has ${secs.length} timed scenes (needs at least 4, like "1. [8s] On screen: ... | Text: ...")`);
    const total = secs.reduce((a, b) => a + b, 0);
    if (total < 60 || total > 75) problems.push(`Scenes add up to ${total}s (needs 60-75s)`);
  }
  if (s.Captions) for (const p of PLATFORMS) if (!new RegExp(`\\b${p}\\b`).test(s.Captions)) problems.push(`Captions missing ${p}`);
  if (series === 'world-news' && s.Sources) {
    // Sources are grouped by story: a heading line ("Nvidia:") followed by link lines.
    const groups = [];
    for (const line of s.Sources.split('\n').map(l => l.trim()).filter(Boolean)) {
      const isLink = /https?:\/\//.test(line);
      if (!isLink || !groups.length) groups.push({ name: isLink ? 'Sources' : line.replace(/:$/, ''), hosts: new Set() });
      for (const m of line.matchAll(/https?:\/\/([^/\s)]+)/g)) groups.at(-1).hosts.add(m[1].replace(/^www\./, ''));
    }
    for (const g of groups) {
      if (g.hosts.size < 2) problems.push(`Sources must come from at least 2 different sites (${g.name})`);
    }
  }
  return problems;
}

function checkDay(dir) {
  const problems = [];
  if (!fs.existsSync(path.join(dir, 'plan.md'))) problems.push('plan.md: missing');
  for (const series of SERIES) {
    const file = path.join(dir, series + '.md');
    if (!fs.existsSync(file)) { problems.push(`${series}.md: missing`); continue; }
    for (const p of checkScript(fs.readFileSync(file, 'utf8'), series)) problems.push(`${series}.md: ${p}`);
  }
  return problems;
}

if (require.main === module) {
  const date = process.argv[2] || require('./town.js').honolulu().date;
  const dir = path.join(__dirname, '..', 'scripts', date);
  const problems = checkDay(dir);
  if (problems.length) { console.log(problems.join('\n')); process.exit(1); }
  console.log(`scripts/${date}: all scripts OK`);
}

module.exports = { checkScript, checkDay, SERIES };
