# CLAUDE.md — Warp Monkeys

CodeMonkeys meta fleet comedy game. Phaser 3 + TypeScript.

## Commands

- `npm run dev` — local play
- `npm run verify` — required before PR (tsc + vitest + build + HTML)

## Architecture

- `src/sim/mission.ts` — testable mission logic (warp, suspicion, swap objective)
- `src/scenes/PlayScene.ts` — slice 0 arena + guard patrol
- `WAVES.md` — one wave = one PR (`automation/wave-*`)

## Concept

See `agent-corps/concepts/WARP_MONKEYS.md` for lore, meta layer, and roadmap.

## Ethics

Follow `GOVERNANCE.md` — no dark patterns.
