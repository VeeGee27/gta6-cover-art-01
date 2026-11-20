// Magic Hour Cover Studio — the poster renderer.
// Draws GTA-style multi-panel key art onto a canvas: real photos of people in
// panels, a big chrome title, script callouts, role tags, a seal and a billing
// block. Every layout is fractions of the panel area, so the same poster works
// at square, portrait and wide export sizes.

export const EXPORT_SIZES = {
  square: { w: 1080, h: 1080, label: 'Square 1080 x 1080' },
  portrait: { w: 1080, h: 1350, label: 'Portrait 1080 x 1350' },
  wide: { w: 1920, h: 1080, label: 'Wide 1920 x 1080' },
};

export const SAMPLES = [
  { id: 'hero', file: 'samples/hero.jpg', label: 'Hero', fx: 0.47, fy: 0.47 },
  { id: 'neon', file: 'samples/neon.jpg', label: 'Neon', fx: 0.55, fy: 0.4 },
  { id: 'vice', file: 'samples/vice.jpg', label: 'Vice', fx: 0.5, fy: 0.33 },
  { id: 'sunset', file: 'samples/sunset.jpg', label: 'Sunset', fx: 0.42, fy: 0.31 },
  { id: 'street', file: 'samples/street.jpg', label: 'Street', fx: 0.5, fy: 0.42 },
];

export const LAYOUTS = [
  {
    id: 'hero-trio', name: 'Hero + Trio', hero: 0,
    panels: [
      { x: 0, y: 0, w: 0.62, h: 1 },
      { x: 0.64, y: 0, w: 0.36, h: 0.32 },
      { x: 0.64, y: 0.34, w: 0.36, h: 0.32 },
      { x: 0.64, y: 0.68, w: 0.36, h: 0.32 },
    ],
  },
  {
    id: 'split-duo', name: 'Split Duo', hero: null,
    panels: [
      { x: 0, y: 0, w: 0.49, h: 1 },
      { x: 0.51, y: 0, w: 0.49, h: 1 },
    ],
  },
  {
    id: 'triptych', name: 'Triptych', hero: null,
    panels: [
      { x: 0, y: 0, w: 0.32, h: 1 },
      { x: 0.34, y: 0, w: 0.32, h: 1 },
      { x: 0.68, y: 0, w: 0.32, h: 1 },
    ],
  },
  {
    id: 'quad-grid', name: 'Quad Grid', hero: null,
    panels: [
      { x: 0, y: 0, w: 0.49, h: 0.49 },
      { x: 0.51, y: 0, w: 0.49, h: 0.49 },
      { x: 0, y: 0.51, w: 0.49, h: 0.49 },
      { x: 0.51, y: 0.51, w: 0.49, h: 0.49 },
    ],
  },
  {
    id: 'cast-five', name: 'Cast Five', hero: 0,
    panels: [
      { x: 0, y: 0, w: 0.55, h: 1 },
      { x: 0.57, y: 0, w: 0.21, h: 0.49 },
      { x: 0.79, y: 0, w: 0.21, h: 0.49 },
      { x: 0.57, y: 0.51, w: 0.21, h: 0.49 },
      { x: 0.79, y: 0.51, w: 0.21, h: 0.49 },
    ],
  },
  { id: 'solo-hero', name: 'Solo Hero', hero: 0, panels: [{ x: 0, y: 0, w: 1, h: 1 }] },
  {
    id: 'diagonal-cut', name: 'Diagonal Cut', hero: null,
    panels: [
      { x: 0, y: 0, w: 0.62, h: 1, poly: [[0, 0], [0.62, 0], [0.38, 1], [0, 1]], calloutSide: 'left', roleSide: 'right' },
      { x: 0.38, y: 0, w: 0.62, h: 1, poly: [[0.62, 0], [1, 0], [1, 1], [0.38, 1]], calloutSide: 'right', roleSide: 'left' },
    ],
  },
  {
    id: 'top-hero-duo', name: 'Top Hero + Duo', hero: 0,
    panels: [
      { x: 0, y: 0, w: 1, h: 0.58 },
      { x: 0, y: 0.6, w: 0.49, h: 0.4 },
      { x: 0.51, y: 0.6, w: 0.49, h: 0.4 },
    ],
  },
];

