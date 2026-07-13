import Phaser from "phaser";
import { journeyMotto } from "../sim/mission.js";
import { getWarpAudio } from "../audio/warpAudio.js";
import { drawArenaFloor } from "../render/shapes.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../game.js";

export class TitleScene extends Phaser.Scene {
  private floor!: Phaser.GameObjects.Graphics;

  constructor() {
    super("TitleScene");
  }

  create(): void {
    this.floor = this.add.graphics();
    drawArenaFloor(this.floor, GAME_WIDTH, GAME_HEIGHT, "monkey");

    this.add
      .text(GAME_WIDTH / 2, 88, "CODEMONKEYS Ã— GROOVE PATROL", {
        fontFamily: "monospace",
        fontSize: "26px",
        color: "#ffd93d",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 128, "WARP DIVISION", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#3ef0ff",
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        210,
        "Warp Monkeys and Space Dandies hop timelines\nand collect coins for the shared ship.\n" +
          journeyMotto() +
          " â€” destination is random every launch.",
        {
          fontFamily: "monospace",
          fontSize: "17px",
          color: "#fff8e7",
          align: "center",
        }
      )
      .setOrigin(0.5);

    const savedFuel = typeof localStorage !== "undefined" ? localStorage.getItem("warp-patrol-crossover-fuel") : null;
    const crossoverFuel = savedFuel ? parseInt(savedFuel, 10) || 0 : 0;
    const lastDest = typeof localStorage !== "undefined" ? localStorage.getItem("warp-patrol-destination") : null;

    let crossoverText = `Shared Ship Fuel: ${crossoverFuel}%`;
    if (crossoverFuel >= 75) {
      crossoverText = "Shared Ship Status: READY FOR LAUNCH!";
      if (lastDest) {
        crossoverText = `Launched to: ${lastDest}!`;
      }
    }

    this.add
      .text(GAME_WIDTH / 2, 276, crossoverText, {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#3ef0ff",
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        320,
        "WASD move  Â·  Q space-warp  Â·  T timeline hop (Time Echo)\nM mute  Â·  click or SPACE to start",
        {
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#b8a88a",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 40, "fan homage â€” original characters Â· fleet crossover", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#7a6a50",
      })
      .setOrigin(0.5);

    this.input.keyboard?.on("keydown-M", () => getWarpAudio().toggleMute());
    this.input.keyboard?.once("keydown-SPACE", () => this.startMission());
    this.input.once("pointerdown", () => this.startMission());
  }

  private startMission(): void {
    this.scene.start("PlayScene");
  }
}
