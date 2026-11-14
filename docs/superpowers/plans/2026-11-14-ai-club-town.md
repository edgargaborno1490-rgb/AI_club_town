# AI Club Town: Live Town Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved mockup into a static site that shows the real state of the village from `town.json`.

**Architecture:** Plain static files, no build step. Pure data logic (`src/state.js`, `src/demo.js`) is browser-and-Node compatible and unit-tested with `node --test`. The three.js scene (`src/scene.js`) is lifted from the mockup and driven by `apply(state)`. `src/app.js` fetches `town.json` every 60 s, or plays the sample day with `?demo`.

**Tech Stack:** three.js r128 + OrbitControls (vendored), vanilla JS, Node built-in test runner, Playwright (preinstalled) for a smoke test.

**Spec:** `docs/superpowers/specs/2026-11-14-ai-club-town-design.md`
**Mockup source:** https://claude.ai/artifact/MTLEtgbQdYGcHz5KEMueMd (local copy: the session scratchpad `town-look.html`)

## Global Constraints
- Look matches the approved mockup exactly (island, plaza, six buildings, villagers, rings, bubbles, goal card, "Today in town").
- Agent ids: `chief, whatif, howitworks, news, programmer, banker`. Statuses: `idle | working | done`.
- Default goal 1000. Refresh every 60 000 ms.
- Never show made-up activity as real: demo mode always shows the "Example data" badge; real mode never does.
- No external network requests at runtime except Google Fonts (with fallbacks). Libraries live in `vendor/`.
- Copy is plain English for a non-technical owner.

## Review Focus
- Unknown agent id or bad status in `town.json` → ignored / treated as `idle`, page still renders.
- `balance` or `goal` as a string, negative or missing → parsed number, negatives and junk become 0; goal falls back to 1000.
- `town.json` missing or invalid on first load → everyone idle, note "No activity data yet."
- A refresh fails after a good load → keep the last good state, note "Couldn't refresh, showing the last update."
- Very long task text → bubble clamps to 3 lines, no layout break.

---

### Task 1: Town data parsing

**Files:**
- Create: `src/state.js`, `tests/state.test.js`, `package.json` (`{"private":true,"scripts":{"test":"node --test tests/"}}`)

**Interfaces:**
- Produces (on `window.TownState` in browser, `module.exports` in Node):
  - `AGENT_IDS: string[]` (order above)
  - `parseTown(raw: unknown) -> {day:number, goal:number, balance:number, updated:string|null, agents:{[id]:{status,task}}, log:{time,text}[], ok:boolean}`; `ok=false` when `raw` is not an object. Every id in `AGENT_IDS` is always present. Log keeps the last 20 entries, newest first in the output.
  - `timeAgo(iso: string|null, now: Date) -> string`: `"just now"` (<1 min), `"5 min ago"`, `"2 h ago"`, `"3 days ago"`, `""` for null/invalid.

- [ ] **Step 1: Write failing tests** in `tests/state.test.js` (`node:test`, `node:assert/strict`):
  - `parseTown(null).ok === false` and all six agents are `{status:'idle', task:''}`, goal 1000, balance 0.
  - `parseTown({agents:{whatif:{status:'working',task:'X'}, ghost:{status:'working'}}})`: whatif working with task X; no `ghost` key.
  - `parseTown({agents:{news:{status:'dancing'}}}).agents.news.status === 'idle'`.
  - `parseTown({balance:'12.40', goal:'abc'})`: balance 12.4, goal 1000. `parseTown({balance:-5}).balance === 0`.
  - log with 25 entries in chronological order → 20 entries, first is the last input entry.
  - `timeAgo` cases above with fixed `now = new Date('2026-11-14T12:00:00Z')`.
- [ ] **Step 2: Run** `npm test` → FAIL (module not found).
- [ ] **Step 3: Implement** `src/state.js` as a UMD-style IIFE.
- [ ] **Step 4: Run** `npm test` → all PASS.
- [ ] **Step 5: Commit** `feat: parse town.json safely`.

### Task 2: Demo day

**Files:**
- Create: `src/demo.js`, `tests/demo.test.js`

**Interfaces:**
- Consumes: `parseTown`, `AGENT_IDS`.
- Produces: `TownDemo.STEPS` (the seven steps from the mockup, same times and text, last step adds 12.40), `TownDemo.stateAt(n: number) -> raw town object` (state after applying steps `0..n` modulo the day; each wrap increments `day` and resets agents and log, balance carries over).

- [ ] **Step 1: Failing tests:** `stateAt(0)` has chief working and 1 log entry; `stateAt(6)` has balance 12.4 and 7 log entries; `stateAt(7)` has day 2, one log entry, balance 12.4; `parseTown(stateAt(n)).ok` for n in 0..14.
- [ ] **Step 2: Run** `npm test` → FAIL.
- [ ] **Step 3: Implement** `src/demo.js` (same UMD pattern).
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: sample day for demo mode`.

### Task 3: The live page

**Files:**
- Create: `index.html`, `styles.css`, `src/scene.js`, `src/app.js`, `town.json`, `vendor/three.min.js`, `vendor/OrbitControls.js` (from npm `three@0.128.0`: `build/three.min.js`, `examples/js/controls/OrbitControls.js`), `.nojekyll`, `tests/smoke.js`

**Interfaces:**
- Consumes: `TownState.parseTown`, `TownState.timeAgo`, `TownDemo.stateAt`.
- Produces: `TownScene.create(stageEl, labelsEl) -> {apply(state)}`: sets each villager's status and bubble text; animation exactly as the mockup.

- [ ] **Step 1: Write `tests/smoke.js`** (Playwright, serves the repo with `python3 -m http.server`): for desktop 1280×800 and phone 390×844, (a) `/` with the committed `town.json` loads with zero page errors and shows the "Updated" line; (b) `/?demo` shows the "Example data" badge and a "working" tag; (c) with `town.json` route aborted, the note reads "No activity data yet"; saves screenshots to the scratchpad.
- [ ] **Step 2: Run** `node tests/smoke.js` → FAIL (no page).
- [ ] **Step 3: Build** `scene.js` from the mockup's scene code (remove the step timer); `styles.css` from the mockup plus `-webkit-line-clamp: 3` on `.bubble`; `index.html` with goal card (title, day, money, bar, status line, demo-only buttons) and log; `app.js` doing fetch with `cache:'no-store'` every 60 000 ms, last-good-state fallback, "Updated X ago" line; demo mode advances every 4.5 s with Pause / Next update. `town.json`: day 1, goal 1000, balance 0, all idle, one log entry "Town opened. Waiting for the first agent run."
- [ ] **Step 4: Run** `node tests/smoke.js` → PASS; look at the screenshots once.
- [ ] **Step 5: Commit** `feat: live AI Club Town page`.

### Task 4: Owner guide

**Files:**
- Modify: `README.md`

- [ ] **Step 1:** Write: what the town is, how to open demo mode, how to turn on GitHub Pages (repo must be public on a free account; Settings → Pages → Deploy from branch), how to edit `town.json` by hand (fields, agent ids, statuses), how to run tests.
- [ ] **Step 2: Run** `npm test && node tests/smoke.js` → PASS.
- [ ] **Step 3: Commit** `docs: owner guide`.
