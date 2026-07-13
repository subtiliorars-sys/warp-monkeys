# Warp Monkeys — Wave Registry

One wave = one PR. Branch prefix: `automation/wave-*`. Verify: `npm run verify`.

## Pickup rules

1. Open automation PR exists → stop (wave in flight).
2. Else → first `pending`/`active` non-`blocked` wave below.
3. Never merge your own PR.

## Active queue

### Wave WM-W0 — Training heist vertical slice
**Status:** `done` (2026-07-05)  
**Shipped:** title → mission → debrief, warp, guard, vitest sim

### Wave WM-W1 — Monkeys × Dandies crossover fuel run
**Status:** `active` (2026-07-05)  
**Scope:**
- [x] Timeline hop (T) — Monkey HQ ↔ Dandy Neon
- [x] 5 coins → shared ship fuel bar (launch at 75%)
- [x] Random destination roll at launch (journey > waypoint)
- [x] Groove Patrol avatar in dandy lane
- [ ] GitHub repo + Pages deploy (owner)

### Wave WM-W2 — Time Echo
**Status:** `active` (2026-07-13)  
**Scope:**
- [x] Record ~3s ghost replay for dual-crew switches (T hop)
- [ ] Owner PR review / merge when asked

### Wave WM-W3 — Shared progress with space-dandy-game
**Status:** `done` (2026-07-13)  
- [x] Cross-repo localStorage fuel key
- [x] SD-W6 counterpart wave

### Wave WM-W4 — Fleet easter eggs
**Status:** `done` (2026-07-13)  
- [x] DMN nut-truck third timeline (asphalt road + hazelnut coins + nut-truck avatar)
- [x] Destination reveal (owner) -- Cancelled: destination is random; extend `RANDOM_DESTINATIONS` instead.

### Wave WM-W5 — Audio juice
**Status:** `done` (2026-07-13)  
- [x] Warp / hop / coin SFX stubs (`src/audio/warpAudio.ts`)

## Blocked (owner)

- GitHub org repo creation / Pages first deploy
- itch.io store page without owner copy review

## Completed

- **WM-W5** — Audio juice (procedural Web Audio stubs)
- **WM-W4** — DMN nut-truck third timeline (nuts crossover)
- **WM-W3** — cross-repo localStorage fuel key & SD-W6 companion
- **WM-W2** — Time Echo dual-crew ghost replay
- **WM-W1** — timeline hop + shared ship fuel mechanics
- **WM-W0** — Training heist vertical slice (bootstrap)
