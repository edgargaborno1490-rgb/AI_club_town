# AI Club Town

A cartoon 3D island where six AI agents work to make money from short videos.
Every building is a white bucket with its job on it (WhiteBucket's village). A bucket's
label glows while its agent is working, and the money card shows real earnings against
the goal. Birds circle the island, one for each TikTok follower, and an empty "? NEXT BUILD" plot
waits for the next thing the followers pick.

| Agent | Building | Job |
|---|---|---|
| Chief of Staff (`chief`) | Red bucket with a star and a flag | Plans the day and hands out jobs |
| What If Studio (`whatif`) | Purple bucket with a "?" and a telescope | "What if…?" videos |
| How It Works (`howitworks`) | Orange bucket with turning gears | How-things-work videos |
| World News (`news`) | Blue "NEWS · ON AIR" bucket with a globe and antenna | World news today, fact-checked |
| Programmer (`programmer`) | Dark code bucket with 1s and 0s floating out | Builds and renders the videos |
| Banker (`banker`) | Green "$" bucket full of gold coins | Keeps the books |

## See it

- **Real town:** open `index.html` through a web server (or the GitHub Pages link below).
- **Demo for filming:** add `?demo` to the end of the link. It plays a sample day and
  is always labeled "Example data".

## Put it online (free, GitHub Pages)

1. On a free GitHub account, Pages needs the repository to be **public**
   (Settings → General → Danger Zone → Change visibility).
2. Settings → Pages → Build and deployment → Source: **Deploy from a branch**.
3. Pick the branch with this code and the `/ (root)` folder, then Save.
4. After a minute, GitHub shows your link, like `https://<your-name>.github.io/AI_club_town/`.

## Followers (the birds)

Each TikTok follower is a bird over the island (up to 60 birds fly; the card always shows
the real number). When you get more followers, tell any Claude chat on this repo
"I have 25 followers now", or run:

```bash
node tools/town.js followers 25 --push
```

## Update the town by hand

Everything the town shows comes from `town.json`. The page checks it every minute.

```json
{
  "day": 1,
  "goal": 1000,
  "balance": 12.40,
  "followers": 10,
  "updated": "2026-11-14T18:00:00Z",
  "agents": {
    "whatif": {"status": "working", "task": "Writing: What if the Moon disappeared?"}
  },
  "log": [
    {"time": "18:00", "text": "Banker logged $12.40 from yesterday's videos."}
  ]
}
```

- `status` is one of `idle`, `working`, `done`. Anything else counts as `idle`.
- Agents left out show as `idle`. Unknown agent names are ignored.
- `log` is oldest first; the town shows the newest 20.
- `updated` is the time of the change in UTC. The page shows "Updated 5 min ago".
- If the file is missing or broken, the town shows everyone idle with
  "No activity data yet". It never makes up activity.

Later, the agents' scheduled runs will edit this file for you.

## Run the tests

```bash
npm test               # data logic
node tests/smoke.js    # opens the page in a headless browser (needs Playwright)
```
