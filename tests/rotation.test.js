const test = require('node:test');
const assert = require('node:assert/strict');
const { deskFor } = require('../tools/rotation.js');

test('money on Monday, Wednesday and Friday', () => {
  assert.equal(deskFor('2026-11-16'), 'howitworks'); // Monday
  assert.equal(deskFor('2026-11-18'), 'howitworks'); // Wednesday
  assert.equal(deskFor('2026-11-20'), 'howitworks'); // Friday
});

test('What If on Tuesday and Saturday', () => {
  assert.equal(deskFor('2026-11-17'), 'whatif');
  assert.equal(deskFor('2026-11-21'), 'whatif');
});

test('World News on Thursday and Sunday', () => {
  assert.equal(deskFor('2026-11-19'), 'news');
  assert.equal(deskFor('2026-11-15'), 'news');
});

test('a bad date throws', () => {
  assert.throws(() => deskFor('someday'), /date/);
});

test('weekly update: Saturdays from Nov 21, numbered by week', () => {
  const { weeklyUpdateWeek } = require('../tools/rotation.js');
  assert.equal(weeklyUpdateWeek('2026-11-14'), null); // first Saturday: intro first, no update yet
  assert.equal(weeklyUpdateWeek('2026-11-21'), 1);
  assert.equal(weeklyUpdateWeek('2026-11-28'), 2);
  assert.equal(weeklyUpdateWeek('2026-11-22'), null); // Sunday
});

test('island clips: Wednesdays and Fridays from Nov 25 (week 2)', () => {
  const { islandClipDay } = require('../tools/rotation.js');
  assert.equal(islandClipDay('2026-11-18'), false); // week 1: Sunday update only
  assert.equal(islandClipDay('2026-11-20'), false);
  assert.equal(islandClipDay('2026-11-25'), true);  // Wednesday
  assert.equal(islandClipDay('2026-11-27'), true);  // Friday
  assert.equal(islandClipDay('2026-11-26'), false); // Thursday
});

test('the Outliers check runs on Mondays from Nov 23, 2026', () => {
  const { outliersDay } = require('../tools/rotation.js');
  assert.equal(outliersDay('2026-11-16'), false);
  assert.equal(outliersDay('2026-11-23'), true);
  assert.equal(outliersDay('2026-11-24'), false);
  assert.equal(outliersDay('2026-11-30'), true);
});

test('rest days come from the list and skip the day', () => {
  const fs = require('fs'), os = require('os'), path = require('path');
  const { restDay } = require('../tools/rotation.js');
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'rest-')), 'rest-days.md');
  fs.writeFileSync(f, '# Rest days\n\n- 2026-11-16: owner posts the Leonids video\n- 2026-12-25\n');
  assert.equal(restDay('2026-11-16', f), 'owner posts the Leonids video');
  assert.equal(restDay('2026-12-25', f), 'day off');
  assert.equal(restDay('2026-11-17', f), null);
  assert.equal(restDay('2026-11-16', '/nope/missing.md'), null);
});
