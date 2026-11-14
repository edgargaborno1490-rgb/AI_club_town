const test = require('node:test');
const assert = require('node:assert/strict');
const { checkScript } = require('../tools/check-scripts.js');

const words = n => Array.from({ length: n }, (_, i) => 'word' + i).join(' ');
const END = 'Comment NEXT and pick the next topic.';

function script({ type = 'science', narration = 185, end = END, rows = 6, status = '> **Status: DRAFT – needs review.**', facts, sources, drop, extra = '' } = {}) {
  const sections = {
    'Narration (record as one paragraph)': `${words(narration)} ${end}`,
    'Section plan': ['| # | Narration | On screen |', '|---|---|---|', ...Array.from({ length: rows }, (_, i) => `| ${i} | line ${i} | drawing ${i} |`)].join('\n'),
    'Fact notes': facts || '- Claim one, as of Nov 2026. Source: https://nasa.gov/a\n- Claim two. Source: https://noaa.gov/b',
    Captions: '- TikTok: a\n- Instagram: b\n- Facebook: c\n- YouTube: d',
  };
  if (sources) sections.Sources = sources;
  if (drop) delete Object.assign(sections)[drop];
  const body = Object.entries(sections).map(([h, t]) => `## ${h}\n\n${t}\n`).join('\n');
  return `${status}\n\n# WhiteBucket Explains: Test topic?\n\nTopic type: ${type}\nFormat: 9:16 · paper line with the bucket guy · about 72 s · voice: Mark\n${extra}\n${body}`;
}

test('a complete studio-format script passes', () => {
  assert.deepEqual(checkScript(script()), []);
});

test('the script must start as DRAFT', () => {
  assert.ok(checkScript(script({ status: '> **Status: APPROVED**' })).some(p => /DRAFT/.test(p)));
});

test('narration must be 170-210 words', () => {
  assert.ok(checkScript(script({ narration: 120 })).some(p => /Narration has/.test(p)));
});

test('narration must end with the locked-in line', () => {
  assert.ok(checkScript(script({ end: 'Follow White Bucket for more.' })).some(p => /Comment NEXT/.test(p)));
});

test('section plan needs 4-8 rows', () => {
  assert.ok(checkScript(script({ rows: 2 })).some(p => /Section plan/.test(p)));
});

test('fact notes need links and an "as of" date', () => {
  assert.ok(checkScript(script({ facts: '- A claim with no source' })).some(p => /Fact notes/.test(p)));
  assert.ok(checkScript(script({ facts: '- A https://a.com/x\n- B https://b.com/y' })).some(p => /as of/.test(p)));
});

test('money scripts must say not financial advice', () => {
  assert.ok(checkScript(script({ type: 'money' })).some(p => /not financial advice/.test(p)));
  assert.deepEqual(checkScript(script({ type: 'money', extra: 'Note: small "not financial advice" card near the end.' })), []);
});

test('a missing caption platform is flagged', () => {
  const s = script().replace('- Facebook: c\n', '');
  assert.ok(checkScript(s).some(p => /Facebook/.test(p)));
});

test('topic type must be money, science or news', () => {
  assert.ok(checkScript(script({ type: 'gossip' })).some(p => /Topic type/.test(p)));
});

test('news scripts need 2 different sites for every story group', () => {
  const bad = 'Story A:\n- https://reuters.com/a\n- https://apnews.com/a\n\nStory B:\n- https://bbc.com/b';
  assert.ok(checkScript(script({ type: 'news', sources: bad })).some(p => /Story B/.test(p)));
  const ok = 'Story A:\n- https://reuters.com/a\n- https://apnews.com/a';
  assert.deepEqual(checkScript(script({ type: 'news', sources: ok })), []);
  assert.ok(checkScript(script({ type: 'news' })).some(p => /Sources/.test(p)));
});

test('a day needs one script per slug in the plan', () => {
  const fs = require('fs'), os = require('os'), path = require('path');
  const { checkDay } = require('../tools/check-scripts.js');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'day-'));
  fs.writeFileSync(path.join(dir, 'plan.md'), '# Plan\n- Slug: a\n- Slug: b\n- Slug: c\n');
  fs.writeFileSync(path.join(dir, 'a.md'), script());
  fs.writeFileSync(path.join(dir, 'b.md'), script());
  assert.ok(checkDay(dir).some(p => /c\.md: missing/.test(p)));
  fs.writeFileSync(path.join(dir, 'c.md'), script());
  assert.deepEqual(checkDay(dir), []);
});

test('village scripts need an "as of" date but no web links', () => {
  const s = script({ type: 'village', facts: '- Scripts written this week: 7 (village/topics.md), as of Nov 21, 2026.' });
  assert.deepEqual(checkScript(s), []);
  const noDate = script({ type: 'village', facts: '- Scripts written: 7 (village/topics.md)' });
  assert.ok(checkScript(noDate).some(p => /as of/.test(p)));
});

test('village videos may be longer and use their own ending', () => {
  const s = script({ type: 'village', narration: 225, end: 'See you next Sunday.', facts: '- Six workers (.claude/skills), as of Nov 14, 2026.' });
  assert.deepEqual(checkScript(s), []);
  const tooLong = script({ type: 'village', narration: 260, end: 'See you next Sunday.', facts: '- x, as of Nov 14, 2026.' });
  assert.ok(checkScript(tooLong).some(p => /Narration has/.test(p)));
});
