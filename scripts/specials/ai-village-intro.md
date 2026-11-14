> **Status: DRAFT – needs review.**

# WhiteBucket Explains: Meet WhiteBucket and His AI Village

Topic type: village
Format: 9:16 · paper line open and close, with a 3D tour of the real island in the middle · about 85–90 s · 221 words · voice: Village host (ElevenLabs, the owner picks and records it)
Post: as the channel's AI Village intro, before the first weekly update (AI Village · Week 1 drafts Sat Nov 21, posts Sun Nov 22)
Tone: warm, honest, a little playful. The bucket guy IS WhiteBucket (the owner), giving a tour of his island. Real numbers only; not a get-rich pitch.
Ending: no "Comment NEXT" on this one. It ends with "follow to become a bird" and asks viewers what to build on the island next.

## Narration (record as one paragraph)

Hi, I'm WhiteBucket… and this is my island. It's called AI Club Town, and every bucket here is an AI worker with one job. Come on, I'll show you around. The red bucket is my Chief of Staff. Every morning, it picks a brand-new topic. The purple one is What If, for the wild science questions. The orange bucket with the gears is How It Works, where we break down money and the things you use every day. The blue one is World News, and it checks every fact against two different sources. This one is the Programmer. It makes sure every script is ready to build. And the bucket full of gold? That's the Banker, keeping track of every dollar. When a worker is busy, its bucket glows. That's real work, not a loop. Then it's my turn. I read every script, and nothing gets made until I say yes. Now… see those birds? Each bird is one of you. Every follower becomes a bird on this island. Right now, there are ten. The goal is one thousand dollars. The bank says… zero. Every week, the island gets something new, and every Sunday I'll show you what we made and how much came in. So follow to become a bird… and comment what we should build on the island next.

## Section plan

| # | Narration | On screen |
|---|---|---|
| 0 | Hi, I'm WhiteBucket… and this is my island. | **Paper.** The 2D bucket guy waves from home position (bottom right). Headline "HI, I'M" (black) "WHITEBUCKET" (red). He hops to the middle and points at a white paper frame that opens on the 3D island, slowly turning; the frame grows to fill the screen (into the 3D tour). Label "as of nov 2026". |
| 1 | It's called AI Club Town… one job. Come on, I'll show you around. | **3D, full screen.** Wide aerial of the island (storyboard 1), slow turn, 10 birds circling. The camera drifts down to the plaza, where the 3D WhiteBucket stands by the fountain, waves at the camera, then turns and hop-walks up the red path. Paper label at the top: "AI CLUB TOWN · 6 AI WORKERS". |
| 2 | The red bucket… brand-new topic. The purple one… science questions. | **3D.** The camera follows him. Red bucket (storyboard 2): its label glows, the flag waves, the Chief's little worker waves back; label "CHIEF OF STAFF · picks the topic". He hops across to the purple bucket: telescope, orbiting planet, glowing "?"; label "WHAT IF · science". |
| 3 | The orange bucket with the gears… The blue one… two different sources. | **3D.** Orange bucket (storyboard 3): the gears spin; label "HOW IT WORKS · money + everyday things". Blue bucket: the globe spins, the antenna light blinks, "ON AIR" glows; label "WORLD NEWS · 2 sources per fact" (red "2"). |
| 4 | This one is the Programmer… And the bucket full of gold? … every dollar. | **3D.** Programmer (storyboard 4): 1s and 0s float up out of the bucket; label "PROGRAMMER · ready to build". Banker (storyboard 5): the big coin spins, WhiteBucket peeks over the rim at the gold; label "BANKER · every dollar". |
| 5 | When a worker is busy… not a loop. Then it's my turn… until I say yes. | **3D, then paper.** The camera rises to a high wide shot; the buckets light up one after another in the real order (Chief → today's writer → World News → Programmer → Banker), each with a speech bubble. Cut to paper: a script page with a red "DRAFT" stamp; the 2D bucket guy stamps "APPROVED". |
| 6 | Now… see those birds? … Right now, there are ten. | **3D.** WhiteBucket on the plaza points up; the camera tilts up and flies through the flock (storyboard 6). Paper counter: "10 FOLLOWERS = 10 BIRDS". One last bird flaps in and joins, with a small label "YOU?". |
| 7 | The goal… zero. Every week… Every Sunday… So follow to become a bird… build on the island next. | **Paper, 3D, paper.** Money bar "$0 of $1,000"; the bucket guy shrugs. Calendar "EVERY SUNDAY · WEEK 1, 2, 3…". Quick 3D shot: WhiteBucket cheers beside the empty plot with the "? NEXT BUILD" sign (storyboard 7). End card (paper): "FOLLOW = BECOME A BIRD", and the outlined comment box types "what should we build next?" while the bucket guy bounces up to it. |

