// Wires the page: photo slots, layout, grade, frame and lettering pickers,
// caption fields, a live preview you can drag and scroll to crop each
// photo, and PNG export in 1080 x 1080, 1080 x 1350 and 1920 x 1080.
// `?demo=1` loads the bundled sample art; `?shot=` sets up a fixed scene
// for a screenshot (see shots.js).
import { paintCover, LAYOUTS, GRADES, INKS, FRAMES, TITLE_STYLES } from "./cover.js";
import { runShot, SAMPLE_ART } from "./shots.js";

const canvas = document.getElementById("coverCanvas");
const titleInput = document.getElementById("titleInput");
const subInput = document.getElementById("subInput");
const titleSizeInput = document.getElementById("titleSize");
const sizeSelect = document.getElementById("sizeSelect");
const statusLine = document.getElementById("statusLine");
const thumbRow = document.getElementById("thumbRow");

/** The cover under edit: everything paintCover needs, plus which panel the
 * crop controls act on. */
export const cover = {
  layout: "hero",
  grade: "sunset",
  frame: "white",
  letter: "chrome",
  shots: [], // { img, zoom, dx, dy, name }
  slots: [0, 1, 2, 3, 0, 1], // one per panel; six-panel layouts use all six
  title: "SUNSET HEIST",
  subtitle: "A NEON CITY STORY",
  ink: "#ffffff",
  titleScale: 100,
  active: 0,
  dress: {
    seal: false, sealText: "NEW",
    badge: false, badgeText: "GOLDEN HOUR",
    stars: false, quote: "The city never looked this good",
    chips: false, chipText: "SUNSET · NEON · LEONIDA",
    billing: true, billingText: "A LEONIDA STORY · STARRING THE CREW · MUSIC BY THE CITY",
    pointer: false, pointerText: "THE GETAWAY", pointerPanel: 0,
    cast: false, castText: "THE DRIVER · THE LOOKOUT · THE FIXER · THE WHEELMAN · THE INSIDE MAN",
  },
};

let panelRects = [];

/** Repaints the preview and refreshes the crop controls. */
export function refresh() {
  panelRects = paintCover(canvas, cover);
  syncCropUI();
}

