"use client";

import { useAnimate, useReducedMotion } from "framer-motion";

type BouncyTextProps = {
  text: string;
  className?: string;
};

function Letter({ char, index }: { char: string; index: number }) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();

  return (
    <span
      ref={scope}
      className="inline-block will-change-transform"
      onPointerEnter={() => {
        // A one-shot hop that always lands back at rest. (`whileHover` with
        // keyframes can strand a letter mid-tilt when the pointer leaves early.)
        animate(
          scope.current,
          { y: [0, "-0.14em", 0], rotate: [0, index % 2 === 0 ? -6 : 6, 0] },
          { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
        );
      }}
    >
      {char}
    </span>
  );
}

/**
 * Each letter hops when the pointer passes over it. The full string stays in
 * the accessibility tree once; the per-letter spans are presentational.
 */
export function BouncyText({ text, className }: BouncyTextProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-block">
        {Array.from(text).map((char, i) => (
          <Letter key={i} char={char} index={i} />
        ))}
      </span>
    </span>
  );
}
