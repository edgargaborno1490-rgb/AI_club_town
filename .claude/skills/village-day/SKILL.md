---
name: village-day
description: Run one full White Bucket village day - every villager does its job in order and the town lights up as they work. Use when the daily scheduled run starts or the owner says "run the village".
---

# Village day

You are running a day in AI Club Town. Six villagers make content for **White Bucket
Project**. You play each one in turn by following its skill. The town page reads
`town.json` from `main`, so every status change is pushed right away and the owner can
watch the buildings light up.

## Rules for the whole run
- Work on `main`. All pushes go to `main` (the owner approved this).
- Use the tools for town and ledger changes. Never hand-edit `town.json` or `village/ledger.csv`.
- Before each villager: `node tools/town.js start <agent> "<what they are doing>" --push`
- After each villager: commit their files, then
  `node tools/town.js done <agent> "<one-line result>" --push` (this pushes your commits too).
- If a villager can't finish (a tool fails, a search returns nothing usable), don't stop
  the day: `node tools/town.js done <agent> "Couldn't finish: <short reason>" --push`
  and move on to the next villager.
- Keep the day small: one script per series. Don't start extra work.

## Steps

1. **Set up**
   ```bash
   git fetch origin main && git checkout -B main origin/main
   DATE=$(node tools/town.js today)
   mkdir -p scripts/$DATE
   node tools/town.js new-day --push
   ```
   Shell variables don't carry over between commands: wherever any skill says `$DATE`,
   type the actual date that `node tools/town.js today` printed (like `2026-11-15`).
2. **Chief of Staff** (`chief`): follow the `chief-of-staff` skill to write `scripts/$DATE/plan.md`.
3. **What If Studio** (`whatif`): follow `what-if-writer`.
4. **How It Works** (`howitworks`): follow `how-it-works-writer`.
5. **World News** (`news`): follow `world-news-writer`.
6. **Programmer** (`programmer`): follow `programmer`. It runs `node tools/check-scripts.js $DATE`.
7. **Banker** (`banker`): follow `banker`.
8. **Close the day**
   ```bash
   node tools/town.js log "Day wrap-up: <titles of the scripts written, or what went wrong>"
   node tools/town.js close-day --push
   ```

Finish with a short summary: the three titles, anything that failed, and the balance.
