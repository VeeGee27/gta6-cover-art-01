# Cover-art revision v2 — report

## Live top 10 studied (2026-11-20 07:37 WIB, 3,972 entries)

| # | Handle | Rate | Title (formula read) |
|---|--------|------|----------------------|
| 1 | el-net | 95.06% | "Palmline: multi-panel GTA-style poster studio for your own photos, with callouts, seal, billing block and PNG export in three sizes" |
| 2 | nightshift-labs | 94.81% | "HEATWAVE Cover Studio: your photos become GTA-style key art (title over the art, slanted panels, sunset grade, sky glow), optional Poster Ink, per-panel crop, caption edits, PNG in 3 sizes" |
| 3 | regian1117 | 94.56% | "Vice Cover Studio v3 — Multi-Panel GTA 6 Poster Maker (Twilight Gold Frame, Striped Retro-Chrome 3D Titles, Role Tags, 8 Layouts, 6 Grades & 3-Size PNG Export)" |
| 4 | do-tinh | 93.94% | "Sunset State Cover Studio" |
| 5 | amber-lark-66 | 93.64% | "Neon Coast" |
| 6 | ahmadfdn | 93.36% | "VICE STATE Cover Studio" |
| 7 | ainz-10 | 93.22% | "Palm Vice Studio" |
| 8 | madsrepo | 92.94% | "Sunset Run: cinema-poster cover studio for your own photos" |
| 9 | hazel-harbor-63 | 92.92% | "SUNSET HEIST cover maker v2" |
| 10 | tarekujjaman | 92.92% | "NEONCOAST Cover Studio: people-driven sunset & neon crime-poster maker" |

Cut-offs: rank 20 = 92.31%, rank 50 = 90.71%, rank 100 = 88.04%, rank 500 = 78.75%, median = 69.59%.
Our v1 "Magic Hour Cover Studio": **69.28%, rank 2,149** — just below the median. The OG preview endpoint returns 404 for these submissions, so the study is from titles + the RULES.txt judge criteria (formula only; nothing copied).

## Gap analysis — what the judges rewarded that v1 lacked

The judge reads the entry mostly through its screenshots (contact sheet: first cover large on top, the rest small beneath) plus a short source outline. Criterion 1 — the art in the screenshots — decides most games. v1's gaps, specific:

1. **The demo covers were incoherent (criterion 1, the biggest gap).** v1's screenshots mixed flat illustrations (demo-neon, demo-palm) with real holiday photos (pier.jpg: a fisherman; boulevard.jpg: a woman in a car). A cover with a random fisherman next to a flat sunset reads as a photo collage, not a GTA poster. The top entries' covers read as one poster.
2. **No billing block.** #1 advertises it explicitly. A movie-credits line is a classic poster element; v1 had nothing of it.
3. **No callouts.** #1 advertises them. v1 had no annotation/label pointing at a panel.
4. **No role tags.** #3 advertises them ("Role Tags"). v1 labelled nothing per panel.
5. **Flat-only lettering.** #3/#12 advertise "Striped Retro-Chrome 3D Titles" / "3D lettering". v1's title was one flat style (pink offset + outline).
6. **One frame.** #3 advertises a "Twilight Gold Frame". v1 had only the white frame.
7. **4 grades, not 6.** #3/#12 advertise 6 grades. v1 had sunset / neon / dusk / none.
8. **No sky glow.** #2 advertises it. v1's key-art titles sat on a plain scrim.
9. **Crop was implicit.** #2 advertises "per-panel crop". v1 had drag + wheel zoom + slot sliders, but no selected-panel crop controls in the UI.
10. **Short, featureless title.** Top titles sell the feature list; v1's title was just "Magic Hour Cover Studio".

## What changed in revision-v2

All in `revision-v2/`, entry-repo untouched:

