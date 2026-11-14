# White Bucket Project: style guide

White Bucket Project is a learning channel: how things work, money, earth science,
"what if" questions and world news. Posted on TikTok, YouTube Shorts, Instagram Reels
and Facebook Reels. The owner can change anything here; every writer reads this first.

## Voice
- A curious friend explaining something cool. Plain words, short sentences.
- Hook in the first 3 seconds: a question or a surprising claim, never "Hey guys".
- One surprising fact per video, clearly true.
- No hype words ("insane", "you won't believe"), no clickbait you can't pay off.
- Close with a short invite: "Follow White Bucket for more." Vary the wording.
- Audience: teens and adults who like learning. Keep it family-friendly.

## Format
- Vertical video, 60–75 seconds. Narration 150–190 words (about 2.5 words a second).
- Every scene is something code can draw later: simple shapes, diagrams, maps, icons,
  big text, low-poly 3D. No real people's faces, no footage from other creators or news
  outlets, no logos or brands as visuals.

## Script template
Save as `scripts/YYYY-MM-DD/<series>.md`, where series is `what-if`, `how-it-works`
or `world-news`. `node tools/check-scripts.js` must pass.

```
---
series: what-if
title: What If the Moon Disappeared?
topic: earth science
length: 70s
---

## Hook
One line, spoken in the first 3 seconds.

## Narration
The full voiceover, 150–190 words, starting with the hook.

## Scenes
1. [6s] On screen: what is drawn | Text: big on-screen words
2. [10s] On screen: ... | Text: ...
(at least 4 scenes; the seconds add up to 60–75)

## Facts to double-check
- Each number or claim, with where it comes from.

## Title
A title under 60 characters.

## Hashtags
#whitebucket plus 4–6 topic tags

## Captions
- TikTok: one or two lines
- YouTube: one or two lines
- Instagram: one or two lines
- Facebook: one or two lines
```

World News adds a `## Sources` section with the links (at least 2 different sites).
