# WhiteBucket Explains: what the village writes

The village is the front office for the owner's video studio, the
`whitebucket-studio` repo. **The studio's `video/WORKFLOW.md` is the boss:** if anything
here disagrees with it, follow WORKFLOW.md. Every writer reads WORKFLOW.md and one or
two recent studio scripts (`video/scripts/hawaii-expensive.md`, `video/scripts/nvidia.md`)
before writing.

## The channel
- **WhiteBucket Explains** on TikTok, Instagram, YouTube and Facebook.
- **Every video is 16:9** (1920×1080; owner, Nov 19, 2026: "keep all my videos 16:9"), built with the studio's
  `wide-video` skill (calm pace). One topic each, 90–125 words (about 45–55 s at the calm pace).
- **Level up (owner, Nov 19, 2026): every video motivates.** The goal is that viewers walk away wanting
  to level up and do something with their life. Keep the facts, then turn them into a push:
  - Frame the viewer as someone who can win ("you can", "here's your move"), never as someone being scolded.
  - Include **one small, doable step** they could take this week (check a rate, set up an automatic
    transfer, write a budget, ask for a raise, learn one skill). Put it right before the island checkup.
  - Real and honest: no hype, no "get rich quick", no promised results, no lifestyle flexing. Small steps
    that add up are the message. Money stays educational with the "not financial advice" line.
  - World News too: neutral facts first, then one line on what it means for you and what you can do.
