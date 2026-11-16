const test = require('node:test');
const assert = require('node:assert/strict');
const { queriesFor, rank, report } = require('../tools/outliers.js');

const v = (desk, views, channelMedian, title = 'A video') =>
  ({ desk, title, url: 'https://www.youtube.com/watch?v=abc', channel: 'Some channel', views, channelMedian });

test('queries rotate weekly and stay the same within a week', () => {
  assert.deepEqual(queriesFor('2026-11-16'), queriesFor('2026-11-22'));
  assert.notDeepEqual(queriesFor('2026-11-16'), queriesFor('2026-11-23'));
  assert.ok(queriesFor('2026-11-16').howitworks && queriesFor('2026-11-16').whatif);
  assert.throws(() => queriesFor('soon'));
});

test('only videos at 3x their channel or more count, best first', () => {
  const { byDesk } = rank({ videos: [v('howitworks', 30000, 10000, 'three'), v('howitworks', 90000, 10000, 'nine'), v('howitworks', 20000, 10000, 'two')] });
  assert.deepEqual(byDesk.howitworks.map(r => r.title), ['nine', 'three']);
});

test('videos without a channel baseline are listed separately, bad lines reported', () => {
  const { unchecked, problems } = rank({ videos: [v('whatif', 500000), { ...v('whatif', 5, 1), url: 'http://evil.example' }, v('gossip', 1, 1)] });
  assert.equal(unchecked.length, 1);
  assert.equal(problems.length, 2);
});

test('report says when there are no outliers or the week was skipped', () => {
  assert.match(report({ date: '2026-11-23', videos: [] }).text, /No outliers this week/);
  assert.match(report({ date: '2026-11-23', skipped: 'low credits', videos: [] }).text, /Skipped this week:\*\* low credits/);
  const ok = report({ date: '2026-11-23', queries: ['q'], creditsLeft: 30, videos: [{ ...v('whatif', 40000, 5000, 'Big | one'), angle: 'What if the Moon left?' }] }).text;
  assert.match(ok, /8\.0x/);
  assert.match(ok, /Big \/ one/);
  assert.match(ok, /credits left: 30/);
});
