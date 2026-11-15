#!/usr/bin/env node
// The Analyst's tool: reads village/stats.md (numbers the owner copies from the apps)
// and reports which series and videos do best.
//   node tools/stats.js            (prints the report)
//   node tools/stats.js --write    (also saves village/analyst-report.md)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'village', 'stats.md');
const REPORT = path.join(ROOT, 'village', 'analyst-report.md');
const SERIES = {
  'what if': 'What If', whatif: 'What If', 'how it works': 'How It Works', howitworks: 'How It Works',
  'world news': 'World News', news: 'World News', 'ai village': 'AI Village', village: 'AI Village',
  'island clip': 'Island Clip', island: 'Island Clip', other: 'Other',
};
const MIN_VIDEOS = 3; // per series, before comparing series

const count = v => {
  const s = String(v || '').trim().replace(/[,\s]/g, '');
  if (s === '' || s === '-') return null;
  const m = s.match(/^(\d+(?:\.\d+)?)([kKmM]?)$/);
  if (!m) return NaN;
  return Math.round(Number(m[1]) * ({ k: 1e3, m: 1e6 }[m[2].toLowerCase()] || 1));
};

function parse(text) {
  const rows = [], problems = [];
  const body = text.split(/^## Numbers\s*$/m)[1] || '';
  body.split('\n').forEach(line => {
    if (!/^\s*-\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)) return;
    const [date, platform, video, series, views, likes, follows] = line.replace(/^\s*-\s*/, '').split('|').map(s => s.trim());
    const s = SERIES[String(series || '').toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ')] || SERIES[String(series || '').toLowerCase()];
    const r = { date, platform, video, series: s, views: count(views), likes: count(likes), follows: count(follows) };
    if (!platform || !video) problems.push(`Missing platform or title: ${line.trim()}`);
    else if (!s) problems.push(`Unknown series "${series}": ${line.trim()}`);
    else if (r.views === null || Number.isNaN(r.views) || Number.isNaN(r.likes) || Number.isNaN(r.follows)) problems.push(`Numbers not readable: ${line.trim()}`);
    else rows.push(r);
  });
  // Keep only the newest line per video + platform.
  const latest = new Map();
  for (const r of rows) {
    const k = `${r.video.toLowerCase()}|${r.platform.toLowerCase()}`;
    if (!latest.has(k) || latest.get(k).date <= r.date) latest.set(k, r);
  }
  return { rows: [...latest.values()], problems };
}

function summarize(rows) {
  const videos = new Map();
  for (const r of rows) {
    const v = videos.get(r.video) || { video: r.video, series: r.series, views: 0, likes: 0, follows: 0, platforms: [] };
    v.views += r.views; v.likes += r.likes || 0; v.follows += r.follows || 0; v.platforms.push(r.platform);
    videos.set(r.video, v);
  }
  const series = new Map();
  for (const v of videos.values()) {
    const s = series.get(v.series) || { series: v.series, videos: 0, views: 0, likes: 0, follows: 0 };
    s.videos++; s.views += v.views; s.likes += v.likes; s.follows += v.follows;
    series.set(v.series, s);
  }
  const bySeries = [...series.values()].map(s => ({ ...s, avg: Math.round(s.views / s.videos) })).sort((a, b) => b.avg - a.avg);
  const top = [...videos.values()].sort((a, b) => b.views - a.views);
  return { bySeries, top, videoCount: videos.size };
}

function report(text, date) {
  const { rows, problems } = parse(text);
  const { bySeries, top, videoCount } = summarize(rows);
  const out = [`# Analyst report (${date})`, ''];
  if (!rows.length) {
    out.push('No numbers yet. The owner adds them to `village/stats.md` (one line per video per platform).');
  } else {
    out.push(`${videoCount} video(s), ${rows.length} line(s). Views are added up across platforms.`, '');
    out.push('## By series', '| Series | Videos | Views | Avg views per video | Likes per 100 views | New follows |', '|---|---|---|---|---|---|');
    for (const s of bySeries) out.push(`| ${s.series} | ${s.videos} | ${s.views} | ${s.avg} | ${s.views ? (s.likes / s.views * 100).toFixed(1) : '0.0'} | ${s.follows} |`);
    out.push('', '## Top videos', '| Video | Series | Views | Platforms |', '|---|---|---|---|');
    for (const v of top.slice(0, 5)) out.push(`| ${v.video} | ${v.series} | ${v.views} | ${v.platforms.join(', ')} |`);
    out.push('', '## What it means');
    const ready = bySeries.filter(s => s.videos >= MIN_VIDEOS && !['AI Village', 'Island Clip', 'Other'].includes(s.series));
    if (ready.length >= 2) {
      const [best, ...rest] = ready;
      const worst = rest[rest.length - 1];
      out.push(`- Best series so far: **${best.series}** (${best.avg} avg views per video, ${best.videos} videos).`);
      out.push(`- Lowest: **${worst.series}** (${worst.avg} avg views per video, ${worst.videos} videos).`);
      out.push('- The Chief may lean toward the best series when picking topics. Changing the rotation itself is the owner\'s call.');
    } else {
      out.push(`- Too early to compare series: each needs at least ${MIN_VIDEOS} videos with numbers. Keep adding them.`);
    }
    if (top[0]) out.push(`- Most-viewed video: "${top[0].video}" (${top[0].series}, ${top[0].views} views). A similar topic is a good bet.`);
  }
  if (problems.length) out.push('', '## Lines I could not read', ...problems.map(p => `- ${p}`));
  return { text: out.join('\n') + '\n', rows, bySeries, top, problems };
}

if (require.main === module) {
  const date = require('./town.js').honolulu().date;
  const r = report(fs.existsSync(FILE) ? fs.readFileSync(FILE, 'utf8') : '', date);
  process.stdout.write(r.text);
  if (process.argv.includes('--write')) { fs.writeFileSync(REPORT, r.text); console.log('saved village/analyst-report.md'); }
}

module.exports = { parse, summarize, report, count };