export const GRADES = [
  { id: 'sunset', name: 'Sunset', skyTop: '#ff9a3d', skyBottom: '#7a2a52', bg: '#241029', tint: 'rgba(255,110,60,0.16)', titleTop: '#fff6cf', titleBottom: '#ffb347', chromeMid: '#e2603a', accent: '#ffb347' },
  { id: 'golden-hour', name: 'Golden Hour', skyTop: '#ffd27a', skyBottom: '#8a4a1e', bg: '#2a160c', tint: 'rgba(255,170,60,0.14)', titleTop: '#fff3c4', titleBottom: '#ff9e3d', chromeMid: '#d97a2b', accent: '#ffcf6e' },
  { id: 'warm-sunset', name: 'Warm Sunset', skyTop: '#ff8a7a', skyBottom: '#6e1f3d', bg: '#2a101c', tint: 'rgba(255,90,90,0.14)', titleTop: '#ffe9c9', titleBottom: '#ff7a59', chromeMid: '#d94f4f', accent: '#ff9e8a' },
  { id: 'neon-night', name: 'Neon Night', skyTop: '#1b2a6b', skyBottom: '#0a0a24', bg: '#07071a', tint: 'rgba(40,120,255,0.16)', titleTop: '#e8f6ff', titleBottom: '#7ee7ff', chromeMid: '#2b6fd9', accent: '#3ee6ff' },
  { id: 'noir', name: 'Noir', skyTop: '#3a3a3a', skyBottom: '#101010', bg: '#0c0c0c', tint: 'rgba(0,0,0,0.18)', titleTop: '#f2f2f2', titleBottom: '#bdbdbd', chromeMid: '#6e6e6e', accent: '#e8e8e8' },
  { id: 'vice-pink', name: 'Vice Pink', skyTop: '#ff7ac0', skyBottom: '#3d1150', bg: '#220a26', tint: 'rgba(255,60,180,0.16)', titleTop: '#ffe3f2', titleBottom: '#ff6ec7', chromeMid: '#d93a9e', accent: '#ff8ad4' },
];

export const FRAMES = [
  { id: 'white', name: 'White', color: '#f2efe6' },
  { id: 'gold', name: 'Gold', color: '#d9a441' },
  { id: 'neon', name: 'Neon', color: '#3ee6ff' },
];

export const TITLE_STYLES = [
  { id: 'chrome', name: 'Chrome 3D' },
  { id: 'flat', name: 'Flat' },
  { id: 'outline', name: 'Outline' },
];

export const DEFAULT_CALLOUTS = ['THE GETAWAY', 'NO TURNING BACK', 'ONE LAST JOB', 'CITY OF VICE', 'RUNNING HOT'];
export const DEFAULT_ROLES = ['THE DRIVER', 'THE LOOKOUT', 'THE FIXER', 'THE WHEELMAN', 'THE INSIDE MAN'];

export const DEFAULT_SCENE = {
  layout: 'hero-trio',
  grade: 'sunset',
  frame: 'gold',
  titleStyle: 'chrome',
  title: 'VICE CITY',
  subtitle: 'a Vice City story',
  billing: 'MAGIC HOUR STUDIO PRESENTS',
  photos: ['hero', 'vice', 'neon', 'street'],
  callouts: DEFAULT_CALLOUTS,
  roles: DEFAULT_ROLES,
  crops: {},
  size: 'portrait',
  selected: 0,
};

export function layoutById(id) {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}

export function gradeById(id) {
  return GRADES.find((g) => g.id === id) ?? GRADES[0];
}

export function frameById(id) {
  return FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}

export function sampleById(id) {
  return SAMPLES.find((s) => s.id === id) ?? null;
}

