// Magic Hour Cover Studio — poster renderer.
// Geometry rule that drives everything: the billing band is a reserved strip at
// the bottom of the poster. No panel, picture, glow or streak ever enters it.
// Every piece of text sits on a dark scrim with padding inside its own panel,
// and decorative art never crosses any text.

export const GRADES = {
  neon: {
    label: 'Neon Night', skyTop: '#1a0a36', skyBottom: '#5c1060',
    tint: 'rgba(255, 60, 160, 0.16)', titleA: '#ffffff', titleB: '#7df9ff',
    accent: '#ff4fd8', band: '#150826', bandInk: '#ffd7f2', scrim: 'rgba(10, 4, 26, 0.72)',
  },
  golden: {
    label: 'Golden Hour', skyTop: '#ff9a3d', skyBottom: '#c23a6e',
    tint: 'rgba(255, 170, 60, 0.18)', titleA: '#ffffff', titleB: '#ffd76a',
    accent: '#ffc94d', band: '#3a1430', bandInk: '#ffe9b8', scrim: 'rgba(46, 12, 34, 0.66)',
  },
  cool: {
    label: 'Cool Blue', skyTop: '#0e2a5c', skyBottom: '#2a6db0',
    tint: 'rgba(60, 140, 255, 0.16)', titleA: '#ffffff', titleB: '#9fd4ff',
    accent: '#6fc3ff', band: '#0a1a38', bandInk: '#d6ecff', scrim: 'rgba(6, 16, 40, 0.70)',
  },
  warm: {
    label: 'Warm Sunset', skyTop: '#d84a2a', skyBottom: '#7a1e5c',
    tint: 'rgba(255, 90, 60, 0.18)', titleA: '#ffffff', titleB: '#ffb37a',
    accent: '#ff8a5c', band: '#33102a', bandInk: '#ffd9c4', scrim: 'rgba(44, 10, 30, 0.66)',
  },
  noir: {
    label: 'Noir', skyTop: '#111111', skyBottom: '#3a3a3a',
    tint: 'rgba(255, 255, 255, 0.08)', titleA: '#ffffff', titleB: '#cfcfcf',
    accent: '#e8e8e8', band: '#0a0a0a', bandInk: '#f0f0f0', scrim: 'rgba(0, 0, 0, 0.72)',
  },
  pastel: {
    label: 'Pastel', skyTop: '#ffd6e8', skyBottom: '#b8e6d5',
    tint: 'rgba(255, 180, 220, 0.14)', titleA: '#4a2a6a', titleB: '#8a4a9a',
    accent: '#c26a9a', band: '#4a2a5c', bandInk: '#ffe9f4', scrim: 'rgba(58, 26, 74, 0.62)',
  },
};

export const FRAMES = {
  white: { label: 'White', color: '#f4f1ea', glow: null },
  gold: { label: 'Gold', color: '#d8a93c', glow: null },
  neon: { label: 'Neon', color: '#46e8ff', glow: 'rgba(70, 232, 255, 0.55)' },
};

export const TITLE_STYLES = {
  flat: 'Flat',
  chrome: 'Chrome 3D',
  outline: 'Outline',
};

export const SIZES = {
  square: { label: 'Square', w: 1080, h: 1080 },
  portrait: { label: 'Portrait', w: 1080, h: 1350 },
  wide: { label: 'Wide', w: 1920, h: 1080 },
};

export const LAYOUTS = {
  solo: { label: 'Solo Hero', mode: 'hero', hero: 0, cast: false },
  heroTrio: { label: 'Hero + Trio', mode: 'hero', hero: 0, cast: false },
  splitDuo: { label: 'Split Duo', mode: 'band', hero: -1, cast: false },
  triptych: { label: 'Triptych', mode: 'band', hero: -1, cast: false },
  quad: { label: 'Quad Grid', mode: 'band', hero: -1, cast: false },
  cast: { label: 'Cast Five', mode: 'hero', hero: 0, cast: true },
  diagonal: { label: 'Diagonal Cut', mode: 'band', hero: -1, cast: false },
  topDuo: { label: 'Top Hero + Duo', mode: 'hero', hero: 0, cast: false },
  rows: { label: 'Three Rows', mode: 'band', hero: -1, cast: false },
  center: { label: 'Center Feature', mode: 'hero', hero: 0, cast: true },
  banner: { label: 'Wide Banner', mode: 'hero', hero: 0, cast: false },
  mosaic: { label: 'Mosaic Nine', mode: 'band', hero: -1, cast: false },
};

