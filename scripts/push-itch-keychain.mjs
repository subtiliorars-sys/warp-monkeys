/**
 * Create itch project (if missing) + Butler push using fleet keychain credential.
 * Does not print the API key.
 */
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const keytar = require(
  resolve("C:/Users/hrmread/MeniscusMaximus/tools/fleet-automation/node_modules/keytar"),
);

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const slug = "jimmythehat-codemonkeys-warp-division";
const target = `subtiliorars/${slug}:html`;

const key = (await keytar.getPassword("fleet-automation", "itch-butler-key"))?.trim();
if (!key) {
  console.error("No itch-butler-key in OS credential store (fleet-automation).");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${key}`,
  Accept: "application/json",
};

const page = await fetch(`https://subtiliorars.itch.io/${slug}`, { method: "HEAD" });
if (page.status === 404) {
  const body = new URLSearchParams({
    title: "CodeMonkeys: Warp Division",
    url: slug,
    classification: "game",
    type: "html",
    published: "true",
    price: "0",
  });
  const res = await fetch("https://itch.io/api/1/key/game/create", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.errors) {
    console.warn(
      "Could not auto-create via API (dashboard create may be required):",
      JSON.stringify(data.errors || res.status),
    );
  } else {
    console.log(`Created itch project: ${slug}`);
  }
} else {
  console.log(`Itch project reachable (HTTP ${page.status})`);
}

const version = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).version;
const zip = resolve(root, `release/warp-monkeys-browser-v${version}.zip`);
if (!existsSync(zip)) {
  console.error("Missing zip — run npm run package:itch first");
  process.exit(1);
}

const butlerCandidates = [
  process.env.BUTLER_BIN,
  resolve("C:/Users/hrmread/MeniscusMaximus/tools/fleet-automation/bin/butler.exe"),
  "butler",
].filter(Boolean);

let butler = butlerCandidates.find((b) => b !== "butler" && existsSync(b));
if (!butler) {
  const which = spawnSync("where", ["butler"], { encoding: "utf8" });
  butler = which.status === 0 ? which.stdout.trim().split(/\r?\n/)[0] : null;
}
if (!butler) {
  console.error("Butler CLI not found");
  process.exit(1);
}

const env = { ...process.env, BUTLER_API_KEY: key };
console.log(`Pushing ${zip} → ${target}`);
let r = spawnSync(butler, ["push", zip, target], { env, stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);
r = spawnSync(butler, ["status", target], { env, stdio: "inherit" });
console.log(`Live: https://subtiliorars.itch.io/${slug}`);
process.exit(r.status ?? 0);
