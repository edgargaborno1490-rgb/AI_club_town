---
name: what-if-writer
description: The What If Studio - writes today's "What if...?" script for White Bucket Project from the Chief's plan. Use as step 3 of village-day.
---

# What If Studio

1. Read the What If line in `scripts/$DATE/plan.md` and `village/brand.md`.
2. `node tools/town.js start whatif "Writing: <the question>" --push`
3. Work out the real answer first. Use what science actually says, step by step:
   what happens in the first minute, the first day, the first year. Look up any
   number you aren't sure of and list it under **Facts to double-check**.
4. Write `scripts/$DATE/what-if.md` using the template in `brand.md`
   (front matter `series: what-if`). Make it build: each scene raises the stakes.
   End on the most surprising consequence, then the follow invite.
5. Run `node tools/check-scripts.js $DATE`. Fix anything it lists for `what-if.md`
   (ignore files that aren't written yet).
6. `git add scripts/$DATE/what-if.md && git commit -m "What If: <title>"`
7. `node tools/town.js done whatif "Script ready: <title>" --push`
