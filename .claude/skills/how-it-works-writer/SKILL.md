---
name: how-it-works-writer
description: The How It Works studio (the money desk) - writes the day's How It Works DRAFT script (mostly money topics) for WhiteBucket Explains, in the day's money format (comparison, real price, myth buster, checklist). Use as step 3 of village-day on How It Works days (every day except Thu/Sun from Nov 19, 2026).
---

# How It Works (money desk)

1. Read the How It Works block in `scripts/$DATE/plan.md`, `village/brand.md`, the studio's
   `../whitebucket-studio/video/WORKFLOW.md`, and `../whitebucket-studio/video/scripts/hawaii-expensive.md`
   (a finished money script to match). If IDEAS.md has research notes for this topic, use them.
2. `node tools/town.js start howitworks "Writing: <title>" --push`
3. Research with web search. Prefer official sources (government agencies, the Fed, CFPB,
   EIA, BLS, Census). Every number gets a source and an "as of" date.
3b. **Today's format** (`node tools/rotation.js` prints it; also in the plan). Build the script around it:
   - **comparison**: two people (or two choices) with the same money; show where each ends up. Hook
     asks "who wins?" and the answer comes before the island checkup. Use simple, sourced math.
   - **realprice**: the sticker price first, then add the hidden costs one at a time (interest, fees,
     insurance, upkeep) to reach the real total. Hook: "A $X <thing>? The real price is $Y."
   - **myth**: one common money belief, said in the hook, then why it is wrong (or half right) with
     one sourced number, then what is true instead.
   - **checklist**: 3 to 5 short steps, one sentence each, numbered on screen. Hook promises the list.
   Every format: ONE idea, 90-150 words, real sourced numbers with "as of" dates, and **no "your move
   this week" step** (owner, Nov 19, 2026; `brand.md`).
   The video is 16:9 (calm wide style), so the section plan describes wide scenes.
3c. **Read the `like-youre-6` skill** (the owner's approved shape, Nov 19). **Explain it like the viewer is 6** (owner, Nov 19, 2026; `brand.md` "Explain like I'm 6"): the hook
   names the frame ("…explained like you're 6"; always the 6-year-old, no Minecraft), one kid picture carries
   the format (comparison = two kids with the same allowance; real price = the toy that costs more than
   its sticker; myth = what grown-ups say vs what's true; checklist = 3-5 steps a kid could follow),
   then "In grown-up words:" one real sourced number.
4. Explain **one** idea well, with that one kid picture (allowance, lemonade stand, cookies, a piggy bank).
   Educational only: no stock picks, predictions or "buy this". No "not financial advice" line, spoken or on screen
   (owner, Nov 19, 2026).
5. Write `scripts/$DATE/<slug>.md` in the format in `brand.md` (`Topic type: money`,
   the voice `node tools/rotation.js` prints (George) in the Format line, and
   `Money format: <comparison | realprice | myth | checklist>` and `Explain like: …` under it).
   The section plan uses the paper-line look and gives the pen line something to do (no bucket guy).
   **Packaging:** follow `packaging` (5 scored title + cover ideas; the pick becomes the title line).
6. Run `node tools/check-scripts.js $DATE` and fix everything it lists for your file
   (other desks' files may not exist yet).
7. `git add scripts/$DATE && git commit -m "How It Works: <title> (DRAFT)"`
8. `node tools/town.js done howitworks "DRAFT ready: <title>" --push`
