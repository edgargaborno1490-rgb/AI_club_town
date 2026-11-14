const test = require('node:test');
const assert = require('node:assert/strict');
const { madeFromIdeas, titleFromScript, fromVillageTopics } = require('../tools/taken-topics.js');

test('reads the Made list from the studio ideas file', () => {
  const md = '# Ideas\n\n## Up next\n- x\n\n## Made\nVolcano · Center of the Earth · NVIDIA · Hawaii Prices\n';
  assert.deepEqual(madeFromIdeas(md), ['Volcano', 'Center of the Earth', 'NVIDIA', 'Hawaii Prices']);
  assert.deepEqual(madeFromIdeas('# nothing'), []);
});

test('reads the title of a studio script', () => {
  assert.equal(titleFromScript('> **Status: DRAFT**\n\n# WhiteBucket Explains: Why is Hawaii expensive?\n'), 'Why is Hawaii expensive?');
  assert.equal(titleFromScript('no title here'), null);
});

test('reads topics the village already wrote', () => {
  const md = '# Topics\n- 2026-11-13 | how-it-works | money | How does a credit score work?\nFormat: `- YYYY-MM-DD | series | subject | topic`\n';
  assert.deepEqual(fromVillageTopics(md), [{ date: '2026-11-13', type: 'money', topic: 'How does a credit score work?' }]);
});
