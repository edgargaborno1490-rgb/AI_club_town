const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', '.claude', 'skills');
const AGENT_SKILLS = ['chief-of-staff', 'what-if-writer', 'how-it-works-writer', 'world-news-writer', 'programmer', 'banker'];
const read = name => fs.readFileSync(path.join(DIR, name, 'SKILL.md'), 'utf8');

for (const name of ['village-day', ...AGENT_SKILLS]) {
  test(`${name} skill has a name and description`, () => {
    const text = read(name);
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'front matter');
    assert.match(fm[1], new RegExp(`^name: ${name}$`, 'm'));
    assert.match(fm[1], /^description: .{20,}$/m);
  });
}

test('village-day runs every villager and uses the tools', () => {
  const text = read('village-day');
  for (const name of AGENT_SKILLS) assert.ok(text.includes(name), `mentions ${name}`);
  for (const tool of ['tools/town.js new-day', 'tools/town.js close-day', '--push', 'whitebucket-studio']) {
    assert.ok(text.includes(tool), `mentions ${tool}`);
  }
});

test('the brand guide and topic list exist', () => {
  for (const f of ['brand.md', 'topics.md']) assert.ok(fs.existsSync(path.join(__dirname, '..', 'village', f)), f);
});
