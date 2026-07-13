export const WARP_COOLDOWN_MS = 1200;
export const WARP_IFRAME_MS = 350;
export const WARP_DISTANCE = 96;
export const TIMELINE_HOP_COOLDOWN_MS = 900;
export const SUSPICION_MAX = 100;
export const SUSPICION_RATE_PER_SEC = 28;
export const SUSPICION_DECAY_PER_SEC = 10;
export const COLLECT_RADIUS = 36;
export const GUARD_VISION_RADIUS = 110;
export const LAUNCH_FUEL = 75;
export const FUEL_PER_COIN = 15;
export const SHIP_FUEL_MAX = 100;

export type Timeline = "monkey" | "dandy" | "nuts";
export type MissionPhase = "active" | "launched" | "busted";

export interface CoinDef {
  id: string;
  timeline: Timeline;
  x: number;
  y: number;
}

/** Coins split across timelines — both crews feed the same ship. */
export const MISSION_COINS: CoinDef[] = [
  { id: "m1", timeline: "monkey", x: 400, y: 140 },
  { id: "m2", timeline: "monkey", x: 620, y: 420 },
  { id: "d1", timeline: "dandy", x: 180, y: 480 },
  { id: "d2", timeline: "dandy", x: 400, y: 380 },
  { id: "d3", timeline: "dandy", x: 660, y: 160 },
  { id: "n1", timeline: "nuts", x: 250, y: 220 },
  { id: "n2", timeline: "nuts", x: 550, y: 300 },
];

export interface MissionState {
  phase: MissionPhase;
  timeline: Timeline;
  suspicion: number;
  shipFuel: number;
  collectedCoins: string[];
  lastWarpMs: number;
  warpStealthUntilMs: number;
  lastTimelineHopMs: number;
  warpCount: number;
  timelineHopCount: number;
  /** Rolled at launch — random every run; the point is the journey. */
  destination: string | null;
}

export interface Vec2 {
  x: number;
  y: number;
}

export function createMissionState(): MissionState {
  return {
    phase: "active",
    timeline: "monkey",
    suspicion: 0,
    shipFuel: 0,
    collectedCoins: [],
    lastWarpMs: -Infinity,
    warpStealthUntilMs: 0,
    lastTimelineHopMs: -Infinity,
    warpCount: 0,
    timelineHopCount: 0,
    destination: null,
  };
}

export function canWarp(state: MissionState, nowMs: number): boolean {
  return state.phase === "active" && nowMs - state.lastWarpMs >= WARP_COOLDOWN_MS;
}

export function canTimelineHop(state: MissionState, nowMs: number): boolean {
  return state.phase === "active" && nowMs - state.lastTimelineHopMs >= TIMELINE_HOP_COOLDOWN_MS;
}

export function isStealthed(state: MissionState, nowMs: number): boolean {
  return nowMs < state.warpStealthUntilMs;
}

export function applyWarp(state: MissionState, nowMs: number): MissionState {
  if (!canWarp(state, nowMs)) return state;
  return {
    ...state,
    lastWarpMs: nowMs,
    warpStealthUntilMs: nowMs + WARP_IFRAME_MS,
    warpCount: state.warpCount + 1,
  };
}

export function toggleTimeline(state: MissionState, nowMs: number): MissionState {
  if (!canTimelineHop(state, nowMs)) return state;
  const nextTimeline = state.timeline === "monkey" ? "dandy" : state.timeline === "dandy" ? "nuts" : "monkey";
  return {
    ...state,
    timeline: nextTimeline,
    lastTimelineHopMs: nowMs,
    timelineHopCount: state.timelineHopCount + 1,
    suspicion: Math.max(0, state.suspicion - 8),
  };
}

export function warpCooldownRemainingMs(state: MissionState, nowMs: number): number {
  return Math.max(0, WARP_COOLDOWN_MS - (nowMs - state.lastWarpMs));
}

export function timelineHopCooldownRemainingMs(state: MissionState, nowMs: number): number {
  return Math.max(0, TIMELINE_HOP_COOLDOWN_MS - (nowMs - state.lastTimelineHopMs));
}

