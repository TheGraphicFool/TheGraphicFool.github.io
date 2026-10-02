# TheGraphicFool.github.io

Portfolio of Muhammad Ali Zahid — Next.js (App Router) exported as a static
site and hosted on GitHub Pages at **https://thegraphicfool.github.io**.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which lints, builds,
and publishes `out/` to GitHub Pages. One-time setup in the repo:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Content

- `src/data/site.ts` — name, bio, socials, services, contact email.
- `src/data/projects.ts` — the work archive and case studies. Paste each
  project's Behance case-study URL into its `behance: ""` field; until then its
  Behance button links to the profile set in `site.ts`.

## Blog

Posts live at `/blog` and are Markdown files in `content/blog/` — the file
name is the URL (`my-post.md` → `/blog/my-post`).

```bash
npm run new-post -- "My post title"   # creates content/blog/my-post-title.md
```

Put the cover image in `public/blog/` (the `cover:` field points at it),
optionally write the body in Markdown — or leave it empty for a cover-only
post — and push to `main`. It's live about a minute later. You can also do it
all from GitHub's web UI: upload the image to `public/blog/`, then add the
`.md` file with **Add file → Create new file**. `content/blog/_template.md`
shows every field; add `draft: true` to hide a post.

## Adding artwork

There's no image server on Pages, so images ship exactly as they sit in
`public/`. Keep full-resolution PNG/JPG originals in `artwork/<project-id>/`,
then run:

```bash
npm run optimize-images
```

That writes web-sized WebP files to `public/projects/<project-id>/` — point
`projects.ts` at those. Blog cover originals go in `artwork/blog/` and come
out in `public/blog/`.
