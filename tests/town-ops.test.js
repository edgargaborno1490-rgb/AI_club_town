const test = require('node:test');
const assert = require('node:assert/strict');
const ops = require('../tools/town-ops.js');

const base = () => ({
  day: 1, goal: 1000, balance: 0, updated: '2026-11-14T12:00:00Z',
  agents: {
    chief: { status: 'idle', task: '' }, whatif: { status: 'idle', task: '' },
    howitworks: { status: 'idle', task: '' }, news: { status: 'idle', task: '' },
    programmer: { status: 'idle', task: '' }, banker: { status: 'idle', task: '' },
  },
  log: [{ time: '12:00', text: 'Town opened. Waiting for the first agent run.' }],
});

test('first run ever stays on Day 1 and starts a fresh log', () => {
  const t = ops.newDay(base(), '2026-11-15');
  assert.equal(t.day, 1);
  assert.equal(t.lastRunDate, '2026-11-15');
  assert.deepEqual(t.log, []);
});

test('a run on a new date moves to the next day and resets everyone', () => {
  const t0 = Object.assign(base(), { lastRunDate: '2026-11-15' });
  t0.agents.whatif = { status: 'done', task: '' };
  const t = ops.newDay(t0, '2026-11-16');
  assert.equal(t.day, 2);
  assert.equal(t.agents.whatif.status, 'idle');
});

test('a second run on the same date keeps the day number', () => {
  const t = ops.newDay(Object.assign(base(), { day: 3, lastRunDate: '2026-11-16' }), '2026-11-16');
  assert.equal(t.day, 3);
});

test('start, done and log update agents and the log', () => {
  let t = ops.start(base(), 'whatif', 'Writing: What if?', '8:05');
  assert.deepEqual(t.agents.whatif, { status: 'working', task: 'Writing: What if?' });
  assert.deepEqual(t.log.at(-1), { time: '8:05', text: 'What If Studio started: Writing: What if?' });
  t = ops.done(t, 'whatif', '8:20', 'Script ready.');
  assert.deepEqual(t.agents.whatif, { status: 'done', task: '' });
  assert.deepEqual(t.log.at(-1), { time: '8:20', text: 'What If Studio: Script ready.' });
  t = ops.log(t, 'Hello', '8:21');
  assert.deepEqual(t.log.at(-1), { time: '8:21', text: 'Hello' });
});

test('every change stamps updated', () => {
  const t = ops.log(base(), 'x', '8:00');
  assert.notEqual(t.updated, '2026-11-14T12:00:00Z');
  assert.ok(!isNaN(Date.parse(t.updated)));
});

test('unknown agent throws', () => {
  assert.throws(() => ops.start(base(), 'ghost', 'x', '8:00'), /Unknown agent/);
});

test('balance is set from a number or money string', () => {
  assert.equal(ops.setBalance(base(), 12.4).balance, 12.4);
  assert.equal(ops.setBalance(base(), '$1,234.50').balance, 1234.5);
  assert.throws(() => ops.setBalance(base(), 'abc'), /amount/);
});

test('closeDay leaves nobody working and says who did not finish', () => {
  const t0 = ops.start(base(), 'news', 'Fact-checking', '8:30');
  const t = ops.closeDay(t0, '9:00');
  assert.equal(t.agents.news.status, 'done');
  assert.ok(t.log.some(e => e.text === "World News didn't finish today."));
  assert.equal(Object.values(t.agents).filter(a => a.status === 'working').length, 0);
});

test('does not mutate its input', () => {
  const t0 = base();
  ops.start(t0, 'chief', 'x', '8:00');
  assert.equal(t0.agents.chief.status, 'idle');
});

test('Honolulu date and time from a UTC moment', () => {
  const { honolulu } = require('../tools/town.js');
  assert.deepEqual(honolulu(new Date('2026-11-15T18:05:00Z')), { date: '2026-11-15', time: '8:05' });
  assert.deepEqual(honolulu(new Date('2026-11-16T03:30:00Z')), { date: '2026-11-15', time: '17:30' });
});

test('a push that hits a conflict stops loudly and leaves the repo clean', () => {
  const { execFileSync } = require('child_process');
  const fs = require('fs'), os = require('os'), path = require('path');
  const { push } = require('../tools/town.js');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'town-push-'));
  const g = (cwd, ...a) => execFileSync('git', a, { cwd, stdio: 'pipe' }).toString();
  const origin = path.join(tmp, 'origin.git'), a = path.join(tmp, 'a'), b = path.join(tmp, 'b');
  g(tmp, 'init', '-q', '--bare', '-b', 'main', origin);
  for (const d of [a, b]) {
    g(tmp, 'clone', '-q', origin, d);
    g(d, 'config', 'user.email', 't@t'); g(d, 'config', 'user.name', 't');
  }
  fs.writeFileSync(path.join(a, 'town.json'), '{"day":1}\n');
  g(a, 'add', '.'); g(a, 'commit', '-qm', 'init'); g(a, 'push', '-q', 'origin', 'HEAD:main');
  g(b, 'pull', '-q', 'origin', 'main');
  fs.writeFileSync(path.join(b, 'town.json'), '{"day":2}\n');
  g(b, 'commit', '-qam', 'other'); g(b, 'push', '-q', 'origin', 'HEAD:main');
  fs.writeFileSync(path.join(a, 'town.json'), '{"day":3}\n');
  assert.throws(() => push('test', a), /conflict/i);
  assert.equal(fs.existsSync(path.join(a, '.git', 'rebase-merge')) || fs.existsSync(path.join(a, '.git', 'rebase-apply')), false);
  assert.doesNotMatch(fs.readFileSync(path.join(a, 'town.json'), 'utf8'), /<<<<<<</);
});