## Build notes (for the studio)

- **One render, no screen recording.** Build the island inside Remotion (`@remotion/three` is already installed) by porting `AI_club_town/src/scene.js`: the same six buckets, labels, villagers, trees, water, clouds and birds. Drive every animation from `useCurrentFrame()` (see the note in `src/three/Scene.tsx`), never a clock, so every frame renders the same every time.
- **Add for the video:** a 3D WhiteBucket who matches the 2D bucket guy (plain dark body, no face, little arms, white bucket on his head with a dark band and handle, a bit taller than the little workers), hop-walking along the paths; and the empty "? NEXT BUILD" plot between the What If and How It Works paths.
- **Storyboard:** 7 reference frames made from the real island, in the studio at `video/public/ai-village-intro/storyboard/` (`1-island.jpg` … `7-next-build.jpg`, matching "storyboard 1–7" in the plan). Camera angles can change; the content and order of the shots shouldn't.
- **Every bucket glows** while it's introduced (status "working"), then goes back to "done". 10 birds, matching `town.json` `followers` on the day of recording.
- **Section times** come from the Whisper word timings, as usual. Captions: `LineCaption`, one line at a time, on a cream strip over the 3D shots.
- **Sound:** voice, plus quiet music (~0.1). No swishes or comic sounds.
- Check stills of every section (`scripts/stills.mjs`) before the full render.

## Fact notes

- Six AI workers, each a bucket with its job on it: Chief (red), What If (purple), How It Works (orange, gears), World News (blue), Programmer (code), Banker (gold): `AI_club_town/src/scene.js` and `.claude/skills/`, as of Nov 14, 2026.
- A new topic every morning on a rotation: `AI_club_town/tools/rotation.js`, as of Nov 14, 2026.
- News facts checked against two independent sources: `world-news-writer` skill, as of Nov 14, 2026.
- Buckets glow and show speech bubbles from the real `town.json` the workers update: `AI_club_town/src/app.js`, as of Nov 14, 2026.
- Every script starts as DRAFT; only the owner approves: studio `video/WORKFLOW.md`, as of Nov 14, 2026.
- One bird per follower: `town.json` `followers` = 10 (TikTok), as of Nov 14, 2026. **If the count has changed when you record, say the new number and update `town.json` (`node tools/town.js followers <n> --push`).**
- Goal $1,000, earned $0: `AI_club_town/town.json` and `village/ledger.csv`, as of Nov 14, 2026. Update the $0 if anything was earned before posting.
- "Every week the island gets something new": the owner picks one idea a week (from the comments) and has it added to the island; it's shown in that Sunday's update.

## Captions

- TikTok: Hi, I'm WhiteBucket 🪣 This is my AI island: 6 AI workers, one goal, and every follower becomes a bird 🐦 What should we build next? #ai #aiagents #buildinpublic #whitebucket #experiment
- Instagram: Meet WhiteBucket and his AI island 🏝️ Six AI workers, one goal: $1,000. Follow to become a bird on the island, and tell me what we should build next. #ai #aiagents #buildinpublic #whitebucket #creator
- Facebook: Hi, I'm WhiteBucket. I built a little AI island to help run my channel. Every follower becomes a bird, and every week the island gets something new. What should we build next? #ai #buildinpublic #whitebucket
- YouTube: "Meet WhiteBucket and His AI Village" · Six AI workers write my scripts, I approve every one, and every follower becomes a bird on the island. Comment what we should build next.
