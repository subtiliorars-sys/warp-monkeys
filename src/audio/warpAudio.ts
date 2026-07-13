/** Procedural Web Audio stubs for warp-monkeys — no licensed assets. */

export const MUTE_STORAGE_KEY = "warp-monkeys-mute-v1";

export function loadMuted(raw: string | null): boolean {
  return raw === "1" || raw === "true";
}

export function readMutedFromStorage(getItem: (key: string) => string | null): boolean {
  return loadMuted(getItem(MUTE_STORAGE_KEY));
}

export function writeMutedToStorage(
  setItem: (key: string, value: string) => void,
  muted: boolean
): void {
  setItem(MUTE_STORAGE_KEY, muted ? "1" : "0");
}

type ToneSpec = {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
};

function beep(
  ctx: AudioContext,
  dest: GainNode,
  { freq, duration, type = "sine", gain = 0.08 }: ToneSpec,
  when = 0
): void {
  const t0 = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(dest);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Warp swoosh: fast frequency slide upward. */
export function scheduleWarpTone(ctx: AudioContext, dest: GainNode): void {
  const t0 = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(250, t0);
  osc.frequency.exponentialRampToValueAtTime(800, t0 + 0.15);
  
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(0.07, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
  
  osc.connect(g);
  g.connect(dest);
  osc.start(t0);
  osc.stop(t0 + 0.2);
}

/** Timeline hop: double rapid square-wave chirp. */
export function scheduleHopTone(ctx: AudioContext, dest: GainNode): void {
  beep(ctx, dest, { freq: 440, duration: 0.06, type: "square", gain: 0.04 }, 0);
  beep(ctx, dest, { freq: 554, duration: 0.08, type: "square", gain: 0.04 }, 0.04);
}

/** Collect coin chime: high pitch triangle sweep. */
export function scheduleCoinTone(ctx: AudioContext, dest: GainNode): void {
  beep(ctx, dest, { freq: 880, duration: 0.08, type: "triangle", gain: 0.06 }, 0);
  beep(ctx, dest, { freq: 1320, duration: 0.1, type: "triangle", gain: 0.05 }, 0.04);
}

export class WarpAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted: boolean;

  constructor(
    private readonly storage: {
      getItem: (key: string) => string | null;
      setItem: (key: string, value: string) => void;
    } = typeof localStorage !== "undefined"
      ? localStorage
      : { getItem: () => null, setItem: () => undefined }
  ) {
    this.muted = readMutedFromStorage((k) => this.storage.getItem(k));
  }

  isMuted(): boolean {
    return this.muted;
  }

  ensureStarted(): void {
    if (typeof AudioContext === "undefined" && typeof (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext === "undefined") {
      return;
    }
    const AC =
      globalThis.AudioContext ??
      (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!this.ctx) {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    writeMutedToStorage((k, v) => this.storage.setItem(k, v), muted);
    if (this.master) {
      this.master.gain.value = muted ? 0 : 1;
    }
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  playWarp(): void {
    this.ensureStarted();
    if (!this.ctx || !this.master || this.muted) return;
    scheduleWarpTone(this.ctx, this.master);
  }

  playHop(): void {
    this.ensureStarted();
    if (!this.ctx || !this.master || this.muted) return;
    scheduleHopTone(this.ctx, this.master);
  }

  playCoin(): void {
    this.ensureStarted();
    if (!this.ctx || !this.master || this.muted) return;
    scheduleCoinTone(this.ctx, this.master);
  }
}

let shared: WarpAudio | null = null;

export function getWarpAudio(): WarpAudio {
  if (!shared) shared = new WarpAudio();
  return shared;
}
