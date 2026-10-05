"use client";

import { useEffect, useRef } from "react";

/**
 * A ringed planet with an orbiting moon and a starfield, ray-cast per
 * character cell and drawn as ASCII — a small software "shader" on a 2D
 * canvas, no WebGL or 3D library needed. Rendered in the page's ink colour so
 * it reads as part of the type. Drag to spin it. Pauses off-screen; holds
 * still under prefers-reduced-motion.
 *
 * Detail comes only from character choice: a 70-step density ramp for the
 * bodies, a sparser ramp for the ring dust, and a few glyphs for stars.
 */

/** Dark → bright, by visual ink density. Leading space = empty cell. */
const RAMP =
  " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const RING_RAMP = " .,:;-=+*#";
const STAR_GLYPHS = [".", "'", "+", "*", "+"];

// Small cells = more characters across the planet = finer detail. At 4×7px a
// desktop canvas is ~230×130 characters (~30k cells), so the frame rate
// adapts below if a slower machine can't keep up.
const CELL_W = 4; // px per column at 1x
const CELL_H = 7; // px per row at 1x
const FPS = 30;
const MIN_FPS = 15;

const PLANET_R = 0.72;
const RING_IN = 0.86;
const RING_OUT = 1.3;
const MOON_R = 0.12;
const MOON_ORBIT = 1.42;
const TILT = 0.42; // axial / ring tilt, radians
const SCENE_EXTENT = 1.42; // scene units from centre to the canvas edge

/** Light comes from the upper left, slightly towards the viewer. */
const LIGHT = normalize([-0.62, 0.5, 0.6]);
/** Half-vector for the specular highlight (viewer is +z). */
const HALF = normalize([LIGHT[0], LIGHT[1], LIGHT[2] + 1]);

