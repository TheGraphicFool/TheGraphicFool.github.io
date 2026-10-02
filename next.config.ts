import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages (TheGraphicFool.github.io).
 *
 * `next build` writes plain HTML/CSS/JS to `out/`, which the Pages workflow in
 * .github/workflows/deploy.yml uploads. There's no server, so:
 *  - images are served as-is (pre-optimise with scripts/optimize-images.mjs);
 *  - `trailingSlash` emits `/work/<slug>/index.html`, which Pages serves
 *    without a redirect dance.
 *
 * This is a user site served from the domain root, so no `basePath` is needed.
 * If it ever moves to a project repo (user.github.io/<repo>), set
 * NEXT_PUBLIC_BASE_PATH=/<repo> at build time.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
