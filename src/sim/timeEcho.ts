import type { Timeline } from "./mission.js";

/** How long of recent movement we keep / replay on a dual-crew switch. */
export const TIME_ECHO_MS = 3000;
/** Minimum spacing between recorded samples (ms). */
export const TIME_ECHO_SAMPLE_MS = 40;

export interface EchoSample {
  /** Absolute scene clock (ms). */
  t: number;
  x: number;
  y: number;
  stealth: boolean;
}

export interface EchoRecorder {
  samples: EchoSample[];
  lastSampleMs: number;
}

export interface GhostReplay {
  /** Samples with t relative to replay start (first sample ≈ 0). */
  samples: EchoSample[];
  /** Avatar of the crew left behind on the hop. */
  crew: Timeline;
  startedAtMs: number;
  durationMs: number;
}

export interface GhostPose {
  x: number;
  y: number;
  stealth: boolean;
  /** 0–1 draw alpha; fades near end of echo. */
  alpha: number;
  done: boolean;
}

export function createEchoRecorder(): EchoRecorder {
  return { samples: [], lastSampleMs: -Infinity };
}

export function recordEchoSample(
  recorder: EchoRecorder,
  nowMs: number,
  x: number,
  y: number,
  stealth: boolean
): EchoRecorder {
  if (nowMs - recorder.lastSampleMs < TIME_ECHO_SAMPLE_MS && recorder.samples.length > 0) {
    return pruneEcho(recorder, nowMs);
  }

  const samples = [...recorder.samples, { t: nowMs, x, y, stealth }];
  return pruneEcho({ samples, lastSampleMs: nowMs }, nowMs);
}

function pruneEcho(recorder: EchoRecorder, nowMs: number): EchoRecorder {
  const cutoff = nowMs - TIME_ECHO_MS;
  const samples = recorder.samples.filter((s) => s.t >= cutoff);
  return { ...recorder, samples };
}

/**
 * Snapshot the last ~3s of movement as a ghost replay for the crew just left.
 * Returns null if there is nothing meaningful to replay.
 */
export function beginGhostReplay(
  recorder: EchoRecorder,
  crew: Timeline,
  nowMs: number
): GhostReplay | null {
  const pruned = pruneEcho(recorder, nowMs);
  if (pruned.samples.length < 2) return null;

  const t0 = pruned.samples[0]!.t;
  const samples = pruned.samples.map((s) => ({
    ...s,
    t: s.t - t0,
  }));
  const durationMs = Math.min(TIME_ECHO_MS, samples[samples.length - 1]!.t);

  if (durationMs < TIME_ECHO_SAMPLE_MS) return null;

  return {
    samples,
    crew,
    startedAtMs: nowMs,
    durationMs,
  };
}

export function ghostPoseAt(ghost: GhostReplay, nowMs: number): GhostPose {
  const elapsed = nowMs - ghost.startedAtMs;
  if (elapsed >= ghost.durationMs || ghost.samples.length === 0) {
    const last = ghost.samples[ghost.samples.length - 1]!;
    return { x: last.x, y: last.y, stealth: last.stealth, alpha: 0, done: true };
  }

  const pose = interpolateSamples(ghost.samples, elapsed);
  const fadeStart = ghost.durationMs * 0.65;
  let alpha = 0.42;
  if (elapsed >= fadeStart) {
    const fadeT = (elapsed - fadeStart) / Math.max(1, ghost.durationMs - fadeStart);
    alpha = 0.42 * (1 - fadeT);
  }

  return { ...pose, alpha, done: false };
}

function interpolateSamples(
  samples: EchoSample[],
  elapsed: number
): { x: number; y: number; stealth: boolean } {
  if (elapsed <= samples[0]!.t) {
    const s = samples[0]!;
    return { x: s.x, y: s.y, stealth: s.stealth };
  }

  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1]!;
    const b = samples[i]!;
    if (elapsed <= b.t) {
      const span = Math.max(1, b.t - a.t);
      const u = (elapsed - a.t) / span;
      return {
        x: a.x + (b.x - a.x) * u,
        y: a.y + (b.y - a.y) * u,
        stealth: u < 0.5 ? a.stealth : b.stealth,
      };
    }
  }

  const last = samples[samples.length - 1]!;
  return { x: last.x, y: last.y, stealth: last.stealth };
}