/** Loads an image from a URL, resolving once it can be drawn. */
export function fetchImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${url}`));
    img.src = url;
  });
}

function addShot(img, name) {
  if (cover.shots.length >= 4) {
    statusLine.textContent = "Four photos is the most — remove one first.";
    return -1;
  }
  cover.shots.push({ img, zoom: 1, dx: 0, dy: 0, name });
  paintThumbs();
  refresh();
  const n = cover.shots.length;
  statusLine.textContent = `${n} photo${n > 1 ? "s" : ""} loaded — pick a layout, then export.`;
  return n - 1;
}

function dropShot(index) {
  cover.shots.splice(index, 1);
  for (let i = 0; i < cover.slots.length; i++) {
    if (cover.slots[i] === index) cover.slots[i] = 0;
    else if (cover.slots[i] > index) cover.slots[i] -= 1;
  }
  if (cover.shots.length === 0) cover.slots = [0, 1, 2, 3, 0, 1];
  paintThumbs();
  refresh();
}

function paintThumbs() {
  thumbRow.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const shot = cover.shots[i];
    const cell = document.createElement("div");
    cell.className = "thumb";
    cell.dataset.index = String(i);
    if (shot) {
      const thumb = document.createElement("img");
      thumb.src = shot.img.src;
      thumb.alt = shot.name;
      cell.appendChild(thumb);
      const zoom = document.createElement("input");
      zoom.type = "range";
      zoom.min = "100";
      zoom.max = "250";
      zoom.value = String(Math.round(shot.zoom * 100));
      zoom.className = "thumb-zoom";
      zoom.setAttribute("aria-label", `Zoom photo ${i + 1}`);
      zoom.addEventListener("input", () => {
        shot.zoom = Number(zoom.value) / 100;
        refresh();
      });
      zoom.addEventListener("click", (e) => e.stopPropagation());
      cell.appendChild(zoom);
      const tag = document.createElement("span");
      tag.className = "thumb-tag";
      tag.textContent = `Photo ${i + 1} ✕`;
      cell.appendChild(tag);
      cell.title = "Click to replace · click the ✕ tag to remove";
      cell.addEventListener("click", (e) => {
        if (e.target === zoom) return;
        if (e.offsetY > cell.clientHeight - 22) dropShot(i);
        else chooseFile(i);
      });
    } else {
      const plus = document.createElement("span");
      plus.className = "thumb-empty";
      plus.textContent = "+";
      cell.appendChild(plus);
      const tag = document.createElement("span");
      tag.className = "thumb-tag";
      tag.textContent = `Photo ${i + 1}`;
      cell.appendChild(tag);
      cell.title = "Click to add a photo";
      cell.addEventListener("click", () => chooseFile(i));
    }
    thumbRow.appendChild(cell);
  }
}

function paintLibrary() {
  const lib = document.getElementById("libRow");
  lib.innerHTML = "";
  for (const url of SAMPLE_ART) {
    const thumb = document.createElement("img");
    thumb.src = url;
    thumb.alt = url.split("/").pop();
    thumb.title = "Tap to add this art";
    thumb.addEventListener("click", async () => {
      if (cover.shots.length >= 4) {
        statusLine.textContent = "Four photos is the most — remove one first.";
        return;
      }
      const img = await fetchImage(url);
      addShot(img, url.split("/").pop());
    });
    lib.appendChild(thumb);
  }
}

function chooseFile(slotIndex) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;
    try {
      const img = await fetchImage(URL.createObjectURL(file));
      if (cover.shots[slotIndex]) {
        cover.shots[slotIndex] = { img, zoom: 1, dx: 0, dy: 0, name: file.name };
        paintThumbs();
        refresh();
      } else {
        addShot(img, file.name);
      }
    } catch {
      statusLine.textContent = "That file could not be read as a photo.";
    }
  });
  input.click();
}

/** Builds the layout, grade, ink, frame and lettering picker rows. */
function mountPickers() {
  const layoutRow = document.getElementById("layoutRow");
  for (const [key, layout] of Object.entries(LAYOUTS)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pick";
    btn.textContent = layout.name;
    btn.setAttribute("aria-pressed", String(cover.layout === key));
    btn.addEventListener("click", () => {
      cover.layout = key;
      layoutRow.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      refresh();
    });
    layoutRow.appendChild(btn);
  }
  const gradeRow = document.getElementById("gradeRow");
  for (const [key, grade] of Object.entries(GRADES)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pick";
    const swatch = document.createElement("span");
    swatch.className = "grade-swatch";
    swatch.style.background = grade.swatch;
    btn.appendChild(swatch);
    btn.appendChild(document.createTextNode(grade.name));
    btn.setAttribute("aria-pressed", String(cover.grade === key));
    btn.addEventListener("click", () => {
      cover.grade = key;
      gradeRow.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      refresh();
    });
    gradeRow.appendChild(btn);
  }
  const inkRow = document.getElementById("inkRow");
  for (const ink of INKS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch";
    btn.style.background = ink.value;
    btn.title = ink.name;
    btn.dataset.ink = ink.value;
    btn.setAttribute("aria-label", `Caption colour: ${ink.name}`);
    btn.setAttribute("aria-pressed", String(cover.ink === ink.value));
    btn.addEventListener("click", () => {
      cover.ink = ink.value;
      inkRow.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      refresh();
    });
    inkRow.appendChild(btn);
  }
  const frameRow = document.getElementById("frameRow");
  for (const [key, frame] of Object.entries(FRAMES)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pick";
    btn.textContent = frame.name;
    btn.dataset.frame = key;
    btn.setAttribute("aria-pressed", String(cover.frame === key));
    btn.addEventListener("click", () => {
      cover.frame = key;
      frameRow.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      refresh();
    });
    frameRow.appendChild(btn);
  }
  const letterRow = document.getElementById("letterRow");
  for (const [key, style] of Object.entries(TITLE_STYLES)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pick";
    btn.textContent = style.name;
    btn.dataset.letter = key;
    btn.setAttribute("aria-pressed", String(cover.letter === key));
    btn.addEventListener("click", () => {
      cover.letter = key;
      letterRow.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      refresh();
    });
    letterRow.appendChild(btn);
  }
}

/** Maps a pointer event to canvas pixels and the panel under it (topmost wins). */
function panelUnder(clientX, clientY) {
  const box = canvas.getBoundingClientRect();
  const x = ((clientX - box.left) / box.width) * canvas.width;
  const y = ((clientY - box.top) / box.height) * canvas.height;
  let index = -1;
  for (let i = panelRects.length - 1; i >= 0; i--) {
    const p = panelRects[i];
    if (x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h) { index = i; break; }
  }
  return { x, y, index };
}

/** Drag to pan the photo inside its panel, scroll to zoom it, click to
 * select the panel the crop row acts on. */
function mountCanvas() {
  let drag = null;
  canvas.addEventListener("pointerdown", (e) => {
    const hit = panelUnder(e.clientX, e.clientY);
    if (hit.index === -1) return;
    cover.active = hit.index;
    const shot = cover.shots[cover.slots[hit.index]];
    if (!shot) {
      refresh();
      return;
    }
    drag = { panel: hit.index, startX: hit.x, startY: hit.y, dx: shot.dx, dy: shot.dy };
    canvas.setPointerCapture(e.pointerId);
    refresh();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const hit = panelUnder(e.clientX, e.clientY);
    const rect = panelRects[drag.panel];
    const shot = cover.shots[cover.slots[drag.panel]];
    if (!rect || !shot) return;
    shot.dx = Math.max(-0.6, Math.min(0.6, drag.dx + (hit.x - drag.startX) / rect.w));
    shot.dy = Math.max(-0.6, Math.min(0.6, drag.dy + (hit.y - drag.startY) / rect.h));
    refresh();
  });
  canvas.addEventListener("pointerup", () => { drag = null; });
  canvas.addEventListener("wheel", (e) => {
    const hit = panelUnder(e.clientX, e.clientY);
    if (hit.index === -1) return;
    const shot = cover.shots[cover.slots[hit.index]];
    if (!shot) return;
    e.preventDefault();
    shot.zoom = Math.max(1, Math.min(2.5, shot.zoom * (e.deltaY < 0 ? 1.08 : 0.93)));
    paintThumbs();
    refresh();
  }, { passive: false });
}

/** Renders the cover at `w` x `h` and downloads it as a PNG. */
export function savePNG(w, h) {
  return new Promise((resolve, reject) => {
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    paintCover(off, cover);
    off.toBlob((blob) => {
      if (!blob) {
        reject(new Error("export failed"));
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `cover-${w}x${h}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      resolve(blob.size);
    }, "image/png");
  });
}

