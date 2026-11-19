// Pure changes to the town.json object. Each returns a new object and stamps `updated`.
const NAMES = {
  chief: 'Chief of Staff', whatif: 'What If Studio', howitworks: 'How It Works',
  news: 'World News', programmer: 'Programmer', banker: 'Banker', analyst: 'Secret Building',
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
  if (Array.isArray(t.trialBirds)) {
    t.trialBirds = t.trialBirds.filter(b => Date.parse(b.until) > Date.now());
    if (!t.trialBirds.length) delete t.trialBirds;
  }
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
  if (town && town.platforms) throw new Error('Followers are counted per platform now: node tools/town.js followers <youtube|tiktok|instagram|facebook> <n>');
  const str = String(count).replace(/[,\s]/g, '');
  if (!/^\d+$/.test(str)) throw new Error(`Not a follower count: "${count}" (use a whole number like 25)`);
  const t = copy(town);
  t.followers = Number(str);
  return t;
}

// Followers on one platform. The total (birds over the island) becomes the sum of all four.
const PLATFORM_IDS = ['youtube', 'tiktok', 'instagram', 'facebook'];
function setPlatform(town, platform, count) {
  const id = String(platform || '').toLowerCase();
  if (!PLATFORM_IDS.includes(id)) throw new Error(`Unknown platform "${platform}". Use one of: ${PLATFORM_IDS.join(', ')}`);
  const str = String(count).replace(/[,\s]/g, '');
  if (!/^\d+$/.test(str)) throw new Error(`Not a follower count: "${count}" (use a whole number like 25)`);
  const t = copy(town);
  const prev = t.platforms && typeof t.platforms === 'object' ? t.platforms : {};
  t.platforms = {};
  for (const p of PLATFORM_IDS) t.platforms[p] = p === id ? Number(str) : (Number(prev[p]) || 0);
  t.followers = PLATFORM_IDS.reduce((s, p) => s + t.platforms[p], 0);
  return t;
}

// Named birds: only public usernames of followers who ASKED for a bird (commented "BIRD").
const MAX_NAMED = 60;
function birdName(name) {
  const n = String(name || '').trim().replace(/^@+/, '');
  if (!/^[A-Za-z0-9._]{2,30}$/.test(n)) throw new Error(`Not a username: "${name}" (letters, numbers, dots and underscores, 2-30 long)`);
  return '@' + n;
}
function addBird(town, name) {
  const n = birdName(name);
  const t = copy(town);
  t.birds = Array.isArray(t.birds) ? t.birds : [];
  if (t.birds.some(b => b.toLowerCase() === n.toLowerCase())) return t;
  if (t.birds.length >= MAX_NAMED) throw new Error(`Already ${MAX_NAMED} named birds (that's how many fly)`);
  t.birds.push(n);
  return t;
}
function removeBird(town, name) {
  const n = birdName(name).toLowerCase();
  const t = copy(town);
  t.birds = (Array.isArray(t.birds) ? t.birds : []).filter(b => b.toLowerCase() !== n);
  if (Array.isArray(t.trialBirds)) t.trialBirds = t.trialBirds.filter(b => String(b.name).toLowerCase() !== n);
  return t;
}
// Trial birds (owner, Nov 19, 2026): someone commented BIRD but hasn't followed yet. Their name shows
// very small for `hours` (default 24), then disappears unless the owner says they followed (keepBird).
function trialBird(town, name, now, hours = 24) {
  const n = birdName(name);
  const h = Number(hours);
  if (!(h > 0 && h <= 24 * 14)) throw new Error(`Not a number of hours: "${hours}"`);
  const t = removeBird(town, n);
  t.trialBirds = Array.isArray(t.trialBirds) ? t.trialBirds : [];
  t.trialBirds.push({ name: n, until: new Date(now.getTime() + h * 3600e3).toISOString() });
  return t;
}
// They followed: the trial bird becomes a normal named bird.
function keepBird(town, name) {
  return addBird(removeBird(town, name), name);
}
// Drop trial birds whose time ran out (the page hides them on time anyway).
function pruneBirds(town, now) {
  const t = copy(town);
  if (Array.isArray(t.trialBirds)) {
    t.trialBirds = t.trialBirds.filter(b => Date.parse(b.until) > now.getTime());
    if (!t.trialBirds.length) delete t.trialBirds;
  }
  return t;
}

// The newest posted video, shown as a link on the town page.
function setLatest(town, title, url) {
  const ti = String(title || '').trim();
  if (!ti || ti.length > 90) throw new Error('Give the video title (up to 90 characters)');
  if (!/^https:\/\/[^\s"'<>]+$/.test(String(url || ''))) throw new Error(`Not a https link: "${url}"`);
  const t = copy(town);
  t.latest = { title: ti, url };
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

module.exports = { NAMES, IDS, newDay, start, done, log, setBalance, setFollowers, setPlatform, PLATFORM_IDS, addBird, removeBird, trialBird, keepBird, pruneBirds, setLatest, closeDay };
