// One-off generator for placeholder "artwork" used by the Work rail and case
// study pages. Produces flat, hard-edged neo-brutalist SVG compositions in the
// acid-pop palette so the site has real visual variety without shipping
// external binary assets.
//
// Run with: node scripts/generate-placeholder-art.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = "public/projects";

// Acid pop — kept in sync with the CSS tokens in src/app/globals.css.
const C = {
  paper: "#F4F1E8",
  ink: "#0A0A0A",
  white: "#FFFFFF",
  yellow: "#FFE600",
  pink: "#FF3D8B",
  cyan: "#00E0FF",
  violet: "#7B4DFF",
  lime: "#B8FF3D",
  orange: "#FF6B1A",
};

const RATIOS = {
  portrait: [1000, 1250],
  square: [1200, 1200],
  landscape: [1600, 1200],
};

function svgWrap(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;
}

/** Stroke weight scaled to the artboard so outlines read the same at any size. */
const sw = (w, h) => Math.max(4, Math.round(Math.min(w, h) * 0.014));

/** A filled shape with its hard offset shadow behind it — the core NB move. */
function hard(shape, fill, stroke, weight, dx, dy) {
  return `${shape(dx, dy, C.ink, "none", 0)}${shape(0, 0, fill, stroke, weight)}`;
}

const rect = (x, y, w, h) => (dx, dy, fill, stroke, weight) =>
  `<rect x="${x + dx}" y="${y + dy}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${weight}"/>`;

const circ = (cx, cy, r) => (dx, dy, fill, stroke, weight) =>
  `<circle cx="${cx + dx}" cy="${cy + dy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${weight}"/>`;

const poly = (points) => (dx, dy, fill, stroke, weight) =>
  `<polygon points="${points.map(([x, y]) => `${x + dx},${y + dy}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${weight}"/>`;

const path = (d) => (dx, dy, fill, stroke, weight) =>
  `<path transform="translate(${dx} ${dy})" d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${weight}" stroke-linejoin="miter"/>`;

/** Diagonal hazard stripes clipped to a region. */
function stripes(w, h, x, y, bw, bh, color, id, angle = 45) {
  const step = Math.min(w, h) * 0.09;
  return `<defs><pattern id="hz${id}" width="${step}" height="${step}" patternTransform="rotate(${angle})" patternUnits="userSpaceOnUse"><rect width="${step / 2}" height="${step}" fill="${color}"/></pattern></defs><rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="url(#hz${id})"/>`;
}

/** Halftone dot field, radius ramping along one axis. */
function halftone(x, y, w, h, cols, rows, color, ramp = "x") {
  const cw = w / cols;
  const ch = h / rows;
  const rMax = Math.min(cw, ch) * 0.46;
  let out = "";
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const t = ramp === "x" ? i / (cols - 1) : j / (rows - 1);
      const r = rMax * (0.15 + 0.85 * t);
      out += `<circle cx="${x + cw * (i + 0.5)}" cy="${y + ch * (j + 0.5)}" r="${r.toFixed(2)}" fill="${color}"/>`;
    }
  }
  return out;
}

