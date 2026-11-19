// Reads town.json safely. Works in the browser (window.TownState) and in Node (require).
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TownState = api;
})(typeof self !== 'undefined' ? self : this, function () {
  const AGENT_IDS = ['chief', 'whatif', 'howitworks', 'news', 'programmer', 'banker', 'analyst'];
  // Follower milestones: each one is a story beat for a weekly update.
  const MILESTONES = [25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
  const STATUSES = ['idle', 'working', 'done'];
  // The goal is followers (since Nov 15, 2026): the four platforms race to 1,000 together.
  const DEFAULT_GOAL = 1000;
  const PLATFORMS = [
    { id: 'youtube', name: 'YouTube' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'facebook', name: 'Facebook' },
  ];
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
    const followers = num(r.followers);
    const log = (Array.isArray(r.log) ? r.log : [])
      .filter(isObj)
      .map(e => ({ time: text(e.time), text: text(e.text) }))
      .slice(-MAX_LOG)
      .reverse();
    const birds = (Array.isArray(r.birds) ? r.birds : [])
      .filter(b => typeof b === 'string' && /^@?[A-Za-z0-9._]{2,30}$/.test(b))
      .map(b => (b[0] === '@' ? b : '@' + b))
      .slice(0, 60);
    // Trial birds: commented BIRD but not following yet; tiny name, hidden once `until` passes.
    const nowMs = now instanceof Date ? now.getTime() : Date.now();
    const smallBirds = (Array.isArray(r.trialBirds) ? r.trialBirds : [])
      .filter(b => isObj(b) && typeof b.name === 'string' && /^@?[A-Za-z0-9._]{2,30}$/.test(b.name) && Date.parse(b.until) > nowMs)
      .map(b => (b.name[0] === '@' ? b.name : '@' + b.name))
      .filter(n => !birds.some(x => x.toLowerCase() === n.toLowerCase()))
      .slice(0, Math.max(0, 60 - birds.length));
    const L = isObj(r.latest) ? r.latest : {};
    const latest = typeof L.title === 'string' && L.title.trim() && /^https:\/\/[^\s"'<>]+$/.test(text(L.url))
      ? { title: L.title.trim().slice(0, 90), url: L.url } : null;
    // Followers per platform; when any are given, the total is their sum.
    const P = isObj(r.platforms) ? r.platforms : {};
    const hasPlatforms = PLATFORMS.some(p => p.id in P);
    const platforms = hasPlatforms ? PLATFORMS.map(p => {
      const n = num(P[p.id]);
      return { id: p.id, name: p.name, followers: n > 0 ? Math.floor(n) : 0 };
    }) : [];
    const top = platforms.reduce((m, p) => Math.max(m, p.followers), 0);
    const leaders = platforms.filter(p => top > 0 && p.followers === top).map(p => p.id);
    const f = hasPlatforms ? platforms.reduce((s, p) => s + p.followers, 0) : (followers > 0 ? Math.floor(followers) : 0);
    return {
      ok,
      day: day >= 1 ? Math.floor(day) : 1,
      goal: goal > 0 ? goal : DEFAULT_GOAL,
      balance: balance > 0 ? balance : 0,
      followers: f,
      platforms,
      leader: leaders.length === 1 ? leaders[0] : null,
      nextMilestone: MILESTONES.find(m => m > f) || null,
      birds: birds.concat(smallBirds),
      smallBirds,
      latest,
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

  return { AGENT_IDS, MILESTONES, PLATFORMS, parseTown, timeAgo };
});
