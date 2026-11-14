#!/usr/bin/env node
// The Banker's book. Reads village/earnings.md, rewrites village/ledger.csv, prints the total.
//   node tools/ledger.js
const fs = require('fs');
const path = require('path');

const LINE = /^-\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*(?:\|\s*(.*?))?\s*$/;

function parseEarnings(md) {
  const rows = [], skipped = [];
  for (const raw of md.split('\n')) {
    const line = raw.trim();
    if (!/^-\s*\d{4}-\d{2}-\d{2}/.test(line)) continue;
    const m = line.match(LINE);
    const amount = m ? Number(m[3].replace(/[$,\s]/g, '')) : NaN;
    if (!m || !isFinite(amount) || m[3].trim() === '') { skipped.push(line); continue; }
    rows.push({ date: m[1], platform: m[2], amount: Math.round(amount * 100) / 100, note: m[4] || '' });
  }
  return { rows, skipped };
}

const cell = v => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

function toCsv(rows) {
  const total = rows.reduce((s, r) => s + r.amount, 0);
  const lines = ['date,platform,amount,note', ...rows.map(r => [r.date, r.platform, r.amount.toFixed(2), r.note].map(cell).join(','))];
  lines.push(`TOTAL,,${total.toFixed(2)},`);
  return lines.join('\n') + '\n';
}

if (require.main === module) {
  const dir = path.join(__dirname, '..', 'village');
  const { rows, skipped } = parseEarnings(fs.readFileSync(path.join(dir, 'earnings.md'), 'utf8'));
  fs.writeFileSync(path.join(dir, 'ledger.csv'), toCsv(rows));
  for (const s of skipped) console.error(`Could not read this line, skipped: ${s}`);
  console.log(rows.reduce((s, r) => s + r.amount, 0).toFixed(2));
}

module.exports = { parseEarnings, toCsv };
