---
name: like-youre-6
description: Fast checklist for writing or fixing a WhiteBucket Explains money script "explained like you're 6" the way the owner wants it (learned Nov 19, 2026 from the first one, credit cards). Use whenever a desk writes a script, the owner edits a narration, or the owner says "make one now" / "change the script" - read this instead of the old chat.
---

# Explained like you're 6 (owner's way, learned Nov 19, 2026)

Read this first; it saves the back-and-forth. Full rules: `village/brand.md`. Example that the owner
APPROVED: `scripts/2026-11-19/credit-cards-like-youre-6.md` (the final narration; copy its shape).

## The narration (what the owner approved)
1. **Hook:** "How does <thing> work? Explained like you're six." Always the 6-year-old. **No Minecraft** or
   any game world (owner: "I like the kid better").
2. **One kid picture, with a concrete deal and real numbers:** "Your friend lends you ten cookies. Give ten
   back next week… and it's free. Wait longer, and you owe twelve. Those two extra cookies are called interest."
   The owner likes a deal a kid can follow (a promise, a "thank-you"), named words only after the picture.
3. **Fill in the "blank" with the REAL answer**, in the simplest form: "For every hundred cookies… one back" (1%),
   "at restaurants… three back" (3%). (The 500 → 5 / 15 math version was too confusing.)
4. **Cover the parts people actually use** (for cards: rewards tiers 1% everything / 3% restaurants, cash back
   or travel points). Say "can earn": rates differ by card.
5. **"In grown-up words:"** one sourced number (Fed G.19 card rate ~22%, as of the release date), then the
   honest catch in a few words ("…way more than the rewards").
6. **Ending:** "Follow and comment BIRD, and your name goes on a bird on our island. See you tomorrow for
   another island update!" If there's **no island news**, the owner may drop the checkup AND the "See you
   tomorrow…" sentence for that script: add `Ending: BIRD line only (...)` under Format (checker allows it).

## Simple beats clever (owner, Nov 19, later: "still kind of confusing, make it simpler")
- **One easy rule instead of math:** "For every hundred cookies you borrow… he gives you one back. At restaurants…
  three back." Not "500 × 1% = 5, all restaurant = 15". At most ONE number per scene on screen.
- **The owner's final pick (Nov 19): the ~136-word version** with "a friend with a cookie jar", 100 → 1 back,
  "at restaurants… three back", money or a trip, "but here's the catch", then 22%. A shorter ~110-word cut
  (no restaurants, no catch line) was too bare: he went back to the 136-word one. Simple, but keep the useful bits.
- Short sentences, one idea each, and say the name of the idea AFTER it: "…That's called rewards."
- **Only one grown-up number, at the end** ("about twenty-two percent a year"); everything before it is cookies.
- A "but here's the catch" line in cookie words beats a percent comparison ("waiting too long costs way more
  cookies than the thank-you gives back").

## Never (owner removed these on Nov 19, 2026, for every video)
- No "your move this week" / homework step.
- No "not financial advice" line, spoken or on screen.
- No island checkup when nothing changed on the island (ask; "To announce" in `island-news.md` empty = none).
- No talking down, no "hey kids"; post as **Not made for kids** (comments must stay on for BIRD).

## Length
Up to about **a minute** (owner: "a minute is good enough", never over 1:30). 90–150 words; the checker
allows 160 because it counts "…" as words. Timing: George x0.95 with 0.8 s beats ≈ 2.3 words/s
(123 words = 52.6 s), so 150 words ≈ 65 s.

## Keep the kid picture honest (the owner doesn't check the math; we do)
- "Two extra cookies a week" = 20% a WEEK: too scary. Tie the extra to the real yearly rate.
- "Five or ten thank-you cookies" for ten borrowed = 50–100%: way too big. Use 500 borrowed → 5–15 back.
- If the picture can't stay true, change the numbers in the picture, not the facts.

## Doing it fast (process lessons)
- **"Make one now" after the day already ran** (`scripts/$DATE/plan.md` exists): don't run `new-day` (it wipes
  the log). Append an `## How It Works (extra, owner asked)` block to `plan.md`, write the script, run
  `node tools/check-scripts.js $DATE`, then `node tools/send-to-studio.js $DATE --push` (it skips scripts the
  studio already has). Skip the Banker/Analyst (they ran in the morning).
- **The owner edits a script that's already in the studio:** `send-to-studio.js` never overwrites, so edit
  BOTH copies the same way (`scripts/$DATE/<slug>.md` and `../whitebucket-studio/video/scripts/<slug>.md`),
  `diff -q` them, push both repos, and `send_message` the open 🎬 video chat ("pull main, use this version").
- **Editing with Python:** find section-plan rows AFTER `## Section plan` (the Packaging table also has `| 1 |`);
  change the section-plan row text BEFORE replacing the narration string (the same words appear in both).
- WebSearch needs `ToolSearch select:WebSearch` first. Good sources: Fed G.19 (card rates), CFPB "Ask CFPB"
  pages (grace period, APR), CFPB rewards spotlight, issuer explainers (Capital One, Chase) for how rewards work.
- **Owner says APPROVED in this chat:** build here (studio `daily-video` + `wide-video`, copy
  `video/src/line/FedHikeWide.tsx`), and tell the 🎬 video chat to stand down so it isn't built twice.
- Answer the owner short: what changed, the narration in a quote block, one question at most.
