# AI Club Town: the live town (design)

## Why
The owner is starting an "AI village" whose job is to make money from short videos.
Three studios (What If, How Things Work, World News Today) are run by a Chief of Staff,
with a Programmer and a Banker helping. The town is the show: a cartoon 3D island people
can watch (and the owner can film) that shows what the agents are really doing.
Budget: the owner's $20 Claude Pro plan, nothing extra.

## Goals
- A 3D low-poly town in the browser (desktop and phone), matching the approved mockup:
  https://claude.ai/artifact/MTLEtgbQdYGcHz5KEMueMd
- Live but simple: the town reads `town.json` and shows each agent's real status
  (idle / working / done), current task, today's log, and real money vs. the goal.
- Free hosting from this repo (GitHub Pages).

## Non-goals (later projects)
- The agents themselves (scheduled Claude runs that write scripts and update `town.json`).
- Making videos (rendering, voiceover, captions) and posting them.
- Any automatic connection to bank accounts or platform payouts.

## Anti-goals
- Fake activity presented as real. If the data is an example, the page says so.
- Anything that costs money beyond the Pro plan.

## Approaches considered
1. **3D web page with three.js** (picked): closest to the reference look, rotates and zooms
   for filming, runs on phones, free to host.
2. Flat 2D top-down map: quicker, but less impressive on camera.
3. Game engine (Unity/Godot): richest, but big installs and hard to test from here.

## Decisions
- Look: exactly the approved mockup (island, fountain plaza, six buildings, villagers,
  status rings, speech bubbles, goal card, "Today in town" log).
- Data contract `town.json` (written by agents later, by hand for now):
  ```json
  {
    "day": 1,
    "goal": 1000,
    "balance": 0,
    "updated": "2026-11-14T08:05:00Z",
    "agents": {
      "chief":      {"status": "done",    "task": ""},
      "whatif":     {"status": "working", "task": "Writing: What if the Moon disappeared?"}
    },
    "log": [{"time": "08:05", "text": "Three studios started on their scripts."}]
  }
  ```
  Agent ids: chief, whatif, howitworks, news, programmer, banker. Missing agents show as idle.
- The page re-reads `town.json` every 60 seconds and shows "Updated X min ago".
- If `town.json` is missing or broken, the page shows the town with everyone idle and a
  clear "No activity data yet" note (never made-up activity).
- A `?demo` mode keeps the sample day playing, for filming and testing, labeled "Example data".
- Files: `index.html` (page), `town.js` (scene), `town.json` (data), libraries vendored into
  the repo so the page does not depend on outside CDNs.

## Left to the builder
- Code structure inside `town.js`, small visual polish, tests for the data-reading logic.

## Owner to-dos
- Turn on GitHub Pages for the repo (Settings, Pages, deploy from branch). On a free GitHub
  account, Pages needs the repo to be public.
