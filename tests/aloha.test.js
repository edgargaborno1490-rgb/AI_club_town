const test = require('node:test');
const assert = require('node:assert');
const A = require('../src/aloha.js');

test('Hawaii time is UTC-10 all year (no daylight saving)', () => {
  assert.strictEqual(A.hawaiiHour(new Date('2026-11-17T07:30:00Z')), 21.5);
  assert.strictEqual(A.hawaiiHour(new Date('2026-07-01T22:00:00Z')), 12);
  assert.strictEqual(A.hawaiiHour(new Date('2026-01-01T05:00:00Z')), 19);
});

test('the island has morning, day, sunset and night', () => {
  assert.strictEqual(A.look(3).phase, 'night');
  assert.strictEqual(A.look(6.5).phase, 'morning');
  assert.strictEqual(A.look(12).phase, 'day');
  assert.strictEqual(A.look(18).phase, 'sunset');
  assert.strictEqual(A.look(21).phase, 'night');
  assert.strictEqual(A.look(12).torch, 0, 'torches are out in the day');
  assert.strictEqual(A.look(23).torch, 1, 'torches burn at night');
  assert.strictEqual(A.look(23).stars, 1);
});

test('the clock reads like a Hawaii clock', () => {
  assert.strictEqual(A.clockText(0.5), '12:30 AM');
  assert.strictEqual(A.clockText(7.633), '7:37 AM');
  assert.strictEqual(A.clockText(21.25), '9:15 PM');
});
