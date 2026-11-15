// A sample day for demo mode (?demo). Always shown with the "Example data" badge.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TownDemo = api;
})(typeof self !== 'undefined' ? self : this, function () {
  const STEPS = [
    { t: '8:00', set: { chief: ['working', 'Planning today: one video per studio'] }, log: "Chief of Staff posted today's plan." },
    { t: '8:05', set: { chief: ['done', ''], whatif: ['working', 'Writing: What if the Moon disappeared?'], howitworks: ['working', 'Researching: How do elevator brakes work?'], news: ['working', "Picking today's top 5 world stories"] }, log: 'Three studios started on their scripts.' },
    { t: '9:10', set: { whatif: ['done', ''], programmer: ['working', 'Rendering the What If animation'] }, log: 'What If script finished. Programmer is rendering it.' },
    { t: '9:40', set: { news: ['working', 'Fact-checking story 3 of 5'], howitworks: ['working', 'Drawing the elevator cutaway'] }, log: 'World News is checking every source.' },
    { t: '10:30', set: { howitworks: ['done', ''], news: ['done', ''], programmer: ['working', 'Rendering 2 more videos'] }, log: 'How It Works and World News scripts are ready.' },
    { t: '11:15', set: { programmer: ['done', ''], banker: ['working', "Logging today's costs: $0 extra"] }, log: '3 videos are ready for you to upload.' },
    { t: '18:00', set: { banker: ['done', ''], analyst: ['working', 'Reading this week\'s view counts'] }, add: 12.4, log: "Banker logged $12.40 you reported from yesterday's videos." },
    { t: '18:10', set: { analyst: ['done', ''] }, log: 'Analyst: What If videos got the most views this week.' },
  ];

  function stateAt(n) {
    const day = Math.floor(n / STEPS.length) + 1;
    const stepInDay = n % STEPS.length;
    const dayMoney = STEPS.reduce((sum, s) => sum + (s.add || 0), 0);
    let balance = Math.round(dayMoney * (day - 1) * 100) / 100;
    const agents = {};
    const log = [];
    for (let i = 0; i <= stepInDay; i++) {
      const s = STEPS[i];
      for (const [id, [status, task]] of Object.entries(s.set)) agents[id] = { status, task };
      if (s.add) balance = Math.round((balance + s.add) * 100) / 100;
      log.push({ time: s.t, text: s.log });
    }
    const platforms = { youtube: 4 + day * 2, tiktok: 5 + day, instagram: 1 + day, facebook: day };
    const followers = Object.values(platforms).reduce((s, n) => s + n, 0);
    return { day, goal: 1000, balance, platforms, followers, birds: ['@sample_bird', '@demo.viewer'], latest: { title: 'Sample video', url: 'https://example.com/' }, updated: null, agents, log };
  }

  return { STEPS, stateAt };
});
