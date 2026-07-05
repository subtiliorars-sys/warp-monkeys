# CodeMonkeys: Warp Division

Meta fleet comedy — **Warp Monkeys** and **Space Dandies** hop timelines, collect coins, and fuel a shared ship. **It's the journey** — random destination every launch. Phaser 3 + TypeScript.

| Surface | URL |
|---------|-----|
| **Play** | https://subtiliorars-sys.github.io/warp-monkeys/ |
| **Playtest** | https://subtiliorars-sys.github.io/warp-monkeys/playtest.html |
| **itch.io** | https://subtiliorars.itch.io/jimmythehat-codemonkeys-warp-division |
| **Concept** | `agent-corps/concepts/WARP_MONKEYS.md` |

> Original characters — CodeMonkeys platform comedy offshoot, not TV IP.

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
| T | Timeline hop — Monkey HQ ↔ Dandy Neon |
| SPACE | Start / retry |

## Slice — shared fuel run

Collect **5 coins** to reach **75% ship fuel** and launch. Guard patrol active in Monkey HQ only.

## Waves

Autonomous worker reads `WAVES.md` — one wave = one PR, branch prefix `automation/wave-*`.

## Ethics

No dark patterns, no loot boxes, no FOMO timers. See `GOVERNANCE.md`.
