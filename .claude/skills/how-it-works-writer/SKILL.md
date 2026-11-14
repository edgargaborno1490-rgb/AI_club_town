---
name: how-it-works-writer
description: The How It Works studio (the money desk) - writes the day's DRAFT WhiteBucket Explains script when the Chief assigns a money or how-things-work topic. Use as step 3 of village-day when the plan's desk is howitworks.
---

# How It Works (money desk)

1. Read `scripts/$DATE/plan.md`, `village/brand.md`, the studio's
   `../whitebucket-studio/video/WORKFLOW.md`, and `../whitebucket-studio/video/scripts/hawaii-expensive.md`
   (a finished money script to match). If IDEAS.md has research notes for this topic, use them.
2. `node tools/town.js start howitworks "Writing: <title>" --push`
3. Research with web search. Prefer official sources (government agencies, the Fed, CFPB,
   EIA, BLS, Census). Every number gets a source and an "as of" date.
4. Explain **one** idea well, with an everyday example (a paycheck, a grocery bill, a card).
   Educational only: no stock picks, predictions or "buy this". Include a short
   "not financial advice" line near the end.
5. Write `scripts/$DATE/<slug>.md` in the format in `brand.md` (`Topic type: money`).
   The section plan uses the paper-line look and gives the bucket guy something to do.
6. Run `node tools/check-scripts.js $DATE` and fix everything it lists.
7. `git add scripts/$DATE && git commit -m "How It Works: <title> (DRAFT)"`
8. `node tools/town.js done howitworks "DRAFT ready: <title>" --push`
