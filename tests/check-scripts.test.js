const test = require('node:test');
const assert = require('node:assert/strict');
const { checkScript } = require('../tools/check-scripts.js');

const words = n => Array.from({ length: n }, (_, i) => 'word' + i).join(' ');

function script({ series = 'what-if', narration = 170, scenes = [10, 15, 15, 15, 15], sources = null, drop = null } = {}) {
  const sections = {
    Hook: 'What if the Moon vanished tonight?',
    Narration: words(narration),
    Scenes: scenes.map((s, i) => `${i + 1}. [${s}s] On screen: shot ${i + 1} | Text: caption ${i + 1}`).join('\n'),
    'Facts to double-check': '- The Moon is about 384,400 km away.',
    Title: 'What If the Moon Disappeared?',
    Hashtags: '#whatif #space #learnontiktok',
    Captions: '- TikTok: a\n- YouTube: b\n- Instagram: c\n- Facebook: d',
  };
  if (sources) sections.Sources = sources;
  if (drop) delete sections[drop];
  const body = Object.entries(sections).map(([h, t]) => `## ${h}\n${t}\n`).join('\n');
  return `---\nseries: ${series}\ntitle: Test title\ntopic: earth science\nlength: 70s\n---\n\n${body}`;
}

test('a complete script passes', () => {
  assert.deepEqual(checkScript(script(), 'what-if'), []);
});

test('a missing section is named', () => {
  assert.ok(checkScript(script({ drop: 'Hashtags' }), 'what-if').some(p => /Hashtags/.test(p)));
});

test('narration outside 150-190 words is flagged', () => {
  assert.ok(checkScript(script({ narration: 90 }), 'what-if').some(p => /Narration has 90 words/.test(p)));
  assert.ok(checkScript(script({ narration: 230 }), 'what-if').some(p => /Narration has 230 words/.test(p)));
});

test('scene seconds outside 60-75 are flagged', () => {
  assert.ok(checkScript(script({ scenes: [10, 10, 10, 10, 10] }), 'what-if').some(p => /Scenes add up to 50s/.test(p)));
});

test('the wrong series in the front matter is flagged', () => {
  assert.ok(checkScript(script({ series: 'news' }), 'what-if').some(p => /series/.test(p)));
});

test('a missing caption platform is flagged', () => {
  const s = script().replace('- Facebook: d', '');
  assert.ok(checkScript(s, 'what-if').some(p => /Facebook/.test(p)));
});

test('world news needs sources from at least 2 different sites', () => {
  const one = '- https://www.reuters.com/a\n- https://www.reuters.com/b';
  const two = '- https://www.reuters.com/a\n- https://apnews.com/b';
  assert.ok(checkScript(script({ series: 'world-news', sources: one }), 'world-news').some(p => /2 different sites/.test(p)));
  assert.deepEqual(checkScript(script({ series: 'world-news', sources: two }), 'world-news'), []);
  assert.ok(checkScript(script({ series: 'world-news' }), 'world-news').some(p => /Sources/.test(p)));
});

test('world news needs 2 different sites for every story group', () => {
  const grouped = 'Story A:\n- https://reuters.com/a\n- https://apnews.com/a\n\nStory B:\n- https://bbc.com/b';
  assert.ok(checkScript(script({ series: 'world-news', sources: grouped }), 'world-news').some(p => /Story B/.test(p)));
  const ok = 'Story A:\n- https://reuters.com/a\n- https://apnews.com/a\n\nStory B:\n- https://bbc.com/b\n- https://npr.org/b';
  assert.deepEqual(checkScript(script({ series: 'world-news', sources: ok }), 'world-news'), []);
});
