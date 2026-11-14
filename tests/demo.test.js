const test = require('node:test');
const assert = require('node:assert/strict');
const { parseTown } = require('../src/state.js');
const { STEPS, stateAt } = require('../src/demo.js');

test('the sample day has seven steps', () => {
  assert.equal(STEPS.length, 7);
});

test('first step: the Chief is planning', () => {
  const s = parseTown(stateAt(0));
  assert.equal(s.agents.chief.status, 'working');
  assert.equal(s.log.length, 1);
  assert.equal(s.day, 1);
});

test('end of day: money logged and full log', () => {
  const s = parseTown(stateAt(6));
  assert.equal(s.balance, 12.4);
  assert.equal(s.log.length, 7);
  assert.equal(s.agents.programmer.status, 'done');
});

test('a new day resets agents and log but keeps the money', () => {
  const s = parseTown(stateAt(7));
  assert.equal(s.day, 2);
  assert.equal(s.log.length, 1);
  assert.equal(s.balance, 12.4);
  assert.equal(s.agents.chief.status, 'working');
  assert.equal(s.agents.programmer.status, 'idle');
});

test('every demo state is valid town data', () => {
  for (let n = 0; n < 15; n++) assert.equal(parseTown(stateAt(n)).ok, true);
});

test('the sample town has birds that grow each day', () => {
  assert.ok(stateAt(0).followers > 0);
  assert.ok(stateAt(STEPS.length).followers > stateAt(0).followers);
});