- **Explain like I'm 6 (owner, Nov 19, 2026): every video, every desk.** Money explained so simply a
  six-year-old would get it, for grown-ups who were never taught. Two frames:
  - **Like you're 6** (the default): "How does a credit card work? Explained like you're 6."
  - **A game world** ("Credit cards explained with Minecraft"): emeralds = money, a chest = a savings
    account, a villager trade = a loan, building block by block = compound growth. Use it when the
    picture truly fits (try about twice a week; the Analyst's numbers decide more or less). Other kid
    worlds work too: lemonade stand, piggy bank, allowance, trading cards, LEGO.
  How to write it:
  - The **hook names the frame**: the question + "explained like you're 6" (or "…with Minecraft").
  - **One picture, all the way through.** Pick one analogy and stay in it; don't stack three.
  - Words a first grader knows, short sentences. Say a hard word only after the picture explains it
    ("…and that extra is called **interest**").
  - Then **"In grown-up words:"** one real, sourced number with its date (e.g. the average card rate).
    The analogy must never bend the facts; if it can't stay true, pick another one.
  - Then the level-up step (for the grown-up watching), the island checkup and the ending, as usual.
  - Warm, never talking down to the viewer, never "hey kids": the audience is teens and adults.
    Videos are posted **Not made for kids** (kids' videos lose comments, and the BIRD comments matter).
  - **Minecraft is only a word, not a look:** say it in titles and narration, but on screen draw our own
    paper-line blocks, coins and chests. No Minecraft logo, font, textures, characters (Steve, Creeper,
    the villager face), sounds or game footage. Captions add "Not affiliated with Minecraft or Mojang."
  - Example (myth day, about the shape only; the real number comes from the fact notes):
    "How does a credit card work? Explained like you're 6. … Your friend lends you ten cookies. Pay back ten
    by Friday, and it's free. Wait longer, and every week you owe a few more cookies. That extra is called
    interest. … In grown-up words: the average card charges about <rate> a year, as of <date>. …"
  - Write `Explain like: you're 6 | Minecraft | <another kid world> · picture: <the analogy>` under the
    Format line (`check-scripts.js` checks it for money and news scripts).
- **One video a day, on a rotation** (from Nov 15, 2026; `node tools/rotation.js`):
  How It Works (money) every day except Thu/Sun World News, money news only (from Nov 19, 2026; What If science paused).
  **Every video is read by George** (Kokoro `bm_george`, the studio makes it; owner, Nov 19, 2026).
  Money formats: Mon comparison · Tue real price · Wed myth buster · Fri checklist · Sat takes turns.
  Plus **AI Village · Week N** every Saturday from Nov 21 (posted Sunday), read by
  **George** (was the ElevenLabs village host until Nov 19, 2026).
  AI Village videos introduce the bucket guy as WhiteBucket (the owner), may run to ~90 s
  (170–240 words), and end with their own line (the weekly update: "See you next Sunday.")
  instead of the daily ending.
  | Series | Desk | Topic type | Voice |
  |---|---|---|---|
  | What If | What If Studio (`whatif`) | science (paused Nov 19, 2026) | Eric (was) |
  | How It Works | How It Works (`howitworks`) | money (mostly) | **George** (Kokoro `bm_george`, free; the studio makes it) |
  | World News | World News (`news`) | money news | **George** (Kokoro `bm_george`; Mark on ElevenLabs until Nov 19, 2026) |
- Write every narration for the ear, whichever voice reads it.

## The look the section plan describes ("paper line", locked in)
- Cream paper background, dark brown ink line drawings (outlines, no fills), red for key
  words and bad numbers. Big spaced-out headlines, small all-caps labels for sources and dates,
  outlined panels, one caption line at a time.
- **No bucket guy** in the daily videos (owner, Nov 17, 2026: "leave him out"). The **pen line** (ink motion) is the
  character: it circles, underlines, strikes in red, becomes the drawing, and turns into a bird at the island.
- A few real photos in white paper frames, only free-to-use (NASA, Wikimedia Commons with
  license), with a credit line. Say honestly what a photo shows.
- **Music:** only free tracks the owner picks (from Nov 17, 2026, night); the studio syncs it. No sound effects or swishes;
  scripts don't pick songs (they may add `Mood: calm / upbeat` under Tone).
  Respectful topics: calm, no jokes. Latest owner decisions: `village/owner-plan.md`.

## The script (one a day)
Save it as `scripts/YYYY-MM-DD/<slug>.md`. `node tools/check-scripts.js` must pass.

```
> **Status: DRAFT – needs review.**

# WhiteBucket Explains: <title as a question or hook>

Topic type: money | science | news | village | island
Format: 16:9 · calm wide style · about 50 s · ~110 words · voice: <the series' voice>
Explain like: you're 6 | Minecraft | <kid world> · picture: <the one analogy, e.g. borrowing a friend's toy>
Post: <date window, or "any time (evergreen)">
Tone: <one line>

## Packaging
| # | Title | Cover words | Score | Why |
|---|---|---|---|---|
(5 ideas, scored like `8/10`; see the `packaging` skill)

Pick: #N
Runner-up: #M (<why>)

## Narration (record as one paragraph)
One paragraph, **90–125 words (30–45 s)**. Owner's change, Nov 17, 2026: **hook first, island checkup
at the END.** In this order:
1. **Hook** (first sentence): the question + the frame ("How does a credit card work? Explained like you're 6.")
   or the format's hook in kid words. No island talk, no "hi", no intro.
2. **Explainer** (~65–85 words): ONE idea told with ONE kid picture, first-grade words, then "In grown-up
   words:" one real sourced number, then **one motivating
   line with a small step the viewer can take this week** (see "Level up" above).
3. **Island checkup** (1–2 short sentences, ~15–20 words) with facts only from town.json and
   `village/island-news.md`: the bird count or the biggest island news, plus **every item under
   "To announce"** (keep each to a few words; if there are many, pick the biggest and list the rest
   in the section plan as on-screen chips). E.g. "On our island… forty-nine birds, and the bird bath is almost done."
4. End with exactly these two sentences:
Follow and comment BIRD, and your name goes on a bird on our island. See you tomorrow for another island update!
"…" for pauses. Short sentences. Numbers spelled the way they're said ("one point one million").

## Section plan
| # | Narration | On screen |
|---|---|---|
| 0 | hook words… | what's drawn, the headline (black + red words), which word it lands on, what the pen line does |
(row 0 = the hook, then 2–5 rows for the explainer, then one for the island checkup, then one for the
end card with the "comment BIRD" box)
The "On screen" column follows the studio's **ink motion** style (owner, Nov 17, 2026): say which word
the headline letters land on, and what the pen line does in that row (circles / underlines / strikes in red /
becomes the drawing). In the island row, the pen line turns into a bird and flies into the island.

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
