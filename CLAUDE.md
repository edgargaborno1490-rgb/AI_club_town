# Project notes for Claude

> **Which repo for what (owner, Nov 19, 2026; kept separate on purpose: merging would move the island page and slow the daily run).**
> **whitebucket-studio** = making videos: build/render, voice, music, captions, `video/scripts/`.
> **AI_club_town** = the island and the village: birds, followers, builds, daily DRAFTs, rotation, stats, earnings.
> The only link between them: `tools/send-to-studio.js` copies DRAFTs into the studio's `video/scripts/`.
> Anything else for the other repo: say so and suggest a chat there instead of editing it from here.

**AI Club Town** is the owner's AI village: a 3D island page (GitHub Pages, from `main`) plus Claude
skills that write one DRAFT video script a day for the channel **WhiteBucket Explains**. The video
studio is a separate repo, `whitebucket-studio`. The patch business **Kanaktical** (`aloha-armor-forge`)
is NOT part of this; never touch it. History (what happened when, follower counts by day):
`village/history.md`; read it only when you need the past.

Live page: https://edgargaborno1490-rgb.github.io/AI_club_town/ (`?demo` plays sample data).

## Rules
- **Privacy:** never show or say the island's web address (it contains the owner's name): not in
  narration, captions, on screen or in a recording's address bar (Nov 17, 2026). Videos call him
  WhiteBucket, never his real name. The island stays public.
- Push straight to `main` of both repos (owner approved), no pull requests; keep branch
  `claude/laughing-ride-0rw56q` in sync with `main`. `main` often moves during a chat: merge
  `origin/main` before pushing.
- **The owner's latest plan and standing orders: `village/owner-plan.md`** (the Chief reads it first each run;
  update it whenever the owner changes the plan).
- The village always writes **DRAFT**; only the owner approves scripts.
- Money scripts: educational only, no stock picks or predictions; no "not financial advice" line anymore (owner, Nov 19, 2026). Never
  suggest real reported facts about real people are fake.
- The Banker never asks for or stores bank details, card numbers or passwords; earnings come only
  from `village/earnings.md` (`node tools/ledger.js`).
- **Music is back** (owner, Nov 17, 2026, night): only free tracks the owner picks (YouTube Audio Library); the studio
  syncs voice + pen line to the beat. Still no sound effects; scripts don't pick songs. **Every video is 16:9** (owner, Nov 19, 2026),
  built with the studio skill `wide-video`; no vertical version.
- **Explain like I'm 6** (owner, Nov 19, 2026): every script explains its money idea like the viewer is six
  ("How does a credit card work? Explained like you're 6"; always the 6-year-old, no Minecraft); one kid picture, then one
  real sourced number "in grown-up words"; `Explain like:` line checked by `check-scripts.js`. `village/brand.md`.
- **Level up** (owner, Nov 19, 2026): every script makes money feel simple and doable, honest (no hype, no promised
  results). **No "your move this week" step** in any video (owner, Nov 19, 2026). `village/brand.md`.
- Tests before pushing code: `npm test` and `NODE_PATH=$(npm root -g) node tests/smoke.js`.

## How it works
- The page shows `town.json`. Change it only with `node tools/town.js ...` (never by hand);
  `--push` commits and pushes to `main`.
- **Seven workers, each a white bucket** (`src/scene.js`): Chief of Staff (red, star), What If
  (purple, "?"), How It Works (orange, gears), World News (blue, NEWS), Programmer (1s and 0s),
  Banker (gold coins), and the **Analyst** (Nov 15).
- **The Analyst's building is under wraps** until the owner says reveal: tarp, scaffolding, crane,
  crew, **no sign**. Page, log and videos call it the **Secret Building** (`NAMES` in
  `tools/town-ops.js`); never say "Analyst" before the reveal. Reveal = in `src/scene.js` set its kind
  to `stats` and remove `hidden: true` (good moment for an Island Clip or weekly update).
