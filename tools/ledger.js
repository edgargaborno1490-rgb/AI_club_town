#!/usr/bin/env node
// The Banker's book. Reads village/earnings.md, rewrites village/ledger.csv, prints the total.
//   node tools/ledger.js
const fs = require('fs');
const path = require('path');

const LINE = /^-\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*(?:\|\s*(.*?))?\s*$/;

// "12", "12.40", "$1,234.50" are amounts; "1.234,50" or "lots" are not.
const AMOUNT = /^\$?(\d{1,3}(,\d{3})+|\d+)(\.\d+)?$/;

function candidateLines(md) {
  const lines = md.split('\n');
  const start = lines.findIndex(l => /^##\s+Earnings\s*$/i.test(l.trim()));
  if (start === -1) return lines.map(l => l.trim()).filter(l => /^-\s*\d{4}-\d{2}-\d{2}/.test(l));
  const out = [];
  for (const l of lines.slice(start + 1)) {
    if (/^##\s/.test(l.trim())) break;
    if (l.trim()) out.push(l.trim());
  }
  return out;
}

function parseEarnings(md) {
  const rows = [], skipped = [];
  for (const raw of candidateLines(md)) {
    const line = raw.startsWith('-') ? raw : '- ' + raw;
    const m = line.match(LINE);
    const ok = m && AMOUNT.test(m[3].replace(/\s/g, ''));
    const amount = ok ? Number(m[3].replace(/[$,\s]/g, '')) : NaN;
    if (!ok || !isFinite(amount)) { skipped.push(raw); continue; }
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
