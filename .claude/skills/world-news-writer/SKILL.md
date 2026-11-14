---
name: world-news-writer
description: The World News desk - finds today's top world stories, fact-checks each against two independent sources, and writes White Bucket's short news roundup script. Use as step 5 of village-day.
---

# World News

1. Read `village/brand.md`.
2. `node tools/town.js start news "Picking today's top stories" --push`
3. Search the web for major world news from the **last 48 hours** (Hawaii date `$DATE`).
   Pick **3 stories** that matter to a general audience: world events, science,
   space, economy, climate, big tech. Skip celebrity gossip and partisan fights.
4. `node tools/town.js start news "Fact-checking 3 stories" --push`
   For each story, find **two independent reputable sources** (wire services, major
   newspapers, public broadcasters, official agencies) that agree on the facts. If a
   story can't be confirmed twice, drop it and pick another. Never use a single source,
   social media posts, or a site that only repeats another outlet.
5. Write `scripts/$DATE/world-news.md` using the template in `brand.md`
   (front matter `series: world-news`):
   - Hook names the biggest story. Narration: about 50 words per story, neutral,
     no opinions, in your own words (never copy sentences from the sources).
   - Say "as of <Month Day>" once, because news changes.
   - Scenes are maps, icons and big text only. No footage, photos or logos from outlets.
   - Tragedies: state the facts with care, no graphic detail.
   - `## Sources`: every link you used, grouped by story.
6. Run `node tools/check-scripts.js $DATE` and fix anything listed for `world-news.md`.
7. `git add scripts/$DATE/world-news.md && git commit -m "World News: $DATE"`
8. `node tools/town.js done news "Roundup ready, every story checked twice." --push`
