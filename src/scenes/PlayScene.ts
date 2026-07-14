import Phaser from "phaser";
import {
  applyWarp,
  chaosRating,
  computeWarpTarget,
  createMissionState,
  guardActiveInTimeline,
  guardSeesPlayer,
  isStealthed,
  journeyMotto,
  LAUNCH_FUEL,
  MISSION_COINS,
  SHIP_FUEL_MAX,
  tickSuspicion,
  timelineHopCooldownRemainingMs,
  timelineDisplayName,
  toggleTimeline,
  tryCollectCoins,
  visibleCoins,
  warpCooldownRemainingMs,
} from "../sim/mission.js";
import type { MissionState } from "../sim/mission.js";
import {
  beginGhostReplay,
  createEchoRecorder,
  ghostPoseAt,
  recordEchoSample,
  type EchoRecorder,
  type GhostReplay,
} from "../sim/timeEcho.js";
import { getWarpAudio } from "../audio/warpAudio.js";
import {
  drawArenaFloor,
  drawBananaCoin,
  drawBananaPeel,
  drawDandyPatrol,
  drawGrooveCoin,
  drawGuard,
  drawMonkey,
  drawNutCoin,
  drawNutTruck,
  drawSharedShip,
  drawShipFuelBar,
  drawSuspicionBar,
  drawTimeEchoGhost,
} from "../render/shapes.js";
import { ARENA_MARGIN, GAME_HEIGHT, GAME_WIDTH } from "../game.js";

type Peel = { x: number; y: number; gfx: Phaser.GameObjects.Graphics; ttl: number };

type CoinGfx = { id: string; gfx: Phaser.GameObjects.Graphics; spin: number };

const PLAYER_SPEED = 180;
const GUARD_Y = 320;
const GUARD_X_MIN = 120;
const GUARD_X_MAX = 680;
const GUARD_SPEED = 90;

export class PlayScene extends Phaser.Scene {
  private floor!: Phaser.GameObjects.Graphics;
  private avatarGfx!: Phaser.GameObjects.Graphics;
  private ghostGfx!: Phaser.GameObjects.Graphics;
  private guardGfx!: Phaser.GameObjects.Graphics;
  private shipHudGfx!: Phaser.GameObjects.Graphics;
  private fuelBarGfx!: Phaser.GameObjects.Graphics;
  private suspicionGfx!: Phaser.GameObjects.Graphics;
  private coinGfx: CoinGfx[] = [];
  private peels: Peel[] = [];

  private hudObjective!: Phaser.GameObjects.Text;
  private hudHint!: Phaser.GameObjects.Text;
  private hudWarp!: Phaser.GameObjects.Text;
  private hudTimeline!: Phaser.GameObjects.Text;
  private hudMute!: Phaser.GameObjects.Text;

  private mission!: MissionState;
  private echoRecorder: EchoRecorder = createEchoRecorder();
  private ghostReplay: GhostReplay | null = null;
  private playerX = GAME_WIDTH / 2;
  private playerY = GAME_HEIGHT - 100;
  private guardX = GUARD_X_MIN;
  private guardDir = 1;
  private moveX = 0;
  private moveY = 0;
  private coinSpin = 0;
  private paused = false;
  private pauseOverlay!: Phaser.GameObjects.Text;

  private keys!: {
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    q: Phaser.Input.Keyboard.Key;
    t: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super("PlayScene");
  }