const SURPRISE_TITLES = [
  ["NEON NIGHTS", "A NEON CITY STORY"],
  ["GOLDEN HOUR", "CHASING THE LAST LIGHT"],
  ["PALM DUSK", "FOUR PANELS · ONE NIGHT"],
  ["MIDNIGHT DRIVE", "THE CITY NEVER SLEEPS"],
  ["SUNSET HEIST", "IN AND OUT BEFORE DARK"],
  ["AFTERGLOW", "EVERY LIGHT TELLS A STORY"],
  ["VICE CITY", "WELCOME TO LEONIDA"],
  ["LAST LIGHT", "EVERY SUNSET HAS A PRICE"],
];

/** Copies the dressing checkboxes and texts from the cover state into the
 * controls, and refreshes the crop row. */
function syncDressUI() {
  const d = cover.dress;
  document.getElementById("sealCheck").checked = d.seal;
  document.getElementById("sealText").value = d.sealText;
  document.getElementById("badgeCheck").checked = d.badge;
  document.getElementById("badgeText").value = d.badgeText;
  document.getElementById("starsCheck").checked = d.stars;
  document.getElementById("quoteText").value = d.quote;
  document.getElementById("chipsCheck").checked = d.chips;
  document.getElementById("chipText").value = d.chipText;
  document.getElementById("billingCheck").checked = d.billing;
  document.getElementById("billingText").value = d.billingText;
  document.getElementById("pointerCheck").checked = d.pointer;
  document.getElementById("pointerText").value = d.pointerText;
  document.getElementById("castCheck").checked = d.cast;
  document.getElementById("castText").value = d.castText;
  syncCropUI();
}

