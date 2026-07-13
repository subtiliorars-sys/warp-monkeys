import Phaser from "phaser";
import type { Timeline } from "../sim/mission.js";

const BANANA = 0xffd93d;
const TERMINAL = 0x7cfc7c;
const PEEL = 0xfff066;
const GUARD = 0xff6b6b;
const NEON_PINK = 0xff3eb5;
const NEON_CYAN = 0x3ef0ff;

export function drawArenaFloor(
  g: Phaser.GameObjects.Graphics,
  w: number,
  h: number,
  timeline: Timeline
): void {
  g.clear();
  const floor = timeline === "monkey" ? 0x2a2218 : timeline === "dandy" ? 0x070010 : 0x242426;
  const wall = timeline === "monkey" ? 0x4a3728 : timeline === "dandy" ? 0x3a1060 : 0xfecb00;
  const grid = timeline === "monkey" ? 0x4a3728 : timeline === "dandy" ? 0x2a0848 : 0x3d3d40;

  g.fillStyle(floor, 1);
  g.fillRect(0, 0, w, h);
  g.lineStyle(2, wall, 0.85);
  g.strokeRect(24, 24, w - 48, h - 48);

  if (timeline === "nuts") {
    // Draw road markings (double yellow lines in center, and white lanes)
    g.lineStyle(2, 0xfecb00, 0.8);
    g.lineBetween(40, h / 2 - 3, w - 40, h / 2 - 3);
    g.lineBetween(40, h / 2 + 3, w - 40, h / 2 + 3);
    
    g.lineStyle(1, 0xffffff, 0.5);
    for (let x = 60; x < w - 60; x += 40) {
      g.lineBetween(x, h / 4, x + 20, h / 4);
      g.lineBetween(x, (3 * h) / 4, x + 20, (3 * h) / 4);
    }
  } else {
    g.lineStyle(1, grid, timeline === "dandy" ? 0.55 : 0.35);
    for (let x = 40; x < w; x += 40) {
      g.lineBetween(x, 40, x, h - 40);
    }
    for (let y = 40; y < h; y += 40) {
      g.lineBetween(40, y, w - 40, y);
    }
  }

  if (timeline === "dandy") {
    g.lineStyle(1, NEON_CYAN, 0.25);
    g.strokeRect(80, 80, w - 160, h - 160);
  }
}

export function drawBananaCoin(g: Phaser.GameObjects.Graphics, x: number, y: number, spin: number): void {
  g.clear();
  g.fillStyle(BANANA, 1);
  g.fillCircle(x, y, 11);
  g.fillStyle(0xffec8b, 0.9);
  g.fillCircle(x + Math.cos(spin) * 2, y + Math.sin(spin) * 2, 5);
}

export function drawGrooveCoin(g: Phaser.GameObjects.Graphics, x: number, y: number, spin: number): void {
  g.clear();
  g.lineStyle(2, NEON_CYAN, 1);
  g.strokeCircle(x, y, 12);
  g.fillStyle(NEON_PINK, 0.85);
  g.fillCircle(x, y, 7);
  g.fillStyle(NEON_CYAN, 0.6);
  g.fillCircle(x + Math.cos(spin * 2) * 3, y + Math.sin(spin * 2) * 3, 3);
}

export function drawNutCoin(g: Phaser.GameObjects.Graphics, x: number, y: number, spin: number): void {
  g.clear();
  // Hazelnut shell base
  g.fillStyle(0x8b5a2b, 1);
  g.fillCircle(x, y + 2, 10);
  
  // Nut cap (hat)
  g.fillStyle(0xcd853f, 1);
  g.beginPath();
  g.arc(x, y - 1, 10, Math.PI, 0, false);
  g.fillPath();

  // Little tip on the bottom
  g.fillStyle(0x5c3a21, 1);
  g.fillTriangle(x, y + 14, x - 3, y + 9, x + 3, y + 9);
}

export function drawMonkey(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  stealth: boolean,
  alphaMul = 1
): void {
  g.clear();
  const alpha = (stealth ? 0.45 : 1) * alphaMul;
  if (alpha <= 0.01) return;
  g.fillStyle(BANANA, alpha);
  g.fillCircle(x, y, 14);
  g.fillStyle(0x8b6914, alpha);
  g.fillCircle(x - 10, y - 6, 6);
  g.fillCircle(x + 10, y - 6, 6);
  g.fillStyle(0x3d2914, alpha);
  g.fillCircle(x - 4, y - 2, 2);
  g.fillCircle(x + 4, y - 2, 2);
  g.lineStyle(2, 0x3d2914, alpha);
  g.beginPath();
  g.arc(x, y + 6, 5, 0, Math.PI, false);
  g.strokePath();
}

