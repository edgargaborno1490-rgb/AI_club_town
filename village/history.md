# AI Club Town history

What happened, day by day. Moved out of CLAUDE.md on Nov 17, 2026 so every chat reads less;
CLAUDE.md keeps the rules. Add new days at the bottom.

## Followers over time (all four platforms)
| Date | YouTube | TikTok | Instagram | Facebook | Total |
|---|---|---|---|---|---|
| Nov 15, 2026 | 19 | 16 | 4 | 3 | 42 |
| Nov 16, 2026 | 20 | 17 | 4 | 3 | 44 |
| Nov 17, 2026 | 25 | 17 | 4 | 3 | 49 |

## Days
- **Nov 13–14, 2026:** town built, then turned into buckets; birds and the next-build plot added;
  the intro video ("Meet WhiteBucket and His AI Village") was made and posted on all four platforms.
- **Nov 15, 2026:** goal changed from $1,000 to 1,000 followers (four-platform race); the Analyst's
  building went up under wraps (the Secret Building); Birdhouses started (a YouTube viewer's comment).
- **Nov 16, 2026:** 44 followers (YouTube leads). The studio put a short island update (44 birds + the
  race) in front of the Leonids video. The follower card became swipeable; the first version didn't
  swipe on the owner's phone (old cached files + pointer events), fixed with touch events and `?v=`
  cache-busting (if it fails again, ask iPhone or Android and which browser). The owner likes the
  Kokoro voice Eric. Real Mark voice = owner's ElevenLabs recording only.
- **Nov 16, 2026 (later):** the owner shared a "top 5 Claude skills for YouTube" TikTok (Outliers,
  Packaging, Script, Retention, Comments → Ideas). Built **Packaging** and the weekly **Outliers**
  check; skipped the other three. Worked: frame contact sheets + faster-whisper; judging each skill
  against what the village already does. Didn't: faster-whisper with a file path (pass a numpy array);
  the creator hid the repo link ("comment FREE"), so we built our own; TubeAlfred Shorts+month search
  came back empty, generic finance searches skew Hindi; `main` moved during the chat (merge
  `origin/main` before pushing).
- The first scheduled run failed (a fresh session had no repo access); fixed by running in the
  owner's main chat.
- **Nov 17, 2026:** YouTube 25 (49 birds). Bird Bath started (viewer @dakotaboyd4809 asked "Where is
  the bird bath?" on the Nov 15 plane Short), Birdhouses finished (crew and ladder removed), wooden
  name signs replaced floating labels, **Aloha Island** became the look (Hawaii-time day/night),
  island checkup moved to the START of videos, `village/island-news.md` added, privacy rule (never
  show the island's address). Tried and dropped: a wood-print photo mockup and an indigo woodblock
  restyle. New skills: `island-change`, `island-preview`. Eric became the What If voice (was Puck).
  Scheduled run moved to 4:30 AM Hawaii (was 7:38).
- **Nov 17, 2026 (later), video style tests with the owner (studio):** a fast beat-cut opening was
  "too fast"; a calm **16:9** version (Eric 0.9 with pauses, typed text, soft transitions, our
  line-drawn objects) was liked and became the studio's `wide-video` skill, posted as an EXTRA
  (YouTube + TikTok "Full screen"); vertical dailies continue. Six music styles were tried (beat,
  piano, R&B piano, dark cinematic, hyperpop, house) and none fit: **videos are voice only from now
  on** (no music, no sound effects). Kokoro Eric mispronounces "Megalodon". TubeAlfred: 37 credits left.
- **Nov 17, 2026 (evening), shorter videos:** after looking at the numbers (AI Village intro 1,170 views and 20
  follows vs Leonids 169 and 1), the owner chose **30–45 s dailies (90–125 words)**: hook first, the island
  checkup moved back to the END (1–2 sentences), then a new line "Comment BIRD, and your name goes on a bird on
  our island." before "See you tomorrow…". `check-scripts.js` checks the length and both lines.
- **Nov 17, 2026 (night), ink motion:** the owner shared a music-only TikTok (letters flying in, a moving line,
  spotlight closes). The studio made a 10 s test in our paper-and-ink look (the voice is the beat) and a 6 s test where
  the pen line becomes a bird and flies into the island. Owner: "super nice, save this style… use it as a reference".
  It's the house style now (studio skill `ink-motion`, references `video/reference/InkTest.mp4` + `InkBirdTest.mp4`).
- **Nov 17, 2026 (late night):** no bucket guy in the videos (the pen line is the character); vertical stays the main
  shape (16:9 extra); **music is back**, but only free tracks the owner picks (YouTube Audio Library), synced to the
  voice and the pen line (studio `scripts/beats.py`).
- **Nov 19, 2026, "explain it like I'm 6"** (owner): every video now explains its money idea like the viewer is six
  ("How does a credit card work? Explained like you're 6"). Starts with the Nov 20 DRAFT. Minecraft was offered
  too; same day the owner chose: "I like the kid better, 6 years old", so always the 6-year-old.
- **Nov 19, 2026, the new setup** (owner: "for now, this will be our setup"):
  - **All money:** science (What If) paused. Four money formats that get views in money Shorts rotate by
    weekday (Mon comparison, Tue real price, Wed myth buster, Fri checklist, Sat takes turns); World
    News (Thu/Sun) became money news only. Why: research that day (TubeAlfred + web) showed
    comparisons ("Same $500/month, who's richer at 45?"), real-price breakdowns and myth-busting
    getting views on small channels, and checklists ("Do these 5 things...", 6.5M) lasting for years.
  - **George reads everything** (owner out of ElevenLabs tokens): no Mark, Eric or village host.
  - **Every video 16:9** (the calm `wide-video` style); the owner knows a wide video fills only about a
    third of the screen in the TikTok/Shorts feed and likes the look anyway.
  - **Level up:** every script motivates (facts, then one small step for this week; no hype).
  - **Ending is now "Follow and comment BIRD…"**: a viewer (@ImsuchaJosh) commented BIRD without
    following. We can't see follower lists, so the owner tells us who followed. New **trial bird**
    (`town.js bird trial`): tiny name for 24 h, then gone unless they follow (`bird keep`). Josh got the
    first one (until Nov 19, 2:32 PM Hawaii).
  - Outliers now runs two money searches (topic + format). TubeAlfred: 26 credits left. Its search
    returned nothing when filtered to "this week"; plain searches with `shorts: true` worked.
