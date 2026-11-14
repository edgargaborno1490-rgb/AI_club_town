// Reads town.json safely. Works in the browser (window.TownState) and in Node (require).
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TownState = api;
})(typeof self !== 'undefined' ? self : this, function () {
  const AGENT_IDS = ['chief', 'whatif', 'howitworks', 'news', 'programmer', 'banker'];
  const STATUSES = ['idle', 'working', 'done'];
  const DEFAULT_GOAL = 1000;
  const MAX_LOG = 20;

  const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const num = v => {
    // Accept "$1,234.50" the way people type it; reject partial junk like "12abc".
    const n = typeof v === 'string' && v.trim() !== '' ? Number(v.replace(/[$,\s]/g, '')) : v;
    return typeof n === 'number' && isFinite(n) ? n : NaN;
  };
  const text = v => (typeof v === 'string' ? v : '');

  const STALE_MS = 3 * 60 * 60 * 1000;

  function parseTown(raw, now) {
    const ok = isObj(raw);
    const r = ok ? raw : {};
    const updatedAt = typeof r.updated === 'string' ? Date.parse(r.updated) : NaN;
    // A run that stopped part-way leaves agents "working"; after 3 hours, show them idle.
    const stalled = !!now && !isNaN(updatedAt) && now.getTime() - updatedAt > STALE_MS;
    const agentsIn = isObj(r.agents) ? r.agents : {};
    const agents = {};
    for (const id of AGENT_IDS) {
      const a = isObj(agentsIn[id]) ? agentsIn[id] : {};
      let status = STATUSES.includes(a.status) ? a.status : 'idle';
      if (stalled && status === 'working') status = 'idle';
      agents[id] = { status, task: status === 'working' ? text(a.task) : '' };
    }
    const anyWorking = AGENT_IDS.some(id => isObj(agentsIn[id]) && agentsIn[id].status === 'working');
    const balance = num(r.balance);
    const goal = num(r.goal);
    const day = num(r.day);
    const log = (Array.isArray(r.log) ? r.log : [])
      .filter(isObj)
      .map(e => ({ time: text(e.time), text: text(e.text) }))
      .slice(-MAX_LOG)
      .reverse();
    return {
      ok,
      day: day >= 1 ? Math.floor(day) : 1,
      goal: goal > 0 ? goal : DEFAULT_GOAL,
      balance: balance > 0 ? balance : 0,
      updated: typeof r.updated === 'string' ? r.updated : null,
      stalled: stalled && anyWorking,
      agents,
      log,
    };
  }

  function timeAgo(iso, now) {
    if (!iso) return '';
    const t = Date.parse(iso);
    if (isNaN(t)) return '';
    const mins = Math.floor((now.getTime() - t) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + ' h ago';
    const days = Math.floor(hours / 24);
    return days + (days === 1 ? ' day ago' : ' days ago');
  }

  return { AGENT_IDS, parseTown, timeAgo };
});
