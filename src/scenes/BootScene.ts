import Phaser from "phaser";
import { KENNEY_ASSET_PATHS, KENNEY_TEXTURES } from "../assets/kenney.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../game.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload(): void {
    this.load.image(KENNEY_TEXTURES.playerShip, KENNEY_ASSET_PATHS.playerShip);
    this.load.image(KENNEY_TEXTURES.enemyGuard, KENNEY_ASSET_PATHS.enemyGuard);
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#1a1408");
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, "TEMPORAL SHENANIGANS BUREAU", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#7cfc7c",
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, "loading warp coils…", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffd93d",
      })
      .setOrigin(0.5);
    this.time.delayedCall(500, () => this.scene.start("TitleScene"));
  }
}
