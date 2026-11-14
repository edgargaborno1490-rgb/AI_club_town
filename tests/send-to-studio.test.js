const test = require('node:test');
const assert = require('node:assert/strict');
const { addReadyRow } = require('../tools/send-to-studio.js');

const IDEAS = `# Ideas

## Researched, script ready
| Topic | Script | Voiceover |
|---|---|---|
| (none) | | |

## Made
Volcano · NVIDIA
`;

test('adds a DRAFT row and removes the (none) placeholder', () => {
  const out = addReadyRow(IDEAS, { title: 'Why rent eats your paycheck', slug: 'rent-paycheck', date: '2026-11-15', voice: 'AI voice B' });
  assert.match(out, /\| Why rent eats your paycheck \| `video\/scripts\/rent-paycheck\.md` \(DRAFT, AI Club Town 2026-11-15\) \| AI voice B \|/);
  assert.doesNotMatch(out, /\(none\)/);
  assert.match(out, /## Made\nVolcano · NVIDIA/);
});

test('adds rows under existing ones', () => {
  const once = addReadyRow(IDEAS, { title: 'A', slug: 'a', date: '2026-11-15', voice: 'Mark' });
  const twice = addReadyRow(once, { title: 'B', slug: 'b', date: '2026-11-15', voice: 'Mark' });
  const rows = twice.split('\n').filter(l => /^\| [AB] \|/.test(l));
  assert.equal(rows.length, 2);
});

test('does not add the same script twice', () => {
  const once = addReadyRow(IDEAS, { title: 'A', slug: 'a', date: '2026-11-15', voice: 'Mark' });
  assert.equal(addReadyRow(once, { title: 'A', slug: 'a', date: '2026-11-15', voice: 'Mark' }), once);
});

test('creates the section if the ideas file has none', () => {
  const out = addReadyRow('# Ideas\n', { title: 'A', slug: 'a', date: '2026-11-15', voice: 'Mark' });
  assert.match(out, /## Researched, script ready\n\| Topic \| Script \| Voiceover \|\n\|---\|---\|---\|\n\| A \|/);
});

test('reads the three desks from the plan', () => {
  const { planEntries } = require('../tools/send-to-studio.js');
  const plan = '# Plan for 2026-11-15 (Day 2)\n\n## What If\n- Topic: What if the Moon vanished?\n- Type: science\n- Slug: moon-vanished\n- Voice: AI voice A (to be chosen)\n\n## World News\n- Topic: Black Friday deals\n- Slug: `black-friday`\n- Voice: Mark (ElevenLabs)\n';
  assert.deepEqual(planEntries(plan), [
    { title: 'What if the Moon vanished?', slug: 'moon-vanished', voice: 'AI voice A (to be chosen)' },
    { title: 'Black Friday deals', slug: 'black-friday', voice: 'Mark (ElevenLabs)' },
  ]);
});
