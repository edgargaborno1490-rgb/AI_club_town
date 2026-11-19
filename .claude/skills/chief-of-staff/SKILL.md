---
name: chief-of-staff
description: The village's Chief of Staff - picks today's one new WhiteBucket Explains topic for the desk on the rotation (and today's money format, or swaps in World News for a big story), never repeating a topic. Use as step 2 of village-day.
---

# Chief of Staff

1. `node tools/town.js start chief "Picking today's topic" --push`
2. Read:
   - **`village/owner-plan.md` first** (the owner's latest plan and standing orders; it wins over habits)
   - `node tools/rotation.js` (today's desk, voice and money format: How It Works every day except Thu/Sun World News; What If science is paused since Nov 19, 2026)
   - `node tools/taken-topics.js` (everything already made, scripted, or written by the village)
   - `../whitebucket-studio/video/IDEAS.md` (the studio's queue: "Up next" and "Evergreen")
   - `village/brand.md` and `village/topics.md` (what the village wrote recently)
   - `village/analyst-report.md` if it exists (which series and videos get the most views)
   - `village/analyst-notes.md` if it exists (watch time, audience, what is working and what is not; newest first)
   - `village/outliers.md` if it exists (Mondays: topics doing 3x+ their channel's usual views
     elsewhere on YouTube; a good starting point for today's desk, never copy a title)
3. Pick **one** topic for today's desk:
   - **How It Works** (money): pick a topic that fits **today's format** from `rotation.js`
     (comparison, real price, myth buster, checklist). A timely money item from IDEAS "Up next"
     (like Black Friday or a rate change) first, then an Evergreen 💰 idea. Write the format in the plan.
   - **What If** (science): **paused** (owner, Nov 19, 2026: "no more science video"). Don't pick science.
   - **World News**: **money news only** (owner, Nov 19, 2026): the most important money story of
     the last 48 hours for regular people (prices, rates, jobs, taxes, housing, a big company or market
     move). No science, no gossip, no partisan fights.
   **Explain like I'm 6** (owner, Nov 19, 2026): every topic gets a kid frame. Pick topics a simple
   picture can explain, and name the picture in the plan (always "you're 6", no Minecraft or game frames; `brand.md`).
   **Swap rule:** on a non-news day you may switch to World News only if a story is
   truly big and will be stale by the next news day. Say why in the plan.
   **Follow-up rule (Part 2):** paused with What If. (Old rule: if the last World News script
   raised a great "what if", the next What If day could follow it up.) The follow-up must be a clearly hypothetical,
   educational question about how things work in general (e.g. "What if a fake headline
   crashed a giant company's stock?" with real past cases). It must **never** suggest that
   real reported facts about real people are fake, never invent claims about real people,
   and never say to buy, sell or time a stock.
   **Use the numbers:** when the Analyst's report shows a clear winner, lean toward topics
   like the top videos (same kind of question, same kind of hook). Stay on today's desk;
   changing the rotation is the owner's call.
   Never pick anything in the taken list, even reworded. Skip ideas the owner dropped
   (IDEAS or the studio's HANDOFF.md say so, e.g. the Thanksgiving turkey idea).
4. Write `scripts/$DATE/plan.md` exactly like this (the tools read it):
   ```
   # Plan for $DATE (Day <the day number in town.json>)

   ## <What If | How It Works | World News>
   - Topic: <title>
   - Type: <science | money | news>
   - Desk: <whatif | howitworks | news>
   - Slug: <short-file-name>
   - Voice: <from rotation.js>
   - Money format: <comparison | realprice | myth | checklist, from rotation.js; How It Works only>
   - Explain like: you're 6 · picture: <the one analogy>
   - Post: <date window or "any time (evergreen)">
   - Why: <one line; say "swap" or "Part 2 of <title>" if it applies>
   ```
   Check that the slug doesn't already exist in `../whitebucket-studio/video/scripts/`.
5. Add a line to `village/topics.md`: `- $DATE | <desk> | <type> | <title>`
6. `git add scripts/$DATE/plan.md village/topics.md && git commit -m "Chief: plan for $DATE"`
7. `node tools/town.js done chief "Today's topic: <title>" --push`
