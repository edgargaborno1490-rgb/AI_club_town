---
name: village-day
description: Run one full White Bucket village day - the Chief picks one new topic, one studio writes the DRAFT script in the WhiteBucket Explains studio format, the news desk fact-checks it, and the town lights up as they work. Use when the daily scheduled run starts or the owner says "run the village".
---

# Village day

AI Club Town is the front office for the owner's video studio (**whitebucket-studio**).
Each day the village writes **one** DRAFT script for **WhiteBucket Explains**. The owner
approves it, records the voice, and the studio builds the video. The town page reads
`town.json` from `main`, so every status change is pushed right away.

## Rules for the whole run
- Work on `main` of AI_club_town. All pushes go to `main` (the owner approved this).
- **Never change the whitebucket-studio repo.** Only read it.
- Use the tools for town and ledger changes. Never hand-edit `town.json` or `village/ledger.csv`.
- Each villager skill already contains its own `start` and `done` calls. Don't add extra ones.
- If a villager can't finish (a tool fails, a search returns nothing usable), don't stop
  the day: `node tools/town.js done <agent> "Couldn't finish: <short reason>" --push`
  and move on to the next villager.
- If a command prints "Push stopped", someone else changed `main` at the same time.
  Stop the day there and say so in your summary; don't force-push.
- Keep the day small: one script, nothing extra.

## Steps

1. **Set up**
   ```bash
   git fetch origin main && git checkout -B main origin/main
   node tools/town.js today
   ```
   Shell variables don't carry over between commands: wherever a skill says `$DATE`,
   type the date that `today` printed (like `2026-11-15`). Then make the folder and start the day:
   ```bash
   mkdir -p scripts/$DATE
   node tools/town.js new-day --push
   ```
   Make sure the studio is next to this repo at `../whitebucket-studio` (read-only):
   `ls ../whitebucket-studio/video/WORKFLOW.md`. If it's missing, attach it with the
   add_repo tool (owner "edgargaborno1490-rgb", repo "whitebucket-studio", access "read")
   and clone it there with `--depth 1`. If that fails, log it and carry on using
   `village/brand.md` alone.
2. **Chief of Staff** (`chief`): follow `chief-of-staff`. Picks the topic and the desk.
3. **The assigned writer** writes the script (only one writes each day):
   money → `how-it-works-writer` (`howitworks`), science / what if → `what-if-writer`
   (`whatif`), timely news → `world-news-writer` (`news`).
4. **World News desk** (`news`): if it wasn't today's writer, follow the fact-check part
   of `world-news-writer`.
5. **Programmer** (`programmer`): follow `programmer`.
6. **Banker** (`banker`): follow `banker`.
7. **Close the day**
   ```bash
   node tools/town.js log "Day wrap-up: DRAFT ready, <title>. Waiting for the owner's OK."
   node tools/town.js close-day --push
   ```

Finish with a short summary: the title, why this topic, anything that failed, and the balance.