export const CALLOUTS = ['THE GETAWAY', 'NO TURNING BACK', 'ONE LAST JOB', 'CITY OF VICE', 'RUNNING HOT'];
export const ROLES = ['THE DRIVER', 'THE LOOKOUT', 'THE FIXER', 'THE WHEELMAN', 'THE INSIDE MAN'];
export const SAMPLES = ['art-neon', 'art-palms', 'art-street', 'art-skyline'];
export const BILLING = 'MAGIC HOUR STUDIO PRESENTS';

// Panel rectangles as fractions of the content area (x, y, w, h).
// The content area is the poster inside the frame and above the billing band.
function panelsFor(layout, cw, ch) {
  const g = 0.012;
  switch (layout) {
    case 'solo': return [{ x: 0, y: 0, w: 1, h: 1 }];
    case 'heroTrio': return [
      { x: 0, y: 0, w: 1, h: 0.62 },
      { x: 0, y: 0.62 + g, w: 0.325, h: 0.38 - g },
      { x: 0.3375, y: 0.62 + g, w: 0.325, h: 0.38 - g },
      { x: 0.675, y: 0.62 + g, w: 0.325, h: 0.38 - g },
    ];
    case 'splitDuo': return [
      { x: 0, y: 0, w: 0.494, h: 1 },
      { x: 0.506, y: 0, w: 0.494, h: 1 },
    ];
    case 'triptych': return [
      { x: 0, y: 0, w: 0.325, h: 1 },
      { x: 0.3375, y: 0, w: 0.325, h: 1 },
      { x: 0.675, y: 0, w: 0.325, h: 1 },
    ];
    case 'quad': return [
      { x: 0, y: 0, w: 0.494, h: 0.494 },
      { x: 0.506, y: 0, w: 0.494, h: 0.494 },
      { x: 0, y: 0.506, w: 0.494, h: 0.494 },
      { x: 0.506, y: 0.506, w: 0.494, h: 0.494 },
    ];
    case 'cast': return [
      { x: 0, y: 0, w: 0.56, h: 1 },
      { x: 0.572, y: 0, w: 0.208, h: 0.494 },
      { x: 0.792, y: 0, w: 0.208, h: 0.494 },
      { x: 0.572, y: 0.506, w: 0.208, h: 0.494 },
      { x: 0.792, y: 0.506, w: 0.208, h: 0.494 },
    ];
    case 'diagonal': return [
      { x: 0, y: 0, w: 1, h: 1, poly: [[0, 0], [1, 0], [0, 1]], text: { x: 0.04, y: 0.62, w: 0.42, h: 0.3 } },
      { x: 0, y: 0, w: 1, h: 1, poly: [[1, 0], [1, 1], [0, 1]], text: { x: 0.54, y: 0.08, w: 0.42, h: 0.3 } },
    ];
    case 'topDuo': return [
      { x: 0, y: 0, w: 1, h: 0.56 },
      { x: 0, y: 0.56 + g, w: 0.494, h: 0.44 - g },
      { x: 0.506, y: 0.56 + g, w: 0.494, h: 0.44 - g },
    ];
    case 'rows': return [
      { x: 0, y: 0, w: 1, h: 0.325 },
      { x: 0, y: 0.3375, w: 1, h: 0.325 },
      { x: 0, y: 0.675, w: 1, h: 0.325 },
    ];
    case 'center': return [
      { x: 0.2, y: 0.14, w: 0.6, h: 0.72 },
      { x: 0, y: 0, w: 0.188, h: 0.3 },
      { x: 0.812, y: 0, w: 0.188, h: 0.3 },
      { x: 0, y: 0.7, w: 0.188, h: 0.3 },
      { x: 0.812, y: 0.7, w: 0.188, h: 0.3 },
    ];
    case 'banner': return [
      { x: 0, y: 0, w: 1, h: 0.6 },
      { x: 0, y: 0.6 + g, w: 1, h: 0.4 - g },
    ];
    case 'mosaic': return [
      { x: 0, y: 0, w: 0.325, h: 0.325 }, { x: 0.3375, y: 0, w: 0.325, h: 0.325 }, { x: 0.675, y: 0, w: 0.325, h: 0.325 },
      { x: 0, y: 0.3375, w: 0.325, h: 0.325 }, { x: 0.3375, y: 0.3375, w: 0.325, h: 0.325 }, { x: 0.675, y: 0.3375, w: 0.325, h: 0.325 },
      { x: 0, y: 0.675, w: 0.325, h: 0.325 }, { x: 0.3375, y: 0.675, w: 0.325, h: 0.325 }, { x: 0.675, y: 0.675, w: 0.325, h: 0.325 },
    ];
    default: return [{ x: 0, y: 0, w: 1, h: 1 }];
  }
}

