const test = require('node:test');
const assert = require('node:assert/strict');
const { AGENT_IDS, parseTown, timeAgo } = require('../src/state.js');

test('non-object input gives a safe idle town marked not ok', () => {
  const s = parseTown(null);
  assert.equal(s.ok, false);
  assert.deepEqual(Object.keys(s.agents), AGENT_IDS);
  for (const id of AGENT_IDS) assert.deepEqual(s.agents[id], { status: 'idle', task: '' });
  assert.equal(s.goal, 1000);
  assert.equal(s.balance, 0);
  assert.equal(s.day, 1);
  assert.deepEqual(s.log, []);
});

test('known agents are read and unknown agents are dropped', () => {
  const s = parseTown({ agents: { whatif: { status: 'working', task: 'X' }, ghost: { status: 'working' } } });
  assert.equal(s.ok, true);
  assert.deepEqual(s.agents.whatif, { status: 'working', task: 'X' });
  assert.equal('ghost' in s.agents, false);
  assert.deepEqual(s.agents.chief, { status: 'idle', task: '' });
});

test('an unknown status becomes idle', () => {
  assert.equal(parseTown({ agents: { news: { status: 'dancing' } } }).agents.news.status, 'idle');
});

test('money values are parsed, junk falls back', () => {
  const s = parseTown({ balance: '12.40', goal: 'abc' });
  assert.equal(s.balance, 12.4);
  assert.equal(s.goal, 1000);
  assert.equal(parseTown({ balance: -5 }).balance, 0);
  assert.equal(parseTown({ goal: 0 }).goal, 1000);
});

test('log keeps the last 20 entries, newest first', () => {
  const log = Array.from({ length: 25 }, (_, i) => ({ time: String(i), text: 'e' + i }));
  const s = parseTown({ log });
  assert.equal(s.log.length, 20);
  assert.deepEqual(s.log[0], { time: '24', text: 'e24' });
  assert.deepEqual(s.log[19], { time: '5', text: 'e5' });
});

test('timeAgo phrases', () => {
  const now = new Date('2026-11-14T12:00:00Z');
  assert.equal(timeAgo('2026-11-14T11:59:30Z', now), 'just now');
  assert.equal(timeAgo('2026-11-14T11:55:00Z', now), '5 min ago');
  assert.equal(timeAgo('2026-11-14T10:00:00Z', now), '2 h ago');
  assert.equal(timeAgo('2026-11-11T12:00:00Z', now), '3 days ago');
  assert.equal(timeAgo(null, now), '');
  assert.equal(timeAgo('nonsense', now), '');
});

test('money written the way people type it', () => {
  assert.equal(parseTown({ balance: '$12.40' }).balance, 12.4);
  assert.equal(parseTown({ balance: '1,234.50' }).balance, 1234.5);
  assert.equal(parseTown({ goal: '$1,000' }).goal, 1000);
  assert.equal(parseTown({ balance: '12abc' }).balance, 0);
});

test('a town not updated for over 3 hours shows nobody working', () => {
  const raw = { updated: '2026-11-14T08:00:00Z', agents: { news: { status: 'working', task: 'X' } } };
  const s = parseTown(raw, new Date('2026-11-14T12:00:00Z'));
  assert.equal(s.agents.news.status, 'idle');
  assert.equal(s.stalled, true);
  const fresh = parseTown(raw, new Date('2026-11-14T09:00:00Z'));
  assert.equal(fresh.agents.news.status, 'working');
  assert.equal(fresh.stalled, false);
});

test('followers are read as a whole number, junk becomes 0', () => {
  assert.equal(parseTown({ followers: 10 }).followers, 10);
  assert.equal(parseTown({ followers: '1,250' }).followers, 1250);
  assert.equal(parseTown({ followers: 12.7 }).followers, 12);
  assert.equal(parseTown({ followers: -3 }).followers, 0);
  assert.equal(parseTown({ followers: 'lots' }).followers, 0);
  assert.equal(parseTown({}).followers, 0);
});

test('trial birds show small until their time runs out', () => {
  const raw = { birds: ['bob'], trialBirds: [{ name: '@Josh', until: '2026-11-20T20:00:00Z' }, { name: '<x>', until: '2099-01-01T00:00:00Z' }] };
  const before = parseTown(raw, new Date('2026-11-20T10:00:00Z'));
  assert.deepEqual(before.birds, ['@bob', '@Josh']);
  assert.deepEqual(before.smallBirds, ['@Josh']);
  const after = parseTown(raw, new Date('2026-11-20T21:00:00Z'));
  assert.deepEqual(after.birds, ['@bob']);
  assert.deepEqual(after.smallBirds, []);
});

test('named birds: only safe usernames, with an @, at most 60', () => {
  const s = parseTown({ birds: ['bob', '@x.y_z', '<script>', 'a', 42, ...Array.from({ length: 70 }, (_, i) => 'u' + i)] });
  assert.deepEqual(s.birds.slice(0, 2), ['@bob', '@x.y_z']);
  assert.equal(s.birds.length, 60);
  assert.deepEqual(parseTown({}).birds, []);
});

test('latest video needs a title and a https link', () => {
  assert.deepEqual(parseTown({ latest: { title: ' Hi ', url: 'https://t.co/x' } }).latest, { title: 'Hi', url: 'https://t.co/x' });
  assert.equal(parseTown({ latest: { title: 'Hi', url: 'javascript:alert(1)' } }).latest, null);
  assert.equal(parseTown({ latest: { title: 'Hi', url: 'http://t.co/x' } }).latest, null);
  assert.equal(parseTown({ latest: { title: '', url: 'https://t.co/x' } }).latest, null);
});

test('next follower milestone', () => {
  assert.equal(parseTown({ followers: 12 }).nextMilestone, 25);
  assert.equal(parseTown({ followers: 25 }).nextMilestone, 50);
  assert.equal(parseTown({}).nextMilestone, 25);
  assert.equal(parseTown({ followers: 99999 }).nextMilestone, null);
});

test('the Analyst is a known agent', () => {
  assert.equal(parseTown({ agents: { analyst: { status: 'working', task: 'Reading stats' } } }).agents.analyst.status, 'working');
});

test('platform followers add up to the total and name a single leader', () => {
  const s = parseTown({ followers: 12, platforms: { tiktok: 16, instagram: 4, youtube: '19', facebook: 3 } });
  assert.equal(s.followers, 42);
  assert.deepEqual(s.platforms.map(p => [p.id, p.followers]), [['youtube', 19], ['tiktok', 16], ['instagram', 4], ['facebook', 3]]);
  assert.equal(s.leader, 'youtube');
  assert.equal(s.nextMilestone, 50);
  assert.equal(parseTown({ platforms: { tiktok: 5, youtube: 5 } }).leader, null);
  assert.equal(parseTown({ platforms: { tiktok: 'junk', youtube: -2 } }).followers, 0);
  assert.deepEqual(parseTown({ followers: 7 }).platforms, []);
  assert.equal(parseTown({ followers: 7 }).followers, 7);
});