// Each scene is a hand-built composition — flat fills, black outlines, hard
// offset shadows. `c` is [background, primary, secondary, tertiary].
const scenes = {
  // Offset stacked blocks — the archetypal neo-brutalist card stack.
  stack: (w, h, c) => {
    const t = sw(w, h);
    const o = Math.min(w, h) * 0.045;
    return `
      <rect width="${w}" height="${h}" fill="${c[0]}"/>
      ${halftone(0, h * 0.62, w, h * 0.38, 14, 6, c[3], "y")}
      ${hard(rect(w * 0.1, h * 0.12, w * 0.46, h * 0.34), c[1], C.ink, t, o, o)}
      ${hard(rect(w * 0.36, h * 0.3, w * 0.5, h * 0.34), c[2], C.ink, t, o, o)}
      ${hard(rect(w * 0.16, h * 0.52, w * 0.38, h * 0.3), c[3], C.ink, t, o, o)}
    `;
  },

  // Concentric rings, heavy strokes.
  orbit: (w, h, c, id) => {
    const t = sw(w, h);
    const m = Math.min(w, h);
    const o = m * 0.04;
    return `
      <rect width="${w}" height="${h}" fill="${c[0]}"/>
      ${stripes(w, h, 0, h * 0.78, w, h * 0.22, c[3], id)}
      <rect x="0" y="${h * 0.78}" width="${w}" height="${h * 0.22}" fill="none" stroke="${C.ink}" stroke-width="${t}"/>
      ${[0.34, 0.24, 0.14].map((r, i) => `<circle cx="${w * 0.5}" cy="${h * 0.42}" r="${m * r}" fill="none" stroke="${C.ink}" stroke-width="${t * 2.4}"/><circle cx="${w * 0.5}" cy="${h * 0.42}" r="${m * r}" fill="none" stroke="${i % 2 ? c[2] : c[1]}" stroke-width="${t * 1.4}"/>`).join("")}
      ${hard(circ(w * 0.5, h * 0.42, m * 0.07), c[2], C.ink, t, o * 0.6, o * 0.6)}
    `;
  },

  // Big arch over a striped ground — poster-like.
  arch: (w, h, c, id) => {
    const t = sw(w, h);
    const o = Math.min(w, h) * 0.04;
    const r = w * 0.32;
    const baseY = h * 0.74;
    const d = `M ${w * 0.5 - r} ${baseY} L ${w * 0.5 - r} ${h * 0.42} A ${r} ${r} 0 0 1 ${w * 0.5 + r} ${h * 0.42} L ${w * 0.5 + r} ${baseY} Z`;
    return `
      <rect width="${w}" height="${h}" fill="${c[0]}"/>
      ${stripes(w, h, 0, baseY, w, h - baseY, c[3], id, -45)}
      ${hard(path(d), c[1], C.ink, t, o, o)}
      ${hard(circ(w * 0.5, h * 0.5, w * 0.13), c[2], C.ink, t, o * 0.6, o * 0.6)}
      <rect x="0" y="${baseY}" width="${w}" height="${t}" fill="${C.ink}"/>
    `;
  },

  // Checkerboard grid with heavy gridlines.
  grid: (w, h, c) => {
    const t = sw(w, h);
    const cols = 4;
    const rows = 4;
    let cells = "";
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const fill = (i + j) % 3 === 0 ? c[1] : (i + j) % 3 === 1 ? c[2] : c[0];
        cells += `<rect x="${(w / cols) * i}" y="${(h / rows) * j}" width="${w / cols}" height="${h / rows}" fill="${fill}" stroke="${C.ink}" stroke-width="${t}"/>`;
      }
    }
    return `
      <rect width="${w}" height="${h}" fill="${c[0]}"/>
      ${cells}
      ${hard(circ(w * 0.5, h * 0.5, Math.min(w, h) * 0.17), c[3], C.ink, t, Math.min(w, h) * 0.035, Math.min(w, h) * 0.035)}
    `;
  },

  // Radiating triangles.
  burst: (w, h, c) => {
    const t = sw(w, h);
    const m = Math.min(w, h);
    const cx = w * 0.5;
    const cy = h * 0.46;
    const spokes = Array.from({ length: 12 }, (_, i) => {
      const a0 = (Math.PI * 2 * i) / 12;
      const a1 = a0 + Math.PI / 12;
      const R = m * 0.62;
      return `<polygon points="${cx},${cy} ${cx + Math.cos(a0) * R},${cy + Math.sin(a0) * R} ${cx + Math.cos(a1) * R},${cy + Math.sin(a1) * R}" fill="${i % 2 ? c[1] : c[2]}"/>`;
    }).join("");
    return `
      <rect width="${w}" height="${h}" fill="${c[0]}"/>
      ${spokes}
      ${hard(circ(cx, cy, m * 0.2), c[3], C.ink, t * 1.4, m * 0.04, m * 0.04)}
      <rect x="0" y="${h * 0.86}" width="${w}" height="${h * 0.14}" fill="${C.ink}"/>
      ${halftone(0, h * 0.86, w, h * 0.14, 16, 2, c[1], "x")}
    `;
  },

  // Vertical bars of varying height.
  columns: (w, h, c) => {
    const t = sw(w, h);
    const n = 7;
    const gap = w * 0.012;
    const bw = (w * 0.86 - gap * (n - 1)) / n;
    const heights = [0.34, 0.62, 0.46, 0.78, 0.28, 0.56, 0.4];
    const fills = [c[1], c[2], c[3], c[1], c[2], c[3], c[1]];
    const bars = heights
      .map((hh, i) => {
        const x = w * 0.07 + i * (bw + gap);
        const y = h * 0.86 - h * hh;
        return `<rect x="${x}" y="${y}" width="${bw}" height="${h * hh}" fill="${fills[i]}" stroke="${C.ink}" stroke-width="${t}"/>`;
      })
      .join("");
    return `
      <rect width="${w}" height="${h}" fill="${c[0]}"/>
      ${bars}
      <rect x="0" y="${h * 0.86}" width="${w}" height="${t * 2}" fill="${C.ink}"/>
      ${hard(circ(w * 0.82, h * 0.18, Math.min(w, h) * 0.11), c[2], C.ink, t, Math.min(w, h) * 0.03, Math.min(w, h) * 0.03)}
    `;
  },

  // Oversized plus/cross with offset shadow.
  cross: (w, h, c) => {
    const t = sw(w, h);
    const m = Math.min(w, h);
    const o = m * 0.05;
    const a = m * 0.16;
    const b = m * 0.44;
    const cx = w * 0.5;
    const cy = h * 0.46;
    const d = `M ${cx - a} ${cy - b} L ${cx + a} ${cy - b} L ${cx + a} ${cy - a} L ${cx + b} ${cy - a} L ${cx + b} ${cy + a} L ${cx + a} ${cy + a} L ${cx + a} ${cy + b} L ${cx - a} ${cy + b} L ${cx - a} ${cy + a} L ${cx - b} ${cy + a} L ${cx - b} ${cy - a} L ${cx - a} ${cy - a} Z`;
    return `
      <rect width="${w}" height="${h}" fill="${c[0]}"/>
      ${halftone(0, 0, w, h * 0.3, 16, 4, c[3], "y")}
      ${hard(path(d), c[1], C.ink, t, o, o)}
      <rect x="${w * 0.06}" y="${h * 0.86}" width="${w * 0.88}" height="${h * 0.07}" fill="${c[2]}" stroke="${C.ink}" stroke-width="${t}"/>
    `;
  },

  // Chunky zigzag bands.
  wave: (w, h, c) => {
    const t = sw(w, h);
    const band = (yTop, fill) => {
      const n = 6;
      const seg = w / n;
      const amp = h * 0.07;
      let d = `M 0 ${yTop}`;
      for (let i = 0; i < n; i++) {
        d += ` L ${seg * (i + 0.5)} ${yTop + (i % 2 ? amp : -amp)} L ${seg * (i + 1)} ${yTop}`;
      }
      d += ` L ${w} ${h} L 0 ${h} Z`;
      return `<path d="${d}" fill="${fill}" stroke="${C.ink}" stroke-width="${t}"/>`;
    };
    return `
      <rect width="${w}" height="${h}" fill="${c[0]}"/>
      ${hard(circ(w * 0.72, h * 0.22, Math.min(w, h) * 0.15), c[3], C.ink, t, Math.min(w, h) * 0.04, Math.min(w, h) * 0.04)}
      ${band(h * 0.5, c[1])}
      ${band(h * 0.68, c[2])}
    `;
  },

  // Big outlined slab type block — reads as a logotype lockup.
  slab: (w, h, c, id) => {
    const t = sw(w, h);
    const o = Math.min(w, h) * 0.045;
    return `
      <rect width="${w}" height="${h}" fill="${c[0]}"/>
      ${stripes(w, h, 0, 0, w, h * 0.18, c[3], id)}
      <rect x="0" y="${h * 0.18}" width="${w}" height="${t}" fill="${C.ink}"/>
      ${hard(rect(w * 0.08, h * 0.3, w * 0.84, h * 0.16), c[1], C.ink, t, o, o)}
      ${hard(rect(w * 0.08, h * 0.52, w * 0.5, h * 0.16), c[2], C.ink, t, o, o)}
      ${hard(rect(w * 0.62, h * 0.52, w * 0.3, h * 0.34), c[3], C.ink, t, o, o)}
    `;
  },

  // Diagonal split with a punched circle.
  split: (w, h, c) => {
    const t = sw(w, h);
    const m = Math.min(w, h);
    return `
      <rect width="${w}" height="${h}" fill="${c[0]}"/>
      ${poly([[0, 0], [w, 0], [0, h]])(0, 0, c[1], C.ink, t)}
      ${poly([[w, h * 0.1], [w, h], [w * 0.18, h]])(0, 0, c[2], C.ink, t)}
      ${hard(circ(w * 0.5, h * 0.5, m * 0.19), c[3], C.ink, t * 1.3, m * 0.04, m * 0.04)}
      ${halftone(w * 0.06, h * 0.06, w * 0.24, h * 0.18, 6, 4, C.ink, "x")}
    `;
  },
};

