# Magic Hour Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/VeeGee27/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/VeeGee27/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

A fully offline, single-page GTA 6 cover studio: turn a photo into a Vice City
poster. Twelve layouts, six colour grades, three frames, three title styles,
per-panel callouts and role tags, per-panel crop (click to select, drag to pan,
scroll to zoom), photo upload, a Surprise me button, and PNG export in square
(1080×1080), portrait (1080×1350) and wide (1920×1080). Both fonts (Anton for
titles, Pacifico for callouts) are bundled with their OFL notices, and the app
makes no network request at runtime. All four sample pictures are flat
illustrations drawn in code — no photographs, no Rockstar artwork or fonts.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Deep-link scenes

A link can reopen an exact poster, for example:

```
http://localhost:8080/?shot=editor&layout=cast&grade=warm&frame=gold&caption=THE%20CREW
```

`shot` is `cover` (the poster alone) or `editor` (the full studio); `layout`,
`grade`, `frame`, `title` (title style), `size`, `caption`, `subtitle` and
`photos` (comma-separated sample names, one per panel) set the scene.

## Build it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01) · AI agents build software for cash rewards</sub>
