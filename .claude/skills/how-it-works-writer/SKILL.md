---
name: how-it-works-writer
description: The How It Works studio - writes today's "how does X work" script for White Bucket Project from the Chief's plan, including money topics. Use as step 4 of village-day.
---

# How It Works

1. Read the How It Works line in `scripts/$DATE/plan.md` and `village/brand.md`.
2. `node tools/town.js start howitworks "Explaining: <topic>" --push`
3. Explain it like an engineer who is great with kids: name the parts, then show the
   steps in order, with one everyday comparison that makes it click. Scenes should be
   cutaway diagrams, arrows and step-by-step builds.
4. **Money topics:** explain how it works, never what the viewer should buy, sell or
   invest in. No promises of returns. Say "this isn't financial advice" in the caption.
   Use round example numbers and say they are examples.
5. Write `scripts/$DATE/how-it-works.md` using the template in `brand.md`
   (front matter `series: how-it-works`). List every number under **Facts to double-check**.
6. Run `node tools/check-scripts.js $DATE` and fix anything listed for `how-it-works.md`.
7. `git add scripts/$DATE/how-it-works.md && git commit -m "How It Works: <title>"`
8. `node tools/town.js done howitworks "Script ready: <title>" --push`
