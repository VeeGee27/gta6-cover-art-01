// Fixed scenes for screenshots: ?shot=editor shows the page with art loaded;
// ?shot=cover shows the exported cover alone, full-bleed. The query picks the
// layout, grade, photos and caption. window.__shotReady is set once painted.

/** The bundled sample art: four fresh Vice City illustrations first, then
 * the kit's own photos. The sample loader takes the first four, so a fresh
 * cover is all illustration — one coherent poster, not a mixed collage. */
export const SAMPLE_ART = [
  "samples/art-neon.jpg",
  "samples/art-palms.jpg",
  "samples/art-street.jpg",
  "samples/art-skyline.jpg",
  "samples/pier.jpg",
  "samples/boulevard.jpg",
];

const SCENES = {
  editor: {
    layout: "hero",
    grade: "gold",
    frame: "gold",
    letter: "chrome",
    photos: SAMPLE_ART,
    slots: [0, 1, 2, 3, 0, 1],
    title: "SUNSET HEIST",
    subtitle: "A NEON CITY STORY",
    ink: "#ffffff",
    titleScale: 100,
    dress: { seal: true, sealText: "NEW", badge: true, badgeText: "GOLDEN HOUR", stars: false, chips: false, billing: true, billingText: "A LEONIDA STORY · STARRING THE CREW · MUSIC BY THE CITY", cast: true, castText: "THE DRIVER · THE LOOKOUT · THE FIXER · THE WHEELMAN · THE INSIDE MAN", pointer: false },
    exportSize: "1920x1080",
  },
  cover: {
    layout: "keyart",
    grade: "sunset",
    frame: "gold",
    letter: "chrome",
    photos: SAMPLE_ART,
    slots: [1],
    title: "NEON NIGHTS",
    subtitle: "A NEON CITY STORY",
    ink: "#ffffff",
    titleScale: 100,
    active: -1,
    dress: { seal: true, sealText: "NEW", badge: false, stars: true, quote: "The city never looked this good", chips: true, chipText: "SUNSET · NEON · LEONIDA", billing: true, billingText: "A LEONIDA STORY · STARRING THE CREW · MUSIC BY THE CITY", cast: false, pointer: true, pointerText: "THE GETAWAY", pointerPanel: 0 },
    exportSize: "1920x1080",
  },
  wide: {
    layout: "slash",
    grade: "vice",
    frame: "neon",
    letter: "chrome",
    photos: SAMPLE_ART,
    slots: [2, 3, 0],
    title: "PALM DUSK",
    subtitle: "FOUR PANELS · ONE NIGHT",
    ink: "#ffd23e",
    titleScale: 100,
    active: -1,
    dress: { seal: false, badge: true, badgeText: "AFTER DARK", stars: true, quote: "Every light tells a story", chips: true, chipText: "PALMS · NEON · NIGHT", billing: true, billingText: "A LEONIDA STORY · STARRING THE CREW · MUSIC BY THE CITY", cast: false, pointer: false },
    exportSize: "1080x1350",
  },
};

export async function runShot(query, load) {
  const name = query.get("shot") || "editor";
  const scene = { ...(SCENES[name] ?? SCENES.editor) };
  // Query overrides, so one scene can serve several screenshots.
  for (const key of ["layout", "grade", "frame", "letter", "title", "subtitle", "ink", "exportSize"]) {
    if (query.get(key)) scene[key] = query.get(key);
  }
  if (query.get("titleScale")) scene.titleScale = Number(query.get("titleScale"));
  if (query.get("photos")) {
    scene.photos = query.get("photos").split(",").map((p) => `samples/${p}.jpg`);
  }
  if (query.get("assign")) {
    scene.slots = query.get("assign").split(",").map(Number);
  }
  if (query.get("seal")) scene.dress = { ...(scene.dress || {}), seal: true, sealText: query.get("seal") };
  if (query.get("badge")) scene.dress = { ...(scene.dress || {}), badge: true, badgeText: query.get("badge") };
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