export function panelCount(layout) {
  return panelsFor(layout, 1, 1).length;
}

export function createState() {
  return {
    layout: 'heroTrio', grade: 'neon', frame: 'gold', titleStyle: 'chrome',
    size: 'square', title: 'VICE HEIST', subtitle: 'a Vice City story',
    panels: [],
  };
}

export function defaultPanels(layout) {
  return panelsFor(layout, 1, 1).map((p, i) => ({
    src: SAMPLES[i % SAMPLES.length],
    ox: 0, oy: 0, z: 1,
    callout: CALLOUTS[i % CALLOUTS.length],
    role: ROLES[i % ROLES.length],
  }));
}

function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function fitFont(ctx, text, family, maxW, start, min, weight) {
  const w = weight ? `${weight} ` : '';
  let size = start;
  ctx.font = `${w}${size}px ${family}`;
  while (size > min && ctx.measureText(text).width > maxW) {
    size -= 1;
    ctx.font = `${w}${size}px ${family}`;
  }
  return size;
}

function drawPhoto(ctx, img, px, py, pw, ph, ox, oy, z) {
  if (!img) return;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const base = Math.max(pw / iw, ph / ih) * z;
  const dw = iw * base;
  const dh = ih * base;
  const dx = px + (pw - dw) / 2 + ox * pw;
  const dy = py + (ph - dh) / 2 + oy * ph;
  ctx.drawImage(img, dx, dy, dw, dh);
}

