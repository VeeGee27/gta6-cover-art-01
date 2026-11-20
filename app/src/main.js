// Magic Hour Cover Studio — wires the page: controls, photo upload, per-panel
// crop, Surprise me, PNG export, deep-link scenes and the test hooks.
import { GRADES, FRAMES, TITLE_STYLES, SIZES, LAYOUTS, CALLOUTS, ROLES, SAMPLES, createState, defaultPanels, panelCount, drawPoster, hitPanel } from './cover.js';
import { runShot, readScene } from './shots.js';

const $ = (id) => document.getElementById(id);
const canvas = $('cover');
const ctx = canvas.getContext('2d');
const status = $('status');

const state = createState();
state.panels = defaultPanels(state.layout);
let selected = 0;
const images = new Map();
const uploads = new Map();
let uploadSeq = 0;
let fontsReady = false;

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function loadSamples() {
  for (const name of SAMPLES) {
    try {
      images.set(name, await loadImage(`samples/${name}.jpg`));
    } catch {
      images.set(name, null);
    }
  }
}

async function loadFonts() {
  try {
    const anton = new FontFace('Anton', 'url(fonts/Anton-Regular.woff2) format("woff2")', { weight: '400' });
    const pacifico = new FontFace('Pacifico', 'url(fonts/Pacifico-Regular.woff2) format("woff2")', { weight: '400' });
    await anton.load();
    await pacifico.load();
    document.fonts.add(anton);
    document.fonts.add(pacifico);
    fontsReady = true;
  } catch {
    fontsReady = false;
  }
}

function currentSize() {
  return SIZES[state.size] || SIZES.square;
}

function resizeCanvas() {
  const s = currentSize();
  if (canvas.width !== s.w || canvas.height !== s.h) {
    canvas.width = s.w;
    canvas.height = s.h;
  }
}

function redraw() {
  resizeCanvas();
  drawPoster(ctx, state, images, canvas.width, canvas.height);
  syncControls();
}

function syncControls() {
  document.querySelectorAll('[data-layout]').forEach((b) => b.classList.toggle('on', b.dataset.layout === state.layout));
  document.querySelectorAll('[data-grade]').forEach((b) => b.classList.toggle('on', b.dataset.grade === state.grade));
  document.querySelectorAll('[data-frame]').forEach((b) => b.classList.toggle('on', b.dataset.frame === state.frame));
  document.querySelectorAll('[data-tstyle]').forEach((b) => b.classList.toggle('on', b.dataset.tstyle === state.titleStyle));
  document.querySelectorAll('[data-size]').forEach((b) => b.classList.toggle('on', b.dataset.size === state.size));
  const panel = state.panels[selected];
  if (panel) {
    $('callout').value = panel.callout || '';
    $('zoom').value = String(Math.round((panel.z || 1) * 100));
    $('zoomLabel').textContent = `${Math.round((panel.z || 1) * 100)}%`;
    $('panelLabel').textContent = `Panel ${selected + 1} of ${state.panels.length}`;
  }
}

function setLayout(id) {
  if (!LAYOUTS[id]) return;
  state.layout = id;
  const old = state.panels;
  state.panels = defaultPanels(id).map((p, i) => ({ ...p, src: old[i] ? old[i].src : p.src }));
  selected = 0;
  redraw();
}

function setGrade(id) { if (GRADES[id]) { state.grade = id; redraw(); } }
function setFrame(id) { if (FRAMES[id]) { state.frame = id; redraw(); } }
function setTitleStyle(id) { if (TITLE_STYLES[id]) { state.titleStyle = id; redraw(); } }

function setSize(id) {
  if (!SIZES[id]) return;
  state.size = id;
  redraw();
}

function setPanelPhoto(i, src) {
  if (!state.panels[i]) return;
  state.panels[i].src = src;
  redraw();
}

function fitPanel(i) {
  const p = state.panels[i];
  if (!p) return;
  p.ox = 0; p.oy = 0; p.z = 1;
  redraw();
}

function surprise() {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  setLayout(pick(Object.keys(LAYOUTS)));
  setGrade(pick(Object.keys(GRADES)));
  setFrame(pick(Object.keys(FRAMES)));
  setTitleStyle(pick(Object.keys(TITLE_STYLES)));
  state.title = pick(['VICE HEIST', 'NEON SHORE', 'GOLDEN GETAWAY', 'THE CREW', 'PALM DUSK', 'SUNSET SLEEPER']);
  $('title').value = state.title;
  state.panels.forEach((p, i) => {
    p.src = pick(SAMPLES);
    p.callout = CALLOUTS[(i + Math.floor(Math.random() * CALLOUTS.length)) % CALLOUTS.length];
  });
  redraw();
  status.textContent = 'Surprise! A new poster, ready to export.';
}

