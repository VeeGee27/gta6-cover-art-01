// Magic Hour Cover Studio — wires the page: controls, photo panels, crop
// gestures, deep-link scenes, PNG export and screenshot scenes.
import {
  drawPoster, hitPanel, LAYOUTS, GRADES, FRAMES, TITLE_STYLES, SAMPLES,
  EXPORT_SIZES, DEFAULT_SCENE, DEFAULT_CALLOUTS, DEFAULT_ROLES, sampleById,
} from './cover.js';
import { SHOTS } from './shots.js';

const canvas = document.getElementById('stage');
const status = document.getElementById('status');
const state = JSON.parse(JSON.stringify(DEFAULT_SCENE));
const uploads = {};
const sampleImages = {};

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function sampleImage(id) {
  if (sampleImages[id]) return sampleImages[id];
  const sample = sampleById(id);
  if (!sample) return null;
  const img = await loadImage(sample.file);
  sampleImages[id] = img;
  return img;
}

async function photosForScene() {
  const out = [];
  for (let i = 0; i < (LAYOUTS.find((l) => l.id === state.layout)?.panels.length ?? 0); i++) {
    const id = state.photos[i];
    if (id === 'upload' && uploads[i]) {
      out.push({ img: uploads[i].img, fx: uploads[i].fx, fy: uploads[i].fy });
    } else if (id) {
      const sample = sampleById(id);
      const img = sample ? await sampleImage(id) : null;
      out.push(img ? { img, fx: sample.fx, fy: sample.fy } : null);
    } else {
      out.push(null);
    }
  }
  return out;
}

function render() {
  const size = EXPORT_SIZES[state.size] ?? EXPORT_SIZES.portrait;
  if (!document.body.classList.contains('shot-cover')) {
    canvas.width = size.w;
    canvas.height = size.h;
  }
  photosForScene().then((photos) => {
    drawPoster(canvas, { ...state, selected: state.selected }, photos);
    syncControls();
    syncUrl();
  });
}

function syncControls() {
  const mark = (id, value) => {
    document.querySelectorAll(`#${id} button`).forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.value === value));
    });
  };
  mark('layouts', state.layout);
  mark('grades', state.grade);
  mark('frames', state.frame);
  mark('titles', state.titleStyle);
  document.querySelectorAll('#samples button').forEach((b) => {
    b.setAttribute('aria-pressed', String(state.photos[state.selected] === b.dataset.value));
  });
  const crop = state.crops[state.selected] ?? { zoom: 1 };
  document.getElementById('zoom').value = Math.round((crop.zoom ?? 1) * 100);
  document.getElementById('callout').value = state.callouts[state.selected] ?? '';
  document.getElementById('role').value = state.roles[state.selected] ?? '';
  document.getElementById('title').value = state.title;
  document.getElementById('subtitle').value = state.subtitle;
  document.getElementById('billing').value = state.billing;
}

function syncUrl() {
  if (new URLSearchParams(location.search).get('shot')) return;
  const q = new URLSearchParams();
  q.set('layout', state.layout);
  q.set('grade', state.grade);
  q.set('frame', state.frame);
  q.set('titleStyle', state.titleStyle);
  q.set('title', state.title);
  q.set('subtitle', state.subtitle);
  q.set('billing', state.billing);
  q.set('photos', state.photos.join(','));
  q.set('callouts', state.callouts.join('|'));
  q.set('roles', state.roles.join('|'));
  q.set('size', state.size);
  history.replaceState(null, '', `${location.pathname}?${q.toString()}`);
}

function applyDeepLink() {
  const q = new URLSearchParams(location.search);
  const pick = (key, list, fallback) => (list.includes(q.get(key)) ? q.get(key) : fallback);
  state.layout = pick('layout', LAYOUTS.map((l) => l.id), state.layout);
  state.grade = pick('grade', GRADES.map((g) => g.id), state.grade);
  state.frame = pick('frame', FRAMES.map((f) => f.id), state.frame);
  state.titleStyle = pick('titleStyle', TITLE_STYLES.map((t) => t.id), state.titleStyle);
  if (q.get('title') != null) state.title = q.get('title');
  if (q.get('subtitle') != null) state.subtitle = q.get('subtitle');
  if (q.get('billing') != null) state.billing = q.get('billing');
  if (q.get('photos')) state.photos = q.get('photos').split(',');
  if (q.get('callouts')) state.callouts = q.get('callouts').split('|');
  if (q.get('roles')) state.roles = q.get('roles').split('|');
  if (q.get('size') && EXPORT_SIZES[q.get('size')]) state.size = q.get('size');
}

function buildButtons(containerId, items, key, onPick) {
  const box = document.getElementById(containerId);
  items.forEach((item) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.value = item.id;
    b.textContent = item.name;
    b.addEventListener('click', () => {
      state[key] = item.id;
      if (key === 'layout') {
        state.selected = 0;
        state.photos = state.photos.slice(0, item.panels.length);
        while (state.photos.length < item.panels.length) {
          state.photos.push(SAMPLES[state.photos.length % SAMPLES.length].id);
        }
      }
      onPick?.();
      render();
    });
    box.appendChild(b);
  });
}

function buildSamples() {
  const box = document.getElementById('samples');
  SAMPLES.forEach((sample) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.value = sample.id;
    b.title = sample.label;
    const img = document.createElement('img');
    img.src = sample.file;
    img.alt = sample.label;
    b.appendChild(img);
    b.addEventListener('click', () => {
      state.photos[state.selected] = sample.id;
      delete uploads[state.selected];
      render();
    });
    box.appendChild(b);
  });
}

