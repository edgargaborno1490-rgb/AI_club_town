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
  (code, 1s and 0s), Banker (gold coins), and since Nov 15, 2026 the **Analyst**. Code: `src/scene.js`.
- **The Analyst's building is under wraps** (owner's wish, Nov 15, 2026): a tarp-covered bucket
  with scaffolding, a crane and a work crew, and **no sign**, so visitors don't know what it is
  until the reveal. The town log and videos call it the **Secret Building** (`NAMES` in
  `tools/town-ops.js`); never say "Analyst" on the page or in a video before the reveal. Reveal = in `src/scene.js` set its kind to `stats` and remove `hidden: true`
  (only when the owner says; good moment for an Island Clip or weekly update).
- **Workers** (hard hats, orange vests) build things: 3 at the construction site, 3 putting up
  the birdhouses (one on a ladder).
- **Birds sit and take turns flying:** most birds sit on bucket rims, the birdhouses, treetops,
  the grass and the plaza; 5-10 fly at a time (more followers = more in the air, max 10), and
  every few seconds one lands while another takes off.
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
- **The goal is 1,000 followers** (owner's change, Nov 15, 2026; it used to be $1,000). The four
  platforms **race** there together: the card shows the total of 1,000 plus a bar per platform
  (YouTube, TikTok, Instagram, Facebook) and flags the leader. Money is only a small
  "Earned so far" line now (the Banker still sets it).
- Birds over the island = followers on all four platforms together. Set each platform with
  `node tools/town.js followers <youtube|tiktok|instagram|facebook> <n> --push`; the total is
  their sum (up to 60 birds fly; the card shows the real number). Nov 15, 2026: YouTube 19,
  TikTok 16, Instagram 4, Facebook 3 = 42. Nov 16, 2026: YouTube 20, TikTok 17, Instagram 4,
  Facebook 3 = 44.
- **The card hides (owner's wish, Nov 16, 2026):** the owner wants to see the island, not the card.
  Swipe the "AI Club Town · Day N" card left (or tap its ‹ tab) to tuck it off screen; a › tab
  stays on the left edge to bring it back (tap or swipe right). The page remembers the choice.
  Code: `cardSwipe` in `src/app.js` (touch events on phones, needed for iPhone Safari; mouse uses
  pointer events) and `.goal.tucked` / `.tuck` in `styles.css`.
- **Phones keep old copies of the page.** `index.html` loads `styles.css?v=N` and `src/*.js?v=N`:
  bump N every time you change CSS or JS, or the owner's phone may show the old version.
- **Named birds:** viewers who comment "BIRD" get their public username on a bird:
  `node tools/town.js bird add <username> --push` (`bird remove` if they ask). Only people who asked.
- **Milestones:** the card shows the next one (25, 50, 100, 250, …). Each is a story beat for
  an Island Clip or weekly update; what it unlocks is the owner's pick.
- **Latest video link** on the card: `node tools/town.js latest "<title>" <https link> --push`
  after the owner posts (ask them for the link).
- The empty **"? NEXT BUILD"** plot: each week the owner picks one viewer idea from the
  comments and it gets built there; that Sunday's update shows it. When a build is done it keeps
  its spot and a new empty plot opens.
- **Built so far:** the **Birdhouses** (Nov 15, 2026, a YouTube viewer's comment): three little
  houses on poles between What If and How It Works; the first three birds of the flock sit on
  them. The next-build plot moved to between How It Works and the Banker.
- **Planned, not built yet:** one animal per platform: TikTok = hyperactive ferret,
  Instagram = peacock, Facebook = owl, YouTube = whale (swims in the water). Before building,
  ask the owner whether it's one animal per follower or one per 10 followers. The intro video
  promised "every follower becomes a bird", so changing it should be shown in a weekly update.

## Plugins (added Nov 16, 2026)
The owner added these Claude plugins. They connect when a chat starts, so a chat opened before
Nov 16 won't have them. TubeAlfred's server is allowed in the `whitebucket-studio` environment
(`mcp.tubealfred.com`); if a tool is missing, say so and carry on without it.
- **No Posty** (removed Nov 16, 2026, owner's choice): the owner posts videos by hand.
- **TubeAlfred** (read-only YouTube data: channel and video stats, comments, transcripts).
  The Analyst may use it for **YouTube** numbers instead of waiting for the owner, writing them
  to `village/stats.md` like any other line (TikTok, Instagram and Facebook numbers still come
  from the owner). It may also list YouTube comments that say "BIRD"; show the usernames to the
  owner and add named birds only after the owner says yes. Public data only, never logins.
- **social-media-skills** (captions, hashtags, hooks, platform specs). Helpers for writing;
  `village/brand.md` and the studio's `video/WORKFLOW.md` still win.

## History
- Nov 13–14, 2026: town built, then turned into buckets; birds and the next-build plot added;
  the intro video ("Meet WhiteBucket and His AI Village") was made and posted on all four platforms.
- The first scheduled run failed (a fresh session had no repo access); fixed by running in the
  owner's main chat.
- Nov 16, 2026: followers updated to 44; the follower card became swipeable. The first version
  didn't swipe on the owner's phone (old cached files + pointer events), fixed with touch events and
  the `?v=` cache-busting. If the owner says it still fails, ask iPhone or Android and which browser.

## Code map (graphify, added Nov 16, 2026)
If `graphify-out/graph.json` exists (the environment setup script builds it; it is not committed),
use it for code questions before grepping: `graphify query "<question>"`, `graphify explain "<name>"`,
`graphify path "<A>" "<B>"`. After code changes: `graphify update .` (free, no AI calls).
If `graphify` is not installed, just work normally. The map is a shortcut, never a requirement.
Obsidian view: `graphify export obsidian --graph graphify-out/graph.json --dir graphify-out/obsidian`.
