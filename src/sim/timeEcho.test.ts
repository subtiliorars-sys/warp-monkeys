import { describe, expect, it } from "vitest";
import {
  TIME_ECHO_MS,
  TIME_ECHO_SAMPLE_MS,
  beginGhostReplay,
  createEchoRecorder,
  ghostPoseAt,
  recordEchoSample,
} from "./timeEcho.js";

describe("time echo", () => {
  it("records samples and prunes older than TIME_ECHO_MS", () => {
    let rec = createEchoRecorder();
    for (let t = 0; t <= 4000; t += TIME_ECHO_SAMPLE_MS) {
      rec = recordEchoSample(rec, t, t / 10, 100, false);
    }
    const oldest = rec.samples[0]!.t;
    expect(4000 - oldest).toBeLessThanOrEqual(TIME_ECHO_MS + TIME_ECHO_SAMPLE_MS);
    expect(rec.samples.length).toBeGreaterThan(10);
  });

  it("beginGhostReplay returns null with fewer than 2 samples", () => {
    let rec = createEchoRecorder();
    rec = recordEchoSample(rec, 0, 10, 20, false);
    expect(beginGhostReplay(rec, "monkey", 0)).toBeNull();
  });

  it("replays path after dual-crew switch snapshot", () => {
    let rec = createEchoRecorder();
    for (let t = 0; t <= 2000; t += TIME_ECHO_SAMPLE_MS) {
      rec = recordEchoSample(rec, t, 100 + t * 0.05, 200, false);
    }
    const ghost = beginGhostReplay(rec, "dandy", 2500);
    expect(ghost).not.toBeNull();
    expect(ghost!.crew).toBe("dandy");
    expect(ghost!.durationMs).toBeGreaterThan(1000);

    const mid = ghostPoseAt(ghost!, 2500 + ghost!.durationMs / 2);
    expect(mid.done).toBe(false);
    expect(mid.alpha).toBeGreaterThan(0);
    expect(mid.x).toBeGreaterThan(100);

    const end = ghostPoseAt(ghost!, 2500 + ghost!.durationMs + 1);
    expect(end.done).toBe(true);
    expect(end.alpha).toBe(0);
  });

  it("fades alpha near end of echo", () => {
    let rec = createEchoRecorder();
    for (let t = 0; t <= 3000; t += TIME_ECHO_SAMPLE_MS) {
      rec = recordEchoSample(rec, t, 50, 50 + t * 0.02, true);
    }
    const ghost = beginGhostReplay(rec, "monkey", 3000)!;
    const early = ghostPoseAt(ghost, 3000);
    const late = ghostPoseAt(ghost, 3000 + ghost.durationMs * 0.9);
    expect(early.alpha).toBeGreaterThan(late.alpha);
    expect(late.alpha).toBeGreaterThan(0);
  });
});