  create(): void {
    this.mission = createMissionState();
    if (typeof localStorage !== "undefined") {
      const savedFuel = localStorage.getItem("warp-patrol-crossover-fuel");
      let initialFuel = savedFuel ? Math.min(100, Math.max(0, parseInt(savedFuel, 10) || 0)) : 0;
      if (initialFuel >= LAUNCH_FUEL) {
        initialFuel = 0;
        localStorage.setItem("warp-patrol-crossover-fuel", "0");
        localStorage.removeItem("warp-patrol-destination");
      }
      this.mission.shipFuel = initialFuel;
    }
    this.peels = [];
    this.coinGfx = [];
    this.echoRecorder = createEchoRecorder();
    this.ghostReplay = null;
    this.playerX = GAME_WIDTH / 2;
    this.playerY = GAME_HEIGHT - 100;
    this.guardX = GUARD_X_MIN;
    this.guardDir = 1;

    this.floor = this.add.graphics();
    this.ghostGfx = this.add.graphics().setDepth(9);
    this.avatarGfx = this.add.graphics().setDepth(10);
    this.guardGfx = this.add.graphics().setDepth(5);
    this.shipHudGfx = this.add.graphics().setDepth(900);
    this.fuelBarGfx = this.add.graphics().setDepth(900);
    this.suspicionGfx = this.add.graphics().setDepth(900);

    this.hudObjective = this.add
      .text(16, 12, "", { fontFamily: "monospace", fontSize: "16px", color: "#ffd93d" })
      .setScrollFactor(0)
      .setDepth(1000);
    this.hudHint = this.add
      .text(16, 36, "", { fontFamily: "monospace", fontSize: "14px", color: "#fff8e7" })
      .setScrollFactor(0)
      .setDepth(1000);
    this.hudWarp = this.add
      .text(GAME_WIDTH - 16, 56, "", { fontFamily: "monospace", fontSize: "14px", color: "#7cfc7c" })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(1000);
    this.hudTimeline = this.add
      .text(GAME_WIDTH - 16, 12, "", { fontFamily: "monospace", fontSize: "14px", color: "#3ef0ff" })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(1000);
    this.hudMute = this.add
      .text(GAME_WIDTH - 16, GAME_HEIGHT - 16, "", { fontFamily: "monospace", fontSize: "13px", color: "#7a6a50" })
      .setOrigin(1, 1)
      .setScrollFactor(0)
      .setDepth(1000);

    const kb = this.input.keyboard!;
    this.keys = {
      w: kb.addKey("W"),
      a: kb.addKey("A"),
      s: kb.addKey("S"),
      d: kb.addKey("D"),
      q: kb.addKey("Q"),
      t: kb.addKey("T"),
      up: kb.addKey("UP"),
      down: kb.addKey("DOWN"),
      left: kb.addKey("LEFT"),
      right: kb.addKey("RIGHT"),
    };

    kb.on("keydown-Q", () => this.tryWarp());
    kb.on("keydown-T", () => this.tryTimelineHop());
    kb.on("keydown-M", () => this.toggleMute());
    kb.on("keydown-ESC", () => this.togglePause());

    this.pauseOverlay = this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        "PAUSED\nWASD move · Q warp · T timeline hop\nM mute · Esc resume",
        {
          fontFamily: "monospace",
          fontSize: "18px",
          color: "#fff8e7",
          align: "center",
          backgroundColor: "#000000aa",
          padding: { x: 16, y: 12 },
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(2000)
      .setVisible(false);

    this.rebuildCoinGraphics();
    this.redrawStatic();
    this.refreshHud();
  }

  update(_time: number, delta: number): void {
    if (this.paused) return;

    const now = this.time.now;
    const dtMs = delta;

    if (this.mission.phase !== "active") {
      this.finishMission();
      return;
    }

    this.readMovement();
    this.playerX = Phaser.Math.Clamp(
      this.playerX + this.moveX * PLAYER_SPEED * (dtMs / 1000),
      ARENA_MARGIN,
      GAME_WIDTH - ARENA_MARGIN
    );
    this.playerY = Phaser.Math.Clamp(
      this.playerY + this.moveY * PLAYER_SPEED * (dtMs / 1000),
      ARENA_MARGIN,
      GAME_HEIGHT - ARENA_MARGIN
    );

    if (guardActiveInTimeline(this.mission.timeline)) {
      this.guardX += this.guardDir * GUARD_SPEED * (dtMs / 1000);
      if (this.guardX >= GUARD_X_MAX) {
        this.guardX = GUARD_X_MAX;
        this.guardDir = -1;
      } else if (this.guardX <= GUARD_X_MIN) {
        this.guardX = GUARD_X_MIN;
        this.guardDir = 1;
      }
    }

    const player = { x: this.playerX, y: this.playerY };
    const guard = { x: this.guardX, y: GUARD_Y };
    const sees = guardSeesPlayer(guard, player, this.mission, now);
    this.mission = tickSuspicion(this.mission, sees, dtMs, now);

    const oldFuel = this.mission.shipFuel;
    this.mission = tryCollectCoins(this.mission, player);
    if (this.mission.shipFuel !== oldFuel) {
      getWarpAudio().playCoin();
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("warp-patrol-crossover-fuel", this.mission.shipFuel.toString());
        if (this.mission.phase === "launched" && this.mission.destination) {
          localStorage.setItem("warp-patrol-destination", this.mission.destination);
        }
      }
    }

    const stealth = isStealthed(this.mission, now);
    this.echoRecorder = recordEchoSample(
      this.echoRecorder,
      now,
      this.playerX,
      this.playerY,
      stealth
    );
    this.advanceGhost(now);

    if (this.mission.collectedCoins.length !== this.countVisibleCoinIds()) {
      this.rebuildCoinGraphics();
    }

    this.coinSpin += dtMs * 0.004;
    this.updatePeels(dtMs);
    this.redrawDynamic(sees, now);
    this.refreshHud(now);

    if (this.mission.phase !== "active") {
      this.finishMission();
    }
  }

