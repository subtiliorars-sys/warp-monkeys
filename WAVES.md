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
**Status:** `pending`  
- [ ] Record 3s ghost replay for dual-crew switches

### Wave WM-W3 — Shared progress with space-dandy-game
**Status:** `pending`  
- [ ] Cross-repo localStorage fuel key
- [ ] SD-W6 counterpart wave

### Wave WM-W4 — Fleet easter eggs
**Status:** `pending`  
- [ ] DMN nut-truck third timeline
- [ ] Destination reveal (owner)

**Cancelled:** destination is random; extend `RANDOM_DESTINATIONS` instead.

### Wave WM-W5 — Audio juice
**Status:** `pending`  
- [ ] Warp / hop / coin SFX stubs

## Blocked (owner)

- GitHub org repo creation / Pages first deploy
- itch.io store page without owner copy review

## Completed

- *(none yet — W0 landing)*
