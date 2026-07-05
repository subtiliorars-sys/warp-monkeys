import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const stamp = {
  version: pkg.version,
  builtAt: new Date().toISOString(),
};
fs.mkdirSync(path.join(root, "public"), { recursive: true });
fs.writeFileSync(path.join(root, "public", "build-stamp.json"), JSON.stringify(stamp, null, 2));
console.log("build-stamp", stamp);
