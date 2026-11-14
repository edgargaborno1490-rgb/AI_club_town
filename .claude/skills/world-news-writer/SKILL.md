---
name: world-news-writer
description: The World News desk - writes the day's World News DRAFT script (read by Mark on ElevenLabs) and then fact-checks the What If and How It Works scripts against a second source. Use as step 5 of village-day.
---

# World News desk

## A. Write today's news script
1. Read the World News block in `scripts/$DATE/plan.md`, `village/brand.md`, the studio's
   `../whitebucket-studio/video/WORKFLOW.md`, and `../whitebucket-studio/video/scripts/nvidia.md`
   (a finished news script to match).
2. `node tools/town.js start news "Writing: <title>" --push`
3. One story, explained: what happened, why it matters, what happens next. Use only facts
   confirmed by **two independent reputable sources** (wire services, major newspapers,
   public broadcasters, official agencies). Neutral, no opinions, your own words.
   Say "as of <Month Day>" once. Tragedies: facts with care, no graphic detail.
4. Write `scripts/$DATE/<slug>.md` in the format in `brand.md` (`Topic type: news`,
   `voice: Mark (ElevenLabs)` in the Format line) with `## Sources` grouped by story.
5. Run `node tools/check-scripts.js $DATE` and fix everything it lists for your file.
6. `git add scripts/$DATE && git commit -m "World News: <title> (DRAFT)"`

## B. Fact-check the other two
1. `node tools/town.js start news "Fact-checking today's other 2 scripts" --push`
2. For the What If and How It Works scripts: confirm every number and claim in the
   narration with web search against a second reputable source.
3. Fix wrong or outdated facts in the narration and the Fact notes (keep the word count
   and ending). Add the second source next to each fact as `(checked: <link>)`.
4. Run `node tools/check-scripts.js $DATE`.
5. `git add scripts/$DATE && git commit -m "World News: fact-check for $DATE"`
6. `node tools/town.js done news "News DRAFT ready; <N> facts checked in the other 2, <M> fixed." --push`
