"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger offset in seconds — pass `index * 0.08` from a mapped list. */
  delay?: number;
  className?: string;
  /** How far a scaled-down entrance should punch in from. Brutalism wants a
   * snap, not a drift, so the default is a short vertical hop, not a float. */
  distance?: number;
};

/**
 * Scroll-triggered entrance used across the marketing sections. Deliberately
 * fast and slightly overshooting — a "slam into place," not an editorial
 * fade — to match the hard-shadow, no-easing-softness visual language.
 * Fires once; respects prefers-reduced-motion via Framer's own hook (the
 * global CSS override in globals.css is the belt to this braces).
 */
export function Reveal({ children, delay = 0, className, distance = 22 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