// bg, primary, secondary, tertiary
const projects = [
  { id: "aurora-collective", scene: "stack", ratio: "square", palettes: [
    [C.paper, C.pink, C.cyan, C.yellow],
    [C.yellow, C.violet, C.white, C.pink],
    [C.cyan, C.yellow, C.pink, C.white],
  ]},
  { id: "quiet-hours", scene: "arch", ratio: "portrait", palettes: [
    [C.paper, C.violet, C.yellow, C.pink],
    [C.violet, C.yellow, C.white, C.cyan],
    [C.white, C.pink, C.violet, C.yellow],
  ]},
  { id: "north-field", scene: "columns", ratio: "landscape", palettes: [
    [C.paper, C.lime, C.cyan, C.yellow],
    [C.lime, C.ink, C.white, C.cyan],
    [C.cyan, C.lime, C.yellow, C.white],
  ]},
  { id: "glass-market", scene: "split", ratio: "landscape", palettes: [
    [C.paper, C.cyan, C.pink, C.yellow],
    [C.pink, C.white, C.cyan, C.yellow],
    [C.yellow, C.cyan, C.violet, C.white],
  ]},
  { id: "paper-trail", scene: "grid", ratio: "square", palettes: [
    [C.paper, C.yellow, C.pink, C.cyan],
    [C.white, C.violet, C.yellow, C.pink],
    [C.pink, C.yellow, C.white, C.violet],
  ]},
  { id: "coastline-radio", scene: "orbit", ratio: "square", palettes: [
    [C.paper, C.cyan, C.violet, C.yellow],
    [C.cyan, C.white, C.pink, C.violet],
    [C.violet, C.cyan, C.yellow, C.white],
  ]},
  { id: "midnight-transit", scene: "cross", ratio: "portrait", palettes: [
    [C.paper, C.violet, C.cyan, C.pink],
    [C.ink, C.cyan, C.yellow, C.violet],
    [C.violet, C.yellow, C.white, C.cyan],
  ]},
  { id: "citrus-press", scene: "burst", ratio: "square", palettes: [
    [C.paper, C.orange, C.yellow, C.white],
    [C.yellow, C.orange, C.white, C.pink],
    [C.orange, C.yellow, C.ink, C.white],
  ]},
  { id: "faultline", scene: "split", ratio: "square", palettes: [
    [C.paper, C.ink, C.orange, C.white],
    [C.orange, C.ink, C.white, C.yellow],
    [C.white, C.orange, C.ink, C.yellow],
  ]},
  { id: "echo-chamber", scene: "orbit", ratio: "square", palettes: [
    [C.ink, C.cyan, C.pink, C.violet],
    [C.violet, C.cyan, C.white, C.pink],
    [C.cyan, C.pink, C.yellow, C.white],
  ]},
  { id: "terra-nova", scene: "slab", ratio: "landscape", palettes: [
    [C.paper, C.lime, C.yellow, C.orange],
    [C.lime, C.white, C.orange, C.yellow],
    [C.yellow, C.lime, C.ink, C.white],
  ]},
  { id: "slow-current", scene: "wave", ratio: "portrait", palettes: [
    [C.paper, C.cyan, C.violet, C.yellow],
    [C.cyan, C.violet, C.white, C.pink],
    [C.white, C.cyan, C.lime, C.violet],
  ]},
  { id: "static-bloom", scene: "burst", ratio: "square", palettes: [
    [C.paper, C.pink, C.violet, C.yellow],
    [C.pink, C.yellow, C.white, C.violet],
    [C.violet, C.pink, C.cyan, C.white],
  ]},
  { id: "helio", scene: "stack", ratio: "landscape", palettes: [
    [C.paper, C.yellow, C.orange, C.pink],
    [C.yellow, C.white, C.orange, C.ink],
    [C.orange, C.yellow, C.white, C.pink],
  ]},
];

let total = 0;
for (const p of projects) {
  const [w, h] = RATIOS[p.ratio];
  const dir = `${OUT}/${p.id}`;
  mkdirSync(dir, { recursive: true });
  p.palettes.forEach((palette, i) => {
    const name = i === 0 ? "cover" : String(i).padStart(2, "0");
    const body = scenes[p.scene](w, h, palette, `${p.id}-${i}`);
    writeFileSync(`${dir}/${name}.svg`, svgWrap(w, h, body), "utf8");
    total++;
  });
}

console.log(
  `Generated ${total} placeholder artwork files across ${projects.length} projects.`
);
