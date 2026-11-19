---
name: world-news-writer
description: The World News desk - on news days writes the DRAFT World News script (money news only, read by George); on other days fact-checks the script another desk wrote. Use as step 3 (news days) or step 4 (other days) of village-day.
---

# World News desk

## A. News days: write today's script
1. Read the World News block in `scripts/$DATE/plan.md`, `village/brand.md`, the studio's
   `../whitebucket-studio/video/WORKFLOW.md`, and `../whitebucket-studio/video/scripts/nvidia.md`
   (a finished news script to match).
2. `node tools/town.js start news "Writing: <title>" --push`
3. **Money news only** (owner, Nov 19, 2026): the economy, prices, rates, jobs, taxes, housing,
   or a big company/market move. One story, explained: what happened, why it matters, what happens next. Use only facts
   confirmed by **two independent reputable sources** (wire services, major newspapers,
   public broadcasters, official agencies). Neutral, no opinions, your own words.
   **Explain it like the viewer is 6** (owner, Nov 19, 2026; `brand.md`): "The Fed raised rates. Explained like
   you're 6." One kid picture for what it means, then the real facts "in grown-up words", still neutral.
   Write the `Explain like:` line under Format. Say "as of <Month Day>" once. Close the story with one line on what it means for the viewer
   (no "your move" step, `brand.md`), facts stay neutral. Tragedies: facts with care, no graphic detail.
   About real people: only what the sources report, attributed ("reports say…"), no guessing.
   About stocks: what happened, never what to buy or sell or what will happen next.
4. Write `scripts/$DATE/<slug>.md` in the format in `brand.md` (`Topic type: news`,
   `voice: George (Kokoro bm_george, made by the studio)` in the Format line) with `## Sources` grouped by story.
   If the story invites a great "what if", add it as the last line of the Fact notes:
   `Possible What If follow-up: <question>` (the Chief may use it on the next What If day).
   **Packaging:** follow `packaging` (5 scored title + cover ideas; the pick becomes the title line).
5. Run `node tools/check-scripts.js $DATE` and fix everything it lists.
6. `git add scripts/$DATE && git commit -m "World News: <title> (DRAFT)"`
7. `node tools/town.js done news "DRAFT ready: <title>" --push`

## B. Other days: fact-check today's script
1. `node tools/town.js start news "Fact-checking today's script" --push`
2. Read today's script in `scripts/$DATE/`. Confirm every number and claim in the narration
   with web search against a second reputable source.
3. Fix wrong or outdated facts in the narration and the Fact notes (keep the word count
   and ending). Add the second source next to each fact as `(checked: <link>)`.
4. Run `node tools/check-scripts.js $DATE`.
5. `git add scripts/$DATE && git commit -m "World News: fact-check for $DATE"`
6. `node tools/town.js done news "Fact-check done: <N> facts confirmed, <M> fixed." --push`
