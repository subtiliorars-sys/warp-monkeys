import { describe, expect, it } from "vitest";
import {
  applyWarp,
  canTimelineHop,
  createMissionState,
  FUEL_PER_COIN,
  guardSeesPlayer,
  isStealthed,
  LAUNCH_FUEL,
  MISSION_COINS,
  tickSuspicion,
  toggleTimeline,
  tryCollectCoins,
  WARP_COOLDOWN_MS,
  WARP_IFRAME_MS,
  rollRandomDestination,
  RANDOM_DESTINATIONS,
} from "./mission.js";

describe("mission sim", () => {
  it("warp respects cooldown and grants stealth window", () => {
    let state = createMissionState();
    state = applyWarp(state, 0);
    expect(state.warpCount).toBe(1);
    expect(isStealthed(state, 100)).toBe(true);
    expect(isStealthed(state, WARP_IFRAME_MS + 1)).toBe(false);
    expect(applyWarp(state, 500)).toEqual(state);
    expect(applyWarp(state, WARP_COOLDOWN_MS).warpCount).toBe(2);
  });

  it("timeline hop alternates lanes in a three-way cycle", () => {
    let state = createMissionState();
    expect(state.timeline).toBe("monkey");
    state = toggleTimeline(state, 0);
    expect(state.timeline).toBe("dandy");
    expect(state.timelineHopCount).toBe(1);
    expect(canTimelineHop(state, 100)).toBe(false);
    
    // Cycle to nuts
    state.lastTimelineHopMs = -Infinity; // reset cooldown for test
    state = toggleTimeline(state, 1000);
    expect(state.timeline).toBe("nuts");
    
    // Cycle back to monkey
    state.lastTimelineHopMs = -Infinity; // reset cooldown for test
    state = toggleTimeline(state, 2000);
    expect(state.timeline).toBe("monkey");
  });

  it("guard only sees player in monkey timeline", () => {
    const guard = { x: 100, y: 100 };
    const player = { x: 120, y: 110 };
    let state = createMissionState();
    expect(guardSeesPlayer(guard, player, state, 9999)).toBe(true);
    state = { ...state, timeline: "dandy" };
    expect(guardSeesPlayer(guard, player, state, 9999)).toBe(false);
  });

  it("coins fuel the ship and launch at threshold", () => {
    let state = createMissionState();
    for (const coin of MISSION_COINS) {
      state = { ...state, timeline: coin.timeline };
      state = tryCollectCoins(state, { x: coin.x, y: coin.y });
    }
    expect(state.shipFuel).toBeGreaterThanOrEqual(LAUNCH_FUEL);
    expect(state.phase).toBe("launched");
    expect(state.collectedCoins.length).toBe(5);
  });

  it("partial coins add fuel without launch", () => {
    const state = tryCollectCoins(createMissionState(), { x: 400, y: 140 });
    expect(state.shipFuel).toBe(FUEL_PER_COIN);
    expect(state.phase).toBe("active");
  });

  it("rolls a random destination at launch", () => {
    let state = createMissionState();
    for (const coin of MISSION_COINS) {
      state = { ...state, timeline: coin.timeline };
      state = tryCollectCoins(state, { x: coin.x, y: coin.y });
    }
    expect(state.destination).toBeTruthy();
    expect(state.phase).toBe("launched");
  });

  it("rollRandomDestination picks from catalog", () => {
    const dest = rollRandomDestination(() => 0);
    expect(RANDOM_DESTINATIONS).toContain(dest);
  });

  it("suspicion busts at max", () => {
    let state = createMissionState();
    for (let t = 0; t < 5000; t += 50) {
      state = tickSuspicion(state, true, 50, t);
    }
    expect(state.phase).toBe("busted");
  });
});
