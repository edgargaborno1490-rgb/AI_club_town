---
name: island-clip
description: The Chief's short "Island Clip" DRAFT (15-30 s) - a quick update about something that actually changed on the AI Club Town island (a follower milestone, new named birds, the next build, a new worker). Use in village-day on Wednesdays and Fridays from Nov 25, 2026 when tools/rotation.js says "also Island Clip", or when the owner asks for an island clip.
---

# Island Clip (Wed + Fri from Nov 25, 2026)

The Sunday "AI Village · Week N" update stays the main island video (the intro promised
it). Island Clips are short extras in between, **only when something real changed**.
An island that looks the same in every post gets boring, so skipping is normal.

1. Check what changed since the last island post (the last `village-update-week-*.md` or
   `island-clip.md` in `scripts/`):
   `git log --since="<that date>" --oneline -- town.json src/ village/` and `node -e "console.log(require('./town.json'))"`.
   Worth a clip: followers crossed a milestone (25, 50, 100, ...), new named birds, the
   next build started or finished, a new worker or building, a funny or honest moment in
   the log (the fact-checker caught a mistake, a run failed). Not worth a clip: only the
   day number changed, or 1-2 new followers.
2. **Nothing worth it:** `node tools/town.js log "Island Clip skipped: nothing new on the island."` and stop.
3. Otherwise: `node tools/town.js start chief "Writing an Island Clip" --push`, then write
   `scripts/$DATE/island-clip.md` in the `village/brand.md` format with:
   - `# WhiteBucket Explains: Island Clip · <what changed>`
   - `Topic type: island`
   - Format line: `9:16 · screen recording of the island page · about 20 s · voice: Village host (ElevenLabs, the owner picks and records it)`
     (the owner can also read it in their own voice).
   - Narration 35-80 words: the change in the first sentence, why it matters, one line
     inviting people in ("Comment BIRD and I'll name a bird after you."), end with
     "See you Sunday."
   - Section plan, 2-5 rows: what to film on the live page
     (https://edgargaborno1490-rgb.github.io/AI_club_town/), e.g. "zoom on the birds".
   - Fact notes: each number with its file (`town.json`, `village/topics.md`) and "as of <date>".
   - Captions for TikTok, Instagram, Facebook, YouTube.
   Same honesty rules as `weekly-update`: real numbers only; no logins or private details;
   named birds only for people who asked.
4. Add a block to `scripts/$DATE/plan.md`:
   ```
   ## Island Clip
   - Topic: Island Clip · <what changed>
   - Type: island
   - Slug: island-clip
   - Voice: Village host (ElevenLabs, the owner picks and records it)
   - Post: today or tomorrow
   ```
5. `node tools/check-scripts.js $DATE`, fix everything, then
   `git add scripts/$DATE && git commit -m "Chief: Island Clip (DRAFT)"` and
   `node tools/town.js done chief "Island Clip drafted: <what changed>." --push`