/** Shrinks `text` from `start` px until it fits `maxWidth`; returns the final size. */
export function fitTextToWidth(ctx, text, family, weight, start, maxWidth, min = 10) {
  let size = start;
  ctx.font = `${weight} ${size}px ${family}`;
  while (size > min && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

export function pointInPolygon(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * Draws `img` to cover `bounds`, keeping the face anchor (`face`, fractions of
 * the image) on `target` (absolute canvas point), with a user zoom and pan.
 * The caller clips; this only positions and draws, clamped so the photo
 * always covers the whole bounds — a face never slides out of its panel.
 */
export function drawPhotoInto(ctx, img, bounds, face, target, zoom, pan) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const base = Math.max(bounds.w / iw, bounds.h / ih);
  const scale = base * (zoom || 1);
  const dw = iw * scale;
  const dh = ih * scale;
  let dx = target.x - face.fx * dw + (pan ? pan.x : 0);
  let dy = target.y - face.fy * dh + (pan ? pan.y : 0);
  if (dw > bounds.w) dx = Math.min(bounds.x, Math.max(bounds.x + bounds.w - dw, dx));
  else dx = bounds.x + (bounds.w - dw) / 2;
  if (dh > bounds.h) dy = Math.min(bounds.y, Math.max(bounds.y + bounds.h - dh, dy));
  else dy = bounds.y + (bounds.h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

/** The big title: striped retro-chrome 3D, flat, or outline — never clipped, always fitted. */
export function drawTitle(ctx, text, cx, baselineY, size, grade, style) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  if (style === 'flat') {
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = size * 0.08;
    ctx.shadowOffsetY = size * 0.02;
    ctx.fillStyle = grade.titleTop;
    ctx.font = `400 ${size}px Anton, sans-serif`;
    ctx.fillText(text, cx, baselineY);
  } else if (style === 'outline') {
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.font = `400 ${size}px Anton, sans-serif`;
    ctx.fillText(text, cx, baselineY);
    ctx.lineWidth = Math.max(2, size * 0.045);
    ctx.strokeStyle = grade.titleTop;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, cx, baselineY);
  } else {
    ctx.font = `400 ${size}px Anton, sans-serif`;
    ctx.fillStyle = '#160a18';
    for (let i = 4; i >= 1; i--) ctx.fillText(text, cx, baselineY + size * 0.014 * i);
    ctx.fillStyle = grade.chromeMid;
    ctx.fillText(text, cx, baselineY + size * 0.014 * 2);
    const grad = ctx.createLinearGradient(0, baselineY - size, 0, baselineY);
    grad.addColorStop(0, grade.titleTop);
    grad.addColorStop(0.55, grade.titleBottom);
    grad.addColorStop(1, grade.chromeMid);
    ctx.fillStyle = grad;
    ctx.fillText(text, cx, baselineY);
    ctx.lineWidth = Math.max(1.5, size * 0.012);
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineJoin = 'round';
    ctx.strokeText(text, cx, baselineY);
  }
  ctx.restore();
}

/** A script callout on a dark scrim, fully inside its panel with padding, shrunk to fit. */
export function drawCallout(ctx, text, rect, side) {
  if (!text) return;
  const inset = Math.max(8, rect.w * 0.045);
  let size = Math.max(12, rect.h * 0.085);
  size = fitTextToWidth(ctx, text, 'Pacifico', 400, size, rect.w - inset * 2, 10);
  ctx.font = `400 ${size}px Pacifico, cursive`;
  const tw = ctx.measureText(text).width;
  const padX = size * 0.45;
  const padY = size * 0.3;
  const boxW = tw + padX * 2;
  const boxH = size * 1.15 + padY;
  const bx = side === 'right' ? rect.x + rect.w - inset - boxW : rect.x + inset;
  const by = rect.y + rect.h - inset - boxH;
  ctx.save();
  ctx.fillStyle = 'rgba(8,4,12,0.62)';
  ctx.beginPath();
  ctx.roundRect(bx, by, boxW, boxH, Math.min(10, boxH * 0.3));
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, bx + padX, by + boxH / 2 + size * 0.04);
  ctx.restore();
}

/** A short role label on a dark pill at the top inside of a panel, shrunk to fit. */
export function drawRoleTag(ctx, text, rect, side) {
  if (!text) return;
  const inset = Math.max(8, rect.w * 0.045);
  let size = Math.max(10, rect.h * 0.055);
  ctx.letterSpacing = '2px';
  size = fitTextToWidth(ctx, text, 'Anton', 400, size, rect.w - inset * 2, 9);
  ctx.font = `400 ${size}px Anton, sans-serif`;
  const tw = ctx.measureText(text).width;
  const padX = size * 0.55;
  const padY = size * 0.35;
  const boxW = tw + padX * 2;
  const boxH = size + padY * 2;
  const bx = side === 'right' ? rect.x + rect.w - inset - boxW : rect.x + inset;
  const by = rect.y + inset;
  ctx.save();
  ctx.fillStyle = 'rgba(8,4,12,0.72)';
  ctx.beginPath();
  ctx.roundRect(bx, by, boxW, boxH, Math.min(8, boxH * 0.4));
  ctx.fill();
  ctx.fillStyle = '#ffcf6e';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, bx + padX, by + boxH / 2 + size * 0.05);
  ctx.restore();
  ctx.letterSpacing = '0px';
}

