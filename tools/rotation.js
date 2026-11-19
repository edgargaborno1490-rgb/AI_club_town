#!/usr/bin/env node
// Which desk writes on a given (Hawaii) date. One script a day.
//   node tools/rotation.js [YYYY-MM-DD]   (defaults to today in Hawaii)
// All money from Nov 19, 2026 (owner: "no more science video, more about money now"):
// Mon/Tue/Wed/Fri/Sat How It Works (money), each day a set FORMAT · Thu/Sun World News (money news only).
// Every video is George from Nov 19, 2026 (owner: out of ElevenLabs tokens), weekly update and clips too.
// What If (science) is paused; 'whatif' stays in SERIES/VOICE for old scripts and stats.
const BY_WEEKDAY = ['news', 'howitworks', 'howitworks', 'howitworks', 'news', 'howitworks', 'howitworks'];
const SERIES = { howitworks: 'How It Works', whatif: 'What If', news: 'World News' };
const VOICE = { howitworks: 'George (Kokoro bm_george, made by the studio)', whatif: 'Eric (Kokoro am_eric, made by the studio)', news: 'George (Kokoro bm_george, made by the studio)' };

// Money formats (the four that get views in money Shorts, owner's pick Nov 19, 2026).
const FORMATS = {
  comparison: 'Comparison: same money, two choices, who ends up ahead? (e.g. "Same $500 a month. Who is richer at 45?")',
  realprice: 'Real Price: the sticker price vs what it really costs (e.g. "A $30,000 car: the real price")',
  myth: 'Myth Buster: a money belief most people have, and what is really true (e.g. "Skipping lattes won\'t make you rich")',
  checklist: 'Checklist: 3-5 simple steps anyone can do (e.g. "Do these 5 things to win with money")',
};
const FORMAT_ORDER = ['comparison', 'realprice', 'myth', 'checklist'];
// Mon comparison · Tue real price · Wed myth · Fri checklist · Sat takes turns through all four.
const FORMAT_BY_WEEKDAY = { 1: 'comparison', 2: 'realprice', 3: 'myth', 5: 'checklist' };
const FIRST_SATURDAY = Date.UTC(2026, 10, 21);
function formatFor(date) {
  if (deskFor(date) !== 'howitworks') return null;
  const t = Date.parse(date + 'T00:00:00Z');
  const day = new Date(t).getUTCDay();
  if (day !== 6) return FORMAT_BY_WEEKDAY[day];
  const n = Math.round((t - FIRST_SATURDAY) / (7 * 864e5));
  return FORMAT_ORDER[((n % 4) + 4) % 4];
}
// One voice for every daily: George.
function voiceFor(date) {
  return VOICE[deskFor(date)];
}

// Village Update: every Saturday from Nov 21, 2026 (week 1). Returns the week number or null.
const FIRST_UPDATE = Date.UTC(2026, 10, 21);
const HOST_VOICE = 'George (Kokoro bm_george, made by the studio)';
function weeklyUpdateWeek(date) {
  deskFor(date);
  const t = Date.parse(date + 'T00:00:00Z');
  if (new Date(t).getUTCDay() !== 6 || t < FIRST_UPDATE) return null;
  return Math.round((t - FIRST_UPDATE) / (7 * 864e5)) + 1;
}

// Island Clip: short island update on Wednesdays and Fridays from Nov 25, 2026 (week 2),
// written ONLY if something on the island changed since the last island post.
const FIRST_CLIP = Date.UTC(2026, 10, 25);
function islandClipDay(date) {
  deskFor(date);
  const t = Date.parse(date + 'T00:00:00Z');
  return t >= FIRST_CLIP && [3, 5].includes(new Date(t).getUTCDay());
}

// Outliers check: every Monday from Nov 23, 2026, before the Chief picks (tools/outliers.js).
const FIRST_OUTLIERS = Date.UTC(2026, 10, 23);
function outliersDay(date) {
  deskFor(date);
  const t = Date.parse(date + 'T00:00:00Z');
  return t >= FIRST_OUTLIERS && new Date(t).getUTCDay() === 1;
}

// Rest days: the owner's days off (village/rest-days.md, lines "- YYYY-MM-DD: reason").
function restDay(date, file = require('path').join(__dirname, '..', 'village', 'rest-days.md')) {
  deskFor(date);
  let text = '';
  try { text = require('fs').readFileSync(file, 'utf8'); } catch { return null; }
  const m = text.match(new RegExp(`^-\\s*${date}\\s*:?\\s*(.*)$`, 'm'));
  return m ? (m[1].trim() || 'day off') : null;
}

function deskFor(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error(`Not a date: "${date}"`);
  return BY_WEEKDAY[new Date(date + 'T12:00:00Z').getUTCDay()];
}

if (require.main === module) {
  try {
    const date = process.argv[2] || require('./town.js').honolulu().date;
    const desk = deskFor(date);
    const rest = restDay(date);
    if (rest) { console.log(`${date}: REST DAY (${rest}). No script today.`); process.exit(0); }
    console.log(`${date}: ${SERIES[desk]} (desk ${desk}, voice: ${voiceFor(date)})`);
    const fmt = formatFor(date);
    if (fmt) console.log(`${date}: format ${fmt} = ${FORMATS[fmt]}`);
    const week = weeklyUpdateWeek(date);
    if (week) console.log(`${date}: also Village Update · Week ${week} (voice: ${HOST_VOICE})`);
    if (outliersDay(date)) console.log(`${date}: also Outliers check (Secret Building, before the Chief picks)`);
    if (islandClipDay(date)) console.log(`${date}: also Island Clip, only if something on the island changed (voice: ${HOST_VOICE})`);
  } catch (err) { console.error(err.message); process.exit(1); }
}

module.exports = { restDay, deskFor, formatFor, voiceFor, FORMATS, weeklyUpdateWeek, islandClipDay, outliersDay, SERIES, VOICE, HOST_VOICE };
