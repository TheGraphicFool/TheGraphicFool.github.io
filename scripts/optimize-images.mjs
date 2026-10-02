/**
 * Turns full-resolution artwork into web-sized WebP files:
 *   artwork/blog/*       → public/blog/*         (blog covers)
 *   artwork/<project>/*  → public/projects/<project>/*
 *
 * The site is a static export (GitHub Pages), so there's no on-demand image
 * optimizer — whatever sits in public/ is exactly what visitors download.
 * Keep the heavy originals in artwork/ (never deployed), run this, then point
 * projects.ts at the .webp files:
 *
 *   node scripts/optimize-images.mjs
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE = path.resolve("artwork");
const TARGET = path.resolve("public/projects");
const BLOG_SOURCE = path.join(SOURCE, "blog");
const BLOG_TARGET = path.resolve("public/blog");
const MAX_WIDTH = 2000;
const QUALITY = 82;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(png|jpe?g)$/i.test(entry.name)) yield full;
  }
}

for await (const file of walk(SOURCE)) {
  const isBlog = file.startsWith(BLOG_SOURCE + path.sep);
  const out = (isBlog
    ? path.join(BLOG_TARGET, path.relative(BLOG_SOURCE, file))
    : path.join(TARGET, path.relative(SOURCE, file)))
    .replace(/\.(png|jpe?g)$/i, ".webp");
  await mkdir(path.dirname(out), { recursive: true });
  const exists = await stat(out).catch(() => null);
  if (exists && exists.mtimeMs >= (await stat(file)).mtimeMs) continue;

  const info = await sharp(file, { limitInputPixels: false })
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);
  console.log(`${path.relative("public", out)}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