/** The active panel's crop controls: a zoom slider and a re-centre button. */
function syncCropUI() {
  const label = document.getElementById("panelName");
  const zoom = document.getElementById("panelZoom");
  const shot = cover.shots[cover.slots[cover.active]];
  label.textContent = `Panel ${cover.active + 1}`;
  zoom.disabled = !shot;
  zoom.value = String(Math.round((shot ? shot.zoom : 1) * 100));
}

/** Sets every picker button's pressed state from the cover state. */
function syncPickers() {
  document.querySelectorAll("#layoutRow button").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.textContent === LAYOUTS[cover.layout].name));
  });
  document.querySelectorAll("#gradeRow button").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.textContent.trim() === GRADES[cover.grade].name));
  });
  document.querySelectorAll("#inkRow button").forEach((b) => {
    b.setAttribute("aria-pressed", String(cover.ink === b.dataset.ink));
  });
  document.querySelectorAll("#frameRow button").forEach((b) => {
    b.setAttribute("aria-pressed", String(cover.frame === b.dataset.frame));
  });
  document.querySelectorAll("#letterRow button").forEach((b) => {
    b.setAttribute("aria-pressed", String(cover.letter === b.dataset.letter));
  });
}

/** Picks a random layout, grade, frame, lettering, photo order, ink and
 * caption — and rolls the dressing dice too. */
export function randomize() {
  const layouts = Object.keys(LAYOUTS);
  const grades = Object.keys(GRADES);
  const frames = Object.keys(FRAMES);
  const letters = Object.keys(TITLE_STYLES);
  const inks = INKS.map((i) => i.value);
  cover.layout = layouts[Math.floor(Math.random() * layouts.length)];
  cover.grade = grades[Math.floor(Math.random() * grades.length)];
  cover.frame = frames[Math.floor(Math.random() * frames.length)];
  cover.letter = letters[Math.floor(Math.random() * letters.length)];
  cover.ink = inks[Math.floor(Math.random() * inks.length)];
  const [cap, sub] = SURPRISE_TITLES[Math.floor(Math.random() * SURPRISE_TITLES.length)];
  cover.title = cap;
  cover.subtitle = sub;
  const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  cover.slots = [...order, order[0], order[1]];
  cover.dress.seal = Math.random() < 0.4;
  cover.dress.badge = Math.random() < 0.4;
  cover.dress.stars = Math.random() < 0.5;
  cover.dress.chips = Math.random() < 0.5;
  cover.dress.billing = Math.random() < 0.6;
  cover.dress.pointer = Math.random() < 0.3;
  cover.dress.cast = Math.random() < 0.5;
  titleInput.value = cap;
  subInput.value = sub;
  syncPickers();
  syncDressUI();
  refresh();
  statusLine.textContent = "Surprised! Tweak anything, then export.";
}

