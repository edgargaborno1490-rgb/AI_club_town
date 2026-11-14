#!/usr/bin/env node
// Which desk writes on a given (Hawaii) date. One script a day.
//   node tools/rotation.js [YYYY-MM-DD]   (defaults to today in Hawaii)
// Mon/Wed/Fri: How It Works (money) · Tue/Sat: What If · Thu/Sun: World News
const BY_WEEKDAY = ['news', 'howitworks', 'whatif', 'howitworks', 'news', 'howitworks', 'whatif'];
const SERIES = { howitworks: 'How It Works', whatif: 'What If', news: 'World News' };
const VOICE = { howitworks: 'AI voice B (to be chosen)', whatif: 'AI voice A (to be chosen)', news: 'Mark (ElevenLabs)' };

function deskFor(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error(`Not a date: "${date}"`);
  return BY_WEEKDAY[new Date(date + 'T12:00:00Z').getUTCDay()];
}

if (require.main === module) {
  try {
    const date = process.argv[2] || require('./town.js').honolulu().date;
    const desk = deskFor(date);
    console.log(`${date}: ${SERIES[desk]} (desk ${desk}, voice: ${VOICE[desk]})`);
  } catch (err) { console.error(err.message); process.exit(1); }
}

module.exports = { deskFor, SERIES, VOICE };