- **Analyst:** reads view counts from `village/stats.md` (owner's numbers, or YouTube via TubeAlfred);
  `node tools/stats.js --write` → `village/analyst-report.md`, which the Chief uses. Rotation changes
  stay the owner's call. Numbers only, never logins.
- **Daily run:** a scheduled task runs the `village-day` skill at 4:30 AM Hawaii time in the owner's
  main Claude chat (it has push access to both repos; a fresh session had none). `village-day` lists
  the steps; each run also opens a "🎬 Video: <title>" chat in the studio that waits for APPROVED.
- **Rotation** (`node tools/rotation.js`), **all money from Nov 19, 2026** (owner: "no more science
  video, more about money now"): How It Works every day except Thu/Sun World News (**money news only**).
  Each money day has a **format**: Mon comparison · Tue real price · Wed myth buster · Fri checklist ·
  Sat takes turns through the four. **Voice: George for everything** (owner, Nov 19: out of ElevenLabs tokens; no Mark, Eric or village host). What If (science) is paused.
  Saturdays from Nov 21 also "AI Village · Week N" (George, posted Sunday). Wed/Fri from
  Nov 25 also a 15–30 s **Island Clip**, only if the island changed (`island-clip`).
- **Rest days:** Hawaii dates in `village/rest-days.md` make `rotation.js` print "REST DAY"; the day
  is only logged. Use this instead of switching off the scheduled task.
- **Packaging** (skill `packaging`): each money/science/news script has `## Packaging`: 5 title +
  cover-word ideas scored /10 (Hook + Clear + True; anything the video doesn't deliver scores 0),
  `Pick: #N`, a runner-up; the title line must be the pick (`check-scripts.js` checks it).
- **Outliers** (Mondays from Nov 23, skill `outliers`, run by the Secret Building before the Chief):
  2 TubeAlfred searches (`node tools/outliers.js queries`), channel medians for up to 4 videos,
  `village/outliers/<date>.json` → `node tools/outliers.js <date> --write` → `village/outliers.md`
  (3x+ their channel's usual views). Borrow topics, never titles or footage. Skipped on purpose:
  Script, Retention (needs a Google login), Comments → Ideas (too few comments; costly).
- Scripts go to `scripts/<date>/`, then the studio's `video/scripts/` via `node tools/send-to-studio.js`
  (adds DRAFTs and IDEAS.md rows, never overwrites). Writing rules: `village/brand.md` (the studio's
  `video/WORKFLOW.md` wins).

## Followers and the island
- **Goal: 1,000 followers**, a race between YouTube, TikTok, Instagram and Facebook (the card shows
  the total, a bar per platform and the leader; money is a small "Earned so far" line).
  Now (Nov 17, 2026): YouTube 25, TikTok 17, Instagram 4, Facebook 3 = **49**.
- Birds = followers on all four together: `node tools/town.js followers <youtube|tiktok|instagram|facebook> <n> --push`
  (up to 60 birds drawn; the card shows the real number). Most birds sit (bucket rims, birdhouses,
  treetops, grass, plaza); 5–10 fly (more followers = more in the air), taking turns landing.
- **Named birds:** viewers who comment "BIRD" get their public username on a bird:
  `node tools/town.js bird add <username> --push` (`bird remove` if asked). Only people who asked.
  From Nov 19, 2026 videos say "Follow and comment BIRD"; the owner tells us who followed (we can't see it).
  **Trial bird** (commented BIRD, not following yet; owner's benefit of the doubt): `bird trial <username> [hours=24] --push`
  shows the name very small and the page hides it when time runs out; `bird keep <username> --push` if they follow.
- **Milestones** (25, 50, 100, 250, …) are story beats; what they unlock is the owner's pick.
- **Latest video link** on the card: `node tools/town.js latest "<title>" <https link> --push` (ask the owner).
- **Look = Aloha Island** (Nov 17): palms, flower bushes, beach, lagoon, volcano, tiki torches, no
  WhiteBucket figure; the sky follows Hawaii time (UTC-10): day, sunset, night with stars, and a
  "🌙 Hawaii · 9:00 PM" clock in "Today in town". `?hour=21` previews an hour, `?classic` the old look.
  Code: `src/aloha.js` + `ALOHA` hooks in `src/scene.js`. The studio's video island
  (`video/src/village/Island.tsx`) must match.
- **Wooden name sign** in front of each bucket; the floating name chip shows only while that worker
  works. No labels on Birdhouses, Bird Bath or the plot (it has its "? NEXT BUILD" board); no sign on
  the Secret Building.
- **The card tucks away** (swipe left or tap ‹; › tab brings it back; remembered): `cardSwipe` in
  `src/app.js` (touch events for iPhone Safari, pointer events for mouse), `.goal.tucked` / `.tuck` in `styles.css`.
- **Phones cache the page:** bump `N` in `styles.css?v=N` / `src/*.js?v=N` (index.html) on every CSS/JS change.
- **Dailies are up to about a minute (90–150 words; owner, Nov 19, 2026; never over 1:30):** hook first, the topic, then a 1–2 sentence
  **island checkup at the END**, then "Follow and comment BIRD, and your name goes on a bird on our island. See you
  tomorrow for another island update!" Every item under "To announce" in `village/island-news.md` goes in the next DRAFT's
  checkup; village-day step 5b moves them to "Announced". Add an item whenever the island changes.
- **Viewer builds:** each week the owner picks one comment idea; it's built on the "? NEXT BUILD" plot
  and shown that Sunday; a finished build keeps its spot and a new plot opens.
  Built: **Birdhouses** (between What If and How It Works; finished Nov 17).
  Building: **Bird Bath** (viewer @dakotaboyd4809; between How It Works and the Banker; fence, cones,
  3 workers; remove the crew when the owner says done). Plot now between the Banker and the
  Programmer (`PLOT_ANGLE = 120`). Workers: 3 at the construction site, 3 at the bird bath.
- **Planned, not built:** one animal per platform (TikTok ferret, Instagram peacock, Facebook owl,
  YouTube whale in the water). Ask first: one per follower or per 10? The intro promised "every
  follower becomes a bird", so show any change in a weekly update.
- Skills for island work: `bird-requests` ("<name> followed", trial birds, remove), `island-change` (followers, builds, finding comments, code checklist) and
  `island-preview` (screenshots at any hour, mockups without touching the live page).

## Plugins
Connected at chat start (a chat opened before Nov 16 won't have them); if one is missing, say so and carry on.
- **TubeAlfred** (read-only YouTube data; server `mcp.tubealfred.com` is allowed in the studio's
  environment). Our channel **@whitebucket09**; its Shorts are titled by post date (Nov 15 Short =
  the plane / FAA video). **Credits are limited: 37 left on Nov 17**; max 8 calls a run, stop below 15;
  comment calls cost 20+. The Analyst may use it for YouTube numbers (into `village/stats.md`);
  TikTok/Instagram/Facebook numbers come from the owner. It may list "BIRD" comments: show the
  usernames, add birds only after the owner says yes. Public data only, never logins.
- **social-media-skills** (captions, hashtags, hooks): helpers; `village/brand.md` and the studio's WORKFLOW win.
- **No Posty** (removed Nov 16): the owner posts by hand.
- Owner shares a video (TikTok, song, tutorial)? Skill `watch-video`.

## Code map (graphify)
If `graphify-out/graph.json` exists, use `graphify query "<question>"`, `graphify explain "<name>"`,
`graphify path "<A>" "<B>"` before grepping; after code changes `graphify update .`. Not installed? Work normally.
