// Pure changes to the town.json object. Each returns a new object and stamps `updated`.
const NAMES = {
  chief: 'Chief of Staff', whatif: 'What If Studio', howitworks: 'How It Works',
  news: 'World News', programmer: 'Programmer', banker: 'Banker',
};
const IDS = Object.keys(NAMES);

function copy(town) {
  const t = JSON.parse(JSON.stringify(town));
  t.agents = t.agents || {};
  for (const id of IDS) t.agents[id] = t.agents[id] || { status: 'idle', task: '' };
  t.log = Array.isArray(t.log) ? t.log : [];
  t.updated = new Date().toISOString();
  return t;
}

function check(id) {
  if (!NAMES[id]) throw new Error(`Unknown agent "${id}". Use one of: ${IDS.join(', ')}`);
}

function newDay(town, date) {
  const t = copy(town);
  if (t.lastRunDate && t.lastRunDate !== date) t.day = (Number(t.day) || 1) + 1;
  if (!t.day) t.day = 1;
  t.lastRunDate = date;
  for (const id of IDS) t.agents[id] = { status: 'idle', task: '' };
  t.log = [];
  return t;
}

function start(town, id, task, time) {
  check(id);
  const t = copy(town);
  t.agents[id] = { status: 'working', task };
  t.log.push({ time, text: `${NAMES[id]} started: ${task}` });
  return t;
}

function done(town, id, time, note) {
  check(id);
  const t = copy(town);
  t.agents[id] = { status: 'done', task: '' };
  if (note) t.log.push({ time, text: `${NAMES[id]}: ${note}` });
  return t;
}

function log(town, text, time) {
  const t = copy(town);
  t.log.push({ time, text });
  return t;
}

function setBalance(town, amount) {
  const n = typeof amount === 'string' ? Number(amount.replace(/[$,\s]/g, '')) : amount;
  if (typeof n !== 'number' || !isFinite(n) || (typeof amount === 'string' && amount.trim() === '')) {
    throw new Error(`Not an amount: "${amount}"`);
  }
  const t = copy(town);
  t.balance = Math.round(n * 100) / 100;
  return t;
}

// Followers show as birds over the island (one bird per follower, up to the page's limit).
function setFollowers(town, count) {
  const str = String(count).replace(/[,\s]/g, '');
  if (!/^\d+$/.test(str)) throw new Error(`Not a follower count: "${count}" (use a whole number like 25)`);
  const t = copy(town);
  t.followers = Number(str);
  return t;
}

function closeDay(town, time) {
  const t = copy(town);
  for (const id of IDS) {
    if (t.agents[id].status === 'working') {
      t.agents[id] = { status: 'done', task: '' };
      t.log.push({ time, text: `${NAMES[id]} didn't finish today.` });
    }
  }
  return t;
}

module.exports = { NAMES, IDS, newDay, start, done, log, setBalance, setFollowers, closeDay };
