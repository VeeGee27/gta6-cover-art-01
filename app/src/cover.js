// Paints the cover: one canvas, one cohesive poster. A layout arranges the
// photos into panels, a grade washes them in sunset or neon colour, a frame
// borders the whole sheet, and the caption block carries the big lettering,
// the sub-caption, the tag chips and the movie billing line. The preview
// canvas and the exported PNG are the same picture at different sizes, so
// what you see is what the file holds.

// A layout is a list of panels [x, y, w, h, shear] in fractions of the
// sheet, plus where the words go: a solid band under the panels, or a
// see-through zone laid over the art. `shear` slants a panel into a
// parallelogram; `seamless` panels butt together with no gap, so slanted
// seams stay clean.
export const LAYOUTS = {
  quad: {
    name: "Four panels",
    panels: [[0, 0, 0.5, 0.41, 0], [0.5, 0, 0.5, 0.41, 0], [0, 0.41, 0.5, 0.41, 0], [0.5, 0.41, 0.5, 0.41, 0]],
    caption: { kind: "band", x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  hero: {
    name: "Hero + strip",
    panels: [[0, 0, 1, 0.58, 0], [0, 0.58, 0.34, 0.24, 0], [0.34, 0.58, 0.33, 0.24, 0], [0.67, 0.58, 0.33, 0.24, 0]],
    caption: { kind: "band", x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  triptych: {
    name: "Three up",
    panels: [[0, 0, 0.34, 0.82, 0], [0.34, 0, 0.33, 0.82, 0], [0.67, 0, 0.33, 0.82, 0]],
    caption: { kind: "band", x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  six: {
    name: "Six grid",
    panels: [[0, 0, 0.34, 0.41, 0], [0.34, 0, 0.33, 0.41, 0], [0.67, 0, 0.33, 0.41, 0], [0, 0.41, 0.34, 0.41, 0], [0.34, 0.41, 0.33, 0.41, 0], [0.67, 0.41, 0.33, 0.41, 0]],
    caption: { kind: "band", x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  duo: {
    name: "Duo",
    panels: [[0, 0, 0.5, 0.82, 0], [0.5, 0, 0.5, 0.82, 0]],
    caption: { kind: "band", x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  strip: {
    name: "Tall + two",
    panels: [[0, 0, 0.45, 0.82, 0], [0.45, 0, 0.55, 0.41, 0], [0.45, 0.41, 0.55, 0.41, 0]],
    caption: { kind: "band", x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  slash: {
    name: "Key Art Slash",
    seamless: true,
    panels: [[0, 0, 0.38, 1, 0.09], [0.31, 0, 0.38, 1, 0.09], [0.62, 0, 0.38, 1, 0.09]],
    caption: { kind: "overlay", x: 0, y: 0.66, w: 1, h: 0.34 },
  },
  keyart: {
    name: "Key Art",
    panels: [[0, 0, 1, 1, 0]],
    caption: { kind: "overlay", x: 0, y: 0.58, w: 1, h: 0.42 },
  },
  single: {
    name: "One photo",
    panels: [[0, 0, 1, 1, 0]],
    caption: { kind: "overlay", x: 0, y: 0.74, w: 1, h: 0.26 },
  },
  comic: {
    name: "Slashed Comic",
    seamless: true,
    panels: [[0, 0, 0.4, 1, 0.16], [0.3, 0, 0.4, 1, 0.16], [0.6, 0, 0.4, 1, 0.16]],
    caption: { kind: "overlay", x: 0, y: 0.66, w: 1, h: 0.34 },
  },
  cast: {
    name: "Cast Grid",
    panels: [[0, 0, 1, 0.46, 0], [0, 0.46, 0.25, 0.36, 0], [0.25, 0.46, 0.25, 0.36, 0], [0.5, 0.46, 0.25, 0.36, 0], [0.75, 0.46, 0.25, 0.36, 0]],
    caption: { kind: "band", x: 0, y: 0.82, w: 1, h: 0.18 },
  },
  strips: {
    name: "Three Strips",
    panels: [[0, 0, 1, 0.27, 0], [0, 0.27, 1, 0.28, 0], [0, 0.55, 1, 0.27, 0]],
    caption: { kind: "band", x: 0, y: 0.82, w: 1, h: 0.18 },
  },
};

// A grade is a wash over each panel: colour at the top, colour at the
// bottom, a flat tint, and the swatch the picker shows. The wash deepens
// toward the bottom so the caption sits on colour, not on a bright edge.
export const GRADES = {
  sunset: {
    name: "Sunset",
    swatch: "linear-gradient(135deg,#ffd23e,#ff6a3d 45%,#c81e78)",
    top: "rgba(255,120,60,0.05)", bottom: "rgba(200,30,120,0.34)", tint: "rgba(255,140,60,0.10)",
  },
  neon: {
    name: "Neon night",
    swatch: "linear-gradient(135deg,#3ec6ff,#7a2bff 50%,#ff2e88)",
    top: "rgba(90,40,255,0.16)", bottom: "rgba(255,40,160,0.30)", tint: "rgba(60,200,255,0.07)",
  },
  dusk: {
    name: "Palm dusk",
    swatch: "linear-gradient(135deg,#ff9ec6,#c81e78 50%,#3a1a6e)",
    top: "rgba(90,30,140,0.20)", bottom: "rgba(255,80,140,0.30)", tint: "rgba(255,110,160,0.08)",
  },
  gold: {
    name: "Vice Gold",
    swatch: "linear-gradient(135deg,#ffe9a3,#ffb347 45%,#b8860b)",
    top: "rgba(255,190,80,0.08)", bottom: "rgba(160,90,10,0.32)", tint: "rgba(255,180,60,0.10)",
  },
  vice: {
    name: "Vice Teal",
    swatch: "linear-gradient(135deg,#2ee6c8,#ff2e88 55%,#7a2bff)",
    top: "rgba(40,220,200,0.14)", bottom: "rgba(255,40,160,0.28)", tint: "rgba(40,200,220,0.08)",
  },
  none: {
    name: "No grade",
    swatch: "linear-gradient(135deg,#888,#444)",
    top: "rgba(0,0,0,0)", bottom: "rgba(0,0,0,0.10)", tint: "rgba(0,0,0,0)",
  },
};

export const INKS = [
  { name: "White", value: "#ffffff" },
  { name: "Sun yellow", value: "#ffd23e" },
  { name: "Neon cyan", value: "#3ec6ff" },
  { name: "Hot pink", value: "#ff7ab8" },
];

// The border around the whole sheet: plain cream, a gold gradient, or a
// double neon keyline on near-black.
export const FRAMES = {
  white: { name: "White frame", kind: "solid", fill: "#f6f1e7" },
  gold: { name: "Gold frame", kind: "gold" },
  neon: { name: "Neon frame", kind: "neon" },
};

// How the big caption is lettered: flat poster type with a pink drop, a
// striped retro-chrome 3D extrusion, or hollow outline type.
export const TITLE_STYLES = {
  flat: { name: "Flat" },
  chrome: { name: "Chrome 3D" },
  outline: { name: "Outline" },
};

/** Tiny deterministic random source, so the film grain never changes. */
function xorshift(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

function buildGrainTile(size, seed) {
  const tile = document.createElement("canvas");
  tile.width = tile.height = size;
  const g = tile.getContext("2d");
  const pixels = g.createImageData(size, size);
  const next = xorshift(seed);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const grey = Math.floor(next() * 255);
    pixels.data[i] = grey;
    pixels.data[i + 1] = grey;
    pixels.data[i + 2] = grey;
    pixels.data[i + 3] = 255;
  }
  g.putImageData(pixels, 0, 0);
  return tile;
}

let grainCache = null;
function grainTile() {
  if (!grainCache) grainCache = buildGrainTile(128, 20261120);
  return grainCache;
}

/** Traces a panel's outline: a plain rectangle, or a parallelogram when the
 * panel is sheared. Used for clipping, for the keyline and for hit-testing. */
export function tracePanel(ctx, x, y, w, h, shearPx) {
  const s = shearPx || 0;
  ctx.beginPath();
  ctx.moveTo(x + s, y);
  ctx.lineTo(x + w + s, y);
  ctx.lineTo(x + w - s, y + h);
  ctx.lineTo(x - s, y + h);
  ctx.closePath();
}

/** Fits one photo into a panel rect, cover-style, panned and zoomed. */
export function paintPhoto(ctx, shot, x, y, w, h, shearPx) {
  const img = shot.img;
  const cover = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const scale = cover * shot.zoom;
  const pw = img.naturalWidth * scale;
  const ph = img.naturalHeight * scale;
  const cx = x + w / 2 + shot.dx * w;
  const cy = y + h / 2 + shot.dy * h;
  ctx.save();
  tracePanel(ctx, x, y, w, h, shearPx);
  ctx.clip();
  ctx.drawImage(img, cx - pw / 2, cy - ph / 2, pw, ph);
  ctx.restore();
}

/** Washes a panel with its grade and darkens the corners a little, so the
 * panels read as one poster instead of loose photos. */
function washPanel(ctx, grade, x, y, w, h, shearPx) {
  const pad = Math.abs(shearPx || 0);
  ctx.save();
  tracePanel(ctx, x, y, w, h, shearPx);
  ctx.clip();
  const wash = ctx.createLinearGradient(0, y, 0, y + h);
  wash.addColorStop(0, grade.top);
  wash.addColorStop(1, grade.bottom);
  ctx.fillStyle = wash;
  ctx.fillRect(x - pad, y, w + pad * 2, h);
  ctx.fillStyle = grade.tint;
  ctx.fillRect(x - pad, y, w + pad * 2, h);
  const shade = ctx.createRadialGradient(
    x + w / 2, y + h / 2, Math.min(w, h) * 0.42,
    x + w / 2, y + h / 2, Math.max(w, h) * 0.75,
  );
  shade.addColorStop(0, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(10,4,20,0.38)");
  ctx.fillStyle = shade;
  ctx.fillRect(x - pad, y, w + pad * 2, h);
  ctx.restore();
}

/** One line of the big caption, in the chosen lettering style. */
function paintTitleLine(ctx, line, cx, baseline, size, ink, style) {
  ctx.font = `${size}px Anton, "Arial Narrow", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  if (style === "chrome") {
    // The extrusion: the same line stepped down-right in deepening shades.
    const offsets = [0.1, 0.07, 0.045];
    const shades = ["#3a0d2e", "#5c1445", "#7d1c5c"];
    offsets.forEach((off, i) => {
      ctx.fillStyle = shades[i];
      ctx.fillText(line, cx + size * off, baseline + size * off);
    });
    // The striped retro-chrome fill: gold, white and pink bands.
    const chrome = ctx.createLinearGradient(0, baseline - size * 0.8, 0, baseline + size * 0.2);
    chrome.addColorStop(0, "#fff3b0");
    chrome.addColorStop(0.28, "#ffd23e");
    chrome.addColorStop(0.42, "#ffffff");
    chrome.addColorStop(0.58, "#ff7ab8");
    chrome.addColorStop(0.78, "#ffd23e");
    chrome.addColorStop(1, "#ff9d00");
    ctx.fillStyle = chrome;
    ctx.fillText(line, cx, baseline);
    ctx.lineWidth = Math.max(2, size * 0.05);
    ctx.strokeStyle = "#1c0b26";
    ctx.strokeText(line, cx, baseline);
  } else if (style === "outline") {
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.fillText(line, cx, baseline);
    ctx.lineWidth = Math.max(2, size * 0.09);
    ctx.strokeStyle = ink;
    ctx.strokeText(line, cx, baseline);
    ctx.lineWidth = Math.max(1, size * 0.03);
    ctx.strokeStyle = "#1c0b26";
    ctx.strokeText(line, cx, baseline);
  } else {
    ctx.fillStyle = "rgba(255,46,136,0.85)";
    ctx.fillText(line, cx + size * 0.045, baseline + size * 0.045);
    ctx.lineWidth = Math.max(2, size * 0.11);
    ctx.strokeStyle = "#1c0b26";
    ctx.strokeText(line, cx, baseline);
    ctx.fillStyle = ink;
    ctx.fillText(line, cx, baseline);
  }
}

/** Breaks a caption into at most two lines that fit `maxW`. */
function splitTitle(ctx, text, maxW) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines = [""];
  for (const word of words) {
    const joined = lines[lines.length - 1] ? `${lines[lines.length - 1]} ${word}` : word;
    if (ctx.measureText(joined).width <= maxW || !lines[lines.length - 1]) {
      lines[lines.length - 1] = joined;
    } else if (lines.length === 1) {
      lines.push(word);
    } else {
      lines[1] = `${lines[1]} ${word}`;
    }
  }
  return lines.slice(0, 2);
}

/** The word stack inside a caption zone: five stars and a quote, the big
 * caption, a gold rule with the sub-caption, the tag chips, and the movie
 * billing line. Each row moves the pen down as it is drawn, so nothing
 * overlaps, and the whole stack shrinks until it fits the zone. */
function paintCaptionBlock(ctx, cover, x, y, w, h) {
  const title = (cover.title || "").trim().toUpperCase();
  const subtitle = (cover.subtitle || "").trim().toUpperCase();
  const dress = cover.dress || {};
  const quote = dress.stars ? (dress.quote || "").trim() : "";
  const chips = dress.chips
    ? (dress.chipText || "").split(/[·,]/).map((t) => t.trim().toUpperCase()).filter(Boolean)
    : [];
  const billing = dress.billing ? (dress.billingText || "").trim().toUpperCase() : "";
  const margin = w * 0.035;
  const innerW = w - margin * 2;
  if (!title && !quote && chips.length === 0 && !billing) return;

  // Pick a size that lets the whole stack fit the zone height.
  let size = h * 0.46 * (cover.titleScale / 100);
  const measure = (s) => {
    ctx.font = `${s}px Anton, "Arial Narrow", sans-serif`;
    const lines = title ? splitTitle(ctx, title, innerW) : [];
    const lineH = s * 1.04;
    const quoteH = quote ? s * 0.6 : 0;
    const subH = subtitle ? s * 0.2 + s * 0.34 : 0;
    const chipH = chips.length ? s * 0.46 : 0;
    const billH = billing ? s * 0.3 : 0;
    return { lines, total: quoteH + lines.length * lineH + subH + chipH + billH, lineH };
  };
  let m = measure(size);
  while ((m.total > h * 0.97 || m.lines.length > 2) && size > 14) {
    size -= 2;
    m = measure(size);
  }
  const { lines, lineH } = m;
  let pen = y + (h - m.total) / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  if (quote) {
    const qSize = Math.max(11, size * 0.24);
    ctx.font = `${qSize}px "DejaVu Sans", system-ui, sans-serif`;
    ctx.fillStyle = "#ffd23e";
    ctx.fillText("★★★★★", x + w / 2, pen + qSize);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = `italic ${qSize}px Georgia, serif`;
    let qText = quote;
    while (ctx.measureText(`“${qText}”`).width > innerW && qText.length > 10) {
      qText = qText.slice(0, -1);
    }
    const shown = qText.length < quote.length ? `“${qText}…”` : `“${qText}”`;
    ctx.fillText(shown, x + w / 2, pen + qSize * 2.15);
    pen += size * 0.6;
  }

  for (const line of lines) {
    paintTitleLine(ctx, line, x + w / 2, pen + size * 0.82, size, cover.ink, cover.letter || "flat");
    pen += lineH;
  }

  if (subtitle) {
    const subSize = Math.max(11, size * 0.2);
    ctx.font = `700 ${subSize}px system-ui, sans-serif`;
    const ruleY = pen + size * 0.14;
    const ruleW = Math.min(w * 0.5, ctx.measureText(subtitle).width + subSize * 3);
    ctx.strokeStyle = "#ffd23e";
    ctx.lineWidth = Math.max(2, subSize * 0.14);
    ctx.beginPath();
    ctx.moveTo(x + w / 2 - ruleW / 2, ruleY);
    ctx.lineTo(x + w / 2 + ruleW / 2, ruleY);
    ctx.stroke();
    ctx.fillStyle = "#ffd23e";
    ctx.fillText(subtitle, x + w / 2, ruleY + subSize * 1.5);
    pen += size * 0.2 + size * 0.34;
  }

  if (chips.length) {
    const chipSize = Math.max(10, size * 0.17);
    ctx.font = `700 ${chipSize}px system-ui, sans-serif`;
    const gap = chipSize * 0.9;
    const widths = chips.map((t) => ctx.measureText(t).width + chipSize * 1.6);
    const rowW = widths.reduce((a, b) => a + b, 0) + gap * (chips.length - 1);
    let tx = x + w / 2 - rowW / 2;
    const ty = pen + chipSize * 0.5;
    chips.forEach((t, i) => {
      const tw = widths[i];
      ctx.beginPath();
      ctx.roundRect(tx, ty, tw, chipSize * 2.1, chipSize);
      ctx.fillStyle = "rgba(22,10,32,0.55)";
      ctx.fill();
      ctx.strokeStyle = "#ffd23e";
      ctx.lineWidth = Math.max(1, chipSize * 0.1);
      ctx.stroke();
      ctx.fillStyle = "#ffd23e";
      ctx.fillText(t, tx + tw / 2, ty + chipSize * 1.45);
      tx += tw + gap;
    });
    pen += size * 0.46;
  }

  if (billing) {
    const bSize = Math.max(9, size * 0.11);
    ctx.font = `600 ${bSize}px system-ui, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    let bText = billing;
    while (ctx.measureText(bText).width > innerW && bText.length > 10) {
      bText = bText.slice(0, -1);
    }
    ctx.fillText(bText.length < billing.length ? `${bText}…` : bText, x + w / 2, pen + bSize * 1.2);
  }
}

/** A starburst seal in a corner, e.g. "NEW". */
function paintSeal(ctx, text, cx, cy, r) {
  const spikes = 14;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.21);
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.78;
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
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
function paintBadge(ctx, text, x, y, h) {
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

/** A warm radial glow behind the title on overlay layouts: the "sky glow". */
function paintGlow(ctx, x, y, w, h) {
  const cx = x + w / 2;
  const cy = y + h * 0.45;
  const r = Math.max(w, h) * 0.62;
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  glow.addColorStop(0, "rgba(255,150,70,0.42)");
  glow.addColorStop(0.55, "rgba(255,90,120,0.18)");
  glow.addColorStop(1, "rgba(255,90,120,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x - w * 0.2, y - h * 0.4, w * 1.4, h * 1.4);
}

/** Cast chips: a small role label at the foot of each panel, e.g. "THE
 * DRIVER". Only drawn where the panels end above the caption band, never
 * under a title laid over the art. */
function paintCastChips(ctx, cover, panels, gap) {
  const roles = (cover.dress?.castText || "").split(/[·,]/).map((t) => t.trim().toUpperCase()).filter(Boolean);
  if (!roles.length) return;
  panels.forEach((rect, i) => {
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

/** A pointer: a dot on one panel with a leader line to a label chip. */
function paintPointer(ctx, cover, panels) {
  const dress = cover.dress || {};
  const label = (dress.pointerText || "").trim().toUpperCase();
  if (!label) return;
  const rect = panels[dress.pointerPanel ?? 0] || panels[0];
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
 * Paints the whole cover onto `canvas` at its own size and returns the
 * panel rectangles in canvas pixels, for hit-testing.
 * `cover`: { layout, grade, frame, letter, shots, slots, title, subtitle,
 *   ink, titleScale, active, dress }.
 */
export function paintCover(canvas, cover) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const layout = LAYOUTS[cover.layout] ?? LAYOUTS.hero;
  const grade = GRADES[cover.grade] ?? GRADES.sunset;
  const dress = cover.dress || {};
  const border = Math.round(w * 0.014);
  const gap = layout.seamless ? 0 : Math.max(2, Math.round(w * 0.008));

  // The poster frame: cream, twilight gold, or neon keylines.
  const frame = FRAMES[cover.frame] ?? FRAMES.white;
  if (frame.kind === "gold") {
    const gold = ctx.createLinearGradient(0, 0, w, h);
    gold.addColorStop(0, "#8a6a2f");
    gold.addColorStop(0.5, "#ffd23e");
    gold.addColorStop(1, "#9a7418");
    ctx.fillStyle = gold;
    ctx.fillRect(0, 0, w, h);
  } else if (frame.kind === "neon") {
    ctx.fillStyle = "#0d0912";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#ff2e88";
    ctx.lineWidth = Math.max(3, w * 0.006);
    ctx.strokeRect(border * 0.5, border * 0.5, w - border, h - border);
    ctx.strokeStyle = "#3ec6ff";
    ctx.lineWidth = Math.max(2, w * 0.003);
    ctx.strokeRect(border * 1.1, border * 1.1, w - border * 2.2, h - border * 2.2);
  } else {
    ctx.fillStyle = "#f6f1e7";
    ctx.fillRect(0, 0, w, h);
  }
  const ix = border;
  const iy = border;
  const iw = w - border * 2;
  const ih = h - border * 2;

  // The dark sheet the panels sit on.
  ctx.fillStyle = "#160a20";
  ctx.fillRect(ix, iy, iw, ih);

  const panels = layout.panels.map(([px, py, pw, ph, shear]) => {
    const rx = ix + px * iw;
    const ry = iy + py * ih;
    const rw = pw * iw;
    const rh = ph * ih;
    return { x: rx, y: ry, w: rw, h: rh, shear: shear ? shear * rw : 0 };
  });

  panels.forEach((rect, i) => {
    // A missing slot falls back to cycling the loaded photos, so a layout
    // with more panels than slots still fills every panel.
    const slot = cover.slots[i];
    const shot = cover.shots[slot ?? (cover.shots.length ? i % cover.shots.length : -1)];
    const px = rect.x + gap / 2;
    const py = rect.y + gap / 2;
    const pw = rect.w - gap;
    const ph = rect.h - gap;
    if (shot) {
      paintPhoto(ctx, shot, px, py, pw, ph, rect.shear);
      washPanel(ctx, grade, px, py, pw, ph, rect.shear);
    } else {
      ctx.fillStyle = "#241a30";
      ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.font = `700 ${Math.max(14, pw * 0.05)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(`PANEL ${i + 1}`, px + pw / 2, py + ph / 2);
    }
    // A thin cream keyline around each panel, following its outline.
    tracePanel(ctx, px, py, pw, ph, rect.shear);
    ctx.strokeStyle = "rgba(246,241,231,0.9)";
    ctx.lineWidth = Math.max(1, w * 0.0015);
    ctx.stroke();
    if (cover.active === i) {
      tracePanel(ctx, px, py, pw, ph, rect.shear);
      ctx.strokeStyle = "#ffd23e";
      ctx.lineWidth = Math.max(3, w * 0.004);
      ctx.stroke();
    }
  });

  // Cast chips at the foot of each panel — only where the panels end above
  // the caption, never under the title on overlay layouts.
  if (dress.cast && layout.caption.kind === "band") paintCastChips(ctx, cover, panels, gap);

  // The words: a solid band under the panels, or a scrim over the art with
  // the title on top of it.
  if (layout.caption.kind === "band") {
    const c = layout.caption;
    const bx = ix + c.x * iw;
    const by = iy + c.y * ih;
    const bw = c.w * iw;
    const bh = c.h * ih;
    ctx.fillStyle = "#160a20";
    ctx.fillRect(bx, by, bw, bh);
    paintCaptionBlock(ctx, cover, bx, by, bw, bh);
  } else {
    const zone = layout.caption;
    const zx = ix + zone.x * iw;
    const zy = iy + zone.y * ih;
    const zw = zone.w * iw;
    const zh = zone.h * ih;
    const scrim = ctx.createLinearGradient(0, zy - zh * 0.4, 0, zy + zh);
    scrim.addColorStop(0, "rgba(22,10,32,0)");
    scrim.addColorStop(1, "rgba(22,10,32,0.85)");
    ctx.fillStyle = scrim;
    ctx.fillRect(ix, zy - zh * 0.4, iw, zh * 1.4);
    paintGlow(ctx, zx, zy, zw, zh);
    paintCaptionBlock(ctx, cover, zx, zy, zw, zh);
  }

  // Dressing: seal top-right, badge top-left.
  if (dress.seal) {
    paintSeal(ctx, dress.sealText, ix + iw - w * 0.075, iy + w * 0.075, w * 0.062);
  }
  if (dress.badge) {
    paintBadge(ctx, dress.badgeText, ix + w * 0.02, iy + w * 0.02, h * 0.042);
  }

  // The pointer label, aimed at one panel.
  if (dress.pointer) paintPointer(ctx, cover, panels);

  // Film grain over everything, faint and deterministic.
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = ctx.createPattern(grainTile(), "repeat");
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  return panels;
}
