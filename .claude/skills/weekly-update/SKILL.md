---
name: weekly-update
description: The Chief of Staff's weekly "AI Village · Week N" DRAFT script - a 60-70 second, honest recap of what the village made and earned this week, hosted by the village host voice. Use in village-day on Saturdays when tools/rotation.js says "also Village Update".
---

# Weekly Village Update (Saturdays, from Nov 21, 2026)

Only when `node tools/rotation.js` prints "also Village Update · Week N". Written by the
Chief, after today's regular script is written and fact-checked.

1. `node tools/town.js start chief "Writing Village Update · Week N" --push`
2. Gather the week's facts (last Sunday through today), **only from real records**:
   - Scripts the village wrote: `village/topics.md` and `scripts/<dates>/`.
   - Videos actually finished: `../whitebucket-studio/video/White Bucket Content/Done.md`
     and the "Made" list in `../whitebucket-studio/video/IDEAS.md`.
   - Money: run `node tools/ledger.js` for the total; this week's lines in `village/earnings.md`.
   - Views: `village/analyst-report.md` (only if it has numbers; say "views" honestly, never guess).
   - Island: followers, next milestone and named birds from `town.json`
     (`node -e "const s=require('./src/state.js').parseTown(require('./town.json'));console.log(s.followers,s.nextMilestone,s.birds)"`).
   - Problems: town.json log lines with "Couldn't finish" or "didn't finish", and the
     git log of AI_club_town for the week (`git log --since="8 days ago" --oneline`).
3. Write `scripts/$DATE/village-update-week-N.md` in the format in `village/brand.md` with:
   - `# WhiteBucket Explains: AI Village · Week N`
   - `Topic type: village`
   - Format line: `voice: George (Kokoro bm_george, made by the studio)` and
     `about 60–90 s`.
   - Narration, in this order: a hook with the week's most interesting number; what the
     village made (scripts written, videos finished, with their titles); the best moment;
     what went wrong; **money earned this week and in total, even if it's $0**; one thing
     changing next week; end with "See you next Sunday." (AI Village videos don't use
     "Comment NEXT"). Narration 170–240 words (up to ~90 s).
   - Section plan: the 3D town (the owner screen-records the town page, or the studio
     records a local copy), the scoreboard of scripts and videos, the money bar, the
     bucket guy reacting. Paper-line style for the cards.
   - Fact notes: each number with where it came from (file name) and "as of <date>".
   - **Week 1 (Nov 21) must announce, as its "changing next week" part:** (a) a new worker
     moved in: the **Analyst** (teal bucket on the plaza) who reads the view counts so the
     village makes more of what people watch; (b) from week 2, short **Island Clips** on
     some Wednesdays and Fridays when something changes on the island, while the big update
     stays every Sunday; (c) "Comment BIRD and I'll name a bird after you." Keep it to the
     ~90 s limit: cut other parts first.
   - From week 2, end the "changing next week" part with the next milestone
     ("<n> more followers to <milestone>").
4. **Honesty rules:** never round up, never guess a number, never say a video was made if
   it isn't in Done.md or the Made list. If the week was bad, say so plainly; that's
   part of the story. No logins, account names, emails or private details on screen. Named birds: only usernames
   of people who asked for one (they're public on the island page).
5. Add a block to `scripts/$DATE/plan.md`:
   ```
   ## Village Update
   - Topic: AI Village · Week N
   - Type: village
   - Slug: village-update-week-N
   - Voice: George (Kokoro bm_george, made by the studio)
   - Post: Sunday
   ```
6. Run `node tools/check-scripts.js $DATE` and fix everything it lists.
7. `git add scripts/$DATE && git commit -m "Chief: Village Update · Week N (DRAFT)"`
8. `node tools/town.js done chief "Village Update · Week N drafted." --push`