function cropFor(i) {
  if (!state.crops[i]) state.crops[i] = { zoom: 1, ox: 0, oy: 0 };
  return state.crops[i];
}

function bindControls() {
  buildButtons('layouts', LAYOUTS, 'layout');
  buildButtons('grades', GRADES, 'grade');
  buildButtons('frames', FRAMES, 'frame');
  buildButtons('titles', TITLE_STYLES, 'titleStyle');
  buildSamples();

  document.getElementById('title').addEventListener('input', (e) => { state.title = e.target.value; render(); });
  document.getElementById('subtitle').addEventListener('input', (e) => { state.subtitle = e.target.value; render(); });
  document.getElementById('billing').addEventListener('input', (e) => { state.billing = e.target.value; render(); });
  document.getElementById('callout').addEventListener('input', (e) => { state.callouts[state.selected] = e.target.value; render(); });
  document.getElementById('role').addEventListener('input', (e) => { state.roles[state.selected] = e.target.value; render(); });
  document.getElementById('zoom').addEventListener('input', (e) => {
    cropFor(state.selected).zoom = Number(e.target.value) / 100;
    render();
  });
  document.getElementById('fit').addEventListener('click', () => {
    state.crops[state.selected] = { zoom: 1, ox: 0, oy: 0 };
    render();
  });
  document.getElementById('fill').addEventListener('click', () => {
    const layout = LAYOUTS.find((l) => l.id === state.layout);
    layout.panels.forEach((_, i) => {
      state.photos[i] = SAMPLES[i % SAMPLES.length].id;
      delete uploads[i];
    });
    render();
  });
  document.getElementById('upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = await loadImage(URL.createObjectURL(file));
    uploads[state.selected] = { img, fx: 0.5, fy: 0.42 };
    state.photos[state.selected] = 'upload';
    state.crops[state.selected] = { zoom: 1, ox: 0, oy: 0 };
    status.textContent = 'Your photo is in the selected panel.';
    render();
  });
  document.getElementById('surprise').addEventListener('click', () => {
    const any = (arr) => arr[Math.floor(Math.random() * arr.length)];
    state.layout = any(LAYOUTS).id;
    state.grade = any(GRADES).id;
    state.frame = any(FRAMES).id;
    state.titleStyle = any(TITLE_STYLES).id;
    const layout = LAYOUTS.find((l) => l.id === state.layout);
    state.photos = layout.panels.map(() => any(SAMPLES).id);
    state.callouts = [...DEFAULT_CALLOUTS].sort(() => Math.random() - 0.5);
    state.roles = [...DEFAULT_ROLES].sort(() => Math.random() - 0.5);
    state.crops = {};
    state.selected = 0;
    render();
  });
  document.querySelectorAll('[data-size]').forEach((b) => {
    b.addEventListener('click', () => exportPNG(b.dataset.size));
  });

  let dragging = false;
  let moved = false;
  let last = null;
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const py = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const hit = hitPanel(state.layout, px, py, canvas.width, canvas.height);
    dragging = true;
    moved = false;
    last = { x: e.clientX, y: e.clientY };
    if (hit >= 0) {
      state.selected = hit;
      canvas.setPointerCapture(e.pointerId);
      render();
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging || !last) return;
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
    if (moved && state.selected >= 0) {
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / rect.width;
      const crop = cropFor(state.selected);
      crop.ox += dx * scale;
      crop.oy += dy * scale;
      last = { x: e.clientX, y: e.clientY };
      render();
    }
  });
  canvas.addEventListener('pointerup', () => {
    dragging = false;
    last = null;
  });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (state.selected < 0) return;
    const crop = cropFor(state.selected);
    crop.zoom = Math.min(2.6, Math.max(1, crop.zoom * (e.deltaY < 0 ? 1.08 : 0.93)));
    render();
  }, { passive: false });
}

async function exportPNG(sizeId) {
  const size = EXPORT_SIZES[sizeId];
  const off = document.createElement('canvas');
  off.width = size.w;
  off.height = size.h;
  const photos = await photosForScene();
  drawPoster(off, { ...state, selected: null }, photos);
  off.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `magic-hour-cover-${size.w}x${size.h}.png`;
    a.click();
    status.textContent = `Saved magic-hour-cover-${size.w}x${size.h}.png`;
  }, 'image/png');
}

async function boot() {
  applyDeepLink();
  bindControls();
  try {
    await Promise.all([
      document.fonts.load('400 100px Anton'),
      document.fonts.load('400 100px Pacifico'),
      ...SAMPLES.map((s) => sampleImage(s.id)),
    ]);
  } catch {
    // Fonts or a sample failed; the poster still draws with fallbacks.
  }
  const shotName = new URLSearchParams(location.search).get('shot');
  const shot = shotName ? SHOTS[shotName] : null;
  if (shot) {
    Object.assign(state, shot.scene);
    state.size = shot.size;
    document.body.classList.add(shot.mode === 'cover' ? 'shot-cover' : 'shot-editor');
    if (shot.mode === 'cover') {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    const photos = await photosForScene();
    drawPoster(canvas, { ...state, selected: null }, photos);
    syncControls();
    requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
  } else {
    render();
  }
}

boot();
