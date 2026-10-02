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
- `src/data/projects.ts` — the work archive and case studies.

## Adding artwork

There's no image server on Pages, so images ship exactly as they sit in
`public/`. Keep full-resolution PNG/JPG originals in `artwork/<project-id>/`,
then run:

```bash
node scripts/optimize-images.mjs
```

That writes web-sized WebP files to `public/projects/<project-id>/` — point
`projects.ts` at those.
