---
name: packaging
description: Packaging - before a DRAFT script is finished, its writer adds 5 title + cover-word ideas, scores them, and picks one, so the owner gets a ready title and cover for the post. Use in step 5 of how-it-works-writer, what-if-writer and world-news-writer (part A), or when the owner asks for better titles or covers.
---

# Packaging (titles and covers)

On a small channel, the title and the cover (the first frame or chosen thumbnail) decide
whether anyone taps. The writer of today's script does this as part of writing, with no
extra town status. It goes into the script as a `## Packaging` section, right after the
title block (before `## Narration`). `node tools/check-scripts.js` checks it for
`money`, `science` and `news` scripts.

1. Write **5 different** ideas. Different *angles*, not the same title reworded:
   a question ("Why is…?"), a surprising number, a "what happens if…", a plain promise
   ("…explained in one minute"), a personal hook ("Your paycheck…").
   - **Title:** the YouTube title, at most 60 characters (100 is the hard limit). No emoji
     in the table (the YouTube caption may add one).
   - **Cover words:** the big words on the first frame, **1-6 words** (black + red, like
     "EVERY PLANE / GROUNDED"). They must read in one second on a phone.
2. **Score each out of 10** = Hook (0-4: would a stranger want the answer?) + Clear
   (0-3: do you know what the video is about in one second?) + True (0-3: does the video
   deliver exactly this, with nothing exaggerated?). Write the score as `8/10` and a short "Why".
   **Honesty first:** an idea the video doesn't fully deliver, or that scares, shames or
   overpromises (money: no "get rich", "the secret banks hide", predictions), scores **0**.
   World News: no blame or guessing about causes; never suggest reported facts are fake.
3. `Pick: #N` = the highest score (a tie goes to the shorter title). Then make the script
   match the pick:
   - the title line: `# WhiteBucket Explains: <picked title>` (exactly the same text),
   - section 0 of the section plan shows the picked cover words as its headline,
   - the YouTube caption uses the picked title (plus ` #shorts`, an emoji is fine).
4. Add one line under the pick: `Runner-up: #M (<why>)`. The owner may swap to it.

```
## Packaging

| # | Title | Cover words | Score | Why |
|---|---|---|---|---|
| 1 | Why Every Plane in America Was Grounded | EVERY PLANE / GROUNDED | 9/10 | big question, clear, true |
| 2 | 3,000 Planes Had to Land at Once | 3,000 PLANES LANDING | 6/10 | strong number, but most planes weren't forced down |
| … |

Pick: #1
Runner-up: #2 (number hook; fix the wording to "kept flying" first)
```

## Rules
- Lean toward titles that make people want to level up ("Your first $1,000 move") while staying true; no hype or promised results. Covers are 16:9 thumbnails from Nov 19, 2026.
- Use real numbers from the fact notes only. Never invent a number for a title.
- The Secret Building's `village/outliers.md` (Mondays) shows titles that work for other
  channels. Learn from their *shape*, never copy a title.
- The owner chooses the final title and cover. The pick is a suggestion.