function mountControls() {
  titleInput.addEventListener("input", () => { cover.title = titleInput.value; refresh(); });
  subInput.addEventListener("input", () => { cover.subtitle = subInput.value; refresh(); });
  titleSizeInput.addEventListener("input", () => { cover.titleScale = Number(titleSizeInput.value); refresh(); });
  sizeSelect.addEventListener("change", () => {
    const [w, h] = sizeSelect.value.split("x").map(Number);
    canvas.width = w;
    canvas.height = h;
    refresh();
  });
  document.getElementById("exportBtn").addEventListener("click", async () => {
    if (cover.shots.length === 0) {
      statusLine.textContent = "Add a photo first — the cover needs at least one.";
      return;
    }
    const [w, h] = sizeSelect.value.split("x").map(Number);
    statusLine.textContent = "Exporting…";
    try {
      const bytes = await savePNG(w, h);
      statusLine.textContent = `Saved cover-${w}x${h}.png (${Math.round(bytes / 1024)} KiB).`;
    } catch {
      statusLine.textContent = "Export failed in this browser — try again.";
    }
  });
  document.getElementById("fillBtn").addEventListener("click", () => {
    if (cover.shots.length === 0) {
      statusLine.textContent = "Add a photo first.";
      return;
    }
    cover.slots = [0, 0, 0, 0, 0, 0];
    refresh();
    statusLine.textContent = "Every panel now shows photo 1.";
  });
  document.getElementById("demoBtn").addEventListener("click", async () => {
    await loadSamples();
  });
  document.getElementById("surpriseBtn").addEventListener("click", () => {
    if (cover.shots.length === 0) {
      statusLine.textContent = "Add a photo first — Surprise me needs something to work with.";
      return;
    }
    randomize();
  });
  const dressPairs = [
    ["sealCheck", "sealText", "sealText", "seal"],
    ["badgeCheck", "badgeText", "badgeText", "badge"],
    ["starsCheck", "quoteText", "quote", "stars"],
    ["chipsCheck", "chipText", "chipText", "chips"],
    ["billingCheck", "billingText", "billingText", "billing"],
    ["pointerCheck", "pointerText", "pointerText", "pointer"],
    ["castCheck", "castText", "castText", "cast"],
  ];
  for (const [checkId, textId, key, flag] of dressPairs) {
    document.getElementById(checkId).addEventListener("change", (e) => {
      cover.dress[flag] = e.target.checked;
      refresh();
    });
    document.getElementById(textId).addEventListener("input", (e) => {
      cover.dress[key] = e.target.value;
      refresh();
    });
  }
  document.getElementById("panelZoom").addEventListener("input", (e) => {
    const shot = cover.shots[cover.slots[cover.active]];
    if (!shot) return;
    shot.zoom = Number(e.target.value) / 100;
    refresh();
  });
  document.getElementById("panelRecenter").addEventListener("click", () => {
    const shot = cover.shots[cover.slots[cover.active]];
    if (!shot) return;
    shot.zoom = 1;
    shot.dx = 0;
    shot.dy = 0;
    refresh();
    statusLine.textContent = `Panel ${cover.active + 1} re-centred.`;
  });
}

/** Loads the bundled sample art (AI-made illustrations, free to use). */
export async function loadSamples() {
  for (const url of SAMPLE_ART) {
    if (cover.shots.length >= 4) break;
    try {
      const img = await fetchImage(url);
      addShot(img, url.split("/").pop());
    } catch {
      // A missing sample never blocks the rest.
    }
  }
}

async function boot() {
  mountPickers();
  mountControls();
  mountCanvas();
  paintThumbs();
  paintLibrary();
  const query = new URLSearchParams(location.search);
  if (query.get("shot")) {
    await runShot(query, async (photos, patch) => {
      for (const url of photos) {
        const img = await fetchImage(url);
        addShot(img, url.split("/").pop());
      }
      // patch.photos is the URL list already loaded above — never assign it
      // over the shot objects. Dressing merges over the defaults, so a
      // scene that only flips one flag never drops the other texts.
      const { photos: _loaded, dress: patchDress, ...rest } = patch;
      Object.assign(cover, rest);
      if (patchDress) Object.assign(cover.dress, patchDress);
      if (patch.exportSize) {
        const [w, h] = patch.exportSize.split("x").map(Number);
        canvas.width = w;
        canvas.height = h;
      }
      titleInput.value = cover.title;
      subInput.value = cover.subtitle;
      titleSizeInput.value = String(cover.titleScale);
      syncPickers();
      syncDressUI();
      refresh();
    });
  } else {
    if (query.get("demo") === "1") await loadSamples();
    if (document.fonts) {
      try {
        await Promise.race([
          document.fonts.load('100px Anton'),
          new Promise((r) => setTimeout(r, 2500)),
        ]);
      } catch { /* fall back to system fonts */ }
    }
    refresh();
  }
  // Self-test hook: ?selftest=1 exports 1080x1080 to a blob and reports its
  // size in the title (or ?selftest=1080x1350 for another size), so a
  // headless run can prove the export path works.
  const selftest = new URLSearchParams(location.search).get("selftest");
  if (selftest) {
    const m = /^(\d+)x(\d+)$/.exec(selftest);
    const [w, h] = m ? [Number(m[1]), Number(m[2])] : [1080, 1080];
    try {
      const bytes = await savePNG(w, h);
      document.title = `EXPORT_OK ${w}x${h} ${bytes}`;
    } catch {
      document.title = "EXPORT_FAIL";
    }
  }
}

boot();
