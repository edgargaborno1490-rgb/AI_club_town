#!/usr/bin/env node
// Which desk writes on a given (Hawaii) date. One script a day.
//   node tools/rotation.js [YYYY-MM-DD]   (defaults to today in Hawaii)
// Mon/Wed/Fri: How It Works (money) · Tue/Sat: What If · Thu/Sun: World News
const BY_WEEKDAY = ['news', 'howitworks', 'whatif', 'howitworks', 'news', 'howitworks', 'whatif'];
const SERIES = { howitworks: 'How It Works', whatif: 'What If', news: 'World News' };
const VOICE = { howitworks: 'George (Kokoro bm_george, made by the studio)', whatif: 'Puck (Kokoro am_puck, made by the studio)', news: 'Mark (ElevenLabs)' };

// Village Update: every Saturday from Nov 21, 2026 (week 1). Returns the week number or null.
const FIRST_UPDATE = Date.UTC(2026, 10, 21);
const HOST_VOICE = 'Village host (ElevenLabs, the owner picks and records it)';
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
    console.log(`${date}: ${SERIES[desk]} (desk ${desk}, voice: ${VOICE[desk]})`);
    const week = weeklyUpdateWeek(date);
    if (week) console.log(`${date}: also Village Update · Week ${week} (voice: ${HOST_VOICE})`);
    if (outliersDay(date)) console.log(`${date}: also Outliers check (Secret Building, before the Chief picks)`);
    if (islandClipDay(date)) console.log(`${date}: also Island Clip, only if something on the island changed (voice: ${HOST_VOICE})`);
  } catch (err) { console.error(err.message); process.exit(1); }
}

module.exports = { restDay, deskFor, weeklyUpdateWeek, islandClipDay, outliersDay, SERIES, VOICE, HOST_VOICE };
