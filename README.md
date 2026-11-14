# AI Club Town

A cartoon 3D island where six AI agents work to make money from short videos.
Each building lights up while its agent is working, and the bank shows real earnings
against the goal.

| Agent | Building | Job |
|---|---|---|
| Chief of Staff (`chief`) | Town Hall | Plans the day and hands out jobs |
| What If Studio (`whatif`) | Observatory | "What if…?" videos |
| How It Works (`howitworks`) | Gear factory | How-things-work videos |
| World News (`news`) | News tower | World news today, fact-checked |
| Programmer (`programmer`) | Workshop | Builds and renders the videos |
| Banker (`banker`) | Bank | Keeps the books |

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

## Update the town by hand

Everything the town shows comes from `town.json`. The page checks it every minute.

```json
{
  "day": 1,
  "goal": 1000,
  "balance": 12.40,
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
