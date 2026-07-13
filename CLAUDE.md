# CLAUDE.md — Warp Monkeys

CodeMonkeys meta fleet comedy game. Phaser 3 + TypeScript.

## Commands

- `npm run dev` — local play
- `npm run verify` — required before PR (tsc + vitest + build + HTML)

## Architecture

- Scenes: Boot → Title → Play → Debrief
- `src/sim/mission.ts` — testable mission logic (warp, suspicion, coins, timeline hop)
- `src/sim/timeEcho.ts` — ~3s movement buffer + ghost replay on dual-crew T hop
- `src/scenes/PlayScene.ts` — arena + guard + Time Echo ghost
- `WAVES.md` — one wave = one PR (`automation/wave-*`)

## Concept

See `agent-corps/concepts/WARP_MONKEYS.md` for lore, meta layer, and roadmap.

## Ethics

Follow `GOVERNANCE.md` — no dark patterns.
