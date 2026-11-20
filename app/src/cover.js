// Draws the cover: a multi-panel poster with a sunset/neon colour grade, a poster
// frame (white, gold or neon), and bold caption lettering in a flat, Chrome 3D or
// outline style. Everything is drawn on one canvas, so the preview and the
// exported PNG are the same picture at different sizes.

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
  comic: {
    label: "Slashed Comic",
    gapless: true,
    panels: [
      { x: 0, y: 0, w: 0.4, h: 1, slant: 0.16 },
      { x: 0.30, y: 0, w: 0.4, h: 1, slant: 0.16 },
      { x: 0.60, y: 0, w: 0.4, h: 1, slant: 0.16 },
    ],
    band: null,
    captionZone: { x: 0, y: 0.66, w: 1, h: 0.34 },
  },
  cast: {
    label: "Cast Grid",
    panels: [
      { x: 0, y: 0, w: 1, h: 0.46 },
      { x: 0, y: 0.46, w: 0.25, h: 0.36 }, { x: 0.25, y: 0.46, w: 0.25, h: 0.36 },
      { x: 0.5, y: 0.46, w: 0.25, h: 0.36 }, { x: 0.75, y: 0.46, w: 0.25, h: 0.36 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  strips: {
    label: "Three Strips",
    panels: [
      { x: 0, y: 0, w: 1, h: 0.27 },
      { x: 0, y: 0.27, w: 1, h: 0.28 },
      { x: 0, y: 0.55, w: 1, h: 0.27 },
    ],
    band: { x: 0, y: 0.82, w: 1, h: 0.18 },
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
  gold: {
    label: "Vice Gold",
    swatch: "linear-gradient(135deg,#ffe9a3,#ffb347 45%,#b8860b)",
    top: "rgba(255,190,80,0.08)", bottom: "rgba(160,90,10,0.32)",
    tint: "rgba(255,180,60,0.10)",
  },
  vice: {
    label: "Vice Teal",
    swatch: "linear-gradient(135deg,#2ee6c8,#ff2e88 55%,#7a2bff)",
    top: "rgba(40,220,200,0.14)", bottom: "rgba(255,40,160,0.28)",
    tint: "rgba(40,200,220,0.08)",
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

// Poster frames: the border around the whole cover.
export const FRAMES = {
  white: { label: "White frame", kind: "solid", fill: "#f6f1e7" },
  gold: { label: "Gold frame", kind: "gold" },
  neon: { label: "Neon frame", kind: "neon" },
};

// Caption lettering styles: flat poster type, striped retro-chrome 3D, or hollow outline.
export const TITLE_STYLES = {
  flat: { label: "Flat" },
  chrome: { label: "Chrome 3D" },
  outline: { label: "Outline" },
};

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
/** Draws one caption line in the chosen title style: flat poster type, striped
 * retro-chrome 3D (extruded layers + a banded gradient fill), or hollow outline. */
function drawCaptionLine(ctx, line, cx, top, size, ink, style) {
  ctx.font = `${size}px Anton, "Arial Narrow", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  if (style === "chrome") {
    // Extrusion: the same line stepped down-right in darkening shades.
    const steps = [0.10, 0.07, 0.045];
    const shades = ["#3a0d2e", "#5c1445", "#7d1c5c"];
    steps.forEach((off, i) => {
      ctx.fillStyle = shades[i];
      ctx.fillText(line, cx + size * off, top + size * off);
    });
    // Striped retro-chrome fill: alternating gold, white and pink bands.
    const grad = ctx.createLinearGradient(0, top - size * 0.8, 0, top + size * 0.2);
    grad.addColorStop(0, "#fff3b0");
    grad.addColorStop(0.28, "#ffd23e");
    grad.addColorStop(0.42, "#ffffff");
    grad.addColorStop(0.58, "#ff7ab8");
    grad.addColorStop(0.78, "#ffd23e");
    grad.addColorStop(1, "#ff9d00");
    ctx.fillStyle = grad;
    ctx.fillText(line, cx, top);
    ctx.lineWidth = Math.max(2, size * 0.05);
    ctx.strokeStyle = "#1c0b26";
    ctx.strokeText(line, cx, top);
  } else if (style === "outline") {
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.fillText(line, cx, top);
    ctx.lineWidth = Math.max(2, size * 0.09);
    ctx.strokeStyle = ink;
    ctx.strokeText(line, cx, top);
    ctx.lineWidth = Math.max(1, size * 0.03);
    ctx.strokeStyle = "#1c0b26";
    ctx.strokeText(line, cx, top);
  } else {
    ctx.fillStyle = "rgba(255,46,136,0.85)";
    ctx.fillText(line, cx + size * 0.045, top + size * 0.045);
    ctx.lineWidth = Math.max(2, size * 0.11);
    ctx.strokeStyle = "#1c0b26";
    ctx.strokeText(line, cx, top);
    ctx.fillStyle = ink;
    ctx.fillText(line, cx, top);
  }
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
 * a gold rule with the sub-caption, tag chips, and the billing block.
 * Shrinks until it fits. */
function drawLettering(ctx, state, bx, by, bw, bh) {
  const text = (state.caption || "").trim().toUpperCase();
  const sub = (state.subcaption || "").trim().toUpperCase();
  const extras = state.extras || {};
  const quote = extras.starsOn ? (extras.quote || "").trim() : "";
  const tags = extras.tagsOn ? (extras.tags || "").split(/[·,]/).map((t) => t.trim().toUpperCase()).filter(Boolean) : [];
  const billing = extras.billingOn ? (extras.billing || "").trim().toUpperCase() : "";
  const pad = bw * 0.035;
  const maxWidth = bw - pad * 2;
  if (!text && !quote && tags.length === 0 && !billing) return;

  // Fit: shrink the caption until the whole stack fits the zone height.
  let size = bh * 0.46 * (state.captionScale / 100);
  const measure = (s) => {
    ctx.font = `${s}px Anton, "Arial Narrow", sans-serif`;
    const lines = text ? wrapCaption(ctx, text, maxWidth) : [];
    const lineHeight = s * 1.04;
    const quoteH = quote ? s * 0.60 : 0;
    const subH = sub ? s * 0.20 + s * 0.34 : 0;
    const tagsH = tags.length ? s * 0.46 : 0;
    const billingH = billing ? s * 0.30 : 0;
    return { lines, total: quoteH + lines.length * lineHeight + subH + tagsH + billingH, lineHeight };
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
    drawCaptionLine(ctx, line, bx + bw / 2, y + size * 0.82, size, state.ink, state.titleStyle || "flat");
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

  if (billing) {
    // The tags sit in their own row; step past them before the billing line.
    if (tags.length) y += size * 0.46;
    const bSize = Math.max(9, size * 0.11);
    ctx.font = `600 ${bSize}px system-ui, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    let bText = billing;
    while (ctx.measureText(bText).width > maxWidth && bText.length > 10) {
      bText = bText.slice(0, -1);
    }
    ctx.fillText(bText.length < billing.length ? `${bText}…` : bText, bx + bw / 2, y + bSize * 1.2);
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

/** A warm radial glow behind the title on key-art layouts: the "sky glow". */
function drawSkyGlow(ctx, zx, zy, zw, zh) {
  const cx = zx + zw / 2;
  const cy = zy + zh * 0.45;
  const r = Math.max(zw, zh) * 0.62;
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  glow.addColorStop(0, "rgba(255,150,70,0.42)");
  glow.addColorStop(0.55, "rgba(255,90,120,0.18)");
  glow.addColorStop(1, "rgba(255,90,120,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(zx - zw * 0.2, zy - zh * 0.4, zw * 1.4, zh * 1.4);
}

/** Role tags: a small cast chip at the foot of each panel, e.g. "THE DRIVER". */
function drawRoleTags(ctx, state, panelsPx, gap) {
  const roles = (state.extras?.roles || "").split(/[·,]/).map((t) => t.trim().toUpperCase()).filter(Boolean);
  if (!roles.length) return;
  panelsPx.forEach((rect, i) => {
    const role = roles[i];
    if (!role) return;
    const h = Math.max(16, rect.h * 0.062);
    const size = h * 0.52;
    ctx.font = `700 ${size}px system-ui, sans-serif`;
    const w = ctx.measureText(role).width + h * 1.2;
    const x = rect.x + gap / 2 + rect.w * 0.03;
    const y = rect.y + rect.h - gap / 2 - h - rect.h * 0.03;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h * 0.28);
    ctx.fillStyle = "rgba(22,10,32,0.78)";
    ctx.fill();
    ctx.strokeStyle = "#ffd23e";
    ctx.lineWidth = Math.max(1, h * 0.06);
    ctx.stroke();
    ctx.fillStyle = "#ffd23e";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(role, x + h * 0.6, y + h / 2 + 1);
  });
}

/** A callout: a dot on a panel with a leader line to a label chip above it. */
function drawCallout(ctx, state, panelsPx) {
  const extras = state.extras || {};
  const label = (extras.callout || "").trim().toUpperCase();
  if (!label) return;
  const rect = panelsPx[extras.calloutPanel ?? 0] || panelsPx[0];
  if (!rect) return;
  const dotX = rect.x + rect.w * 0.68;
  const dotY = rect.y + rect.h * 0.32;
  const size = Math.max(13, rect.w * 0.028);
  ctx.font = `700 ${size}px system-ui, sans-serif`;
  const chipW = ctx.measureText(label).width + size * 2.4;
  const chipH = size * 2.1;
  const chipX = Math.min(Math.max(dotX - chipW / 2, 8), ctx.canvas.width - chipW - 8);
  let chipY = dotY - chipH - size * 1.6;
  if (chipY < 8) chipY = dotY + size * 1.6;
  ctx.beginPath();
  ctx.moveTo(dotX, dotY);
  ctx.lineTo(chipX + chipW / 2, chipY + (chipY < dotY ? chipH : 0));
  ctx.strokeStyle = "#ffd23e";
  ctx.lineWidth = Math.max(2, size * 0.12);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(dotX, dotY, Math.max(4, size * 0.28), 0, Math.PI * 2);
  ctx.fillStyle = "#ffd23e";
  ctx.fill();
  ctx.lineWidth = Math.max(2, size * 0.1);
  ctx.strokeStyle = "#1c0b26";
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(chipX, chipY, chipW, chipH, chipH * 0.3);
  ctx.fillStyle = "rgba(22,10,32,0.88)";
  ctx.fill();
  ctx.strokeStyle = "#ffd23e";
  ctx.lineWidth = Math.max(1, size * 0.08);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, chipX + chipW / 2, chipY + chipH / 2 + 1);
}

/**
 * Draws the whole cover onto `canvas` at its own size.
 * `state`: { layout, grade, frame, titleStyle, photos, assignments, caption, subcaption, ink,
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

  // Poster frame: white, twilight gold, or neon keylines.
  const frameStyle = FRAMES[state.frame] ?? FRAMES.white;
  if (frameStyle.kind === "gold") {
    const gold = ctx.createLinearGradient(0, 0, w, h);
    gold.addColorStop(0, "#8a6a2f");
    gold.addColorStop(0.5, "#ffd23e");
    gold.addColorStop(1, "#9a7418");
    ctx.fillStyle = gold;
    ctx.fillRect(0, 0, w, h);
  } else if (frameStyle.kind === "neon") {
    ctx.fillStyle = "#0d0912";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#ff2e88";
    ctx.lineWidth = Math.max(3, w * 0.006);
    ctx.strokeRect(frame * 0.5, frame * 0.5, w - frame, h - frame);
    ctx.strokeStyle = "#3ec6ff";
    ctx.lineWidth = Math.max(2, w * 0.003);
    ctx.strokeRect(frame * 1.1, frame * 1.1, w - frame * 2.2, h - frame * 2.2);
  } else {
    ctx.fillStyle = "#f6f1e7";
    ctx.fillRect(0, 0, w, h);
  }
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

  // Cast role tags at the foot of each panel — only where the panels end
  // above the caption, never under the title on key-art layouts.
  if (extras.rolesOn && layout.band) drawRoleTags(ctx, state, panelsPx, gap);

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
    drawSkyGlow(ctx, zx, zy, zw, zh);
    drawLettering(ctx, state, zx, zy, zw, zh);
  }

  // Extras: seal top-right, pill top-left.
  if (extras.sealOn) {
    drawSeal(ctx, extras.seal, ix + iw - w * 0.075, iy + w * 0.075, w * 0.062);
  }
  if (extras.pillOn) {
    drawPill(ctx, extras.pill, ix + w * 0.02, iy + w * 0.02, h * 0.042);
  }

  // Callout label pointing at a panel.
  if (extras.calloutOn) drawCallout(ctx, state, panelsPx);

  // Film grain over everything, faint and deterministic.
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = ctx.createPattern(getGrain(), "repeat");
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  return panelsPx;
}