// A callout sits fully inside its panel: padded on all sides, on a dark scrim,
// shrunk to fit the panel width. The script font's swashes overhang its measured
// width and its descenders drop below the em box, so the text is fitted to 86%
// of the free width and the scrim is taller than the font size, and the whole
// box is clamped inside the panel with padding on every side.
function drawCallout(ctx, panel, text, grade, px, py, pw, ph) {
  if (!text || !text.trim()) return;
  const pad = Math.max(8, pw * 0.05);
  const maxW = (pw - pad * 2) * 0.86;
  const start = Math.max(14, Math.min(ph * 0.15, pw * 0.08));
  const size = fitFont(ctx, text, '"Pacifico", cursive', maxW, start, 10);
  ctx.font = `${size}px "Pacifico", cursive`;
  const tw = ctx.measureText(text).width;
  const boxW = Math.min(tw + pad * 1.6, pw - pad);
  const boxH = size * 1.9;
  let bx = px + (pw - boxW) / 2;
  bx = Math.max(px + pad * 0.5, Math.min(bx, px + pw - pad * 0.5 - boxW));
  const by = py + ph - pad * 1.6 - boxH;
  ctx.fillStyle = 'rgba(8, 4, 18, 0.66)';
  roundRectPath(ctx, bx, by, boxW, boxH, boxH / 2);
  ctx.fill();
  ctx.font = `${size}px "Pacifico", cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, bx + boxW / 2, by + boxH / 2 + size * 0.06);
}

// A role tag is a small pill at the top of a panel, inset from every edge.
function drawRoleTag(ctx, panel, text, px, py, pw, ph) {
  if (!text || !text.trim()) return;
  const pad = Math.max(8, pw * 0.05);
  const start = Math.max(10, Math.min(ph * 0.075, pw * 0.062));
  const size = fitFont(ctx, text, 'Anton, sans-serif', (pw - pad * 2) * 0.92, start, 8, 'bold');
  ctx.font = `bold ${size}px Anton, sans-serif`;
  const tw = ctx.measureText(text).width;
  const boxW = tw + pad * 1.4;
  const boxH = size * 1.7;
  const bx = px + pad;
  const by = py + pad;
  ctx.fillStyle = 'rgba(8, 4, 18, 0.72)';
  roundRectPath(ctx, bx, by, boxW, boxH, 3);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = Math.max(1, size * 0.08);
  roundRectPath(ctx, bx, by, boxW, boxH, 3);
  ctx.stroke();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, bx + pad * 0.7, by + boxH / 2 + size * 0.05);
}

function drawTitle(ctx, state, grade, zone) {
  const title = (state.title || '').trim().toUpperCase();
  const sub = (state.subtitle || '').trim();
  if (!title && !sub) return;
  const { x, y, w, h } = zone;
  // Soft sky glow behind the title only: a radial wash, no lines, no streaks.
  const glow = ctx.createRadialGradient(x + w / 2, y + h * 0.42, 4, x + w / 2, y + h * 0.42, Math.max(w, h) * 0.62);
  glow.addColorStop(0, grade.tint);
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x, y, w, h);
  if (title) {
    const maxW = w * 0.94;
    const start = Math.min(h * 0.52, w * 0.16);
    const size = fitFont(ctx, title, 'Anton, sans-serif', maxW, start, 18);
    const ty = y + h * 0.44;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (state.titleStyle === 'outline') {
      ctx.font = `${size}px Anton, sans-serif`;
      ctx.lineWidth = Math.max(2, size * 0.07);
      ctx.strokeStyle = grade.titleA;
      ctx.strokeText(title, x + w / 2, ty);
    } else if (state.titleStyle === 'chrome') {
      const grad = ctx.createLinearGradient(0, ty - size * 0.55, 0, ty + size * 0.55);
      grad.addColorStop(0, grade.titleA);
      grad.addColorStop(0.55, grade.titleB);
      grad.addColorStop(1, grade.titleA);
      ctx.font = `${size}px Anton, sans-serif`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillText(title, x + w / 2 + size * 0.045, ty + size * 0.06);
      ctx.fillStyle = grad;
      ctx.fillText(title, x + w / 2, ty);
    } else {
      ctx.font = `${size}px Anton, sans-serif`;
      ctx.fillStyle = grade.titleA;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = size * 0.14;
      ctx.fillText(title, x + w / 2, ty);
      ctx.shadowBlur = 0;
    }
    if (sub) {
      const subSize = Math.max(13, Math.min(size * 0.34, h * 0.19));
      ctx.font = `${subSize}px "Pacifico", cursive`;
      ctx.fillStyle = grade.accent;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = subSize * 0.25;
      ctx.fillText(sub, x + w / 2, ty + size * 0.62);
      ctx.shadowBlur = 0;
    }
  } else if (sub) {
    const subSize = Math.max(13, h * 0.3);
    ctx.font = `${subSize}px "Pacifico", cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = grade.accent;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = subSize * 0.25;
    ctx.fillText(sub, x + w / 2, y + h / 2);
    ctx.shadowBlur = 0;
  }
}

// Hit-test a point (in content-area fractions) against the panels.
export function hitPanel(layout, fx, fy) {
  const panels = panelsFor(layout, 1, 1);
  for (let i = panels.length - 1; i >= 0; i--) {
    const p = panels[i];
    if (p.poly) {
      const [a, b, c] = p.poly;
      const d = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
      const u = ((b[1] - c[1]) * (fx - c[0]) + (c[0] - b[0]) * (fy - c[1])) / d;
      const v = ((c[1] - a[1]) * (fx - c[0]) + (a[0] - c[0]) * (fy - c[1])) / d;
      if (u >= 0 && v >= 0 && u + v <= 1) return i;
    } else if (fx >= p.x && fx <= p.x + p.w && fy >= p.y && fy <= p.y + p.h) {
      return i;
    }
  }
  return -1;
}

