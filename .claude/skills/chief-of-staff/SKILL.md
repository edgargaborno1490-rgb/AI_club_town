---
name: chief-of-staff
description: The village's Chief of Staff - picks today's three new WhiteBucket Explains topics (one What If, one How It Works, one World News) from the studio's ideas list and the news, never repeating a topic. Use as step 2 of village-day.
---

# Chief of Staff

1. `node tools/town.js start chief "Picking today's 3 topics" --push`
2. Read:
   - `node tools/taken-topics.js` (everything already made, scripted, or written by the village)
   - `../whitebucket-studio/video/IDEAS.md` (the studio's queue: "Up next" and "Evergreen")
   - `village/brand.md` (the three series and their voices)
3. Pick **three** topics, one per series:
   - **What If** (science): a "what if…?" or a surprising science/space/Earth/history
     question. Timely sky events and science news from IDEAS "Up next" go here first.
   - **How It Works** (mostly money): how something works, usually money (credit, rent,
     inflation, the Fed, taxes, prices). Timely money items from "Up next" (like Black
     Friday) go here first, then IDEAS "Evergreen" 💰 ideas.
   - **World News**: the most important timely story of the last 48 hours that a general
     audience cares about (economy, science, world events). Skip gossip and partisan fights.
   Never pick anything in the taken list, even reworded. Skip ideas the owner dropped
   (IDEAS or the studio's HANDOFF.md say so, e.g. the Thanksgiving turkey idea).
4. Write `scripts/$DATE/plan.md` exactly like this (the tools read it):
   ```
   # Plan for $DATE (Day <the day number in town.json>)

   ## What If
   - Topic: <title>
   - Type: science
   - Slug: <short-file-name>
   - Voice: AI voice A (to be chosen)
   - Post: <date window or "any time (evergreen)">
   - Why: <one line>

   ## How It Works
   - Topic: … (Type: money, Voice: AI voice B (to be chosen))

   ## World News
   - Topic: … (Type: news, Voice: Mark (ElevenLabs))
   ```
   Check that no slug already exists in `../whitebucket-studio/video/scripts/`.
5. Add three lines to `village/topics.md`: `- $DATE | <desk> | <type> | <title>`
6. `git add scripts/$DATE/plan.md village/topics.md && git commit -m "Chief: plan for $DATE"`
7. `node tools/town.js done chief "Today's 3 topics are picked." --push`
