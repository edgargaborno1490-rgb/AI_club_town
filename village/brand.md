# WhiteBucket Explains: what the village writes

The village is the front office for the owner's video studio, the
`whitebucket-studio` repo. **The studio's `video/WORKFLOW.md` is the boss:** if anything
here disagrees with it, follow WORKFLOW.md. Every writer reads WORKFLOW.md and one or
two recent studio scripts (`video/scripts/hawaii-expensive.md`, `video/scripts/nvidia.md`)
before writing.

## The channel
- **WhiteBucket Explains** on TikTok, Instagram, YouTube and Facebook.
- ~65–75 s vertical explainers, one topic each.
- **One video a day, on a rotation** (from Nov 15, 2026; `node tools/rotation.js`):
  Mon/Wed/Fri How It Works · Tue/Sat What If · Thu/Sun World News.
  | Series | Desk | Topic type | Voice |
  |---|---|---|---|
  | What If | What If Studio (`whatif`) | science | **AI voice A** (to be chosen) |
  | How It Works | How It Works (`howitworks`) | money (mostly) | **AI voice B** (to be chosen, different from A) |
  | World News | World News (`news`) | news | **Mark** (ElevenLabs, the owner records it) |
- Write every narration for the ear, whichever voice reads it.

## The look the section plan describes ("paper line", locked in)
- Cream paper background, dark brown ink line drawings (outlines, no fills), red for key
  words and bad numbers. Big spaced-out headlines, small all-caps labels for sources and dates,
  outlined panels, one caption line at a time.
- **The bucket guy:** a faceless dark figure with a white bucket on his head. Playful: hops,
  points, shrugs, cheers, jumps at big numbers. Stands bottom right, walks into some scenes.
- A few real photos in white paper frames, only free-to-use (NASA, Wikimedia Commons with
  license), with a credit line. Say honestly what a photo shows.
- Quiet sound: no swishes, no comic sound effects. Respectful topics: calm, no jokes.

## The script (one a day)
Save it as `scripts/YYYY-MM-DD/<slug>.md`. `node tools/check-scripts.js` must pass.

```
> **Status: DRAFT – needs review.**

# WhiteBucket Explains: <title as a question or hook>

Topic type: money | science | news
Format: 9:16 · paper line with the bucket guy · about 72 s · ~190 words · voice: <the series' voice>
Post: <date window, or "any time (evergreen)">
Tone: <one line>

## Narration (record as one paragraph)
One paragraph, about 180–200 words. First sentence is the hook. "…" for pauses. Short
sentences. Numbers spelled the way they're said ("one point one million"). Ends with
exactly: Comment NEXT and pick the next topic.

## Section plan
| # | Narration | On screen |
|---|---|---|
| 0 | hook words… | what's drawn, the headline (black + red words), what the bucket guy does |
(5–7 rows)

## Fact notes
- Every claim and number, with a source link and an "as of" date.

## Captions
- TikTok: … (about 5 hashtags, ends "Comment NEXT and pick the next topic!")
- Instagram: …
- Facebook: … (3 hashtags)
- YouTube: title + one line
```

- **Money:** educational only. No stock picks, predictions or "buy this". Include a short
  "not financial advice" line (spoken, or a note for the on-screen card). Every number dated.
- **News:** add `## Sources`, grouped by story (a line like `Nvidia:` then its links), at
  least 2 different reputable sites per story. Your own words, never copied sentences.
- **Crossovers:** a What If can be "Part 2" of a recent World News story, but only as a
  clearly hypothetical, educational question about how things work in general. Never
  suggest real reported facts about real people are fake; never say to buy or sell.
- **Only the owner approves.** The village always writes DRAFT. The Programmer copies the
  drafts into the studio's `video/scripts/` and lists them in IDEAS.md (never overwriting).