export function distance(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function guardActiveInTimeline(timeline: Timeline): boolean {
  return timeline === "monkey";
}

export function guardSeesPlayer(
  guard: Vec2,
  player: Vec2,
  state: MissionState,
  nowMs: number
): boolean {
  if (state.phase !== "active") return false;
  if (!guardActiveInTimeline(state.timeline)) return false;
  if (isStealthed(state, nowMs)) return false;
  return distance(guard, player) <= GUARD_VISION_RADIUS;
}

export function tickSuspicion(
  state: MissionState,
  seesPlayer: boolean,
  dtMs: number,
  _nowMs: number
): MissionState {
  if (state.phase !== "active") return state;

  let suspicion = state.suspicion;
  if (seesPlayer) {
    suspicion += (SUSPICION_RATE_PER_SEC * dtMs) / 1000;
  } else {
    const decay = state.timeline === "dandy" ? SUSPICION_DECAY_PER_SEC * 1.4 : SUSPICION_DECAY_PER_SEC;
    suspicion -= (decay * dtMs) / 1000;
  }
  suspicion = clamp(suspicion, 0, SUSPICION_MAX);

  if (suspicion >= SUSPICION_MAX) {
    return { ...state, suspicion, phase: "busted" };
  }
  return { ...state, suspicion };
}

export function coinsRemaining(state: MissionState): CoinDef[] {
  return MISSION_COINS.filter((c) => !state.collectedCoins.includes(c.id));
}

export function visibleCoins(state: MissionState): CoinDef[] {
  return coinsRemaining(state).filter((c) => c.timeline === state.timeline);
}

export function tryCollectCoins(state: MissionState, player: Vec2): MissionState {
  if (state.phase !== "active") return state;

  let next = state;
  for (const coin of visibleCoins(state)) {
    if (distance(player, coin) > COLLECT_RADIUS) continue;
    if (next.collectedCoins.includes(coin.id)) continue;
    next = {
      ...next,
      collectedCoins: [...next.collectedCoins, coin.id],
      shipFuel: clamp(next.shipFuel + FUEL_PER_COIN, 0, SHIP_FUEL_MAX),
    };
  }

  if (next.shipFuel >= LAUNCH_FUEL) {
    return {
      ...next,
      phase: "launched",
      destination: next.destination ?? rollRandomDestination(),
    };
  }
  return next;
}

export function chaosRating(state: MissionState): number {
  const warpBonus = Math.min(state.warpCount * 5 + state.timelineHopCount * 6, 35);
  const fuelBonus = state.phase === "launched" ? 35 : Math.floor(state.shipFuel * 0.25);
  const suspicionPenalty = Math.floor(state.suspicion * 0.25);
  return clamp(warpBonus + fuelBonus + 30 - suspicionPenalty, 0, 100);
}

export function debriefLine(state: MissionState): string {
  if (state.phase === "busted") {
    return "Timeline Security grounded the ship. The journey continues on foot.";
  }
  if (state.phase === "launched") {
    const where = state.destination ?? "somewhere";
    return `Ship launched toward ${where}. Doesn't matter where — you already warped ${state.warpCount} times and hopped ${state.timelineHopCount} timelines. That was the point.`;
  }
  return "Partial fuel load. Keep hopping — the destination is random anyway.";
}

/** Shown during play — journey over waypoint. */
export function journeyMotto(): string {
  return "It's the journey";
}

export const RANDOM_DESTINATIONS = [
  "the Nut Truck Nebula",
  "Spreadsheet Sector 7G",
  "a branch that never merged",
  "Groove Patrol Lost & Found",
  "the itch.io discover page",
  "Timeline Security break room",
  "a parking orbit near ???",
  "the second page of WAVES.md",
  "Banana Smoothie Prime",
  "wherever the RNG says",
] as const;

export function rollRandomDestination(random = Math.random): string {
  const idx = Math.floor(random() * RANDOM_DESTINATIONS.length);
  return RANDOM_DESTINATIONS[clamp(idx, 0, RANDOM_DESTINATIONS.length - 1)]!;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function computeWarpTarget(
  player: Vec2,
  dir: Vec2,
  bounds: { width: number; height: number; margin: number }
): Vec2 {
  const len = Math.hypot(dir.x, dir.y);
  const nx = len > 0.01 ? dir.x / len : 0;
  const ny = len > 0.01 ? dir.y / len : -1;
  return {
    x: clamp(player.x + nx * WARP_DISTANCE, bounds.margin, bounds.width - bounds.margin),
    y: clamp(player.y + ny * WARP_DISTANCE, bounds.margin, bounds.height - bounds.margin),
  };
}
