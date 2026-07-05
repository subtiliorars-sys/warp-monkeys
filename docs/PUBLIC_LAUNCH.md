# Public launch — CodeMonkeys: Warp Division

## Live surfaces

| Surface | Status | URL |
|---------|--------|-----|
| GitHub repo | push `main` | https://github.com/subtiliorars-sys/warp-monkeys |
| GitHub Pages (game) | Actions on push | https://subtiliorars-sys.github.io/warp-monkeys/ |
| GitHub Pages (playtest) | same deploy | https://subtiliorars-sys.github.io/warp-monkeys/playtest.html |
| itch.io | owner / Butler | https://subtiliorars.itch.io/jimmythehat-codemonkeys-warp-division |

## Enable GitHub Pages (one-time)

Repo → **Settings** → **Pages** → Source: **GitHub Actions**  
(or already set by `deploy-pages.yml` on first workflow run)

## itch.io

See `ITCH_PASTE_READY.md` and:

```powershell
npm run package:itch   # zip only
npm run push:itch      # zip + butler if BUTLER_API_KEY set
```

## What the owner must supply

| Item | Why |
|------|-----|
| **Butler wharf API key** | Not in agent shell; fleet GitHub secret was invalid per MM #148 |
| **Butler CLI on PATH** | Not installed on this machine |
| **itch project create** | First publish requires dashboard project (slug in ITCH_PASTE_READY) |
| **Cover approval** | `docs/itch-cover.png` — replace if you want different art |

I do **not** have your itch.io password or a working `BUTLER_API_KEY` in this session.

## Verify before announcing

```powershell
npm run verify
npm run package:itch
```

Open `dist/index.html` via `npm run preview` and complete one fuel run.