/** A round seal with a star and a VICE CITY ring, tucked inside the hero panel. */
export function drawSeal(ctx, rect) {
  const r = Math.max(16, Math.min(rect.w, rect.h) * 0.1);
  const cx = rect.x + rect.w - r - Math.max(10, rect.w * 0.05);
  const cy = rect.y + r + Math.max(10, rect.h * 0.05);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(10,6,16,0.85)';
  ctx.fill();
  ctx.lineWidth = Math.max(2, r * 0.07);
  ctx.strokeStyle = '#d9a441';
  ctx.stroke();
  const spikes = 5;
  const outer = r * 0.42;
  const inner = r * 0.19;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const rad = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / spikes;
    const x = cx + Math.cos(a) * rad;
    const y = cy - r * 0.18 + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = '#ffcf6e';
  ctx.fill();
  const label = 'VICE CITY';
  const size = fitTextToWidth(ctx, label, 'Anton', 400, r * 0.3, r * 1.5, 7);
  ctx.font = `400 ${size}px Anton, sans-serif`;
  ctx.fillStyle = '#f2efe6';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy + r * 0.52);
  ctx.restore();
}

/** The billing line in its own clear band at the bottom — nothing crosses it. */
export function drawBilling(ctx, text, w, h) {
  const bandY = h * 0.935;
  const bandH = h * 0.05;
  ctx.save();
  ctx.fillStyle = '#0d0714';
  ctx.fillRect(0, bandY, w, bandH);
  if (text) {
    ctx.letterSpacing = '3px';
    const size = fitTextToWidth(ctx, text, 'Anton', 400, bandH * 0.52, w * 0.9, 9);
    ctx.font = `400 ${size}px Anton, sans-serif`;
    ctx.fillStyle = '#f2efe6';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, bandY + bandH / 2 + size * 0.04);
    ctx.letterSpacing = '0px';
  }
  ctx.restore();
}

/** The poster's outer frame, plus a thin inner line. */
export function drawFrame(ctx, w, h, frame) {
  const fw = Math.max(4, w * 0.012);
  ctx.save();
  ctx.lineWidth = fw;
  ctx.strokeStyle = frame.color;
  ctx.strokeRect(fw / 2, fw / 2, w - fw, h - fw);
  ctx.lineWidth = Math.max(1, w * 0.0015);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.strokeRect(fw * 2, fw * 2, w - fw * 4, h - fw * 4);
  ctx.restore();
}

/** Absolute panel rects (and polygon points, when a panel is slanted) for a canvas. */
export function panelRects(layoutId, w, h) {
  const layout = layoutById(layoutId);
  const pa = { x: w * 0.02, y: h * 0.165, w: w * 0.96, h: h * 0.76 };
  return layout.panels.map((p, i) => {
    const rect = {
      x: pa.x + p.x * pa.w,
      y: pa.y + p.y * pa.h,
      w: p.w * pa.w,
      h: p.h * pa.h,
      hero: layout.hero === i,
      calloutSide: p.calloutSide ?? 'left',
      roleSide: p.roleSide ?? 'left',
      poly: null,
    };
    if (p.poly) {
      rect.poly = p.poly.map(([fx, fy]) => [pa.x + fx * pa.w, pa.y + fy * pa.h]);
    }
    return rect;
  });
}

export function hitPanel(layoutId, px, py, w, h) {
  const rects = panelRects(layoutId, w, h);
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    if (r.poly) {
      if (pointInPolygon(px, py, r.poly)) return i;
    } else if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
      return i;
    }
  }
  return -1;
}

/**
 * Draws the whole poster. `scene` carries layout, grade, frame, title style,
 * words, photo ids and per-panel crops. `photos` is an array aligned with the
 * panels: { img, fx, fy } or null for an empty panel.
 */
