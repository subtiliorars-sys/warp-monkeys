import Phaser from "phaser";
import type { MissionState } from "../sim/mission.js";
import { debriefLine, journeyMotto } from "../sim/mission.js";
import { drawArenaFloor } from "../render/shapes.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../game.js";

export class DebriefScene extends Phaser.Scene {
  private floor!: Phaser.GameObjects.Graphics;

  constructor() {
    super("DebriefScene");
  }

  create(data: { mission: MissionState; chaos: number }): void {
    const mission = data.mission;
    const chaos = data.chaos ?? 0;
    const won = mission.phase === "launched";

    this.floor = this.add.graphics();
    drawArenaFloor(this.floor, GAME_WIDTH, GAME_HEIGHT, won ? "dandy" : "monkey");

    const titleColor = won ? "#3ef0ff" : "#ff6b6b";
    const title = won ? "LAUNCHED — JOURNEY ONGOING" : "BUSTED";

    this.add
      .text(GAME_WIDTH / 2, 90, title, {
        fontFamily: "monospace",
        fontSize: "28px",
        color: titleColor,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 132, journeyMotto(), {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#ffd93d",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 200, debriefLine(mission), {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#fff8e7",
        align: "center",
        wordWrap: { width: 580 },
      })
      .setOrigin(0.5);

    const destLine = won && mission.destination ? `RNG plotted: ${mission.destination}` : "No launch — warps still count";

    const stats = [
      `Ship fuel: ${mission.shipFuel}%`,
      `Coins: ${mission.collectedCoins.length}/5`,
      `Timeline hops: ${mission.timelineHopCount}  ·  Warps: ${mission.warpCount}`,
      destLine,
    ].join("\n");

    this.add
      .text(GAME_WIDTH / 2, 330, stats, {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#b8a88a",
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 410, `Chaos rating: ${chaos}/100`, {
        fontFamily: "monospace",
        fontSize: "15px",
        color: "#7cfc7c",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 48, "click or SPACE — another journey", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffd93d",
      })
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-SPACE", () => this.scene.start("PlayScene"));
    this.input.once("pointerdown", () => this.scene.start("PlayScene"));
  }
}
