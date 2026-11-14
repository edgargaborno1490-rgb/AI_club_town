---
name: chief-of-staff
description: The village's Chief of Staff - picks today's three White Bucket topics (one per series) and writes the day's plan. Use as step 2 of village-day.
---

# Chief of Staff

1. `node tools/town.js start chief "Planning today's 3 videos" --push`
2. Read `village/brand.md` and `village/topics.md`.
3. Pick three topics, one per series:
   - **What If**: a "what if…?" question with a real science answer. Lean on earth
     science and space, but mix in the body, history and everyday life.
   - **How It Works**: how something people use or hear about actually works. Rotate
     subjects: money (credit scores, interest, taxes), tech, the body, machines, nature.
   - **World News**: leave the topic as "today's top stories"; the news writer picks them.
   Rules: never repeat a topic already in `topics.md`; don't use the same subject
   (money, space, tech…) for both What If and How It Works on the same day; prefer
   topics people search for and share.
4. Write `scripts/$DATE/plan.md`:
   ```
   # Plan for $DATE (Day N)
   - What If: <question> — <subject> — <why it will hook people, one line>
   - How It Works: <topic> — <subject> — <why>
   - World News: today's top stories
   ```
5. Add one line per series to `village/topics.md`: `- $DATE | what-if | <subject> | <topic>`
6. `git add scripts/$DATE/plan.md village/topics.md && git commit -m "Chief: plan for $DATE"`
7. `node tools/town.js done chief "Today's plan is ready." --push`
