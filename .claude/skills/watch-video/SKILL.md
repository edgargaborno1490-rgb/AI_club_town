---
name: watch-video
description: Watch a video the owner uploads (a TikTok, a Reel, a tutorial) and judge honestly whether its idea, tool or "skill" would help WhiteBucket Explains or AI Club Town. Use when the owner shares an MP4 and asks "can you learn this", "will this help our channel", or "what is this video saying".
---

# Watch a video and judge it

Made Nov 16, 2026, after the owner shared a "top 5 Claude skills for YouTube" TikTok.
The owner wants a straight answer: what it is, what fits us, what doesn't, and why.

## 1. Watch it (frames + words)
Work in the scratchpad, never in a repo.
```bash
D=<scratchpad>/vid; mkdir -p $D; F="<uploaded .mp4>"
ffprobe -v error -show_entries format=duration:stream=width,height,codec_type -of compact "$F"
ffmpeg -v error -y -i "$F" -vf "fps=1/3,scale=360:-1,tile=4x3" $D/sheet%02d.jpg   # contact sheets
ffmpeg -v error -y -i "$F" -ac 1 -ar 16000 $D/a.wav
```
Look at every `sheet*.jpg` with Read (on-screen text often holds names, tables and links).
Transcribe with faster-whisper, passing a **numpy array, not the file path** (passing a
path crashed on Nov 16: `av.open() got an unexpected keyword argument 'metadata_errors'`;
the studio's `video/scripts/align.py` does it the same way):
```bash
cd $D && python3 -c "
import numpy as np, wave
from faster_whisper import WhisperModel
w=wave.open('a.wav'); a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
for x in WhisperModel('base',compute_type='int8').transcribe(a)[0]: print(f'[{x.start:.0f}s] {x.text}')"
```
Whisper mishears names (it wrote "clawed skills" for "Claude skills"): trust the frames.

## 2. Compare with what we already have
Before calling anything new, check what the village and studio already do: the skills in
`.claude/skills/` (and the studio's), the plugins in CLAUDE.md (TubeAlfred,
social-media-skills), and `village/stats.md` (our real numbers). Many "must-have" skills are
things a desk already does.

## 3. Judge each idea for OUR size
A table: what it does · fits us? (worth it / already have it / later / skip) · why.
Ask for each one:
- Does it help a channel with ~20 YouTube subscribers and ~45 followers in total **now**?
  (Retention graphs and comment mining need views and comments we don't have yet.)
- Does it need a login or account access? The village rule is numbers only, never logins.
- What does it cost? TubeAlfred calls use credits (comments 20+ each).
- Does it break a rule (DRAFT only, no clickbait, money = educational only, no reused footage)?
Be honest: "this repeats what we have" is a useful answer. Recommend at most 2 things to
build, then ask before building.

## 4. Don't chase hidden links
Creators often cut off the repo link and ask viewers to comment a word ("FREE") to get it.
Don't ask the owner to comment for it, and don't guess the link. Build our own version from
what the video shows; it can follow our rules exactly.

## 5. If the owner says build it
Add it as a village skill, wire it into `village-day` (and `tools/rotation.js` if it's
weekly), add a check or test where a mistake would be easy, and note it in CLAUDE.md.
Run `npm test` and the smoke test, merge `origin/main` first (it often moves during a chat),
then push to `main` and the sync branches.
