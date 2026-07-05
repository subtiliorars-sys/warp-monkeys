# itch.io — CodeMonkeys: Warp Division (copy-paste ready)

*First publish: create project once, then `npm run push:itch` or manual zip upload.*

---

## Project settings

| Field | Value |
|-------|-------|
| **Title** | CodeMonkeys: Warp Division |
| **URL slug** | `jimmythehat-codemonkeys-warp-division` |
| **Full URL** | https://subtiliorars.itch.io/jimmythehat-codemonkeys-warp-division |
| **Developer name** | JimmyTheHat |
| **Kind** | HTML |
| **Main file** | `index.html` |
| **Viewport** | **800 × 600** |
| **Price** | **Free** or PWYW $0+ |
| **Tags** | arcade, browser, comedy, sci-fi, singleplayer, short, casual, retro |

---

## Short description

> Warp Monkeys and Space Dandies hop timelines, collect coins, fuel a shared ship. Random destination every launch — it's the journey. Browser play, no install.

---

## Full description

```
CODEMONKEYS: WARP DIVISION · JIMMYTHEHAT

Meta fleet comedy crossover. Play as Unit Chimp-7 or the Groove Patrol avatar —
timeline-hop (T) between Monkey HQ and Dandy Neon, space-warp (Q), scoop coins,
and fill the shared hull. Launch at 75% fuel; nav rolls a random waypoint because
it's the journey that matters.

WHAT YOU GET (v1.0)
• Title → fuel run → launch debrief loop in the browser
• Timeline hop + space warp + guard patrol
• Random destination catalog on every successful launch
• Playtest hub at playtest.html

NOTES
Original characters — CodeMonkeys platform comedy offshoot, not TV IP.
Space Dandy lane is fan homage (same as Groove Patrol game).

Also in the fleet: Groove Patrol, Driving Me Nuts, Yes Man, Men Eat Peanut Butter.
```

---

## Package & upload

```powershell
cd C:\Users\hrmread\warp-monkeys
npm run package:itch
```

Upload `release/warp-monkeys-browser-v1.0.0.zip` → **Uploads** → check **This file will be played in the browser**.

Cover art: `docs/itch-cover.png` (630×500).

---

## Butler (automated push)

1. Install Butler: https://itch.io/docs/butler/ (add to PATH)
2. Create API key (wharf): https://itch.io/user/settings/api-keys
3. **First time only:** create empty itch project with slug above (Dashboard → Create new project)
4. Push:

```powershell
$env:BUTLER_API_KEY = "<your wharf key — do not commit>"
npm run push:itch
```

Or GitHub Actions secret `BUTLER_API_KEY` on `warp-monkeys` repo (for CI later).

Target: `subtiliorars/jimmythehat-codemonkeys-warp-division:html`

---

## After publish

1. **Classification** → general audience
2. **Embed** → allow on external sites
3. **External links** → GitHub Pages play URL
4. Upload 1–3 screenshots (title screen, both timelines, launch debrief)
5. Publish (visibility: public)

---

## Owner checklist (one-time)

- [ ] itch project created with slug `jimmythehat-codemonkeys-warp-division`
- [ ] Zip uploaded or Butler push succeeded
- [ ] Cover + at least one screenshot
- [ ] GitHub Pages live (see `PUBLIC_LAUNCH.md`)
