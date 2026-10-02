/**
 * Scaffolds a blog post:
 *
 *   npm run new-post -- "My post title"
 *
 * Creates content/blog/<slug>.md with today's date. Put the cover image at
 * public/blog/<slug>.webp (or run scripts/optimize-images.mjs with the
 * original in artwork/blog/<slug>.png), then push to main to publish.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new-post -- "My post title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[^\w\s-]/g, "")
  .trim()
  .replace(/[\s_]+/g, "-")
  .replace(/-+/g, "-");
const date = new Date().toISOString().slice(0, 10);
const file = path.join("content/blog", `${slug}.md`);

if (existsSync(file)) {
  console.error(`${file} already exists.`);
  process.exit(1);
}

mkdirSync(path.dirname(file), { recursive: true });
writeFileSync(
  file,
  `---
title: ${title}
date: ${date}
cover: /blog/${slug}.webp
excerpt:
---

Write the post here in Markdown — or delete this line for a cover-only post.
`
);
console.log(`Created ${file}\nAdd the cover at public/blog/${slug}.webp, then push to main.`);