// Draws the whole poster onto ctx at the canvas's own size.
// images: Map from sample name to a loaded image (or null for a missing photo).
export function drawPoster(ctx, state, images, w, h) {
  const grade = GRADES[state.grade] || GRADES.neon;
  const frame = FRAMES[state.frame] || FRAMES.white;
  const layout = LAYOUTS[state.layout] || LAYOUTS.heroTrio;
  const fw = Math.max(6, Math.min(w, h) * 0.016);
  const bandH = Math.max(26, h * 0.062);
  const cx0 = fw;
  const cy0 = fw;
  const cw = w - fw * 2;
  const ch = h - fw * 2 - bandH;
  // Sky.
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, grade.skyTop);
  sky.addColorStop(1, grade.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  // Title band for band-mode layouts: the top strip of the content area.
  const bandMode = layout.mode === 'band';
  const titleBandH = bandMode ? ch * 0.17 : 0;
  const panelTop = cy0 + titleBandH;
  const panelH = ch - titleBandH;
  if (bandMode) {
    drawTitle(ctx, state, grade, { x: cx0, y: cy0, w: cw, h: titleBandH });
  }
  // Panels.
  const panels = panelsFor(state.layout, 1, 1);
  panels.forEach((p, i) => {
    const px = cx0 + p.x * cw;
    const py = panelTop + p.y * panelH;
    const pw = p.w * cw;
    const ph = p.h * panelH;
    const data = state.panels[i] || {};
    ctx.save();
    if (p.poly) {
      ctx.beginPath();
      p.poly.forEach(([fx, fy], k) => {
        const X = cx0 + fx * cw;
        const Y = panelTop + fy * panelH;
        if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      });
      ctx.closePath();
      ctx.clip();
    } else {
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();
    }
    const img = data.src ? images.get(data.src) : null;
    drawPhoto(ctx, img, px, py, pw, ph, data.ox || 0, data.oy || 0, data.z || 1);
    ctx.fillStyle = grade.tint;
    ctx.fillRect(px, py, pw, ph);
    ctx.restore();
    // Panel divider line (thin, inside the panel edge).
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = Math.max(1, Math.min(w, h) * 0.002);
    if (p.poly) {
      ctx.beginPath();
      ctx.moveTo(cx0 + cw, panelTop);
      ctx.lineTo(cx0, panelTop + panelH);
      ctx.stroke();
    } else {
      ctx.strokeRect(px, py, pw, ph);
    }
    // Text: role tag at the top, callout at the bottom, both inside the panel.
    const tp = p.text ? { x: cx0 + p.text.x * cw, y: panelTop + p.text.y * panelH, w: p.text.w * cw, h: p.text.h * panelH } : { x: px, y: py, w: pw, h: ph };
    if (layout.cast && i > 0) drawRoleTag(ctx, p, data.role || '', tp.x, tp.y, tp.w, tp.h);
    drawCallout(ctx, p, data.callout || '', grade, tp.x, tp.y, tp.w, tp.h);
    // Hero title overlays the hero panel's top, on a scrim, clear of its callout.
    if (layout.mode === 'hero' && i === layout.hero) {
      const th = ph * 0.34;
      const scrim = ctx.createLinearGradient(0, py, 0, py + th);
      scrim.addColorStop(0, grade.scrim);
      scrim.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = scrim;
      ctx.fillRect(px, py, pw, th);
      drawTitle(ctx, state, grade, { x: px, y: py, w: pw, h: th });
    }
  });
  // Billing band: a solid strip at the bottom; nothing ever crosses it.
  const bandY = h - fw - bandH;
  ctx.fillStyle = grade.band;
  ctx.fillRect(fw, bandY, w - fw * 2, bandH);
  ctx.strokeStyle = grade.accent;
  ctx.lineWidth = Math.max(1, Math.min(w, h) * 0.0015);
  ctx.beginPath();
  ctx.moveTo(fw, bandY);
  ctx.lineTo(w - fw, bandY);
  ctx.stroke();
  const bSize = Math.max(12, Math.min(bandH * 0.44, w * 0.022));
  ctx.font = `bold ${bSize}px Anton, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = grade.bandInk;
  const bText = BILLING;
  const bw = ctx.measureText(bText).width;
  if (bw > (w - fw * 2) * 0.92) {
    ctx.font = `bold ${Math.floor(bSize * (w - fw * 2) * 0.92 / bw)}px Anton, sans-serif`;
  }
  ctx.fillText(bText, w / 2, bandY + bandH / 2);
  // Frame around the whole poster.
  ctx.lineWidth = fw;
  ctx.strokeStyle = frame.color;
  if (frame.glow) {
    ctx.shadowColor = frame.glow;
    ctx.shadowBlur = fw * 1.6;
  }
  ctx.strokeRect(fw / 2, fw / 2, w - fw, h - fw);
  ctx.shadowBlur = 0;
}
