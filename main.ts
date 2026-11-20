// Magic Hour Cover Studio, a gta6-cover-art-01 entry (Node 22, standard
// library only): the app is this directory's app/ folder, plain static files
// a desktop browser loads offline — app/index.html, its ES modules, the
// Anton font and the sample art, no library and no network request. It turns
// a person's own photos into a multi-panel GTA-style poster cover with a
// sunset or neon grade, Chrome 3D or outline caption lettering, a gold or
// neon poster frame, cast role tags, callouts and a movie billing block, and
// exports it as a PNG in 1080 x 1080, 1080 x 1350 or 1920 x 1080. This
// program hands the app in: it copies app/ and screenshots/ from beside this
// file to /output and writes /output/dossier.json, the summary the judge
// reads, with the vendored make.fun library.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-app.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outputDir, "app"), { recursive: true });
mkdirSync(join(outputDir, "screenshots"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), join(outputDir, "screenshots"), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files in app/ or 48 MiB of
// app files, in all, or a path under app/ over 1000 bytes: app/ counts beside
// /output's own 1000-entry cap, its screenshots/ and dossier.json).
const dossierPath = join(outputDir, "dossier.json");
writeFileSync(
  dossierPath,
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  }),
);

// Read the dossier back: a zero-byte or missing file would fail the gate
// silently, so fail loudly here instead of handing in an empty entry.
const dossierBytes = readFileSync(dossierPath).length;
if (dossierBytes === 0) throw new Error(`dossier is empty: ${dossierPath}`);
console.log(`wrote ${dossierPath} (${dossierBytes} bytes)`);
