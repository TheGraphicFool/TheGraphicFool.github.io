"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Reading-progress bar pinned to the bottom edge of the sticky header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="bg-pink absolute inset-x-0 -bottom-[3px] h-[3px] origin-left"
      style={{ scaleX }}
    />
  );
}
