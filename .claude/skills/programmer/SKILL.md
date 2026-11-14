---
name: programmer
description: The village Programmer - checks today's DRAFT script matches the WhiteBucket Explains studio format and fixes format problems so the studio's editor can build it. Use as step 5 of village-day.
---

# Programmer

1. `node tools/town.js start programmer "Checking today's script" --push`
2. Run `node tools/check-scripts.js $DATE`.
3. Fix format problems only: the Status line, title line, `Topic type:`, section headings,
   the section-plan table, a missing caption platform, the exact ending line. Don't
   rewrite the content beyond trimming or adding a few words to land at 180–200.
   If the script is missing because the writer couldn't finish, leave it missing.
4. Run the checker again until it passes.
5. If you changed anything: `git add scripts/$DATE && git commit -m "Programmer: format fixes for $DATE"`
6. `node tools/town.js done programmer "Script checked, ready for the owner's OK." --push`
   (or say it's missing).
