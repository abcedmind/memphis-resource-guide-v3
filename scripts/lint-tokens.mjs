// Token lint (2026-09-30). Fails if a raw hex colour is written anywhere in
// src/ outside src/app/tokens.css. Four files cannot read CSS variables (the
// OG image, the global error page, the favicon, the browser theme colour);
// they may use a hex only if it is one of the values in tokens.css.
// Program data (seed-data.ts) is data, not design, and is skipped.
// Run: npm run lint:tokens   (Node standard library only)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const TOKENS = "src/app/tokens.css";
const SKIP = new Set([TOKENS, "src/lib/seed-data.ts"]);
const MIRRORS = new Set([
  "src/app/opengraph-image.tsx",
  "src/app/global-error.tsx",
  "src/app/icon.svg",
  "src/app/layout.tsx",
]);
const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const norm = (h) => {
  h = h.toLowerCase();
  return h.length === 4 ? "#" + [...h.slice(1)].map((c) => c + c).join("") : h;
};

const allowed = new Set(
  [...readFileSync(TOKENS, "utf8").matchAll(/--[\w-]+:\s*(#[0-9a-fA-F]{3,8})/g)].map((m) => norm(m[1]))
);

const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

let bad = 0;
for (const file of walk("src").filter((f) => /\.(tsx?|css|svg)$/.test(f))) {
  if (SKIP.has(file)) continue;
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    for (const [hex] of line.matchAll(HEX)) {
      const ok = MIRRORS.has(file) && allowed.has(norm(hex));
      if (!ok) {
        bad++;
        console.log(`${file}:${i + 1}  ${hex}  ${MIRRORS.has(file) ? "not a tokens.css value" : "raw colour; use a token"}`);
      }
    }
  });
}
if (bad) {
  console.log(`token lint: ${bad} problem(s)`);
  process.exit(1);
}
console.log(`token lint: ok (${allowed.size} token values)`);
