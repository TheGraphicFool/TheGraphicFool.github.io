"use client";

import { motion, useReducedMotion } from "framer-motion";

type BouncyTextProps = {
  text: string;
  className?: string;
};

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
        {Array.from(text).map((char, i) =>
          char === " " ? (
            <span key={i}> </span>
          ) : (
            <motion.span
              key={i}
              className="inline-block"
              whileHover={{
                y: [0, -18, 0],
                rotate: [0, i % 2 === 0 ? -6 : 6, 0],
                transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              {char}
            </motion.span>
          )
        )}
      </span>
    </span>
  );
}
