// Fixed scenes for screenshots: ?shot=editor shows the page with photos loaded;
// ?shot=cover shows the exported cover alone, full-bleed. The query picks the
// layout, grade, photos and caption. window.__shotReady is set once painted.

/** The bundled sample photos (kit samples plus AI-made demo art). */
export const DEMO_PHOTOS = [
  "samples/demo-neon.jpg",
  "samples/demo-palm.jpg",
  "samples/pier.jpg",
  "samples/boulevard.jpg",
];

const SCENES = {
  editor: {
    layout: "hero",
    grade: "sunset",
    photos: DEMO_PHOTOS,
    assignments: [0, 1, 2, 3, 0, 1],
    caption: "SUNSET HEIST",
    subcaption: "A NEON CITY STORY",
    ink: "#ffffff",
    captionScale: 100,
    extras: { sealOn: true, seal: "NEW", pillOn: true, pill: "GOLDEN HOUR", starsOn: false, tagsOn: false },
    exportSize: "1920x1080",
  },
  cover: {
    layout: "slash",
    grade: "sunset",
    photos: DEMO_PHOTOS,
    assignments: [0, 1, 2],
    caption: "NEON NIGHTS",
    subcaption: "A NEON CITY STORY",
    ink: "#ffffff",
    captionScale: 100,
    selectedPanel: -1,
    extras: { sealOn: true, seal: "NEW", pillOn: false, starsOn: true, quote: "The city never looked this good", tagsOn: true, tags: "SUNSET · NEON · LEONIDA" },
    exportSize: "1920x1080",
  },
  wide: {
    layout: "quad",
    grade: "neon",
    photos: DEMO_PHOTOS,
    assignments: [2, 3, 0, 1],
    caption: "PALM DUSK",
    subcaption: "FOUR PANELS · ONE NIGHT",
    ink: "#ffd23e",
    captionScale: 100,
    selectedPanel: -1,
    extras: { sealOn: false, pillOn: true, pill: "AFTER DARK", starsOn: true, quote: "Every light tells a story", tagsOn: true, tags: "PALMS · NEON · NIGHT" },
    exportSize: "1080x1350",
  },
};

export async function runShot(query, load) {
  const name = query.get("shot") || "editor";
  const scene = { ...(SCENES[name] ?? SCENES.editor) };
  // Query overrides, so one scene can serve several screenshots.
  for (const key of ["layout", "grade", "caption", "subcaption", "ink", "exportSize"]) {
    if (query.get(key)) scene[key] = query.get(key);
  }
  if (query.get("captionScale")) scene.captionScale = Number(query.get("captionScale"));
  if (query.get("photos")) {
    scene.photos = query.get("photos").split(",").map((p) => `samples/${p}.jpg`);
  }
  if (query.get("assign")) {
    scene.assignments = query.get("assign").split(",").map(Number);
  }
  if (query.get("seal")) scene.extras = { ...(scene.extras || {}), sealOn: true, seal: query.get("seal") };
  if (query.get("pill")) scene.extras = { ...(scene.extras || {}), pillOn: true, pill: query.get("pill") };
  if (name === "cover" || name === "wide") document.body.classList.add("shot-cover");
  if (document.fonts) {
    try {
      await Promise.race([
        document.fonts.load('100px Anton'),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
    } catch { /* fall back to system fonts */ }
  }
  await load(scene.photos, scene);
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
