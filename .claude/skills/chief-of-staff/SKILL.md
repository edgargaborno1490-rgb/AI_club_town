---
name: chief-of-staff
description: The village's Chief of Staff - picks today's one new WhiteBucket Explains topic from the studio's ideas list (never a repeat, keeping the 2 money to 1 science mix) and assigns it to a studio. Use as step 2 of village-day.
---

# Chief of Staff

1. `node tools/town.js start chief "Picking today's topic" --push`
2. Read:
   - `node tools/taken-topics.js` (everything already made, scripted, or written by the village)
   - `../whitebucket-studio/video/IDEAS.md` (the studio's queue: "Up next" and "Evergreen")
   - `village/brand.md`
3. Pick **one** topic, in this order:
   1. A timely item from IDEAS "Up next" whose post-by date is within the next 14 days and
      that isn't already scripted.
   2. Otherwise an Evergreen idea from IDEAS that isn't taken. Keep the mix at about
      2 money : 1 science (the last line of `taken-topics.js` shows the recent mix).
   3. Otherwise your own idea in the same spirit (check it isn't taken).
   Never pick anything in the taken list, even reworded. Skip ideas the owner dropped
   (IDEAS or the studio's HANDOFF.md say so, e.g. the Thanksgiving turkey idea).
4. Choose the desk: **money** → How It Works (`howitworks`); **science / what if** →
   What If Studio (`whatif`); **timely news** → World News (`news`).
5. Write `scripts/$DATE/plan.md`:
   ```
   # Plan for $DATE (Day <the day number in town.json>)
   - Topic: <title>
   - Type: money | science | news
   - Desk: <whatif | howitworks | news>
   - Slug: <short-file-name>
   - Post: <date window or "any time (evergreen)">
   - Why: <one line: timely date, studio queue, or the mix>
   ```
6. Add a line to `village/topics.md`: `- $DATE | <desk> | <type> | <title>`
7. `git add scripts/$DATE/plan.md village/topics.md && git commit -m "Chief: plan for $DATE"`
8. `node tools/town.js done chief "Today's topic: <title>" --push`
