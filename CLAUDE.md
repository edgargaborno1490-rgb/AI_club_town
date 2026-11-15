# Project notes for Claude

**AI Club Town** is the owner's AI village: a 3D island page (GitHub Pages, from `main`)
plus Claude skills that write one DRAFT video script a day for the owner's channel
**WhiteBucket Explains**. The video studio is a separate repo, `whitebucket-studio`.
The patch business **Kanaktical** (`aloha-armor-forge`) is NOT part of this; never touch it.

Live page: https://edgargaborno1490-rgb.github.io/AI_club_town/ (`?demo` plays sample data).

## How it works
- Everything the page shows comes from `town.json`. Change it only with
  `node tools/town.js ...` (never by hand); `--push` commits and pushes it to `main`.
- **Seven workers, each a white bucket** with its job on it: Chief of Staff (red, star),
  What If (purple, "?"), How It Works (orange, gears), World News (blue, NEWS), Programmer
  (code, 1s and 0s), Banker (gold coins), and since Nov 15, 2026 the **Analyst** (teal,
  bar chart; a smaller bucket on the plaza). Code: `src/scene.js`.
- **Analyst:** reads view counts the owner copies into `village/stats.md` (or tells Claude),
  `node tools/stats.js --write` saves `village/analyst-report.md`; the Chief uses it when
  picking topics. Rotation changes stay the owner's call. Numbers only, never logins.
- **Daily run:** a scheduled task runs the `village-day` skill at 7:38 AM Hawaii time, inside
  the owner's main Claude chat (that chat has push access to both repos). Skills live in
  `.claude/skills/`; `village-day` lists the steps. Each run also opens a new
  "🎬 Video: <title>" chat in the studio for that day's draft (it shows the narration and waits
  for the owner's APPROVED).
- **Rotation** (`node tools/rotation.js`): Mon/Wed/Fri How It Works (money, voice George),
  Tue/Sat What If (science, Puck), Thu/Sun World News (Mark, ElevenLabs). Saturdays from
  Nov 21, 2026 also "AI Village · Week N" (village host voice, posted Sunday). Wed/Fri from
  Nov 25 also a short **Island Clip** (15–30 s), only if something on the island changed
  (`island-clip` skill). The owner decided (Nov 15) to keep What If for now; revisit with
  the Analyst's numbers (the 2-money-to-1-science test ends mid-December).
- Scripts go to `scripts/<date>/`, then into the studio's `video/scripts/` through
  `node tools/send-to-studio.js` (adds new DRAFTs and IDEAS.md rows, never overwrites).
  Writing rules: `village/brand.md` (the studio's `video/WORKFLOW.md` wins if they disagree).

## Rules
- Push straight to `main` of both repos (owner approved). No pull requests.
  Also keep branch `claude/laughing-ride-0rw56q` in sync with `main`.
- The village always writes **DRAFT**. Only the owner approves scripts.
- Money scripts: educational only, "not financial advice", no stock picks or predictions.
  Never suggest real reported facts about real people are fake.
- The Banker never asks for or stores bank details, card numbers or passwords. Earnings come
  only from what the owner writes in `village/earnings.md` (`node tools/ledger.js`).
- Tests: `npm test` and `NODE_PATH=$(npm root -g) node tests/smoke.js` before pushing code.

## Followers and the island
- Birds over the island = followers. Set the count with
  `node tools/town.js followers <n> --push` (up to 60 birds fly; the card shows the real number).
- **Named birds:** viewers who comment "BIRD" get their public username on a bird:
  `node tools/town.js bird add <username> --push` (`bird remove` if they ask). Only people who asked.
- **Milestones:** the card shows the next one (25, 50, 100, 250, …). Each is a story beat for
  an Island Clip or weekly update; what it unlocks is the owner's pick.
- **Latest video link** on the card: `node tools/town.js latest "<title>" <https link> --push`
  after the owner posts (ask them for the link).
- The empty **"? NEXT BUILD"** plot: each week the owner picks one viewer idea from the
  comments and it gets built there; that Sunday's update shows it.
- **Planned, not built yet:** one animal per platform: TikTok = hyperactive ferret,
  Instagram = peacock, Facebook = owl, YouTube = whale (swims in the water). Before building,
  ask the owner whether it's one animal per follower or one per 10 followers. The intro video
  promised "every follower becomes a bird", so changing it should be shown in a weekly update.

## History
- Nov 13–14, 2026: town built, then turned into buckets; birds and the next-build plot added;
  the intro video ("Meet WhiteBucket and His AI Village") was made and posted on all four platforms.
- The first scheduled run failed (a fresh session had no repo access); fixed by running in the
  owner's main chat.
