// Draws the cover: a multi-panel poster with a sunset/neon colour grade, a white
// frame, and bold Anton caption lettering. Everything is drawn on one canvas, so
// the preview and the exported PNG are the same picture at different sizes.

// Layouts: panels in unit coordinates of the cover, and the caption band below
// them. A layout with `band: null` puts its title over the art instead, in
// `captionZone`, over a scrim. `slant` shears a panel into a parallelogram;
// `gapless` panels abut with no gap, so slanted seams stay clean.
export const LAYOUTS = {
  quad: {
    label: "Four panels",
    panels: [
      { x: 0, y: 0, w: 0.5, h: 0.41 }, { x: 0.5, y: 0, w: 0.5, h: 0.41 },
      { x: 0, y: 0.41, w: 0.5, h: 0.41 }, { x: 0.5, y: 0.41, w: 0.5, h: 0.41 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  hero: {
    label: "Hero + strip",
    panels: [
      { x: 0, y: 0, w: 1, h: 0.58 },
      { x: 0, y: 0.58, w: 0.34, h: 0.24 }, { x: 0.34, y: 0.58, w: 0.33, h: 0.24 },
      { x: 0.67, y: 0.58, w: 0.33, h: 0.24 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  triptych: {
    label: "Three up",
    panels: [
      { x: 0, y: 0, w: 0.34, h: 0.82 }, { x: 0.34, y: 0, w: 0.33, h: 0.82 },
      { x: 0.67, y: 0, w: 0.33, h: 0.82 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  six: {
    label: "Six grid",
    panels: [
      { x: 0, y: 0, w: 0.34, h: 0.41 }, { x: 0.34, y: 0, w: 0.33, h: 0.41 },
      { x: 0.67, y: 0, w: 0.33, h: 0.41 },
      { x: 0, y: 0.41, w: 0.34, h: 0.41 }, { x: 0.34, y: 0.41, w: 0.33, h: 0.41 },
      { x: 0.67, y: 0.41, w: 0.33, h: 0.41 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  duo: {
    label: "Duo",
    panels: [
      { x: 0, y: 0, w: 0.5, h: 0.82 }, { x: 0.5, y: 0, w: 0.5, h: 0.82 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  strip: {
    label: "Tall + two",
    panels: [
      { x: 0, y: 0, w: 0.45, h: 0.82 },
      { x: 0.45, y: 0, w: 0.55, h: 0.41 }, { x: 0.45, y: 0.41, w: 0.55, h: 0.41 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  slash: {
    label: "Key Art Slash",
    gapless: true,
    panels: [
      { x: 0, y: 0, w: 0.38, h: 1, slant: 0.09 },
      { x: 0.31, y: 0, w: 0.38, h: 1, slant: 0.09 },
      { x: 0.62, y: 0, w: 0.38, h: 1, slant: 0.09 },
    ],
    band: null,
    captionZone: { x: 0, y: 0.66, w: 1, h: 0.34 },
  },
  keyart: {
    label: "Key Art",
    panels: [{ x: 0, y: 0, w: 1, h: 1 }],
    band: null,
    captionZone: { x: 0, y: 0.58, w: 1, h: 0.42 },
  },
  single: {
    label: "One photo",
    panels: [{ x: 0, y: 0, w: 1, h: 1 }],
    band: null,
    captionZone: { x: 0, y: 0.74, w: 1, h: 0.26 },
  },
};

// Colour grades: a wash over each panel, strongest at the bottom.
export const GRADES = {
  sunset: {
    label: "Sunset",
    swatch: "linear-gradient(135deg,#ffd23e,#ff6a3d 45%,#c81e78)",
    top: "rgba(255,120,60,0.05)", bottom: "rgba(200,30,120,0.34)",
    tint: "rgba(255,140,60,0.10)",
  },
  neon: {
    label: "Neon night",
    swatch: "linear-gradient(135deg,#3ec6ff,#7a2bff 50%,#ff2e88)",
    top: "rgba(90,40,255,0.16)", bottom: "rgba(255,40,160,0.30)",
    tint: "rgba(60,200,255,0.07)",
  },
  dusk: {
    label: "Palm dusk",
    swatch: "linear-gradient(135deg,#ff9ec6,#c81e78 50%,#3a1a6e)",
    top: "rgba(90,30,140,0.20)", bottom: "rgba(255,80,140,0.30)",
    tint: "rgba(255,110,160,0.08)",
  },
  none: {
    label: "No grade",
    swatch: "linear-gradient(135deg,#888,#444)",
    top: "rgba(0,0,0,0)", bottom: "rgba(0,0,0,0.10)",
    tint: "rgba(0,0,0,0)",
  },
};

export const INKS = [
  { label: "White", value: "#ffffff" },
  { label: "Sun yellow", value: "#ffd23e" },
  { label: "Neon cyan", value: "#3ec6ff" },
  { label: "Hot pink", value: "#ff7ab8" },
];

/** Seeded random, so the grain is identical on every render of the same cover. */
function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function makeGrain(size, seed) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(size, size);
  const rnd = seededRandom(seed);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(rnd() * 255);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
let grainTile = null;
function getGrain() {
  if (!grainTile) grainTile = makeGrain(140, 20261119);
  return grainTile;
}

/** The panel's outline as a path: a rectangle, or a parallelogram when slanted. */
export function panelPath(ctx, rx, ry, rw, rh, slantPx) {
  const s = slantPx || 0;
  ctx.beginPath();
  ctx.moveTo(rx + s, ry);
  ctx.lineTo(rx + rw + s, ry);
  ctx.lineTo(rx + rw - s, ry + rh);
  ctx.lineTo(rx - s, ry + rh);
  ctx.closePath();
}

/** Draws one photo into a panel rect, cover-fit, panned and zoomed. */
export function drawPhotoInPanel(ctx, photo, rx, ry, rw, rh, slantPx) {
  const img = photo.img;
  const base = Math.max(rw / img.naturalWidth, rh / img.naturalHeight);
  const scale = base * photo.scale;
  const pw = img.naturalWidth * scale;
  const ph = img.naturalHeight * scale;
  const cx = rx + rw / 2 + photo.ox * rw;
  const cy = ry + rh / 2 + photo.oy * rh;
  ctx.save();
  panelPath(ctx, rx, ry, rw, rh, slantPx);
  ctx.clip();
  ctx.drawImage(img, cx - pw / 2, cy - ph / 2, pw, ph);
  ctx.restore();
}

/** Washes a panel with the grade and darkens its corners. */
function gradePanel(ctx, grade, rx, ry, rw, rh, slantPx) {
  ctx.save();
  panelPath(ctx, rx, ry, rw, rh, slantPx);
  ctx.clip();
  const wash = ctx.createLinearGradient(0, ry, 0, ry + rh);
  wash.addColorStop(0, grade.top);
  wash.addColorStop(1, grade.bottom);
  ctx.fillStyle = wash;
  ctx.fillRect(rx - Math.abs(slantPx || 0), ry, rw + 2 * Math.abs(slantPx || 0), rh);
  ctx.fillStyle = grade.tint;
  ctx.fillRect(rx - Math.abs(slantPx || 0), ry, rw + 2 * Math.abs(slantPx || 0), rh);
  const vig = ctx.createRadialGradient(
    rx + rw / 2, ry + rh / 2, Math.min(rw, rh) * 0.42,
    rx + rw / 2, ry + rh / 2, Math.max(rw, rh) * 0.75,
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(10,4,20,0.38)");
  ctx.fillStyle = vig;
  ctx.fillRect(rx - Math.abs(slantPx || 0), ry, rw + 2 * Math.abs(slantPx || 0), rh);
  ctx.restore();
}
/** Splits a caption into at most two lines that fit `maxWidth`. */
function wrapCaption(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines = [""];
  for (const word of words) {
    const trial = lines[lines.length - 1] ? `${lines[lines.length - 1]} ${word}` : word;
    if (ctx.measureText(trial).width <= maxWidth || !lines[lines.length - 1]) {
      lines[lines.length - 1] = trial;
    } else if (lines.length === 1) {
      lines.push(word);
    } else {
      lines[1] = `${lines[1]} ${word}`;
    }
  }
  return lines.slice(0, 2);
}

/** Draws the caption stack into a zone: stars + quote, the big caption,
 * a gold rule with the sub-caption, and tag chips. Shrinks until it fits. */
function drawLettering(ctx, state, bx, by, bw, bh) {
  const text = (state.caption || "").trim().toUpperCase();
  const sub = (state.subcaption || "").trim().toUpperCase();
  const extras = state.extras || {};
  const quote = extras.starsOn ? (extras.quote || "").trim() : "";
  const tags = extras.tagsOn ? (extras.tags || "").split(/[·,]/).map((t) => t.trim().toUpperCase()).filter(Boolean) : [];
  const pad = bw * 0.035;
  const maxWidth = bw - pad * 2;
  if (!text && !quote && tags.length === 0) return;

  // Fit: shrink the caption until the whole stack fits the zone height.
  let size = bh * 0.46 * (state.captionScale / 100);
  const measure = (s) => {
    ctx.font = `${s}px Anton, "Arial Narrow", sans-serif`;
    const lines = text ? wrapCaption(ctx, text, maxWidth) : [];
    const lineHeight = s * 1.04;
    const quoteH = quote ? s * 0.60 : 0;
    const subH = sub ? s * 0.20 + s * 0.34 : 0;
    const tagsH = tags.length ? s * 0.46 : 0;
    return { lines, total: quoteH + lines.length * lineHeight + subH + tagsH, lineHeight };
  };
  let m = measure(size);
  while ((m.total > bh * 0.97 || m.lines.length > 2) && size > 14) {
    size -= 2;
    m = measure(size);
  }
  const { lines, lineHeight } = m;
  let y = by + (bh - m.total) / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  if (quote) {
    const qSize = Math.max(11, size * 0.24);
    ctx.font = `${qSize}px "DejaVu Sans", system-ui, sans-serif`;
    ctx.fillStyle = "#ffd23e";
    ctx.fillText("★★★★★", bx + bw / 2, y + qSize);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = `italic ${qSize}px Georgia, serif`;
    let qText = quote;
    while (ctx.measureText(`“${qText}”`).width > maxWidth && qText.length > 10) {
      qText = qText.slice(0, -1);
    }
    const q = qText.length < quote.length ? `“${qText}…”` : `“${qText}”`;
    ctx.fillText(q, bx + bw / 2, y + qSize * 2.15);
    y += size * 0.60;
  }

  for (const line of lines) {
    const top = y + size * 0.82;
    ctx.font = `${size}px Anton, "Arial Narrow", sans-serif`;
    ctx.fillStyle = "rgba(255,46,136,0.85)";
    ctx.fillText(line, bx + bw / 2 + size * 0.045, top + size * 0.045);
    ctx.lineWidth = Math.max(2, size * 0.11);
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1c0b26";
    ctx.strokeText(line, bx + bw / 2, top);
    ctx.fillStyle = state.ink;
    ctx.fillText(line, bx + bw / 2, top);
    y += lineHeight;
  }

  if (sub) {
    const subSize = Math.max(11, size * 0.2);
    ctx.font = `700 ${subSize}px system-ui, sans-serif`;
    const ruleY = y + size * 0.14;
    const ruleW = Math.min(bw * 0.5, ctx.measureText(sub).width + subSize * 3);
    ctx.strokeStyle = "#ffd23e";
    ctx.lineWidth = Math.max(2, subSize * 0.14);
    ctx.beginPath();
    ctx.moveTo(bx + bw / 2 - ruleW / 2, ruleY);
    ctx.lineTo(bx + bw / 2 + ruleW / 2, ruleY);
    ctx.stroke();
    ctx.fillStyle = "#ffd23e";
    ctx.fillText(sub, bx + bw / 2, ruleY + subSize * 1.5);
    y += size * 0.20 + size * 0.34;
  }

  if (tags.length) {
    const tagSize = Math.max(10, size * 0.17);
    ctx.font = `700 ${tagSize}px system-ui, sans-serif`;
    const gap = tagSize * 0.9;
    const widths = tags.map((t) => ctx.measureText(t).width + tagSize * 1.6);
    const rowW = widths.reduce((a, b) => a + b, 0) + gap * (tags.length - 1);
    let tx = bx + bw / 2 - rowW / 2;
    const ty = y + tagSize * 0.5;
    tags.forEach((t, i) => {
      const tw = widths[i];
      ctx.beginPath();
      ctx.roundRect(tx, ty, tw, tagSize * 2.1, tagSize);
      ctx.fillStyle = "rgba(22,10,32,0.55)";
      ctx.fill();
      ctx.strokeStyle = "#ffd23e";
      ctx.lineWidth = Math.max(1, tagSize * 0.1);
      ctx.stroke();
      ctx.fillStyle = "#ffd23e";
      ctx.fillText(t, tx + tw / 2, ty + tagSize * 1.45);
      tx += tw + gap;
    });
  }
}

/** A starburst seal in a corner, e.g. "NEW". */
function drawSeal(ctx, text, cx, cy, r) {
  const points = 14;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.21);
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.78;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const px = Math.cos(a) * rad;
    const py = Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = "#ffd23e";
  ctx.fill();
  ctx.lineWidth = Math.max(2, r * 0.07);
  ctx.strokeStyle = "#1c0b26";
  ctx.stroke();
  const label = (text || "NEW").trim().toUpperCase();
  let size = r * 0.52;
  ctx.font = `${size}px Anton, "Arial Narrow", sans-serif`;
  while (ctx.measureText(label).width > r * 1.5 && size > 8) {
    size -= 1;
    ctx.font = `${size}px Anton, "Arial Narrow", sans-serif`;
  }
  ctx.fillStyle = "#1c0b26";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 0, 1);
  ctx.restore();
}

/** A pill badge, e.g. "GOLDEN HOUR", top-left. */
function drawPill(ctx, text, x, y, h) {
  const label = (text || "").trim().toUpperCase();
  if (!label) return;
  const size = h * 0.52;
  ctx.font = `700 ${size}px system-ui, sans-serif`;
  const w = ctx.measureText(label).width + h * 1.1;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fillStyle = "#ff2e88";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
}

/**
 * Draws the whole cover onto `canvas` at its own size.
 * `state`: { layout, grade, photos, assignments, caption, subcaption, ink,
 *   captionScale, selectedPanel, extras }.
 * Returns the panel rectangles in canvas pixels, for hit-testing.
 */
export function drawCover(canvas, state) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const layout = LAYOUTS[state.layout] ?? LAYOUTS.hero;
  const grade = GRADES[state.grade] ?? GRADES.sunset;
  const extras = state.extras || {};
  const frame = Math.round(w * 0.012);
  const gap = layout.gapless ? 0 : Math.max(2, Math.round(w * 0.007));

  // White poster frame.
  ctx.fillStyle = "#f6f1e7";
  ctx.fillRect(0, 0, w, h);
  const ix = frame;
  const iy = frame;
  const iw = w - frame * 2;
  const ih = h - frame * 2;

  // Dark sheet behind the panels.
  ctx.fillStyle = "#160a20";
  ctx.fillRect(ix, iy, iw, ih);

  const panelsPx = layout.panels.map((p) => {
    const rx = ix + p.x * iw;
    const ry = iy + p.y * ih;
    const rw = p.w * iw;
    const rh = p.h * ih;
    return { x: rx, y: ry, w: rw, h: rh, slant: p.slant ? p.slant * rw : 0 };
  });

  panelsPx.forEach((rect, i) => {
    // A missing assignment falls back to cycling the loaded photos, so a
    // layout with more panels than assignments still fills every panel.
    const assigned = state.assignments[i];
    const photo = state.photos[assigned ?? (state.photos.length ? i % state.photos.length : -1)];
    const px = rect.x + gap / 2;
    const py = rect.y + gap / 2;
    const pw = rect.w - gap;
    const ph = rect.h - gap;
    if (photo) {
      drawPhotoInPanel(ctx, photo, px, py, pw, ph, rect.slant);
      gradePanel(ctx, grade, px, py, pw, ph, rect.slant);
    } else {
      ctx.fillStyle = "#241a30";
      ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.font = `700 ${Math.max(14, pw * 0.05)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(`PANEL ${i + 1}`, px + pw / 2, py + ph / 2);
    }
    // Thin white keyline around each panel, following its outline.
    panelPath(ctx, px, py, pw, ph, rect.slant);
    ctx.strokeStyle = "rgba(246,241,231,0.9)";
    ctx.lineWidth = Math.max(1, w * 0.0015);
    ctx.stroke();
    if (state.selectedPanel === i) {
      panelPath(ctx, px, py, pw, ph, rect.slant);
      ctx.strokeStyle = "#ffd23e";
      ctx.lineWidth = Math.max(3, w * 0.004);
      ctx.stroke();
    }
  });

  // Caption band, or a scrim over the art with the title on top.
  if (layout.band) {
    const bx = ix + layout.band.x * iw;
    const by = iy + layout.band.y * ih;
    const bw = layout.band.w * iw;
    const bh = layout.band.h * ih;
    ctx.fillStyle = "#160a20";
    ctx.fillRect(bx, by, bw, bh);
    drawLettering(ctx, state, bx, by, bw, bh);
  } else {
    const zone = layout.captionZone || { x: 0, y: 0.74, w: 1, h: 0.26 };
    const zx = ix + zone.x * iw;
    const zy = iy + zone.y * ih;
    const zw = zone.w * iw;
    const zh = zone.h * ih;
    const scrim = ctx.createLinearGradient(0, zy - zh * 0.4, 0, zy + zh);
    scrim.addColorStop(0, "rgba(22,10,32,0)");
    scrim.addColorStop(1, "rgba(22,10,32,0.85)");
    ctx.fillStyle = scrim;
    ctx.fillRect(ix, zy - zh * 0.4, iw, zh * 1.4);
    drawLettering(ctx, state, zx, zy, zw, zh);
  }

  // Extras: seal top-right, pill top-left.
  if (extras.sealOn) {
    drawSeal(ctx, extras.seal, ix + iw - w * 0.075, iy + w * 0.075, w * 0.062);
  }
  if (extras.pillOn) {
    drawPill(ctx, extras.pill, ix + w * 0.02, iy + w * 0.02, h * 0.042);
  }

  // Film grain over everything, faint and deterministic.
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = ctx.createPattern(getGrain(), "repeat");
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  return panelsPx;
}
