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
  Plus **AI Village · Week N** every Saturday from Nov 21 (posted Sunday), hosted by the
  **village host** voice (ElevenLabs, the owner picks and records it; not Mark, Eric or George).
  AI Village videos introduce the bucket guy as WhiteBucket (the owner), may run to ~90 s
  (170–240 words), and end with their own line (the weekly update: "See you next Sunday.")
  instead of the daily ending.
  | Series | Desk | Topic type | Voice |
  |---|---|---|---|
  | What If | What If Studio (`whatif`) | science | **Eric** (Kokoro `am_eric`, free; the studio makes it; replaced Puck Nov 17, 2026, owner's pick) |
  | How It Works | How It Works (`howitworks`) | money (mostly) | **George** (Kokoro `bm_george`, free; the studio makes it) |
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
- **Voice only** (owner, Nov 17, 2026): no background music, no sound effects, no swishes; scripts never plan any.
  Respectful topics: calm, no jokes. Latest owner decisions: `village/owner-plan.md`.

## The script (one a day)
Save it as `scripts/YYYY-MM-DD/<slug>.md`. `node tools/check-scripts.js` must pass.

```
> **Status: DRAFT – needs review.**

# WhiteBucket Explains: <title as a question or hook>

Topic type: money | science | news | village | island
Format: 9:16 · paper line with the bucket guy · about 72 s · ~190 words · voice: <the series' voice>
Post: <date window, or "any time (evergreen)">
Tone: <one line>

## Packaging
| # | Title | Cover words | Score | Why |
|---|---|---|---|---|
(5 ideas, scored like `8/10`; see the `packaging` skill)

Pick: #N
Runner-up: #M (<why>)

## Narration (record as one paragraph)
One paragraph, about 200–235 words. **From Nov 17, 2026 (owner's change) the island checkup
comes FIRST:** open with a short **island checkup** (2–4 sentences, ~10–15 s; up to ~6
sentences when `village/island-news.md` has a lot of news) with facts only from town.json and
`village/island-news.md`: the bird count, what's new or being built (e.g. the Secret Building,
without saying what it is), and **every item under "To announce" in island-news.md**. Then one
short bridge into the topic (e.g. "Now… today's question.") and the explainer (~150–180
words), whose first sentence is the topic's hook. End with exactly:
See you tomorrow for another island update!
The checkup's first sentence should hook too (lead with the most exciting island news). "…" for pauses. Short sentences. Numbers spelled the way
they're said ("one point one million").

## Section plan
| # | Narration | On screen |
|---|---|---|
| 0 | hook words… | what's drawn, the headline (black + red words), what the bucket guy does |
(row 0 = the island checkup, then 5–7 rows for the explainer, then one for the end card)

## Fact notes
- Every claim and number, with a source link and an "as of" date.

## Captions
- TikTok: … (about 5 hashtags, ends "New island update every day: see you tomorrow!")
- Instagram: …
- Facebook: … (3 hashtags)
- YouTube: the picked title + one line
```

- **Money:** educational only. No stock picks, predictions or "buy this". Include a short
  "not financial advice" line (spoken, or a note for the on-screen card). Every number dated.
- **News:** add `## Sources`, grouped by story (a line like `Nvidia:` then its links), at
  least 2 different reputable sites per story. Your own words, never copied sentences.
- **Crossovers:** a What If can be "Part 2" of a recent World News story, but only as a
  clearly hypothetical, educational question about how things work in general. Never
  suggest real reported facts about real people are fake; never say to buy or sell.
- **End card (every explainer):** the section plan's last row ("See you tomorrow…") also notes
  the desk credit for the studio's end card, e.g. `End card: desk whatif (What If bucket),
  birds from town.json`. The studio draws a small bucket in the desk's colour with
  "written by the What If bucket · AI Club Town" and the bird count. The narration stays
  the same. This ties every video back to the island.
- **Island Clips** (`Topic type: island`, Wed/Fri from Nov 25, only when something changed):
  35–80 words, 2–5 section plan rows that say what to film on the live island page, end
  with "See you Sunday.", no web links needed (facts come from `town.json` etc. with "as
  of"). See the `island-clip` skill.
- **Named birds:** viewers who comment "BIRD" get a bird with their public username
  (`node tools/town.js bird add <username> --push`). Only people who asked; remove anyone
  who asks (`bird remove`).
- **Only the owner approves.** The village always writes DRAFT. The Programmer copies the
  drafts into the studio's `video/scripts/` and lists them in IDEAS.md (never overwriting).

## Privacy (owner's rule, Nov 17, 2026)
- Never show or say the island's web address (it contains the owner's name): no link in narration, captions, on screen or in a recording's address bar (owner's rule, Nov 17, 2026).
  Say "our AI island" instead. Never use the owner's real name; on camera he is WhiteBucket.
