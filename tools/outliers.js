#!/usr/bin/env node
// Weekly Outliers check: which videos in our niches are doing far better than
// their own channel usually does? Those topics are worth our own take.
//   node tools/outliers.js queries [YYYY-MM-DD]   this week's two searches (money topic + money format)
//   node tools/outliers.js [YYYY-MM-DD] [--write] read village/outliers/<date>.json,
//                                                 print (and with --write save) village/outliers.md
// The Secret Building fills the JSON from TubeAlfred (public YouTube numbers only).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIN_RATIO = 3; // 3x the channel's usual views = an outlier
const PER_DESK = 5;
const DESKS = { howitworks: 'How It Works (money)', whatif: 'What If (science)', news: 'World News' };

// Two money searches per week (science paused Nov 19, 2026): a topic search and a format search
// (the 'whatif' slot now holds money-format searches), rotating so we look somewhere new each Monday.
const QUERIES = {
  howitworks: ['how money works explained', 'why is everything so expensive', 'credit card interest explained',
    'how taxes actually work', 'how banks make money', 'how the stock market works for beginners'],
  whatif: ['same salary who is richer', 'real cost of buying a car', 'money myths debunked',
    'things to do with your first paycheck', 'real cost of credit card minimum payment', 'money habits checklist'],
};

function weekIndex(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error(`Not a date: "${date}"`);
  return Math.floor((Date.parse(date + 'T00:00:00Z') - Date.UTC(2026, 10, 16)) / (7 * 864e5));
}

function queriesFor(date) {
  const w = weekIndex(date);
  const pick = list => list[((w % list.length) + list.length) % list.length];
  return { howitworks: pick(QUERIES.howitworks), whatif: pick(QUERIES.whatif) };
}

const num = n => Number(n).toLocaleString('en-US');

function rank(data) {
  const problems = [];
  const rows = [];
  const unchecked = [];
  for (const [i, v] of (data.videos || []).entries()) {
    const where = `video ${i + 1}${v.title ? ` ("${v.title}")` : ''}`;
    if (!DESKS[v.desk]) { problems.push(`${where}: desk must be one of ${Object.keys(DESKS).join(', ')}`); continue; }
    if (!v.title || !/^https:\/\/(www\.)?youtube\.com\/|^https:\/\/youtu\.be\//.test(v.url || '')) { problems.push(`${where}: needs a title and a YouTube https link`); continue; }
    if (!Number.isFinite(v.views) || v.views < 0) { problems.push(`${where}: views must be a number`); continue; }
    if (!Number.isFinite(v.channelMedian) || v.channelMedian <= 0) { unchecked.push(v); continue; }
    rows.push({ ...v, ratio: v.views / v.channelMedian });
  }
  rows.sort((a, b) => b.ratio - a.ratio);
  const byDesk = {};
  for (const r of rows.filter(r => r.ratio >= MIN_RATIO)) {
    (byDesk[r.desk] ||= []);
    if (byDesk[r.desk].length < PER_DESK) byDesk[r.desk].push(r);
  }
  return { byDesk, unchecked, problems, checked: rows.length };
}

function report(data) {
  const { byDesk, unchecked, problems, checked } = rank(data);
  const out = [
    `# Outliers (week of ${data.date})`,
    '',
    `Written by the Secret Building from public YouTube numbers (TubeAlfred), as of ${data.date}.`,
    `An **outlier** got at least ${MIN_RATIO}x the views its channel usually gets, so the *topic* pulled people in,`,
    'not just the channel\'s size. The Chief may use a topic here as a starting point for its own',
    'WhiteBucket take on the right desk. Never copy a title, script or footage. Not a must: the rotation still rules.',
    '',
    `Searches: ${(data.queries || []).map(q => `"${q}"`).join(', ') || '(none)'} · videos checked: ${checked}` +
      (Number.isFinite(data.creditsLeft) ? ` · TubeAlfred credits left: ${data.creditsLeft}` : ''),
  ];
  if (data.skipped) out.push('', `**Skipped this week:** ${data.skipped}`);
  for (const [desk, label] of Object.entries(DESKS)) {
    const list = byDesk[desk];
    if (!list) continue;
    out.push('', `## ${label}`, '', '| x usual | Video | Channel | Views | Our take |', '|---|---|---|---|---|');
    for (const r of list) {
      out.push(`| ${r.ratio.toFixed(1)}x | [${r.title.replace(/\|/g, '/')}](${r.url}) | ${(r.channel || '').replace(/\|/g, '/')} | ${num(r.views)} (usual ${num(r.channelMedian)}) | ${(r.angle || '').replace(/\|/g, '/')} |`);
    }
  }
  if (!Object.keys(byDesk).length && !data.skipped) out.push('', `No outliers this week (nothing reached ${MIN_RATIO}x its channel's usual views).`);
  if (unchecked.length) {
    out.push('', '## Big, but not compared with their channel', '');
    for (const v of unchecked.slice(0, 5)) out.push(`- ${v.title} (${num(v.views)} views, ${v.channel || 'unknown channel'})`);
  }
  return { text: out.join('\n') + '\n', problems };
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    const today = () => require('./town.js').honolulu().date;
    if (args[0] === 'queries') {
      const q = queriesFor(args[1] || today());
      console.log(`money topic: ${q.howitworks}\nmoney format: ${q.whatif}`);
      process.exit(0);
    }
    const date = args.find(a => /^\d{4}-/.test(a)) || today();
    const file = path.join(ROOT, 'village', 'outliers', `${date}.json`);
    if (!fs.existsSync(file)) { console.error(`No data yet: village/outliers/${date}.json`); process.exit(1); }
    const { text, problems } = report(JSON.parse(fs.readFileSync(file, 'utf8')));
    if (problems.length) console.log('Lines I could not read:\n' + problems.map(p => '- ' + p).join('\n') + '\n');
    if (args.includes('--write')) {
      fs.writeFileSync(path.join(ROOT, 'village', 'outliers.md'), text);
      console.log('Saved village/outliers.md');
    } else console.log(text);
  } catch (err) { console.error(err.message); process.exit(1); }
}

module.exports = { queriesFor, rank, report, MIN_RATIO };
