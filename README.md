# CodeMonkeys: Warp Division

Meta fleet comedy — **Warp Monkeys** and **Space Dandies** hop timelines, collect coins, and fuel a shared ship. **It's the journey** — random destination every launch. Phaser 3 + TypeScript.

| Surface | URL |
|---------|-----|
| **Play** | https://subtiliorars-sys.github.io/warp-monkeys/ |
| **Playtest** | https://subtiliorars-sys.github.io/warp-monkeys/playtest.html |
| **itch.io** | https://subtiliorars.itch.io/jimmythehat-codemonkeys-warp-division |
| **Concept** | `agent-corps/concepts/WARP_MONKEYS.md` |

> Original characters — CodeMonkeys platform comedy offshoot, not TV IP.

## First session

See `docs/FIRST-SESSION.md` for first-run expectations.

## Commands

```powershell
npm install
npm run dev            # local play
npm run verify         # tsc + vitest + build + HTML check
npm run package:itch   # zip for itch.io HTML upload
npm run push:itch      # zip + butler (needs BUTLER_API_KEY + butler CLI)
```

Launch checklist: `docs/PUBLIC_LAUNCH.md` · itch copy-paste: `docs/ITCH_PASTE_READY.md`

## Controls

| Input | Action |
|-------|--------|
| WASD / arrows | Move (Chimp-7 or Groove Patrol avatar) |
| Q | Space warp within timeline |
| T | Timeline hop — Monkey HQ ↔ Dandy Neon (Time Echo ghost ~3s) |
| M | Toggle mute (persists in localStorage) |
| SPACE | Start / retry |

## Slice — shared fuel run

Collect **5 coins** to reach **75% ship fuel** and launch. Guard patrol active in Monkey HQ only. Press **T** to hop crews � a translucent **Time Echo** replays your last ~3s of movement as the crew you left behind.

## Waves

Autonomous worker reads `WAVES.md` — one wave = one PR, branch prefix `automation/wave-*`.

## Ethics

No dark patterns, no loot boxes, no FOMO timers. See `GOVERNANCE.md`.




## Shared asset libraries

**Agents:** do not invent colored-box placeholders when free art exists.
See [docs/ASSETS.md](docs/ASSETS.md) â†’ `game-visual-assets`, `game-audio-assets`, `game-3d-assets`.
