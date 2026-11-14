---
name: village-day
description: Run one full White Bucket village day - the Chief picks three new topics (What If, How It Works, World News), each desk writes a DRAFT script in the WhiteBucket Explains studio format, the news desk fact-checks, the Programmer sends the drafts to the studio, and the town lights up as they work. Use when the daily scheduled run starts or the owner says "run the village".
---

# Village day

AI Club Town is the front office for the owner's video studio (**whitebucket-studio**).
Each day the village writes **three** DRAFT scripts for **WhiteBucket Explains**, one per
series, and sends them to the studio. The owner approves them, the voices are added, and
the studio builds the videos. The town page reads `town.json` from `main`, so every status
change is pushed right away.

## Rules for the whole run
- Work on `main` of AI_club_town. All pushes go to `main` (the owner approved this).
- The studio repo is changed **only** by `node tools/send-to-studio.js` (it adds new DRAFT
  scripts and IDEAS.md rows, never overwrites). Don't edit anything else in the studio.
- Use the tools for town and ledger changes. Never hand-edit `town.json` or `village/ledger.csv`.
- Each villager skill already contains its own `start` and `done` calls. Don't add extra ones.
- If a villager can't finish (a tool fails, a search returns nothing usable), don't stop
  the day: `node tools/town.js done <agent> "Couldn't finish: <short reason>" --push`
  and move on to the next villager.
- If a command prints "Push stopped", someone else changed that repo at the same time.
  Stop the day there and say so in your summary; don't force-push.
- Keep it to three scripts. Nothing extra.

## Steps

1. **Set up**
   ```bash
   git fetch origin main && git checkout -B main origin/main
   node tools/town.js today
   ```
   Shell variables don't carry over between commands: wherever a skill says `$DATE`,
   type the date that `today` printed (like `2026-11-15`). Then:
   ```bash
   mkdir -p scripts/$DATE
   node tools/town.js new-day --push
   ```
   Make sure the studio is next to this repo at `../whitebucket-studio` on its `main`
   branch: `ls ../whitebucket-studio/video/WORKFLOW.md`. If it's missing, attach it with the
   add_repo tool (owner "edgargaborno1490-rgb", repo "whitebucket-studio", access "push")
   and clone it there with `--depth 1`. If that fails, log it, write the scripts anyway,
   and the Programmer will report that they weren't sent.
2. **Chief of Staff** (`chief`): follow `chief-of-staff`. Picks three topics.
3. **What If Studio** (`whatif`): follow `what-if-writer`.
4. **How It Works** (`howitworks`): follow `how-it-works-writer`.
5. **World News** (`news`): follow `world-news-writer` (writes the news script, then
   fact-checks the other two).
6. **Programmer** (`programmer`): follow `programmer` (checks all three, sends them to the studio).
7. **Banker** (`banker`): follow `banker`.
8. **Close the day**
   ```bash
   node tools/town.js log "Day wrap-up: 3 DRAFTs in the studio: <the three titles>."
   node tools/town.js close-day --push
   ```

Finish with a short summary: the three titles and their voices, anything that failed, and the balance.
