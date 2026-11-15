---
name: village-day
description: Run one full White Bucket village day - the Chief picks one new topic for today's desk on the rotation, that desk writes the DRAFT script in the WhiteBucket Explains studio format, the news desk fact-checks, the Programmer sends it to the studio, and the town lights up as they work. Use when the daily scheduled run starts or the owner says "run the village".
---

# Village day

AI Club Town is the front office for the owner's video studio (**whitebucket-studio**).
Each day the village writes **one** DRAFT script for **WhiteBucket Explains** and sends it
to the studio. The owner approves it, the voice is added, and the studio builds the video.
The town page reads `town.json` from `main`, so every status change is pushed right away.

**Rotation** (`node tools/rotation.js`): Mon/Wed/Fri How It Works (money, George) ·
Tue/Sat What If (science, Puck) · Thu/Sun World News (Mark on ElevenLabs).
Extras: Saturdays from Nov 21 the weekly "AI Village · Week N"; Wednesdays and Fridays from
Nov 25 a short Island Clip, only if something on the island changed.

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
- One script (plus the Village Update on Saturdays and an Island Clip on Wed/Fri when
  there's news). Nothing extra. The desks that aren't on today stay idle.

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
   and clone it there with `--depth 1`. If that fails, log it, write the script anyway,
   and the Programmer will report that it wasn't sent.
2. **Chief of Staff** (`chief`): follow `chief-of-staff`. Picks today's topic and desk.
3. **Today's writer** (only one): How It Works → `how-it-works-writer`;
   What If → `what-if-writer`; World News → part A of `world-news-writer`.
4. **World News desk** (`news`): on days it didn't write, follow part B of
   `world-news-writer` (fact-check today's script).
4b. **Saturdays only:** if `node tools/rotation.js` prints "also Village Update", the
   Chief follows `weekly-update` (a second DRAFT, posted Sunday).
4c. **Wednesdays and Fridays from Nov 25:** if `node tools/rotation.js` prints "also Island
   Clip", the Chief follows `island-clip` (it may skip when nothing changed).
5. **Programmer** (`programmer`): follow `programmer` (checks the script, sends it to the studio).
6. **Banker** (`banker`): follow `banker`.
7. **Analyst** (`analyst`): follow `analyst` (reads `village/stats.md`, updates the report).
7b. **Open the video chat** (one per DRAFT sent to the studio today; skip any that weren't sent).
   Use the `create_session` tool (claude-code-remote) with:
   - `title`: "🎬 Video: <title> (<voice name>)"
   - `environment_id`: `env_016US1TUy1EDLLZAQxsURQAG` (whitebucket-studio)
   - `source_url`: `https://github.com/edgargaborno1490-rgb/whitebucket-studio`
   - `prompt`: say which script (`video/scripts/<slug>.md`), its series and voice, then:
     "Use the daily-video skill (.claude/skills/daily-video/SKILL.md). Right now, only: read the
     skill and the script; reply with the title,
     voice, post window and the full narration in a quote block so the owner can copy it;
     then wait. Don't change the Status or build until the owner says APPROVED (and, for Mark
     or the village host, sends the MP3; for Puck/George make the voice with scripts/tts.py).
     After approval follow the daily-video skill (template FaaLine.tsx, real NASA media, 3D island
     checkup, "See you tomorrow" ending): stills to the owner, render, caption, update HANDOFF.md,
     push to main, send the MP4."
   If the tool isn't available or fails, say so in the summary (the owner can open one by hand).
8. **Close the day**
   ```bash
   node tools/town.js log "Day wrap-up: DRAFT in the studio: <title> (<voice>)."
   node tools/town.js close-day --push
   ```

Finish with a short summary: the title and its voice, why this topic, anything that
failed, the balance, the Analyst's one-line finding (or the reminder to add numbers), the
full narration in a quote block (so the owner can copy it), and the name of the video chat.
