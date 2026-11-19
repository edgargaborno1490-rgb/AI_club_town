const test = require('node:test');
const assert = require('node:assert/strict');
const { checkScript } = require('../tools/check-scripts.js');

const words = n => Array.from({ length: n }, (_, i) => 'word' + i).join(' ');
const END = 'Follow and comment BIRD, and your name goes on a bird on our island. See you tomorrow for another island update!';

const PACK = ['| # | Title | Cover words | Score | Why |', '|---|---|---|---|---|',
  '| 1 | Test topic? | BIG WORDS | 9/10 | clear |', '| 2 | Another one | TWO WORDS | 7/10 | ok |',
  '| 3 | Third | THREE | 6/10 | ok |', '| 4 | Fourth | FOUR | 5/10 | ok |', '| 5 | Fifth | FIVE | 4/10 | ok |', '', 'Pick: #1'].join('\n');

function script({ type = 'science', narration = 95, end = END, rows = 6, status = '> **Status: DRAFT – needs review.**', facts, sources, drop, extra = '' } = {}) {
  const sections = {
    'Narration (record as one paragraph)': `${words(narration)} ${end}`,
    'Section plan': ['| # | Narration | On screen |', '|---|---|---|', ...Array.from({ length: rows }, (_, i) => `| ${i} | line ${i} | drawing ${i} |`)].join('\n'),
    'Fact notes': facts || '- Claim one, as of Nov 2026. Source: https://nasa.gov/a\n- Claim two. Source: https://noaa.gov/b',
    Captions: '- TikTok: a\n- Instagram: b\n- Facebook: c\n- YouTube: d',
    Packaging: PACK,
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

test('daily narration must be 90-160 words (up to about a minute)', () => {
  assert.ok(checkScript(script({ narration: 60 })).some(p => /Narration has/.test(p)));
  assert.ok(checkScript(script({ narration: 190 })).some(p => /Narration has/.test(p)));
});

test('daily narration must ask viewers to comment BIRD right before the ending', () => {
  assert.ok(checkScript(script({ end: 'See you tomorrow for another island update!' })).some(p => /comment BIRD/i.test(p)));
});

test('narration must end with the locked-in line', () => {
  assert.ok(checkScript(script({ end: 'Follow White Bucket for more.' })).some(p => /See you tomorrow/.test(p)));
});

test('section plan needs 4-10 rows', () => {
  assert.ok(checkScript(script({ rows: 2 })).some(p => /Section plan/.test(p)));
});

test('fact notes need links and an "as of" date', () => {
  assert.ok(checkScript(script({ facts: '- A claim with no source' })).some(p => /Fact notes/.test(p)));
  assert.ok(checkScript(script({ facts: '- A https://a.com/x\n- B https://b.com/y' })).some(p => /as of/.test(p)));
});

test('money scripts no longer need a "not financial advice" line (owner, Nov 19, 2026)', () => {
  assert.deepEqual(checkScript(script({ type: 'money', extra: 'Explain like: you\'re 6 · picture: a piggy bank' })), []);
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
  assert.deepEqual(checkScript(script({ type: 'news', sources: ok, extra: 'Explain like: you\'re 6 · picture: cookies' })), []);
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
  const s = script({ type: 'village', narration: 185, facts: '- Scripts written this week: 7 (village/topics.md), as of Nov 21, 2026.' });
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

test('island clips are short (35-80 words, 2-5 sections) with no web links needed', () => {
  const ok = script({ type: 'island', narration: 50, end: 'See you Sunday.', rows: 3, facts: '- Followers: 25 (town.json), as of Nov 25, 2026.' });
  assert.deepEqual(checkScript(ok), []);
  const long = script({ type: 'island', narration: 120, end: 'See you Sunday.', rows: 3, facts: '- x, as of Nov 25, 2026.' });
  assert.ok(checkScript(long).some(p => /Narration has/.test(p)));
  const many = script({ type: 'island', narration: 50, end: 'See you Sunday.', rows: 7, facts: '- x, as of Nov 25, 2026.' });
  assert.ok(checkScript(many).some(p => /Section plan/.test(p)));
});

test('money, science and news scripts need 5 scored packaging ideas and a pick', () => {
  assert.ok(checkScript(script({ drop: 'Packaging' })).some(p => /Packaging/.test(p)));
  const four = script().replace('| 5 | Fifth | FIVE | 4/10 | ok |\n', '');
  assert.ok(checkScript(four).some(p => /exactly 5/.test(p)));
  assert.ok(checkScript(script().replace('Pick: #1', '')).some(p => /Pick/.test(p)));
  assert.ok(checkScript(script().replace('9/10', 'great')).some(p => /score/.test(p)));
  assert.ok(checkScript(script().replace('BIG WORDS', 'far too many words on this little cover')).some(p => /cover words/.test(p)));
});

test('the title line must be the picked packaging title', () => {
  assert.ok(checkScript(script().replace('Pick: #1', 'Pick: #2')).some(p => /picked title: "Another one"/.test(p)));
});

test('village and island scripts do not need packaging', () => {
  const s = script({ type: 'village', narration: 185, end: 'See you next Sunday.', facts: '- x, as of Nov 21, 2026.', drop: 'Packaging' });
  assert.deepEqual(checkScript(s), []);
});

test('money and news scripts must be explained like the viewer is 6 (owner, Nov 19, 2026)', () => {
  const fin = 'Note: "not financial advice".';
  assert.ok(checkScript(script({ type: 'money', extra: fin })).some(p => /Explain like/.test(p)));
  assert.deepEqual(checkScript(script({ type: 'money', extra: `Explain like: you're 6 · picture: a piggy bank\n${fin}` })), []);
  assert.ok(checkScript(script({ type: 'money', extra: `Explain like: Minecraft · picture: emeralds\n${fin}` })).some(p => /Explain like/.test(p)));
  assert.ok(!checkScript(script()).some(p => /Explain like/.test(p))); // science (paused) doesn't need it
});

test('scripts written before Nov 20, 2026 do not need the Explain like line', () => {
  const s = script({ type: 'money', extra: 'Note: "not financial advice".' });
  assert.deepEqual(checkScript(s, '2026-11-19'), []);
  assert.ok(checkScript(s, '2026-11-20').some(p => /Explain like/.test(p)));
});