function downloadPNG() {
  const s = currentSize();
  canvas.toBlob((blob) => {
    if (!blob) { status.textContent = 'Export failed.'; return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `cover-${s.w}x${s.h}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    status.textContent = `Saved cover-${s.w}x${s.h}.png`;
  }, 'image/png');
}

function canvasPoint(e) {
  const r = canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
}

function contentFractions(px, py) {
  const fw = Math.max(6, Math.min(canvas.width, canvas.height) * 0.016);
  const bandH = Math.max(26, canvas.height * 0.062);
  const cw = canvas.width - fw * 2;
  const ch = canvas.height - fw * 2 - bandH;
  const bandMode = LAYOUTS[state.layout].mode === 'band';
  const titleBandH = bandMode ? ch * 0.17 : 0;
  const fx = (px * canvas.width - fw) / cw;
  const fy = (py * canvas.height - fw - titleBandH) / (ch - titleBandH);
  return { fx, fy };
}

let dragging = false;
let lastPt = null;

canvas.addEventListener('pointerdown', (e) => {
  const p = canvasPoint(e);
  const { fx, fy } = contentFractions(p.x, p.y);
  const hit = hitPanel(state.layout, fx, fy);
  if (hit >= 0) {
    selected = hit;
    dragging = true;
    lastPt = p;
    canvas.setPointerCapture(e.pointerId);
    syncControls();
  }
});

canvas.addEventListener('pointermove', (e) => {
  if (!dragging || !lastPt) return;
  const p = canvasPoint(e);
  const panel = state.panels[selected];
  if (!panel) return;
  const r = canvas.getBoundingClientRect();
  const dx = (p.x - lastPt.x) * canvas.width / r.width;
  const dy = (p.y - lastPt.y) * canvas.height / r.height;
  panel.ox = Math.max(-0.6, Math.min(0.6, (panel.ox || 0) + dx / canvas.width));
  panel.oy = Math.max(-0.6, Math.min(0.6, (panel.oy || 0) + dy / canvas.height));
  lastPt = p;
  redraw();
});

canvas.addEventListener('pointerup', () => { dragging = false; lastPt = null; });

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const panel = state.panels[selected];
  if (!panel) return;
  const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
  panel.z = Math.max(1, Math.min(3, (panel.z || 1) * factor));
  redraw();
}, { passive: false });

document.querySelectorAll('[data-layout]').forEach((b) => b.addEventListener('click', () => setLayout(b.dataset.layout)));
document.querySelectorAll('[data-grade]').forEach((b) => b.addEventListener('click', () => setGrade(b.dataset.grade)));
document.querySelectorAll('[data-frame]').forEach((b) => b.addEventListener('click', () => setFrame(b.dataset.frame)));
document.querySelectorAll('[data-tstyle]').forEach((b) => b.addEventListener('click', () => setTitleStyle(b.dataset.tstyle)));
document.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => setSize(b.dataset.size)));

$('title').addEventListener('input', () => { state.title = $('title').value; redraw(); });
$('subtitle').addEventListener('input', () => { state.subtitle = $('subtitle').value; redraw(); });
$('callout').addEventListener('input', () => {
  const p = state.panels[selected];
  if (p) { p.callout = $('callout').value; redraw(); }
});
$('zoom').addEventListener('input', () => {
  const p = state.panels[selected];
  if (p) { p.z = Math.max(1, Math.min(3, Number($('zoom').value) / 100)); redraw(); }
});
$('fit').addEventListener('click', () => fitPanel(selected));
$('surprise').addEventListener('click', surprise);
$('export').addEventListener('click', downloadPNG);

$('upload').addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const key = `upload:${uploadSeq++}`;
  const img = await loadImage(URL.createObjectURL(file));
  uploads.set(key, img);
  images.set(key, img);
  setPanelPhoto(selected, key);
  status.textContent = `Loaded ${file.name} into panel ${selected + 1}.`;
});

$('samplePick').addEventListener('change', (e) => {
  if (e.target.value) setPanelPhoto(selected, e.target.value);
  e.target.value = '';
});

// Deep-link scene: ?shot=, ?layout=, ?grade=, ?frame=, ?title=, ?size=,
// ?caption=, ?subtitle=, ?photos= (one sample per panel).
async function applyScene(scene) {
  if (scene.layout && LAYOUTS[scene.layout]) {
    state.layout = scene.layout;
    state.panels = defaultPanels(scene.layout);
    selected = 0;
  }
  if (scene.grade && GRADES[scene.grade]) state.grade = scene.grade;
  if (scene.frame && FRAMES[scene.frame]) state.frame = scene.frame;
  if (scene.titleStyle && TITLE_STYLES[scene.titleStyle]) state.titleStyle = scene.titleStyle;
  if (scene.size && SIZES[scene.size]) state.size = scene.size;
  if (scene.title !== undefined) { state.title = scene.title; $('title').value = scene.title; }
  if (scene.subtitle !== undefined) { state.subtitle = scene.subtitle; $('subtitle').value = scene.subtitle; }
  if (scene.photos) {
    scene.photos.forEach((name, i) => {
      if (state.panels[i] && SAMPLES.includes(name)) state.panels[i].src = name;
    });
  }
  await loadSamples();
  if (!fontsReady) await loadFonts();
  redraw();
}

function renderAtSize(w, h) {
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  drawPoster(off.getContext('2d'), state, images, w, h);
  return { w: off.width, h: off.height };
}

// Test hooks for the in-browser feature matrix.
window.__studio = {
  state,
  setLayout, setGrade, setFrame, setTitleStyle, setSize, setPanelPhoto, fitPanel,
  panelCount: () => panelCount(state.layout),
  hitAt(fx, fy) { return hitPanel(state.layout, fx, fy); },
  exportSize(w, h) { return renderAtSize(w, h); },
  setTitle(t) { state.title = t; $('title').value = t; redraw(); },
  setSubtitle(t) { state.subtitle = t; $('subtitle').value = t; redraw(); },
  setCallout(i, t) { if (state.panels[i]) { state.panels[i].callout = t; redraw(); } },
  select(i) { if (state.panels[i]) { selected = i; syncControls(); } },
  setZoom(i, z) { if (state.panels[i]) { state.panels[i].z = z; redraw(); } },
  fontsReady: () => fontsReady,
  sampleLoaded: (name) => !!images.get(name),
};

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
(async () => {
  await loadSamples();
  await loadFonts();
  if (shot) {
    await runShot(shot, params, { applyScene });
  } else {
    const scene = readScene(params);
    if (Object.keys(scene).length > 0) await applyScene(scene);
    redraw();
  }
})();
