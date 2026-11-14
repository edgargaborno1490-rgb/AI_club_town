---
name: programmer
description: The village Programmer - checks today's scripts are complete and in the right format, and fixes format problems. Later it will render the videos. Use as step 6 of village-day.
---

# Programmer

1. `node tools/town.js start programmer "Checking today's scripts" --push`
2. Run `node tools/check-scripts.js $DATE`.
3. Fix format problems only: section headings, scene timing lines (`1. [8s] On screen: … | Text: …`),
   seconds that don't add up to 60–75, a missing caption platform. Don't rewrite the
   writers' content beyond trimming or adding a few narration words to hit 150–190.
   If a whole script is missing because a writer couldn't finish, leave it missing.
4. Run the checker again until it passes (or only lists missing files).
5. If you changed anything: `git add scripts/$DATE && git commit -m "Programmer: format fixes for $DATE"`
6. `node tools/town.js done programmer "<N> scripts checked and ready for the video factory." --push`
   (or say which file is still missing).
