import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distPlaytest = path.join(root, "dist", "playtest.html");
const srcPlaytest = path.join(root, "playtest.html");

if (fs.existsSync(srcPlaytest)) {
  fs.copyFileSync(srcPlaytest, distPlaytest);
}

for (const file of ["index.html", "playtest.html"]) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) throw new Error(`Missing ${file}`);
  const html = fs.readFileSync(p, "utf8");
  if (!html.includes("<!DOCTYPE html>")) throw new Error(`${file} missing doctype`);
  if (!html.includes("<html")) throw new Error(`${file} missing html tag`);
  console.log(`OK ${file}`);
}

console.log("HTML validation passed");
