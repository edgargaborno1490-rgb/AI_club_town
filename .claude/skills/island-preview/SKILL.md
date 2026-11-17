---
name: island-preview
description: Take screenshots of the AI Club Town island (phone or desktop, any Hawaii hour, close-ups of one spot) or mock up a new look for it without touching the live page - for checking a change before pushing, sending the owner a picture, or trying a style idea. Use for "show me", "preview", "what would it look like if...", "make a mockup".
---

# Island preview (learned Nov 17, 2026)

Chromium + Playwright are pre-installed (`require('playwright')`). Work in the scratchpad, never
in the repo, and never deploy a mockup.

## Plain screenshots of the real page
`NODE_PATH=$(npm root -g) node tests/smoke.js <out-dir>` saves desktop + phone shots of the
real page, demo, and Aloha at 12:00 and 21:00. For other hours, serve the repo folder with a tiny
`http.createServer` and open `/?hour=6.6` (morning), `12`, `18.3` (sunset), `21` (night);
`/?classic` = the old island. Click `#tuck` to hide the card. Phone = 390x844; screenshots for
the owner use `deviceScaleFactor: 2`. Wait ~3-4 s after load for the scene.
Sticking several shots side by side (PIL) works well for "through the day" pictures.

## Close-ups and mockups (scratch copy)
1. Copy `index.html styles.css src town.json vendor` to a scratch folder.
2. In the copy of `src/scene.js`, after `scene.add(sun);` add
   `root.__wb = { scene, camera, renderer, controls, sun };`, or `sed` the camera line
   (`camera.position.set(...)`, `controls.target.set(...)`, `controls.autoRotate = false`).
   Buckets sit at radius 13.5 at angles -90..210; plots at radius 7.6.
3. Inject a script with `page.addScriptTag` that changes materials/lights/CSS
   (`.panel,.tuck,#labels{display:none}` for a clean picture). Keep a shared helper file.

## What worked / what didn't (owner's taste)
- Liked: **Aloha Island** (palms, beach, volcano, torches, Hawaii-time day/night): became the look.
  Liked: wooden name signs instead of floating labels.
  Didn't like: a 3D WhiteBucket (dark figure) standing in the plaza: "too weird", removed. Keep him in the videos only.
- Didn't like: a flat "wood art print" photo mockup (he meant a woodblock print), and the
  indigo woodblock 3D restyle ("not good"): recoloring the 3D island doesn't give a hand-drawn
  feel. For a new look, show 2-3 quick options side by side and ask, before building.
- Fog: on phones the camera is far away; keep `fog.near` beyond ~110 or the island gets washed out.
- A shell edit with `$$` in a heredoc tripped the safety check; use the Edit tool for those.