export function drawPoster(canvas, scene, photos) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const grade = gradeById(scene.grade);
  const frame = frameById(scene.frame);
  const layout = layoutById(scene.layout);
  const rects = panelRects(scene.layout, w, h);

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, grade.skyTop);
  sky.addColorStop(0.16, grade.skyBottom);
  sky.addColorStop(0.3, grade.bg);
  sky.addColorStop(1, grade.bg);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const title = (scene.title ?? '').trim();
  if (title) {
    const size = fitTextToWidth(ctx, title.toUpperCase(), 'Anton', 400, h * 0.082, w * 0.92, 20);
    drawTitle(ctx, title.toUpperCase(), w / 2, h * 0.098, size, grade, scene.titleStyle);
  }
  const subtitle = (scene.subtitle ?? '').trim();
  if (subtitle) {
    const size = fitTextToWidth(ctx, subtitle, 'Pacifico', 400, h * 0.03, w * 0.8, 12);
    ctx.save();
    ctx.font = `400 ${size}px Pacifico, cursive`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = size * 0.25;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(subtitle, w / 2, h * 0.135);
    ctx.restore();
  }

  const popH = h * 0.013;
  rects.forEach((rect, i) => {
    const photo = photos[i] ?? null;
    const crop = (scene.crops ?? {})[i] ?? { zoom: 1, ox: 0, oy: 0 };
    const clip = rect.hero
      ? { x: rect.x, y: rect.y - popH, w: rect.w, h: rect.h + popH }
      : { x: rect.x, y: rect.y, w: rect.w, h: rect.h };
    ctx.save();
    ctx.beginPath();
    if (rect.poly) {
      rect.poly.forEach(([px, py], j) => (j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
      ctx.closePath();
    } else {
      ctx.rect(clip.x, clip.y, clip.w, clip.h);
    }
    ctx.clip();
    if (photo && photo.img) {
      const target = { x: rect.x + rect.w * 0.5, y: rect.y + rect.h * 0.42 };
      if (grade.id === 'noir') ctx.filter = 'grayscale(0.8) contrast(1.06)';
      drawPhotoInto(ctx, photo.img, clip, { fx: photo.fx, fy: photo.fy }, target, crop.zoom, { x: crop.ox ?? 0, y: crop.oy ?? 0 });
      ctx.filter = 'none';
    } else {
      const empty = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h);
      empty.addColorStop(0, '#2a1a33');
      empty.addColorStop(1, '#120a18');
      ctx.fillStyle = empty;
      ctx.fillRect(clip.x, clip.y, clip.w, clip.h);
    }
    ctx.fillStyle = grade.tint;
    ctx.fillRect(clip.x, clip.y, clip.w, clip.h);
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    if (rect.poly) {
      rect.poly.forEach(([px, py], j) => (j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
      ctx.closePath();
    } else {
      ctx.rect(clip.x, clip.y, clip.w, clip.h);
    }
    ctx.lineWidth = Math.max(2, w * 0.002);
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.stroke();
    ctx.restore();
  });

  if (scene.layout === 'diagonal-cut') {
    const pa = { x: w * 0.02, y: h * 0.165, w: w * 0.96, h: h * 0.76 };
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pa.x + 0.62 * pa.w, pa.y);
    ctx.lineTo(pa.x + 0.38 * pa.w, pa.y + pa.h);
    ctx.lineWidth = Math.max(3, w * 0.003);
    ctx.strokeStyle = '#d9a441';
    ctx.stroke();
    ctx.restore();
  }

  rects.forEach((rect, i) => {
    const callout = (scene.callouts ?? [])[i] ?? '';
    drawCallout(ctx, callout, rect, rect.calloutSide);
    const isHeroPanel = layout.hero === i;
    if (!isHeroPanel && layout.panels.length > 1) {
      const role = (scene.roles ?? [])[i] ?? '';
      drawRoleTag(ctx, role, rect, rect.roleSide);
    }
  });

  const sealIndex = layout.hero != null ? layout.hero : rects.length - 1;
  drawSeal(ctx, rects[sealIndex]);

  drawBilling(ctx, (scene.billing ?? '').trim(), w, h);
  drawFrame(ctx, w, h, frame);

  if (scene.selected != null && scene.selected >= 0 && scene.selected < rects.length) {
    const r = rects[scene.selected];
    ctx.save();
    ctx.setLineDash([Math.max(8, w * 0.008), Math.max(6, w * 0.006)]);
    ctx.lineWidth = Math.max(3, w * 0.003);
    ctx.strokeStyle = '#ffcf6e';
    ctx.strokeRect(r.x, r.y, r.w, r.h);
    ctx.restore();
  }
}
