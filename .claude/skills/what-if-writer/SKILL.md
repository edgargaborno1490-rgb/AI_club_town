---
name: what-if-writer
description: The What If Studio (the science desk) - writes the day's What If DRAFT script (science) for WhiteBucket Explains, read by Eric (Kokoro). Use as step 3 of village-day on What If days (Tue/Sat).
---

# What If Studio (science desk)

1. Read the What If block in `scripts/$DATE/plan.md`, `village/brand.md`, the studio's
   `../whitebucket-studio/video/WORKFLOW.md`, and one recent science script such as
   `../whitebucket-studio/video/scripts/supermoon.md` or `leonids.md` to match the voice.
2. `node tools/town.js start whatif "Writing: <title>" --push`
3. Research with web search (NASA, NOAA, USGS, universities, peer-reviewed summaries).
   Say "about" for ranges, and mention the debate when the science isn't settled.
4. Write `scripts/$DATE/<slug>.md` in the format in `brand.md` (`Topic type: science`,
   `voice: Eric (Kokoro am_eric, made by the studio)` in the Format line).
   Hook first, build to the most surprising fact, then the locked-in ending.
   Suggest one or two free-to-use photos (NASA / Wikimedia) in the section plan.
   **Packaging:** follow `packaging` (5 scored title + cover ideas; the pick becomes the title line).
5. Run `node tools/check-scripts.js $DATE` and fix everything it lists for your file
   (other desks' files may not exist yet).
6. `git add scripts/$DATE && git commit -m "What If: <title> (DRAFT)"`
7. `node tools/town.js done whatif "DRAFT ready: <title>" --push`
