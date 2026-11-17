---
name: how-it-works-writer
description: The How It Works studio (the money desk) - writes the day's How It Works DRAFT script (mostly money topics) for WhiteBucket Explains, read by George (Kokoro). Use as step 3 of village-day on How It Works days (Mon/Wed/Fri).
---

# How It Works (money desk)

1. Read the How It Works block in `scripts/$DATE/plan.md`, `village/brand.md`, the studio's
   `../whitebucket-studio/video/WORKFLOW.md`, and `../whitebucket-studio/video/scripts/hawaii-expensive.md`
   (a finished money script to match). If IDEAS.md has research notes for this topic, use them.
2. `node tools/town.js start howitworks "Writing: <title>" --push`
3. Research with web search. Prefer official sources (government agencies, the Fed, CFPB,
   EIA, BLS, Census). Every number gets a source and an "as of" date.
4. Explain **one** idea well, with an everyday example (a paycheck, a grocery bill, a card).
   Educational only: no stock picks, predictions or "buy this". Include a short
   "not financial advice" line near the end.
5. Write `scripts/$DATE/<slug>.md` in the format in `brand.md` (`Topic type: money`,
   `voice: George (Kokoro bm_george, made by the studio)` in the Format line).
   The section plan uses the paper-line look and gives the pen line something to do (no bucket guy).
   **Packaging:** follow `packaging` (5 scored title + cover ideas; the pick becomes the title line).
6. Run `node tools/check-scripts.js $DATE` and fix everything it lists for your file
   (other desks' files may not exist yet).
7. `git add scripts/$DATE && git commit -m "How It Works: <title> (DRAFT)"`
8. `node tools/town.js done howitworks "DRAFT ready: <title>" --push`
