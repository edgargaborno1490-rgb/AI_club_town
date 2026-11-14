# AI Club Town: the village agents (design)

## Why
The village is the production team for **White Bucket Project**, the owner's learning
channel (a mix of how things work, news, money and earth science), posted on TikTok,
Facebook, Instagram and YouTube. The channel is about a week old. The goal is to make
money from it. For now the agents write scripts that pile up, ready for the video
factory (a later project). The town page must light up from real work.
Budget: the owner's $20 Claude Pro plan, nothing extra.

## Goals
- Once a day, an automatic run where each villager does its real job, in order, and
  updates `town.json` as it goes so the town lights up building by building.
- Three scripts a day, one per series, ready for animation, saved in `scripts/YYYY-MM-DD/`.
- A Banker's ledger of costs and earnings the owner reports, driving the town's money bar.
- Everything saved to `main`, which GitHub Pages serves.

## Non-goals
- Rendering videos, voiceover, posting to platforms (later projects).
- Kanaktical (the owner's patch business). It stays out of the village.
- Touching bank accounts or platform logins.

## Anti-goals
- A village that looks busy but is not: the town only shows what a run actually did.
- News with unchecked facts, or reused footage or text from other outlets.
- Any cost beyond the Pro plan; more than 1 of the ~5 daily automatic runs.

## Approaches considered
1. **One daily run that plays every role in turn** (picked): fits the plan's ~5 runs a day
   and its usage limits, costs nothing extra.
2. One run per agent: 6 runs a day, over the plan's limit.
3. GitHub Actions with an API key: pay-per-use, breaks the $20 budget.

## The White Bucket style (owner may change)
- Vertical video, 60–75 seconds (TikTok's payout program counts videos over 1 minute).
- A curious friend explaining things: plain words, a hook in the first 3 seconds, one
  surprising fact per video, a closing line that invites a follow.
- Audience: teens and adults who like learning.
- Series: **What If** (often earth science), **How It Works** (machines, money, the body…),
  **World News Today** (short, fact-checked roundup).

## The villagers (each one a Claude Code skill in `.claude/skills/`)
| Agent | Skill | Daily job |
|---|---|---|
| Chief of Staff | `chief-of-staff` | Picks 3 topics, one per series, rotating subjects (money, earth science, tech, body, history…) and avoiding repeats listed in `village/topics.md`. Writes `scripts/DATE/plan.md`. Closes the day with a summary log line. |
| What If Studio | `what-if-writer` | Writes `scripts/DATE/what-if.md`. |
| How It Works | `how-it-works-writer` | Writes `scripts/DATE/how-it-works.md`. |
| World News | `world-news-writer` | Searches the web for stories from the last 48 hours, keeps only those confirmed by 2 independent reputable sources, writes `scripts/DATE/world-news.md` in its own words with the source links. |
| Programmer | `programmer` | Runs the script checker on today's files and fixes format problems. Later: renders videos. |
| Banker | `banker` | Moves new lines from `village/earnings.md` (where the owner writes what they earned) into `village/ledger.csv`, and sets the town's balance to the ledger total. |

The run itself is a seventh skill, `village-day`, that calls the others in that order.

## The script format (every series)
Front matter: series, title, topic, length target. Then sections: **Hook** (first 3 s),
**Narration** (the full voiceover, 150–190 words), **Scenes** (numbered, each with what
is on screen, on-screen text, and duration; durations add up to 60–75 s), **Facts to
double-check**, **Title**, **Hashtags**, **Captions** (TikTok, YouTube, Instagram,
Facebook). World News adds **Sources**. `tools/check-scripts.js` enforces this.

## Updating the town
`tools/town.js` changes `town.json` so the agents never hand-edit JSON:
`new-day`, `start <agent> "<task>"`, `done <agent>`, `log "<text>"`, `balance <amount>`,
each with optional `--push` (commit and push to main with a short message). A failed step
marks that agent done with a log line saying what went wrong, and the day carries on. At
the end of the run nobody is left "working".

## Schedule
One scheduled task, a fresh session each morning, prompt: run the `village-day` skill
and push to `main`. Before scheduling, one full test run, checked by hand.

## Owner to-dos
- Switch GitHub Pages from the working branch to `main`.
- Write earnings into `village/earnings.md` (one line: date, platform, amount) whenever
  money comes in.

## Left to the builder
- Exact wording of each skill, the checker's code, commit messages, the cron minute.

## Update 2026-11-14: front office for whitebucket-studio
The owner already runs a video studio (`whitebucket-studio`, channel **WhiteBucket Explains**).
The village now serves it:
- **One** DRAFT script a day (not three), in the studio's script format, following the studio's
  `video/WORKFLOW.md` (paper-line look, the bucket guy, ending "Comment NEXT and pick the next topic.").
- The Chief picks from the studio's `video/IDEAS.md`, never a topic that is made, scripted or
  already written (`tools/taken-topics.js`), keeping about 2 money : 1 science.
- Desks: money → How It Works, science → What If, timely news → World News. On days World
  News doesn't write, it fact-checks the script against a second source.
- The village only reads the studio repo. The owner approves, records the voice, and the
  studio's editor builds the video as before.

## Update 2026-11-14 (later): three a day, straight into the studio
- Back to **three** DRAFT scripts a day, one per series: What If (science, AI voice A),
  How It Works (mostly money, AI voice B), World News (Mark on ElevenLabs). The voices for
  A and B are still to be chosen.
- The Programmer sends the drafts into the studio with `tools/send-to-studio.js`: copies to
  `video/scripts/<slug>.md` (never overwrites) and adds a row to IDEAS.md's
  "Researched, script ready" table, then pushes the studio's `main`. Owner approved.
- The studio's Saturday researcher scheduled task is paused (owner's request).

## Update 2026-11-14 (latest): one a day on a rotation, crossovers
- One DRAFT a day (`tools/rotation.js`): Mon/Wed/Fri How It Works (money, AI voice B),
  Tue/Sat What If (science, AI voice A), Thu/Sun World News (Mark). The Chief may swap in
  World News for a big story that would go stale.
- On non-news days World News fact-checks the day's script.
- Crossovers: a What If can be "Part 2" of a World News story, only as a clearly
  hypothetical, educational question; never implying real reported facts about real people
  are fake, never buy/sell advice.

## Update 2026-11-14: AI Village series
- Intro video script: `scripts/specials/ai-village-intro.md` (sent to the studio as a DRAFT).
- Every Saturday from Nov 21 the Chief also drafts **AI Village · Week N** (skill `weekly-update`),
  posted Sunday, with only real numbers from the repo records. New topic type `village`
  (fact notes cite repo files instead of web links).
- Voice: a fourth ElevenLabs "village host" voice the owner picks and records (not Mark).