export function drawDandyPatrol(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  stealth: boolean,
  alphaMul = 1
): void {
  g.clear();
  const alpha = (stealth ? 0.45 : 1) * alphaMul;
  if (alpha <= 0.01) return;
  g.fillStyle(NEON_PINK, alpha);
  g.fillTriangle(x, y - 16, x - 14, y + 12, x + 14, y + 12);
  g.fillStyle(NEON_CYAN, alpha);
  g.fillRect(x - 6, y + 4, 12, 8);
  g.lineStyle(2, 0xffffff, alpha * 0.5);
  g.strokeTriangle(x, y - 16, x - 14, y + 12, x + 14, y + 12);
}

export function drawNutTruck(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  stealth: boolean,
  alphaMul = 1
): void {
  g.clear();
  const alpha = (stealth ? 0.45 : 1) * alphaMul;
  if (alpha <= 0.01) return;

  // Truck body (green/teal)
  g.fillStyle(0x20b2aa, alpha);
  g.fillRect(x - 16, y - 12, 24, 18);
  
  // Cabin (front, facing right)
  g.fillStyle(0x1e88e5, alpha);
  g.fillRect(x + 8, y - 6, 10, 12);
  
  // Cabin window
  g.fillStyle(NEON_CYAN, alpha);
  g.fillRect(x + 10, y - 4, 6, 5);

  // Wheels
  g.fillStyle(0x333333, alpha);
  g.fillCircle(x - 10, y + 8, 5);
  g.fillCircle(x + 10, y + 8, 5);
  
  // Giant nut logo on cargo side (orange circle with brown cap)
  g.fillStyle(0xcd853f, alpha);
  g.fillCircle(x - 4, y - 3, 5);
  g.fillStyle(0x8b5a2b, alpha);
  g.fillCircle(x - 4, y - 5, 4);
}

/** Translucent afterimage of the crew left behind on a timeline hop. */
export function drawTimeEchoGhost(
  g: Phaser.GameObjects.Graphics,
  crew: Timeline,
  x: number,
  y: number,
  stealth: boolean,
  alpha: number
): void {
  if (crew === "monkey") {
    drawMonkey(g, x, y, stealth, alpha);
  } else if (crew === "dandy") {
    drawDandyPatrol(g, x, y, stealth, alpha);
  } else {
    drawNutTruck(g, x, y, stealth, alpha);
  }
}

export function drawGuard(g: Phaser.GameObjects.Graphics, x: number, y: number, alert: number): void {
  g.clear();
  const pulse = 0.4 + alert * 0.006;
  g.lineStyle(2, GUARD, pulse);
  g.strokeCircle(x, y, 14);
  g.fillStyle(GUARD, 1);
  g.fillRect(x - 10, y - 8, 20, 24);
  g.fillStyle(0xffffff, 1);
  g.fillRect(x - 6, y - 14, 12, 8);
}

export function drawBananaPeel(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  g.clear();
  g.fillStyle(PEEL, 0.85);
  g.fillEllipse(x, y, 18, 10);
  g.lineStyle(1, 0xc4a035, 0.8);
  g.strokeEllipse(x, y, 18, 10);
}

export function drawShipFuelBar(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  ratio: number
): void {
  g.clear();
  g.fillStyle(0x000000, 0.45);
  g.fillRect(x, y, w, 12);
  g.fillStyle(NEON_CYAN, 0.95);
  g.fillRect(x, y, w * ratio, 12);
  g.lineStyle(1, BANANA, 0.9);
  g.strokeRect(x, y, w, 12);
}

export function drawSuspicionBar(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  ratio: number
): void {
  g.clear();
  g.fillStyle(0x000000, 0.4);
  g.fillRect(x, y, w, 10);
  const color = ratio > 0.75 ? 0xff4444 : ratio > 0.4 ? 0xffaa44 : TERMINAL;
  g.fillStyle(color, 0.95);
  g.fillRect(x, y, w * ratio, 10);
  g.lineStyle(1, 0x4a3728, 1);
  g.strokeRect(x, y, w, 10);
}

export function drawSharedShip(g: Phaser.GameObjects.Graphics, x: number, y: number, fuelRatio: number): void {
  g.clear();
  g.fillStyle(0x1a1408, 0.9);
  g.fillRoundedRect(x - 42, y - 18, 84, 36, 4);
  g.lineStyle(2, BANANA, 0.8);
  g.strokeRoundedRect(x - 42, y - 18, 84, 36, 4);
  g.fillStyle(NEON_PINK, 1);
  g.fillTriangle(x - 20, y, x - 36, y + 10, x - 36, y - 10);
  g.fillStyle(NEON_CYAN, fuelRatio > 0.5 ? 1 : 0.5);
  g.fillRect(x - 10, y - 6, 40, 12);
}
