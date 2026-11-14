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
  (function tick() {
    shown += (target - shown) * 0.12;
    if (Math.abs(target - shown) < 0.005) shown = target;
    money.nodeValue = fmt(shown) + ' ';
    requestAnimationFrame(tick);
  })();

  function render(state) {
    town.apply(state);
    target = state.balance;
    $('day').textContent = 'Day ' + state.day;
    $('goal').textContent = 'of ' + fmt(state.goal).replace(/\.00$/, '');
    $('bar').style.width = Math.min(100, state.balance / state.goal * 100) + '%';
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
      if (lastFailed) msg += " Couldn't refresh, showing the last update.";
    }
    $('status').textContent = msg;
  }

  async function load() {
    try {
      const res = await fetch('town.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const state = parseTown(await res.json());
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
