import type { Accent } from "@/data/projects";

/**
 * Accent lookups.
 *
 * Tailwind can't see dynamically-built class names, so every accent class is
 * written out in full here rather than interpolated at the call site.
 */

export const ACCENT_BG: Record<Accent, string> = {
  yellow: "bg-yellow",
  pink: "bg-pink",
  cyan: "bg-cyan",
  violet: "bg-violet",
};

/**
 * Foreground that clears WCAG AA (4.5:1) on each accent.
 * Measured: yellow 19.6:1, cyan 15.9:1, pink 4.87:1 — all against ink.
 * Violet only reaches 3.9:1 against ink but 4.83:1 against white, so it flips.
 */
export const ACCENT_TEXT: Record<Accent, string> = {
  yellow: "text-ink",
  pink: "text-ink",
  cyan: "text-ink",
  violet: "text-white",
};

/** For inline styles (box-shadow colours, SVG fills). */
export const ACCENT_VAR: Record<Accent, string> = {
  yellow: "var(--yellow)",
  pink: "var(--pink)",
  cyan: "var(--cyan)",
  violet: "var(--violet)",
};
