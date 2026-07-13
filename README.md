# CodeMonkeys: Warp Division

Meta fleet comedy â€” **Warp Monkeys** and **Space Dandies** hop timelines, collect coins, and fuel a shared ship. **It's the journey** â€” random destination every launch. Phaser 3 + TypeScript.

| Surface | URL |
|---------|-----|
| **Play** | https://subtiliorars-sys.github.io/warp-monkeys/ |
| **Playtest** | https://subtiliorars-sys.github.io/warp-monkeys/playtest.html |
| **itch.io** | https://subtiliorars.itch.io/jimmythehat-codemonkeys-warp-division |
| **Concept** | `agent-corps/concepts/WARP_MONKEYS.md` |

> Original characters â€” CodeMonkeys platform comedy offshoot, not TV IP.

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

Launch checklist: `docs/PUBLIC_LAUNCH.md` Â· itch copy-paste: `docs/ITCH_PASTE_READY.md`

## Controls

| Input | Action |
|-------|--------|
| WASD / arrows | Move (Chimp-7 or Groove Patrol avatar) |
| Q | Space warp within timeline |
| T | Timeline hop â€” Monkey HQ â†” Dandy Neon |
| SPACE | Start / retry |

## Slice â€” shared fuel run

Collect **5 coins** to reach **75% ship fuel** and launch. Guard patrol active in Monkey HQ only.

## Waves

Autonomous worker reads `WAVES.md` â€” one wave = one PR, branch prefix `automation/wave-*`.

## Ethics

No dark patterns, no loot boxes, no FOMO timers. See `GOVERNANCE.md`.


