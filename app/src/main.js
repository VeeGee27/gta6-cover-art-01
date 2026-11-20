// Wires the page: photo slots, layout, grade, frame and title-style pickers,
// caption fields, a live preview canvas you can drag and scroll to crop each
// photo, and PNG export in 1080 x 1080, 1080 x 1350 and 1920 x 1080.
// `?demo=1` loads the bundled sample photos; `?shot=` sets up a fixed scene
// for a screenshot (see shots.js).
import { drawCover, LAYOUTS, GRADES, INKS, FRAMES, TITLE_STYLES } from "./cover.js";
import { runShot, DEMO_PHOTOS } from "./shots.js";

const canvas = document.getElementById("cover");
const captionInput = document.getElementById("caption");
const subcaptionInput = document.getElementById("subcaption");
const captionSizeInput = document.getElementById("captionSize");
const exportSizeSelect = document.getElementById("exportSize");
const statusEl = document.getElementById("status");
const slotsEl = document.getElementById("slots");

/** App state: everything drawCover needs, plus which panel is selected. */
export const state = {
  layout: "hero",
  grade: "sunset",
  frame: "white",
  titleStyle: "chrome",
  photos: [], // { img, scale, ox, oy, name }
  assignments: [0, 1, 2, 3, 0, 1], // one per panel; six-panel layouts use all six
  caption: "SUNSET HEIST",
  subcaption: "A NEON CITY STORY",
  ink: "#ffffff",
  captionScale: 100,
  selectedPanel: 0,
  extras: {
    sealOn: false, seal: "NEW",
    pillOn: false, pill: "GOLDEN HOUR",
    starsOn: false, quote: "The city never looked this good",
    tagsOn: false, tags: "SUNSET · NEON · LEONIDA",
    billingOn: true, billing: "A LEONIDA STORY · STARRING THE CREW · MUSIC BY THE CITY",
    calloutOn: false, callout: "THE GETAWAY", calloutPanel: 0,
    rolesOn: false, roles: "THE DRIVER · THE LOOKOUT · THE FIXER · THE WHEELMAN",
  },
};

let panelsPx = [];
let fontsReady = false;

