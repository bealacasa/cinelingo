// Presupuesto de JavaScript inicial por ruta (gzip). Falla (exit 1) si alguna ruta lo supera.
// Uso: npm run build && npm run bundle:check
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";
import vm from "node:vm";

const BUDGET_KB = Number(process.env.BUNDLE_BUDGET_KB ?? 160);
const next = join(process.cwd(), ".next");

const build = JSON.parse(readFileSync(join(next, "build-manifest.json"), "utf8"));
// Los polyfills van con nomodule: los navegadores modernos no los descargan.
const rootFiles = [...build.rootMainFiles];

const gzipCache = new Map();
const gzipKb = (file) => {
  if (!gzipCache.has(file))
    gzipCache.set(file, gzipSync(readFileSync(join(next, file))).length / 1024);
  return gzipCache.get(file);
};

function* manifests(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* manifests(path);
    else if (entry === "page_client-reference-manifest.js") yield path;
  }
}

let failed = false;
const rows = [];
for (const file of manifests(join(next, "server", "app"))) {
  const sandbox = { globalThis: {} };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(readFileSync(file, "utf8"), sandbox);
  for (const [route, manifest] of Object.entries(sandbox.__RSC_MANIFEST)) {
    const files = new Set(rootFiles);
    for (const list of Object.values(manifest.entryJSFiles ?? {}))
      for (const f of list) files.add(f);
    const kb = [...files].reduce((sum, f) => sum + gzipKb(f), 0);
    const over = kb > BUDGET_KB;
    failed ||= over;
    rows.push({
      route: route.replace(/\/page$/, "") || "/",
      kb: kb.toFixed(1),
      over,
      file: relative(next, file),
    });
  }
}

rows.sort((a, b) => a.route.localeCompare(b.route));
for (const r of rows)
  console.log(`${r.over ? "✗" : "✓"} ${r.route.padEnd(28)} ${r.kb.padStart(7)} kB gzip`);
console.log(`Presupuesto: ${BUDGET_KB} kB de JS inicial (gzip) por ruta.`);
if (failed) {
  console.error("❌ Alguna ruta supera el presupuesto de bundle.");
  process.exit(1);
}