- **cover.js** — 3 new layouts (Slashed Comic, Cast Grid, Three Strips → 12 total); 2 new grades (Vice Gold, Vice Teal → 6 total); `FRAMES` (White / Gold / Neon); `TITLE_STYLES` (Flat / Chrome 3D / Outline) with `drawCaptionLine` (chrome = 3-step extrusion + striped gold/white/pink gradient fill; outline = hollow); `drawBillingBlock` folded into the caption stack; `drawCallout` (dot + leader line + label chip); `drawRoleTags` (cast chip at the foot of each panel, band layouts only); `drawSkyGlow` (warm radial glow behind key-art titles). `drawCover` wires frame, glow, role tags and callout.
- **main.js** — state gains `frame`, `titleStyle`, and extras `billing` / `callout` / `roles`; frame + title-style pickers; billing/callout/roles controls; selected-panel crop row (zoom slider + Re-centre); `surpriseMe` now randomises frame, title style and the new extras; 2 new surprise captions; shot scenes now merge extras over the defaults instead of replacing them (a scene that flips one flag no longer drops the others' text).
- **index.html** — Frame and Title-style picker rows, Panel-crop row, Billing / Callout / Role-tags rows, updated brand copy.
- **style.css** — styles for the crop row and new pickers.
- **shots.js** — 2 new AI-made samples in the library (see below); scenes rewritten to showcase v2 (keyart + gold frame + chrome title + callout for the hero cover; slash + neon frame + Vice Teal for the portrait; cast grid + role tags for the editor).
- **shots.json** — queries updated to the new scenes.
- **main.ts** — header/description updated for v2.
- **README.md** — v2 feature list, "What's in v2" section, suggested submission title (below). Badge lines untouched.
- **app/fonts/OFL.txt** — usage-note header added; license text unchanged.
- **New samples** — `app/samples/demo-street.jpg` (neon palm boulevard, flat vector) and `app/samples/demo-skyline.jpg` (skyline at dusk, flat vector), AI-made, no people, no text, no logos. The demo loader now takes the four illustrations first, so a fresh cover is one coherent poster instead of a mixed collage. The kit photos (pier, boulevard) stay in the library for "any photo" use.
- **Screenshots re-taken** — all 4, from the new scenes.

Suggested submission title: "Magic Hour Cover Studio v2 — multi-panel GTA-style poster maker (12 layouts, 6 grades, Chrome 3D titles, gold & neon frames, role tags, callouts, billing block, 3-size PNG export)".

## Verification

- `node --check` on cover.js, main.js, shots.js: all pass (caught and fixed one real bug: `frame` name collision in drawCover).
- Served with `node serve.ts`; Playwright (cached Chromium) loaded all 4 `?shot=` scenes: **0 console errors, 0 page errors, 0 failed requests**.
- Export self-test: `?demo=1&selftest=1080x1080` → `EXPORT_OK 1080x1080 2221879` (PNG downloads).
- Screenshots: 1-cover 1280×720 / 123 KiB; 2-editor 1280×800 / 162 KiB; 3-cover 1024×1280 / 185 KiB; 4-editor 1280×800 / 165 KiB — all within the gate (≤256 KiB, long side ≤1280, short side ≥480).
- `node cli/makefun.mjs check --repo revision-v2 --worktree`: **4 passed, 0 failed**, 17 skipped (transcript checks run on the sealed recording at submit), 5 at submission (repo not yet public/pushed — normal).
- `MAKEFUN_OUTPUT_DIR=/tmp/out-cover node main.ts`: dossier.json builds, 936,387 bytes (cap 1.5 MiB), app/ + screenshots/ copied with the new samples.
- Fresh-viewer read-back of all 4 screenshots, 3 defects found and fixed (see below). Final screenshots re-read and clean.

### Defects found by the read-back (all fixed)

1. **Billing block overlapped the tag chips** (shot 1): the billing line was drawn at the pre-tags cursor. Fixed: the cursor now steps past the tags row before the billing line.
2. **Role tags collided with the title on key-art layouts** (shot 3): chips at the foot of full-height panels sat under the scrim and overlapped the sub-caption. Fixed: role tags draw only on band layouts (panels end above the caption).
3. **Billing silently dropped in shot scenes** (shots 2–3): `Object.assign(state, rest)` replaced the whole extras object, so scenes without a `billing` key lost the default text. Fixed in main.js (extras now merge over defaults) and the scenes now carry explicit billing text.

## Verdict — is this clearly better than v1 (69.28%)?

**Yes, judged clearly better.** The revision closes every specific gap the live top 10 advertise, and — more importantly — fixes the exact thing the judge weights first: the covers in the screenshots are now coherent illustrated posters (gold frame, Chrome 3D title, callout, billing block, role tags) instead of a mixed collage with a random fisherman. The feature set now matches the top-10 formula (12 layouts, 6 grades, 3D titles, frames, role tags, callouts, billing block, per-panel crop), and the app is verified working end to end with no console errors and a passing kit check.

**Risk, stated plainly:** a revision can lower a rating. The judge is pairwise and noisy (the same pair can be answered differently), and the Chrome 3D title is bolder than v1's flat title — if the judge reads it as garish in a given pairing, that game goes the other way. I cannot put an honest number on the new rate; v1 sat at the median and the new entry's visible art and feature list are materially stronger, so a material rise is the expected outcome, not a guarantee. If the resubmit scores below 69.28%, rebuild from v1 (the entry-repo is untouched) rather than patching v2 forward.

## What the parent still has to do (not done here, by design)

- Seal the live recording (01a1f661-0f6c-70d1-8dbb-3faf61cd2828) when the build is accepted.
- Upload revision-v2 to GitHub (new repo or the existing one — a resubmit replaces the files; verify the tree byte-identical by clone + `git ls-tree`).
- Submit with the recording flow and the suggested title above. Cover quota is 5/day; v1 used 1 on 19 Nov UTC, so the resubmit is the first of the 20 Nov UTC day. Bounty closes 2026-11-21T10:30Z (17:30 WIB).
