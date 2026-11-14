# Village Agents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A daily run where six villagers write White Bucket scripts and light up the town from real work.

**Architecture:** Deterministic Node tools (`tools/`) do every file change the town and ledger depend on, unit-tested with `node --test`. Claude Code skills (`.claude/skills/`) hold each villager's instructions; `village-day` runs them in order. A scheduled task starts a fresh session each morning that runs `village-day` and pushes to `main`.

**Tech Stack:** Node 22 (no dependencies), Claude Code skills, Claude Code scheduled tasks.

**Spec:** `docs/superpowers/specs/2026-11-14-village-agents-design.md`

## Global Constraints
- Agent ids: `chief, whatif, howitworks, news, programmer, banker`. Statuses `idle | working | done`.
- Log times are `H:MM` in `Pacific/Honolulu`; `updated` is ISO UTC.
- Scripts live in `scripts/YYYY-MM-DD/` (Honolulu date): `plan.md`, `what-if.md`, `how-it-works.md`, `world-news.md`.
- Narration 150–190 words; scene durations sum to 60–75 s.
- Everything is pushed to `main`. No cost beyond the Pro plan.
- Schedule: daily 7:38 Pacific/Honolulu (8am jittered per scheduling guidance).

## Review Focus
- A step fails mid-run → that agent ends `done` with a log line saying so; `close-day` leaves nobody `working`.
- `git push` rejected because main moved → `--push` pulls with rebase and retries (up to 4 times).
- `village/earnings.md` has a malformed line → skipped and reported, total still computed.
- First run ever (no `lastRunDate`) → stays Day 1; a second run on the same date does not bump the day.
- Script missing a section, or scene seconds outside 60–75 → checker names the file and the problem, exits 1.

---

### Task 1: Town updater
**Files:** Create `tools/town-ops.js`, `tools/town.js`, `tests/town-ops.test.js`
**Interfaces — Produces:** `newDay(town, date) -> town` (day+1 only if `lastRunDate` set and different from `date`; sets `lastRunDate`, all agents idle, log cleared); `start(town, id, task, time)`; `done(town, id, time, note?)`; `log(town, text, time)`; `setBalance(town, amount)`; `closeDay(town, time)` (any `working` → `done` + log "<Name> didn't finish today."). All set `updated`. Unknown id throws. CLI: `node tools/town.js <new-day|start|done|log|balance|close-day> [args] [--push]`.
- [ ] Failing tests for each function and the Review Focus day rules → `npm test` FAIL → implement → PASS → commit.

### Task 2: Script checker
**Files:** Create `tools/check-scripts.js`, `tests/check-scripts.test.js`
**Interfaces — Produces:** `checkScript(text, series) -> string[]` (empty = OK). Scene lines look like `1. [8s] On screen: … | Text: …`. CLI `node tools/check-scripts.js [YYYY-MM-DD]` checks the day's three scripts and `plan.md`, prints problems, exits 1 on any.
- [ ] Failing tests: good script passes; missing section, narration too short, scenes summing to 50 s, world news with one source link each produce a named problem → implement → PASS → commit.

### Task 3: Ledger
**Files:** Create `tools/ledger.js`, `tests/ledger.test.js`, `village/earnings.md`
**Interfaces — Produces:** `parseEarnings(md) -> {rows:[{date,platform,amount,note}], skipped:string[]}` from lines `- 2026-11-20 | TikTok | 12.40 | note`; CLI regenerates `village/ledger.csv` and prints the total.
- [ ] Failing tests (good lines, `$1,234.50`, malformed line skipped) → implement → PASS → commit.

### Task 4: The villagers
**Files:** Create `.claude/skills/{village-day,chief-of-staff,what-if-writer,how-it-works-writer,world-news-writer,programmer,banker}/SKILL.md`, `village/brand.md`, `village/topics.md`, `tests/skills.test.js`
- [ ] Failing test: each skill exists with `name` + `description` front matter; `village-day` names all six agent skills and the tools → write skills from the spec → PASS → commit.

### Task 5: First real day + schedule
- [ ] Merge the branch into `main`, push.
- [ ] Run `village-day` once by hand; check `node tools/check-scripts.js` passes, town shows Day 1 with everyone `done`, scripts read well.
- [ ] Create the scheduled task (fresh session daily, 7:38 Pacific/Honolulu).
