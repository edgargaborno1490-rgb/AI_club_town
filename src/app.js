// Wires the page together: real mode reads town.json every minute; ?demo plays the sample day.
(function () {
  const { parseTown, timeAgo } = window.TownState;
  const REFRESH_MS = 60000;
  const DEMO_MS = 4500;
  const $ = id => document.getElementById(id);
  const town = window.TownScene.create($('stage'), $('labels'));
  const demo = new URLSearchParams(location.search).has('demo');

  const money = $('money').firstChild;
  let target = 0, shown = 0;
  const fmt = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const whole = n => Math.round(n).toLocaleString('en-US');
  (function tick() {
    shown += (target - shown) * 0.12;
    if (Math.abs(target - shown) < 0.5) shown = target;
    money.nodeValue = whole(shown) + ' ';
    requestAnimationFrame(tick);
  })();

  function render(state) {
    town.apply(state);
    // The goal is followers on all four platforms together; money is a small line under it.
    target = state.followers;
    $('day').textContent = 'Day ' + state.day;
    $('goal').textContent = 'of ' + whole(state.goal) + ' followers';
    $('earned').textContent = 'Earned so far: ' + fmt(state.balance);
    const race = $('race');
    race.hidden = !state.platforms.length;
    race.textContent = '';
    const top = Math.max(1, ...state.platforms.map(p => p.followers));
    for (const p of [...state.platforms].sort((a, b) => b.followers - a.followers)) {
      const li = document.createElement('li');
      li.dataset.p = p.id;
      if (p.id === state.leader) li.className = 'lead';
      const name = document.createElement('span'); name.className = 'pname'; name.textContent = p.name;
      const track = document.createElement('span'); track.className = 'track';
      const fill = document.createElement('i'); fill.style.width = Math.max(3, p.followers / top * 100) + '%';
      track.appendChild(fill);
      const count = document.createElement('span'); count.className = 'pcount';
      count.textContent = p.followers.toLocaleString('en-US') + (p.id === state.leader ? ' 🏁' : '');
      li.append(name, track, count);
      race.appendChild(li);
    }
    const n = state.followers, max = window.TownScene.MAX_BIRDS;
    const who = state.platforms.length ? 'follower on any platform' : 'follower';
    $('flock').textContent = n === 0 ? `No birds yet: every ${who} becomes a bird.`
      : `${n.toLocaleString('en-US')} ${n === 1 ? 'bird' : 'birds'}: one for each ${who}` + (n > max ? ` (${max} flying)` : '');
    const named = state.birds.length;
    if (named) $('flock').textContent += ` · ${named} named (comment BIRD to get yours)`;
    $('milestone').textContent = state.nextMilestone
      ? `Next milestone: ${state.nextMilestone.toLocaleString('en-US')} followers (${(state.nextMilestone - n).toLocaleString('en-US')} to go) → something new on the island`
      : '';
    $('latest').hidden = !state.latest;
    if (state.latest) { $('latest').href = state.latest.url; $('latest-title').textContent = 'Latest video: ' + state.latest.title; }
    $('bar').style.width = Math.max(n > 0 ? 1.5 : 0, Math.min(100, n / state.goal * 100)) + '%';
    const feed = $('feed');
    feed.textContent = '';
    if (!state.log.length) {
      const li = document.createElement('li');
      li.innerHTML = '<time></time><span>Nothing yet today.</span>';
      feed.appendChild(li);
    }
    for (const e of state.log) {
      const li = document.createElement('li');
      const time = document.createElement('time'); time.textContent = e.time;
      const text = document.createElement('span'); text.textContent = e.text;
      li.append(time, text);
      feed.appendChild(li);
    }
  }

  if (demo) {
    const { stateAt } = window.TownDemo;
    $('badge').hidden = false;
    $('demo-controls').hidden = false;
    $('status').textContent = 'A sample day, not real activity.';
    let n = 2, auto = true;
    const step = () => render(parseTown(stateAt(n++)));
    step();
    setInterval(() => { if (auto) step(); }, DEMO_MS);
    $('next').addEventListener('click', step);
    $('pause').addEventListener('click', () => { auto = !auto; $('pause').textContent = auto ? 'Pause' : 'Play'; });
    return;
  }

  let lastGood = null, lastFailed = false;
  function showStatus() {
    let msg;
    if (!lastGood) msg = 'No activity data yet. The town lights up after the first agent run.';
    else {
      const ago = timeAgo(lastGood.updated, new Date());
      msg = ago ? 'Updated ' + ago + '.' : 'Updated (time not given).';
      if (lastGood.stalled) msg += ' The last run stopped early.';
      if (lastFailed) msg += " Couldn't refresh, showing the last update.";
    }
    $('status').textContent = msg;
  }

  async function load() {
    try {
      const res = await fetch('town.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const state = parseTown(await res.json(), new Date());
      if (!state.ok) throw new Error('town.json is not an object');
      lastGood = state; lastFailed = false;
      render(state);
    } catch (err) {
      lastFailed = true;
      if (!lastGood) render(parseTown(null));
    }
    showStatus();
  }

  load();
  setInterval(load, REFRESH_MS);
  setInterval(showStatus, 30000);
})();
