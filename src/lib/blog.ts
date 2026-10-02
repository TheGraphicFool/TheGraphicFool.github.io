import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * Blog posts are Markdown files in `content/blog/`, read at build time.
 *
 * To publish: add `content/blog/<slug>.md` (or run `npm run new-post -- "Title"`),
 * drop its cover image in `public/blog/`, and push to main. File name = URL slug.
 *
 *   ---
 *   title: My post
 *   date: 2026-10-02
 *   cover: /blog/my-post.webp
 *   excerpt: One line for the blog index.   (optional)
 *   draft: true                              (optional — hides the post)
 *   ---
 *   The body, in Markdown. Can be empty: a post can be just the cover image.
 */

const DIR = path.join(process.cwd(), "content/blog");

export type Post = {
  slug: string;
  title: string;
  date: string;
  cover: string;
  excerpt: string;
  /** Rendered HTML of the Markdown body ("" when the post is cover-only). */
  html: string;
};

/** Minimal `key: value` frontmatter — enough for this blog, no dependency. */
function parse(source: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) return { data: {}, body: source };

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line);
    if (pair) data[pair[1]] = pair[2].trim().replace(/^(["'])(.*)\1$/, "$2");
  }
  return { data, body: match[2] };
}

function load(file: string): (Post & { draft: boolean }) | null {
  const slug = file.replace(/\.md$/, "");
  const { data, body } = parse(readFileSync(path.join(DIR, file), "utf8"));
  if (!data.title || !data.date || !data.cover) {
    throw new Error(`content/blog/${file} needs title, date and cover in its frontmatter.`);
  }
  return {
    slug,
    title: data.title,
    date: data.date,
    cover: data.cover,
    excerpt: data.excerpt ?? "",
    html: body.trim() ? (marked.parse(body, { async: false }) as string) : "",
    draft: data.draft === "true",
  };
}

/** Published posts, newest first. */
export function getPosts(): Post[] {
  let files: string[] = [];
  try {
    files = readdirSync(DIR).filter((file) => file.endsWith(".md") && !file.startsWith("_"));
  } catch {
    return [];
  }
  return files
    .map(load)
    .filter((post): post is Post & { draft: boolean } => post !== null && !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

/** "2 Oct 2026" — formatted in UTC so the build machine's timezone can't shift it. */
export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