  private countVisibleCoinIds(): number {
    return MISSION_COINS.filter((c) => !this.mission.collectedCoins.includes(c.id)).length;
  }

  private readMovement(): void {
    this.moveX = 0;
    this.moveY = 0;
    if (this.keys.a.isDown || this.keys.left.isDown) this.moveX -= 1;
    if (this.keys.d.isDown || this.keys.right.isDown) this.moveX += 1;
    if (this.keys.w.isDown || this.keys.up.isDown) this.moveY -= 1;
    if (this.keys.s.isDown || this.keys.down.isDown) this.moveY += 1;
    const len = Math.hypot(this.moveX, this.moveY);
    if (len > 0) {
      this.moveX /= len;
      this.moveY /= len;
    }
  }

  private tryWarp(): void {
    const now = this.time.now;
    if (this.mission.phase !== "active") return;
    const before = this.mission.warpCount;
    this.mission = applyWarp(this.mission, now);
    if (this.mission.warpCount === before) return;
    getWarpAudio().playWarp();

    const target = computeWarpTarget(
      { x: this.playerX, y: this.playerY },
      { x: this.moveX, y: this.moveY },
      { width: GAME_WIDTH, height: GAME_HEIGHT, margin: ARENA_MARGIN }
    );

    if (this.mission.timeline === "monkey") {
      this.spawnPeel(this.playerX, this.playerY);
    }
    this.playerX = target.x;
    this.playerY = target.y;
    const flashColor = this.mission.timeline === "dandy" ? [62, 240, 255] : [255, 217, 61];
    this.cameras.main.flash(80, flashColor[0], flashColor[1], flashColor[2], false, undefined, 0.18);
  }

  private tryTimelineHop(): void {
    const now = this.time.now;
    const before = this.mission.timeline;
    this.mission = toggleTimeline(this.mission, now);
    if (this.mission.timeline === before) return;
    getWarpAudio().playHop();

    // Dual-crew Time Echo: replay ~3s of the crew you just left.
    this.ghostReplay = beginGhostReplay(this.echoRecorder, before, now);
    this.echoRecorder = createEchoRecorder();
    this.echoRecorder = recordEchoSample(
      this.echoRecorder,
      now,
      this.playerX,
      this.playerY,
      isStealthed(this.mission, now)
    );

    this.rebuildCoinGraphics();
    this.redrawStatic();
    const tint = this.mission.timeline === "dandy" ? [255, 62, 181] : [255, 217, 61];
    this.cameras.main.flash(120, tint[0], tint[1], tint[2], false, undefined, 0.12);
  }

  private advanceGhost(now: number): void {
    if (!this.ghostReplay) {
      this.ghostGfx.clear();
      return;
    }
    const pose = ghostPoseAt(this.ghostReplay, now);
    if (pose.done) {
      this.ghostReplay = null;
      this.ghostGfx.clear();
      return;
    }
    drawTimeEchoGhost(
      this.ghostGfx,
      this.ghostReplay.crew,
      pose.x,
      pose.y,
      pose.stealth,
      pose.alpha
    );
  }

  private spawnPeel(x: number, y: number): void {
    const gfx = this.add.graphics().setDepth(2);
    drawBananaPeel(gfx, x, y);
    this.peels.push({ x, y, gfx, ttl: 8000 });
  }

  private updatePeels(dtMs: number): void {
    this.peels = this.peels.filter((peel) => {
      peel.ttl -= dtMs;
      if (peel.ttl <= 0) {
        peel.gfx.destroy();
        return false;
      }
      return true;
    });
  }

