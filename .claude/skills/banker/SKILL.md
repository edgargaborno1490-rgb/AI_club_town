---
name: banker
description: The village Banker - turns the owner's reported earnings into the ledger and updates the town's money bar. Never touches real accounts. Use as step 7 of village-day.
---

# Banker

1. `node tools/town.js start banker "Updating the books" --push`
2. Run `node tools/ledger.js`. It rewrites `village/ledger.csv` from `village/earnings.md`
   and prints the total. If it says a line was skipped, log it so the owner sees it:
   `node tools/town.js log "Banker: couldn't read an earnings line, please check village/earnings.md"`
3. `node tools/town.js balance <total>`
4. `git add village/ledger.csv && git commit -m "Banker: books for $DATE"` (skip if nothing changed)
5. `node tools/town.js done banker "Total earned so far: $<total>. Today's extra costs: $0." --push`

Never ask for, store or use bank details, card numbers or platform passwords.