function normalize([x, y, z]: number[]): [number, number, number] {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

/** Cheap deterministic value noise. */
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
/** Three octaves of noise — enough turbulence for cloud bands. */
function fbm(x: number, y: number) {
  return (
    noise(x, y) * 0.5 +
    noise(x * 2.1, y * 2.1) * 0.25 +
    noise(x * 4.3, y * 4.3) * 0.15 +
    noise(x * 8.7, y * 8.7) * 0.1
  );
}

function charFor(ramp: string, value: number) {
  const i = Math.max(0, Math.min(ramp.length - 1, Math.floor(value * ramp.length)));
  return ramp[i];
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function AsciiPlanet({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rootStyle = getComputedStyle(document.documentElement);
    const fontFamily = rootStyle.getPropertyValue("--font-space-mono").trim() || "monospace";
    const ink = rootStyle.getPropertyValue("--ink").trim() || "#0a0a0a";

    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let spin = 0; // planet rotation (radians)
    let clock = 0; // seconds; drives moon orbit, ring drift, star twinkle
    let velocity = 0.3; // radians per second
    let visible = true;
    let raf = 0;
    let last = 0;
    let dragging = false;
    let dragX = 0;

    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);
    // Ring plane normal = the planet's axis, tipped ~20° towards the viewer so
    // the ring reads as a thin tilted ellipse.
    const ringN = normalize([-sinT * 0.94, cosT * 0.94, 0.34]);

    /** Does a ray from point p towards the light cross the ring? (shadowing) */
    function ringBlocksLight(x: number, y: number, z: number) {
      const denom = ringN[0] * LIGHT[0] + ringN[1] * LIGHT[1] + ringN[2] * LIGHT[2];
      if (Math.abs(denom) < 1e-4) return false;
      const t = -(ringN[0] * x + ringN[1] * y + ringN[2] * z) / denom;
      if (t <= 0) return false;
      const d = Math.hypot(x + LIGHT[0] * t, y + LIGHT[1] * t, z + LIGHT[2] * t);
      return d > RING_IN && d < RING_OUT && !(d > 1.06 && d < 1.11);
    }

    /** Does the planet block the light reaching point p? */
    function planetBlocksLight(x: number, y: number, z: number) {
      const b = x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2];
      if (b > 0) return false; // already on the lit side of the centre
      const c = x * x + y * y + z * z - PLANET_R * PLANET_R;
      return b * b - c > 0;
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      cols = Math.max(20, Math.floor(rect.width / CELL_W));
      rows = Math.max(12, Math.floor(rect.height / CELL_H));
      draw();
    }

    function draw() {
      if (!ctx || cols === 0) return;
      const w = canvas!.width;
      const h = canvas!.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ink;
      ctx.textBaseline = "top";
      ctx.font = `700 ${CELL_H * dpr}px ${fontFamily}`;

      const cellW = w / cols;
      const cellH = h / rows;
      const span = Math.min(w, h) / 2 / SCENE_EXTENT;

      // Moon: orbits in (roughly) the ring plane, slowly.
      const mAngle = clock * 0.35;
      const mx0 = Math.cos(mAngle) * MOON_ORBIT;
      const mz0 = Math.sin(mAngle) * MOON_ORBIT;
      const my0 = -mz0 * 0.36;
      const moon = [mx0 * cosT - my0 * sinT, mx0 * sinT + my0 * cosT, mz0];

      const ringDrift = clock * 0.12;
      const twinkle = Math.floor(clock * 3);

      for (let r = 0; r < rows; r++) {
        let line = "";
        for (let c = 0; c < cols; c++) {
          const px = ((c + 0.5) * cellW - w / 2) / span;
          const py = -((r + 0.5) * cellH - h / 2) / span;

          let ch = " ";
          let depth = -Infinity;

          // --- Planet ------------------------------------------------------
          const d2 = px * px + py * py;
          if (d2 < PLANET_R * PLANET_R) {
            const pz = Math.sqrt(PLANET_R * PLANET_R - d2);
            const nx = px / PLANET_R;
            const ny = py / PLANET_R;
            const nz = pz / PLANET_R;

            // Body space: undo the axial tilt, then spin about the axis.
            const bx = nx * cosT + ny * sinT;
            const by = -nx * sinT + ny * cosT;
            const lon = Math.atan2(bx, nz) + spin;
            const lat = Math.asin(clamp01((by + 1) / 2) * 2 - 1);

            // Turbulent latitude bands.
            const turb = fbm(lon * 1.6, lat * 4.5);
            const bands = 0.5 + 0.5 * Math.sin(lat * 11 + turb * 3.2);
            const fine = 0.5 + 0.5 * Math.sin(lat * 38 + turb * 6);
            // Hairline streaks inside each band, only resolvable at small cells.
            const wisps = 0.5 + 0.5 * Math.sin(lat * 96 + turb * 14 + Math.sin(lon * 3) * 2);
            let albedo = 0.42 + 0.28 * bands + 0.12 * fine + 0.08 * wisps;
            // Scattered bright cloud puffs drifting with the rotation.
            const puffs = noise(lon * 7 + 40, lat * 14);
            if (puffs > 0.74) albedo = Math.min(1, albedo + (puffs - 0.74) * 1.6);

            // A great storm: an oval vortex riding one band.
            const sLon = Math.atan2(Math.sin(lon - 1.2), Math.cos(lon - 1.2));
            const sLat = lat + 0.38;
            const storm = (sLon * sLon) / 0.09 + (sLat * sLat) / 0.012;
            if (storm < 1) {
              const swirl = 0.5 + 0.5 * Math.sin(storm * 9 + sLon * 4);
              albedo = 0.35 + 0.55 * swirl;
            }

            // Pale polar caps.
            if (Math.abs(lat) > 1.15) albedo = Math.max(albedo, 0.85 - (1.57 - Math.abs(lat)) * 0.4);

            const nDotL = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
            const diffuse = Math.max(0, nDotL);
            // Soft terminator so the night side isn't a hard edge.
            const terminator = clamp01((nDotL + 0.12) / 0.3);
            const spec = Math.pow(Math.max(0, nx * HALF[0] + ny * HALF[1] + nz * HALF[2]), 28);
            const rim = Math.pow(1 - nz, 2.5) * 0.35 * terminator;

            // Ambient floor: the night side stays faintly drawn (earthshine), so
            // the sphere's full outline always reads.
            let shade = (0.2 + diffuse * 0.8 * terminator) * albedo + spec * 0.45 + rim;
            if (ringBlocksLight(px, py, pz)) shade *= 0.35; // ring shadow band
            ch = charFor(RAMP, clamp01(shade));
            depth = pz;
          } else if (d2 < (PLANET_R + 0.035) * (PLANET_R + 0.035)) {
            // Thin atmospheric halo just past the limb, brighter on the lit side.
            const lit = (px * LIGHT[0] + py * LIGHT[1]) / Math.sqrt(d2);
            if (lit > -0.2) ch = lit > 0.45 ? ":" : ".";
          }

          // --- Ring --- (intersect the view ray with the ring plane)
          const rz = -(ringN[0] * px + ringN[1] * py) / ringN[2];
          if (rz > depth) {
            const dist = Math.hypot(px, py, rz);
            if (dist > RING_IN && dist < RING_OUT) {
              const t = (dist - RING_IN) / (RING_OUT - RING_IN);
              // Ringlets of different density, plus a dark division.
              const ringlets =
                0.5 + 0.3 * Math.sin(t * 52) * Math.sin(t * 13 + 1) + 0.2 * Math.sin(t * 140);
              const bandDensity = t < 0.18 ? 0.45 : t < 0.46 ? 1 : t < 0.55 ? 0.05 : t < 0.85 ? 0.8 : 0.35;
              const angle = Math.atan2(rz, px);
              const dust = 0.75 + 0.25 * hash(Math.floor(angle * 40 + ringDrift * 40), Math.floor(t * 30));
              let shade = bandDensity * ringlets * dust;
              if (planetBlocksLight(px, py, rz)) shade *= 0.25; // planet's shadow on the ring
              // Over the planet, only the dense ringlets cover it; it shows
              // through the thin ones and the division.
              const threshold = depth > -Infinity ? 0.5 : 0.06;
              if (shade > threshold) {
                ch = charFor(RING_RAMP, clamp01(shade));
                depth = rz;
              }
            }
          }

          // --- Moon --------------------------------------------------------
          const mdx = px - moon[0];
          const mdy = py - moon[1];
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < MOON_R * MOON_R) {
            const mz = moon[2] + Math.sqrt(MOON_R * MOON_R - md2);
            if (mz > depth) {
              const nx = mdx / MOON_R;
              const ny = mdy / MOON_R;
              const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
              const diffuse = Math.max(0, nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
              const craterNoise = noise(nx * 7 + 3, ny * 7 + 7);
              // Dark crater floors with a bright rim on their edge.
              const craters = craterNoise > 0.7 ? 0.5 : craterNoise > 0.64 ? 1.15 : 1;
              let shade = (0.08 + diffuse * 0.92) * (0.6 + 0.4 * noise(nx * 9, ny * 9)) * craters;
              if (planetBlocksLight(moon[0] + mdx, moon[1] + mdy, mz)) shade *= 0.2; // eclipse
              ch = charFor(RAMP, clamp01(shade));
              depth = mz;
            }
          }

          // --- Stars: sparse, twinkling, only in empty sky -----------------
          if (ch === " ") {
            const s = hash(c * 1.37, r * 2.11);
            if (s > 0.995) {
              const phase = hash(c + twinkle * 0.13, r);
              const g = phase > 0.8 ? STAR_GLYPHS[2 + Math.floor((s - 0.995) * 600) % 3] : STAR_GLYPHS[phase > 0.35 ? 1 : 0];
              ch = g;
            }
          }

          line += ch;
        }
        // One fillText per row keeps this to a few dozen draw calls a frame.
        ctx.fillText(line, 0, r * cellH, w);
      }
    }

    // Adaptive frame rate: if drawing a frame costs too much (slow phone,
    // huge canvas), render less often rather than janking the page.
    let targetFps = FPS;
    let avgCost = 0;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      if (now - last < 1000 / targetFps) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      if (!dragging) velocity += (0.3 - velocity) * Math.min(1, dt * 1.5); // ease back to cruise
      spin += velocity * dt;
      clock += dt;
      const t0 = performance.now();
      draw();
      avgCost = avgCost * 0.9 + (performance.now() - t0) * 0.1;
      // Keep drawing under ~40% of each frame's budget.
      targetFps = Math.max(MIN_FPS, Math.min(FPS, 400 / Math.max(avgCost, 1)));
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = 0;
    });
    io.observe(canvas);

    // Drag to spin, with a flick carrying on after release.
    function onDown(event: PointerEvent) {
      dragging = true;
      dragX = event.clientX;
      canvas!.setPointerCapture(event.pointerId);
    }
    function onMove(event: PointerEvent) {
      if (!dragging) return;
      const dx = event.clientX - dragX;
      dragX = event.clientX;
      spin += dx * 0.012;
      velocity = dx * 0.6;
      if (reduceMotion) draw();
    }
    function onUp() {
      dragging = false;
    }
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    resize();
    if (!reduceMotion) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="A rotating ringed planet with a small moon among stars, drawn in ASCII characters"
      title="Drag to spin"
      className={`block h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing ${className}`}
    />
  );
}
