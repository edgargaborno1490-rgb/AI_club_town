const test = require('node:test');
const assert = require('node:assert/strict');
const { parse, report, count } = require('../tools/stats.js');

const doc = lines => `# x\n\n## Numbers\n${lines.join('\n')}\n`;

test('counts accept 1,250 and 1.2k and dashes', () => {
  assert.equal(count('1,250'), 1250);
  assert.equal(count('1.2k'), 1200);
  assert.equal(count('-'), null);
  assert.ok(Number.isNaN(count('lots')));
});

test('the newest line per video and platform wins', () => {
  const { rows } = parse(doc([
    '- 2026-11-20 | TikTok | Black Hole | What If | 100 | 5 | 1',
    '- 2026-11-27 | TikTok | Black Hole | What If | 900 | 40 | 3',
    '- 2026-11-27 | YouTube | Black Hole | what-if | 50',
  ]));
  assert.equal(rows.length, 2);
  assert.equal(rows.find(r => r.platform === 'TikTok').views, 900);
});

test('bad lines are listed, not counted; example lines above "## Numbers" are ignored', () => {
  const { rows, problems } = parse('- 2026-11-01 | TikTok | Example | What If | 5\n## Numbers\n- 2026-11-20 | TikTok | X | Cooking | 10\n- 2026-11-20 | TikTok | Y | What If | many');
  assert.equal(rows.length, 0);
  assert.equal(problems.length, 2);
});

test('no numbers: says so', () => {
  assert.match(report(doc([]), '2026-11-21').text, /No numbers yet/);
});

test('series are compared only with 3+ videos each', () => {
  const few = report(doc(['- 2026-11-21 | TikTok | A | What If | 500', '- 2026-11-21 | TikTok | B | How It Works | 100']), 'd');
  assert.match(few.text, /Too early to compare/);
  const lines = [];
  for (const [s, v] of [['What If', 500], ['How It Works', 100]]) for (let i = 0; i < 3; i++) lines.push(`- 2026-11-21 | TikTok | ${s} ${i} | ${s} | ${v + i}`);
  const r = report(doc(lines), 'd');
  assert.match(r.text, /Best series so far: \*\*What If\*\*/);
  assert.match(r.text, /Lowest: \*\*How It Works\*\*/);
  assert.equal(r.bySeries[0].series, 'What If');
});

test('views add up across platforms per video', () => {
  const r = report(doc(['- 2026-11-21 | TikTok | A | What If | 500 | 10', '- 2026-11-21 | Instagram | A | What If | 200 | 4']), 'd');
  assert.equal(r.top[0].views, 700);
  assert.deepEqual(r.top[0].platforms, ['TikTok', 'Instagram']);
});
