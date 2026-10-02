import type { CSSProperties, ReactNode } from "react";

type StickerProps = {
  children: ReactNode;
  /** Degrees. Small values only — past ~10° it reads as broken, not placed. */
  rotate?: number;
  className?: string;
  as?: "div" | "span";
};

/**
 * A rotated, bordered badge with a hard shadow. The one place in the system
 * where things are deliberately off-axis.
 */
export function Sticker({
  children,
  rotate = -4,
  className = "bg-yellow",
  as: Tag = "div",
}: StickerProps) {
  return (
    <Tag
      className={`nb-panel nb-label shadow-nb inline-flex items-center gap-2 px-3 py-2 font-bold ${className}`}
      style={{ transform: `rotate(${rotate}deg)` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