  private rebuildCoinGraphics(): void {
    this.coinGfx.forEach((c) => c.gfx.destroy());
    this.coinGfx = visibleCoins(this.mission).map((coin) => ({
      id: coin.id,
      gfx: this.add.graphics().setDepth(8),
      spin: Math.random() * Math.PI,
    }));
  }

  private redrawStatic(): void {
    drawArenaFloor(this.floor, GAME_WIDTH, GAME_HEIGHT, this.mission.timeline);
  }

  private redrawDynamic(sees: boolean, now: number): void {
    const stealth = isStealthed(this.mission, now);

    for (const entry of this.coinGfx) {
      const coin = MISSION_COINS.find((c) => c.id === entry.id);
      if (!coin) continue;
      if (coin.timeline === "monkey") {
        drawBananaCoin(entry.gfx, coin.x, coin.y, entry.spin + this.coinSpin);
      } else if (coin.timeline === "dandy") {
        drawGrooveCoin(entry.gfx, coin.x, coin.y, entry.spin + this.coinSpin);
      } else {
        drawNutCoin(entry.gfx, coin.x, coin.y, entry.spin + this.coinSpin);
      }
    }

    if (this.mission.timeline === "monkey") {
      drawMonkey(this.avatarGfx, this.playerX, this.playerY, stealth);
      drawGuard(this.guardGfx, this.guardX, GUARD_Y, this.mission.suspicion);
    } else if (this.mission.timeline === "dandy") {
      drawDandyPatrol(this.avatarGfx, this.playerX, this.playerY, stealth);
      this.guardGfx.clear();
    } else {
      drawNutTruck(this.avatarGfx, this.playerX, this.playerY, stealth);
      this.guardGfx.clear();
    }

    drawSharedShip(this.shipHudGfx, GAME_WIDTH / 2, 52, this.mission.shipFuel / SHIP_FUEL_MAX);
    drawShipFuelBar(this.fuelBarGfx, 200, GAME_HEIGHT - 44, GAME_WIDTH - 400, this.mission.shipFuel / SHIP_FUEL_MAX);
    drawSuspicionBar(this.suspicionGfx, 200, GAME_HEIGHT - 28, GAME_WIDTH - 400, this.mission.suspicion / 100);

    if (sees && !stealth) {
      this.cameras.main.shake(40, 0.002);
    }
  }

  private toggleMute(): void {
    getWarpAudio().toggleMute();
    this.refreshMuteHud();
  }

  private togglePause(): void {
    this.paused = !this.paused;
    this.pauseOverlay.setVisible(this.paused);
  }

  private refreshMuteHud(): void {
    const muted = getWarpAudio().isMuted();
    this.hudMute.setText(muted ? "M · MUTED" : "M · sound on");
    this.hudMute.setColor(muted ? "#ff6b6b" : "#7a6a50");
  }

  private refreshHud(now = this.time.now): void {
    const warpCd = warpCooldownRemainingMs(this.mission, now);
    const hopCd = timelineHopCooldownRemainingMs(this.mission, now);
    this.refreshMuteHud();
    this.hudWarp.setText(warpCd > 0 ? `Q WARP ${Math.ceil(warpCd / 1000)}s` : "Q WARP READY");
    this.hudTimeline.setText(
      hopCd > 0
        ? `T HOP ${Math.ceil(hopCd / 1000)}s · ${timelineDisplayName(this.mission.timeline)}`
        : `T HOP · ${timelineDisplayName(this.mission.timeline)}`
    );

    const remaining = MISSION_COINS.length - this.mission.collectedCoins.length;
    this.hudObjective.setText(
      `Ship fuel ${this.mission.shipFuel}/${LAUNCH_FUEL}  ·  ${journeyMotto()}`
    );
    const echoHint = this.ghostReplay ? " · TIME ECHO" : "";
    this.hudHint.setText(
      remaining > 0
        ? `${remaining} coins left — hop (T) for Time Echo; destination rolls at launch${echoHint}`
        : "Fuel critical — launching…"
    );
  }

  private finishMission(): void {
    this.scene.start("DebriefScene", {
      mission: this.mission,
      chaos: chaosRating(this.mission),
    });
  }
}
