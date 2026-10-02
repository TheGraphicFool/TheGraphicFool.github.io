import type { CSSProperties } from "react";

type MarqueeProps = {
  items: readonly string[];
  /** Seconds for one full cycle. Lower = faster. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  separator?: string;
};

/**
 * Infinite ticker band. Pure CSS — the track holds the item list twice and
 * translates -50%, so the seam is invisible and there's no JS on the main
 * thread. Pauses on hover; fully stopped under `prefers-reduced-motion`.
 */
export function Marquee({
  items,
  duration = 34,
  reverse = false,
  className = "bg-ink text-yellow",
  separator = "✳",
}: MarqueeProps) {
  // Rendered twice for the seamless loop; the duplicate is decorative.
  const run = (key: string, hidden: boolean) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((item, i) => (
        <span key={`${key}-${i}`} className="flex shrink-0 items-center">
          <span className="font-display px-6 text-xl whitespace-nowrap sm:px-8 sm:text-2xl md:text-3xl">
            {item}
          </span>
          <span aria-hidden className="text-lg opacity-70 sm:text-xl">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`nb-marquee border-y-[3px] border-ink overflow-hidden py-3 sm:py-4 ${className}`}
    >
      <div
        className="nb-marquee-track"
        data-direction={reverse ? "reverse" : undefined}
        style={{ "--nb-marquee-duration": `${duration}s` } as CSSProperties}
      >
        {run("a", false)}
        {run("b", true)}
      </div>
    </div>
  );
}
