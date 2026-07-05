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

| Item | Status | Action |
|------|--------|--------|
| **GitHub repo** | Done | https://github.com/subtiliorars-sys/warp-monkeys |
| **CI verify** | Green | `npm run verify` on push |
| **GitHub Pages** | Deploy may need retry | Repo → Settings → Pages → Source: GitHub Actions. If deploy fails, Settings → Environments → `github-pages` → approve if waiting. Re-run **deploy-pages** workflow. |
| **Butler wharf API key** | Not in agent shell | Fresh key: https://itch.io/user/settings/api-keys — fleet MM #148 noted old org secret was **invalid** |
| **Butler CLI** | Not installed here | Download https://itchio.itch.io/butler or use itch desktop app upload |
| **itch project (first time)** | Owner | Dashboard → Create → slug `jimmythehat-codemonkeys-warp-division` |
| **Cover art** | Draft in repo | `docs/itch-cover.png` — swap if desired |

I do **not** have your itch.io password or a working `BUTLER_API_KEY` in this session. MeniscusMaximus has a `BUTLER_API_KEY` secret, but it is not copied to `warp-monkeys` and may need rotation.

## Verify before announcing

```powershell
npm run verify
npm run package:itch
```

Open `dist/index.html` via `npm run preview` and complete one fuel run.
