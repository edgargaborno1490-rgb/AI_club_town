const test = require('node:test');
const assert = require('node:assert/strict');
const { parseEarnings, toCsv } = require('../tools/ledger.js');

const md = `# Earnings

Write one line each time money comes in:
- 2026-11-20 | TikTok | 12.40 | Creator Rewards
- 2026-11-21 | YouTube | $1,234.50
- 2026-11-22 | Instagram | lots | oops
- not a ledger line
`;

test('reads good lines, including money with $ and commas', () => {
  const { rows } = parseEarnings(md);
  assert.deepEqual(rows, [
    { date: '2026-11-20', platform: 'TikTok', amount: 12.4, note: 'Creator Rewards' },
    { date: '2026-11-21', platform: 'YouTube', amount: 1234.5, note: '' },
  ]);
});

test('reports lines it could not read instead of guessing', () => {
  const { skipped } = parseEarnings(md);
  assert.deepEqual(skipped, ['- 2026-11-22 | Instagram | lots | oops']);
});

test('the example line in the instructions is not counted', () => {
  const { rows } = parseEarnings('- YYYY-MM-DD | Platform | 0.00 | note');
  assert.deepEqual(rows, []);
});

test('csv has a header and a total line', () => {
  const csv = toCsv(parseEarnings(md).rows);
  assert.equal(csv.split('\n')[0], 'date,platform,amount,note');
  assert.match(csv, /^TOTAL,,1246\.90,$/m);
});

test('csv quotes notes with commas', () => {
  const csv = toCsv([{ date: '2026-11-20', platform: 'TikTok', amount: 1, note: 'a, b' }]);
  assert.match(csv, /"a, b"/);
});

test('every line under Earnings that is not readable gets reported', () => {
  const text = `# x\n- 2026-01-01 | TikTok | 9 | example above the list\n\n## Earnings\n- Dec 2 | YouTube | 5.00\n2026-12-03 | Instagram | 3.00\n- 2026-12-05 | TikTok | 1.234,50\n- 2026-12-06 | YouTube | 2.00\n`;
  const { rows, skipped } = parseEarnings(text);
  assert.deepEqual(rows.map(r => r.amount), [3, 2]);
  assert.deepEqual(skipped, ['- Dec 2 | YouTube | 5.00', '- 2026-12-05 | TikTok | 1.234,50']);
});