export function redraw() {
  panelsPx = drawCover(canvas, state);
  syncPanelCrop();
}

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${url}`));
    img.src = url;
  });
}

function addPhoto(img, name) {
  if (state.photos.length >= 4) {
    statusEl.textContent = "Four photos is the most — remove one first.";
    return -1;
  }
  const slot = { img, scale: 1, ox: 0, oy: 0, name };
  state.photos.push(slot);
  renderSlots();
  redraw();
  statusEl.textContent = `${state.photos.length} photo${state.photos.length > 1 ? "s" : ""} loaded — pick a layout, then export.`;
  return state.photos.length - 1;
}

function removePhoto(index) {
  state.photos.splice(index, 1);
  for (let i = 0; i < state.assignments.length; i++) {
    if (state.assignments[i] === index) state.assignments[i] = 0;
    else if (state.assignments[i] > index) state.assignments[i] -= 1;
  }
  if (state.photos.length === 0) state.assignments = [0, 1, 2, 3, 0, 1];
  renderSlots();
  redraw();
}

function renderSlots() {
  slotsEl.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const photo = state.photos[i];
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = String(i);
    if (photo) {
      const thumb = document.createElement("img");
      thumb.src = photo.img.src;
      thumb.alt = photo.name;
      slot.appendChild(thumb);
      const zoom = document.createElement("input");
      zoom.type = "range";
      zoom.min = "100";
      zoom.max = "250";
      zoom.value = String(Math.round(photo.scale * 100));
      zoom.className = "slot-zoom";
      zoom.setAttribute("aria-label", `Zoom photo ${i + 1}`);
      zoom.addEventListener("input", () => {
        photo.scale = Number(zoom.value) / 100;
        redraw();
      });
      zoom.addEventListener("click", (e) => e.stopPropagation());
      slot.appendChild(zoom);
      const tag = document.createElement("span");
      tag.className = "slot-tag";
      tag.textContent = `Photo ${i + 1} ✕`;
      slot.appendChild(tag);
      slot.title = "Click to replace · click the ✕ tag to remove";
      slot.addEventListener("click", (e) => {
        if (e.target === zoom) return;
        if (e.offsetY > slot.clientHeight - 22) {
          removePhoto(i);
        } else {
          pickFile(i);
        }
      });
    } else {
      const plus = document.createElement("span");
      plus.className = "slot-empty";
      plus.textContent = "+";
      slot.appendChild(plus);
      const tag = document.createElement("span");
      tag.className = "slot-tag";
      tag.textContent = `Photo ${i + 1}`;
      slot.appendChild(tag);
      slot.title = "Click to add a photo";
      slot.addEventListener("click", () => pickFile(i));
    }
    slotsEl.appendChild(slot);
  }
}

function renderLibrary() {
  const libraryEl = document.getElementById("library");
  libraryEl.innerHTML = "";
  for (const url of DEMO_PHOTOS) {
    const thumb = document.createElement("img");
    thumb.src = url;
    thumb.alt = url.split("/").pop();
    thumb.title = "Tap to add this photo";
    thumb.addEventListener("click", async () => {
      if (state.photos.length >= 4) {
        statusEl.textContent = "Four photos is the most — remove one first.";
        return;
      }
      const img = await loadImage(url);
      addPhoto(img, url.split("/").pop());
    });
    libraryEl.appendChild(thumb);
  }
}

function pickFile(slotIndex) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;
    try {
      const img = await loadImage(URL.createObjectURL(file));
      if (state.photos[slotIndex]) {
        state.photos[slotIndex] = { img, scale: 1, ox: 0, oy: 0, name: file.name };
        renderSlots();
        redraw();
      } else {
        addPhoto(img, file.name);
      }
    } catch {
      statusEl.textContent = "That file could not be read as a photo.";
    }
  });
  input.click();
}

function buildPickers() {
  const layoutRow = document.getElementById("layoutRow");
  for (const [key, layout] of Object.entries(LAYOUTS)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pick";
    btn.textContent = layout.label;
    btn.setAttribute("aria-pressed", String(state.layout === key));
    btn.addEventListener("click", () => {
      state.layout = key;
      layoutRow.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      redraw();
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
    btn.appendChild(document.createTextNode(grade.label));
    btn.setAttribute("aria-pressed", String(state.grade === key));
    btn.addEventListener("click", () => {
      state.grade = key;
      gradeRow.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      redraw();
    });
    gradeRow.appendChild(btn);
  }
  const inkRow = document.getElementById("inkRow");
  for (const ink of INKS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch";
    btn.style.background = ink.value;
    btn.title = ink.label;
    btn.dataset.ink = ink.value;
    btn.setAttribute("aria-label", `Caption colour: ${ink.label}`);
    btn.setAttribute("aria-pressed", String(state.ink === ink.value));
    btn.addEventListener("click", () => {
      state.ink = ink.value;
      inkRow.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      redraw();
    });
    inkRow.appendChild(btn);
  }
  const frameRow = document.getElementById("frameRow");
  for (const [key, frame] of Object.entries(FRAMES)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pick";
    btn.textContent = frame.label;
    btn.dataset.frame = key;
    btn.setAttribute("aria-pressed", String(state.frame === key));
    btn.addEventListener("click", () => {
      state.frame = key;
      frameRow.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      redraw();
    });
    frameRow.appendChild(btn);
  }
  const titleRow = document.getElementById("titleRow");
  for (const [key, style] of Object.entries(TITLE_STYLES)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pick";
    btn.textContent = style.label;
    btn.dataset.titleStyle = key;
    btn.setAttribute("aria-pressed", String(state.titleStyle === key));
    btn.addEventListener("click", () => {
      state.titleStyle = key;
      titleRow.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      redraw();
    });
    titleRow.appendChild(btn);
  }
}
/** Maps a pointer event to canvas pixels and the panel under it (topmost wins). */
function panelAt(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * canvas.width;
  const y = ((clientY - rect.top) / rect.height) * canvas.height;
  let index = -1;
  for (let i = panelsPx.length - 1; i >= 0; i--) {
    const p = panelsPx[i];
    if (x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h) { index = i; break; }
  }
  return { x, y, index };
}

function wireCanvas() {
  let drag = null;
  canvas.addEventListener("pointerdown", (e) => {
    const hit = panelAt(e.clientX, e.clientY);
    if (hit.index === -1) return;
    state.selectedPanel = hit.index;
    const photo = state.photos[state.assignments[hit.index]];
    if (!photo) {
      redraw();
      return;
    }
    drag = { panel: hit.index, startX: hit.x, startY: hit.y, ox: photo.ox, oy: photo.oy };
    canvas.setPointerCapture(e.pointerId);
    redraw();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const hit = panelAt(e.clientX, e.clientY);
    const rect = panelsPx[drag.panel];
    const photo = state.photos[state.assignments[drag.panel]];
    if (!rect || !photo) return;
    photo.ox = Math.max(-0.6, Math.min(0.6, drag.ox + (hit.x - drag.startX) / rect.w));
    photo.oy = Math.max(-0.6, Math.min(0.6, drag.oy + (hit.y - drag.startY) / rect.h));
    redraw();
  });
  canvas.addEventListener("pointerup", () => { drag = null; });
  canvas.addEventListener("wheel", (e) => {
    const hit = panelAt(e.clientX, e.clientY);
    if (hit.index === -1) return;
    const photo = state.photos[state.assignments[hit.index]];
    if (!photo) return;
    e.preventDefault();
    photo.scale = Math.max(1, Math.min(2.5, photo.scale * (e.deltaY < 0 ? 1.08 : 0.93)));
    renderSlots();
    redraw();
  }, { passive: false });
}

/** Renders the cover at `w` x `h` and downloads it as a PNG. */
export function exportCover(w, h) {
  return new Promise((resolve, reject) => {
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    drawCover(off, state);
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

const SURPRISE_CAPTIONS = [
  ["NEON NIGHTS", "A NEON CITY STORY"],
  ["GOLDEN HOUR", "CHASING THE LAST LIGHT"],
  ["PALM DUSK", "FOUR PANELS · ONE NIGHT"],
  ["MIDNIGHT DRIVE", "THE CITY NEVER SLEEPS"],
  ["SUNSET HEIST", "IN AND OUT BEFORE DARK"],
  ["AFTERGLOW", "EVERY LIGHT TELLS A STORY"],
  ["VICE CITY", "WELCOME TO LEONIDA"],
  ["LAST LIGHT", "EVERY SUNSET HAS A PRICE"],
];

function syncExtrasUI() {
  const e = state.extras;
  document.getElementById("sealOn").checked = e.sealOn;
  document.getElementById("sealText").value = e.seal;
  document.getElementById("pillOn").checked = e.pillOn;
  document.getElementById("pillText").value = e.pill;
  document.getElementById("starsOn").checked = e.starsOn;
  document.getElementById("quoteText").value = e.quote;
  document.getElementById("tagsOn").checked = e.tagsOn;
  document.getElementById("tagsText").value = e.tags;
  document.getElementById("billingOn").checked = e.billingOn;
  document.getElementById("billingText").value = e.billing;
  document.getElementById("calloutOn").checked = e.calloutOn;
  document.getElementById("calloutText").value = e.callout;
  document.getElementById("rolesOn").checked = e.rolesOn;
  document.getElementById("rolesText").value = e.roles;
  syncPanelCrop();
}

/** The selected panel's crop controls: a zoom slider and a re-centre button. */
function syncPanelCrop() {
  const label = document.getElementById("panelLabel");
  const zoom = document.getElementById("panelZoom");
  const photo = state.photos[state.assignments[state.selectedPanel]];
  label.textContent = `Panel ${state.selectedPanel + 1}`;
  zoom.disabled = !photo;
  zoom.value = String(Math.round((photo ? photo.scale : 1) * 100));
}

/** Sets every picker button's pressed state from the current state. */
function syncPickers() {
  document.querySelectorAll("#layoutRow button").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.textContent === LAYOUTS[state.layout].label));
  });
  document.querySelectorAll("#gradeRow button").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.textContent.trim() === GRADES[state.grade].label));
  });
  document.querySelectorAll("#inkRow button").forEach((b) => {
    b.setAttribute("aria-pressed", String(state.ink === b.dataset.ink));
  });
  document.querySelectorAll("#frameRow button").forEach((b) => {
    b.setAttribute("aria-pressed", String(state.frame === b.dataset.frame));
  });
  document.querySelectorAll("#titleRow button").forEach((b) => {
    b.setAttribute("aria-pressed", String(state.titleStyle === b.dataset.titleStyle));
  });
}

/** Picks a random layout, grade, frame, title style, photo order, ink and caption. */
export function surpriseMe() {
  const layouts = Object.keys(LAYOUTS);
  const grades = Object.keys(GRADES);
  const frames = Object.keys(FRAMES);
  const titleStyles = Object.keys(TITLE_STYLES);
  const inks = INKS.map((i) => i.value);
  state.layout = layouts[Math.floor(Math.random() * layouts.length)];
  state.grade = grades[Math.floor(Math.random() * grades.length)];
  state.frame = frames[Math.floor(Math.random() * frames.length)];
  state.titleStyle = titleStyles[Math.floor(Math.random() * titleStyles.length)];
  state.ink = inks[Math.floor(Math.random() * inks.length)];
  const [cap, sub] = SURPRISE_CAPTIONS[Math.floor(Math.random() * SURPRISE_CAPTIONS.length)];
  state.caption = cap;
  state.subcaption = sub;
  const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  state.assignments = [...order, order[0], order[1]];
  state.extras.sealOn = Math.random() < 0.4;
  state.extras.pillOn = Math.random() < 0.4;
  state.extras.starsOn = Math.random() < 0.5;
  state.extras.tagsOn = Math.random() < 0.5;
  state.extras.billingOn = Math.random() < 0.6;
  state.extras.calloutOn = Math.random() < 0.3;
  state.extras.rolesOn = Math.random() < 0.5;
  captionInput.value = cap;
  subcaptionInput.value = sub;
  syncPickers();
  syncExtrasUI();
  redraw();
  statusEl.textContent = "Surprised! Tweak anything, then export.";
}

function wireControls() {
  captionInput.addEventListener("input", () => { state.caption = captionInput.value; redraw(); });
  subcaptionInput.addEventListener("input", () => { state.subcaption = subcaptionInput.value; redraw(); });
  captionSizeInput.addEventListener("input", () => { state.captionScale = Number(captionSizeInput.value); redraw(); });
  exportSizeSelect.addEventListener("change", () => {
    const [w, h] = exportSizeSelect.value.split("x").map(Number);
    canvas.width = w;
    canvas.height = h;
    redraw();
  });
  document.getElementById("export").addEventListener("click", async () => {
    if (state.photos.length === 0) {
      statusEl.textContent = "Add a photo first — the cover needs at least one.";
      return;
    }
    const [w, h] = exportSizeSelect.value.split("x").map(Number);
    statusEl.textContent = "Exporting…";
    try {
      const bytes = await exportCover(w, h);
      statusEl.textContent = `Saved cover-${w}x${h}.png (${Math.round(bytes / 1024)} KiB).`;
    } catch {
      statusEl.textContent = "Export failed in this browser — try again.";
    }
  });
  document.getElementById("fillAll").addEventListener("click", () => {
    if (state.photos.length === 0) {
      statusEl.textContent = "Add a photo first.";
      return;
    }
    state.assignments = [0, 0, 0, 0, 0, 0];
    redraw();
    statusEl.textContent = "Every panel now shows photo 1.";
  });
  document.getElementById("demoBtn").addEventListener("click", async () => {
    await loadDemoPhotos();
  });
  document.getElementById("surprise").addEventListener("click", () => {
    if (state.photos.length === 0) {
      statusEl.textContent = "Add a photo first — Surprise me needs something to work with.";
      return;
    }
    surpriseMe();
  });
  const extraPairs = [
    ["sealOn", "sealText", "seal", "sealOn"],
    ["pillOn", "pillText", "pill", "pillOn"],
    ["starsOn", "quoteText", "quote", "starsOn"],
    ["tagsOn", "tagsText", "tags", "tagsOn"],
    ["billingOn", "billingText", "billing", "billingOn"],
    ["calloutOn", "calloutText", "callout", "calloutOn"],
    ["rolesOn", "rolesText", "roles", "rolesOn"],
  ];
  for (const [checkId, textId, key, flag] of extraPairs) {
    document.getElementById(checkId).addEventListener("change", (e) => {
      state.extras[flag] = e.target.checked;
      redraw();
    });
    document.getElementById(textId).addEventListener("input", (e) => {
      state.extras[key] = e.target.value;
      redraw();
    });
  }
  document.getElementById("panelZoom").addEventListener("input", (e) => {
    const photo = state.photos[state.assignments[state.selectedPanel]];
    if (!photo) return;
    photo.scale = Number(e.target.value) / 100;
    redraw();
  });
  document.getElementById("panelCenter").addEventListener("click", () => {
    const photo = state.photos[state.assignments[state.selectedPanel]];
    if (!photo) return;
    photo.scale = 1;
    photo.ox = 0;
    photo.oy = 0;
    redraw();
    statusEl.textContent = `Panel ${state.selectedPanel + 1} re-centred.`;
  });
}

/** Loads the bundled sample photos (AI-made demo art, free to use). */
export async function loadDemoPhotos() {
  for (const url of DEMO_PHOTOS) {
    if (state.photos.length >= 4) break;
    try {
      const img = await loadImage(url);
      addPhoto(img, url.split("/").pop());
    } catch {
      // A missing sample never blocks the rest.
    }
  }
}

async function boot() {
  buildPickers();
  wireControls();
  wireCanvas();
  renderSlots();
  renderLibrary();
  const query = new URLSearchParams(location.search);
  if (query.get("shot")) {
    await runShot(query, async (photos, patch) => {
      for (const url of photos) {
        const img = await loadImage(url);
        addPhoto(img, url.split("/").pop());
      }
      // patch.photos is the URL list already loaded above — never assign it
      // over the photo objects. Extras merge over the defaults, so a scene
      // that only flips a flag never silently drops the other extras' text.
      const { photos: _loaded, extras: patchExtras, ...rest } = patch;
      Object.assign(state, rest);
      if (patchExtras) Object.assign(state.extras, patchExtras);
      if (patch.exportSize) {
        const [w, h] = patch.exportSize.split("x").map(Number);
        canvas.width = w;
        canvas.height = h;
      }
      captionInput.value = state.caption;
      subcaptionInput.value = state.subcaption;
      captionSizeInput.value = String(state.captionScale);
      syncPickers();
      syncExtrasUI();
      redraw();
    });
  } else {
    if (query.get("demo") === "1") await loadDemoPhotos();
    if (document.fonts) {
      try {
        await Promise.race([
          document.fonts.load('100px Anton'),
          new Promise((r) => setTimeout(r, 2500)),
        ]);
        fontsReady = true;
      } catch { /* fall back to system fonts */ }
    }
    redraw();
  }
  // Self-test hook: ?selftest=1 exports 1080x1080 to a blob and reports its size
  // in the title (or ?selftest=1080x1350 for another size), so a headless run
  // can prove the export path works.
  const selftest = new URLSearchParams(location.search).get("selftest");
  if (selftest) {
    const m = /^(\d+)x(\d+)$/.exec(selftest);
    const [w, h] = m ? [Number(m[1]), Number(m[2])] : [1080, 1080];
    try {
      const bytes = await exportCover(w, h);
      document.title = `EXPORT_OK ${w}x${h} ${bytes}`;
    } catch {
      document.title = "EXPORT_FAIL";
    }
  }
}

boot();
