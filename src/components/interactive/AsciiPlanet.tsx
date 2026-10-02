"use client";

import { useEffect, useRef } from "react";

/**
 * A ringed planet with an orbiting moon, ray-cast per character cell and
 * drawn as ASCII — a tiny software "shader" on a 2D canvas, no WebGL or 3D
 * library needed. Rendered in the page's ink colour so it reads as part of
 * the type. Drag to spin it. Pauses off-screen; holds still under
 * prefers-reduced-motion.
 */

/** Dark → bright. The first char is a space so unlit cells stay empty. */
const RAMP = " .,:;-=+*%#@";
const RING_RAMP = " .:-=+*";

const CELL_W = 7; // px per column at 1x
const CELL_H = 12; // px per row at 1x
const FPS = 30;

const PLANET_R = 0.6;
const RING_IN = 0.82;
const RING_OUT = 1.14;
const MOON_R = 0.11;
const MOON_ORBIT = 1.24;
const TILT = 0.42; // axial / ring tilt, radians

/** Light comes from the upper left, slightly towards the viewer. */
const LIGHT = normalize([-0.55, 0.55, 0.62]);

function normalize([x, y, z]: number[]): [number, number, number] {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

/** Cheap deterministic value noise on the sphere's surface coordinates. */
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

function charFor(ramp: string, value: number) {
  const i = Math.max(0, Math.min(ramp.length - 1, Math.floor(value * ramp.length)));
  return ramp[i];
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
    let orbit = 0; // moon / ring-texture phase
    let velocity = 0.35; // radians per second
    let visible = true;
    let raf = 0;
    let last = 0;
    let dragging = false;
    let dragX = 0;

    // Planet tilt as a rotation about the view (z) axis.
    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);
    // Ring plane normal: mostly "up" (the planet's axis), tipped ~20° towards
    // the viewer so the ring reads as a thin tilted ellipse, Saturn-style.
    const ringN = normalize([-sinT * 0.94, cosT * 0.94, 0.34]);

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
      // Keep the scene square in screen space whatever the cell aspect is,
      // with a margin so the ring and moon never clip at the edges.
      const span = Math.min(w, h) / 2 / 1.42;

      // Moon position: orbits in (roughly) the ring plane.
      const mAngle = orbit * 0.6;
      const mx0 = Math.cos(mAngle) * MOON_ORBIT;
      const mz0 = Math.sin(mAngle) * MOON_ORBIT;
      const my0 = -mz0 * 0.36;
      const moon = [mx0 * cosT - my0 * sinT, mx0 * sinT + my0 * cosT, mz0];

      for (let r = 0; r < rows; r++) {
        let line = "";
        for (let c = 0; c < cols; c++) {
          const px = ((c + 0.5) * cellW - w / 2) / span;
          const py = -((r + 0.5) * cellH - h / 2) / span;

          let ch = " ";
          let depth = -Infinity;

          // --- Planet ---
          const d2 = px * px + py * py;
          if (d2 < PLANET_R * PLANET_R) {
            const pz = Math.sqrt(PLANET_R * PLANET_R - d2);
            const nx = px / PLANET_R;
            const ny = py / PLANET_R;
            const nz = pz / PLANET_R;
            // Undo the tilt to get body-space coords, then spin about y.
            const bx = nx * cosT + ny * sinT;
            const by = -nx * sinT + ny * cosT;
            const lon = Math.atan2(bx, nz) + spin;
            const lat = Math.asin(Math.max(-1, Math.min(1, by)));
            const bands = 0.5 + 0.5 * Math.sin(lat * 9 + noise(lon * 1.5, lat * 3) * 2.2);
            const storms = noise(lon * 3 + 10, lat * 6) > 0.72 ? 0.35 : 0;
            const surface = 0.55 + 0.35 * bands + storms;
            const diffuse = Math.max(0, nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
            const rim = Math.pow(1 - nz, 3) * 0.25;
            ch = charFor(RAMP, Math.min(1, (0.08 + diffuse * 0.92) * surface + rim));
            depth = pz;
          }

          // --- Ring --- (intersect the view ray with the ring plane)
          const rz = -(ringN[0] * px + ringN[1] * py) / ringN[2];
          if (rz > depth) {
            const dist = Math.hypot(px, py, rz);
            if (dist > RING_IN && dist < RING_OUT) {
              // Gaps and grooves, plus streaks that travel round the ring.
              const t = (dist - RING_IN) / (RING_OUT - RING_IN);
              const grooves = 0.5 + 0.5 * Math.sin(t * 34);
              const gap = t > 0.55 && t < 0.62 ? 0 : 1;
              const angle = Math.atan2(rz, px) - orbit * 0.25;
              const streak = 0.6 + 0.4 * Math.sin(angle * 9);
              const shade = gap * (0.35 + 0.65 * grooves) * streak;
              if (shade > 0.05) {
                ch = charFor(RING_RAMP, shade);
                depth = rz;
              }
            }
          }

          // --- Moon ---
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
              ch = charFor(RAMP, 0.15 + diffuse * 0.85);
              depth = mz;
            }
          }

          line += ch;
        }
        // One fillText per row keeps this to a few dozen draw calls a frame.
        ctx.fillText(line, 0, r * cellH, w);
      }
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      if (now - last < 1000 / FPS) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      if (!dragging) velocity += (0.35 - velocity) * Math.min(1, dt * 1.5); // ease back to cruise
      spin += velocity * dt;
      orbit += dt;
      draw();
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
      aria-label="A rotating ringed planet with a small moon, drawn in ASCII characters"
      title="Drag to spin"
      className={`block h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing ${className}`}
    />
  );
}
