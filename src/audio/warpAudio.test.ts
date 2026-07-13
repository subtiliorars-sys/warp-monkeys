import { describe, expect, it } from "vitest";
import { loadMuted, readMutedFromStorage, writeMutedToStorage } from "./warpAudio.js";

describe("mute persistence", () => {
  it("treats missing as unmuted", () => {
    expect(loadMuted(null)).toBe(false);
    expect(loadMuted("0")).toBe(false);
  });

  it("reads true flags", () => {
    expect(loadMuted("1")).toBe(true);
    expect(loadMuted("true")).toBe(true);
  });

  it("round-trips through storage adapters", () => {
    const bag = new Map<string, string>();
    writeMutedToStorage((k, v) => bag.set(k, v), true);
    expect(readMutedFromStorage((k) => bag.get(k) ?? null)).toBe(true);
    writeMutedToStorage((k, v) => bag.set(k, v), false);
    expect(readMutedFromStorage((k) => bag.get(k) ?? null)).toBe(false);
  });
});
