#!/usr/bin/env node
// Lists every topic that is already made, scripted or written by the village,
// so the Chief of Staff never repeats one.
//   node tools/taken-topics.js [path-to-whitebucket-studio]   (default ../whitebucket-studio)
const fs = require('fs');
const path = require('path');

function madeFromIdeas(md) {
  const m = md.match(/^## Made\s*\n([\s\S]*?)(?=\n## |\s*$)/m);
  if (!m) return [];
  return m[1].split(/·|\n/).map(s => s.trim()).filter(Boolean);
}

function titleFromScript(md) {
  const m = md.match(/^# WhiteBucket Explains: (.+)$/m);
  return m ? m[1].trim() : null;
}

function fromVillageTopics(md) {
  return md.split('\n')
    .map(l => l.match(/^-\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(.+?)\s*$/))
    .filter(Boolean)
    .map(m => ({ date: m[1], type: m[3], topic: m[4] }));
}

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const studio = path.resolve(process.argv[2] || path.join(root, '..', 'whitebucket-studio'));
  const read = f => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
  const ideas = read(path.join(studio, 'video', 'IDEAS.md'));
  if (!ideas) {
    console.error(`Can't find the studio at ${studio}. Clone whitebucket-studio next to AI_club_town first.`);
    process.exit(1);
  }
  console.log('## Already made (studio)');
  for (const t of madeFromIdeas(ideas)) console.log(`- ${t}`);
  console.log('\n## Already scripted (studio video/scripts)');
  const dir = path.join(studio, 'video', 'scripts');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort()) {
    const t = titleFromScript(read(path.join(dir, f)));
    if (t) console.log(`- ${t}`);
  }
  console.log('\n## Already written by the village');
  const village = fromVillageTopics(read(path.join(root, 'village', 'topics.md')) || '');
  for (const v of village) console.log(`- ${v.date} (${v.type}) ${v.topic}`);
  const recent = village.slice(-3).map(v => v.type);
  console.log(`\n## Mix: last 3 village topics were ${recent.join(', ') || 'none'} (aim for 2 money : 1 science)`);
}

module.exports = { madeFromIdeas, titleFromScript, fromVillageTopics };
