"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

/** Floating "up" button that appears once you're well past the hero. */
export function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 900;
    if (next !== visible) setVisible(next);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.4, rotate: 20 }}
          animate={{ opacity: 1, scale: 1, rotate: -6 }}
          exit={{ opacity: 0, scale: 0.4, rotate: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          onClick={() => {
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
          }}
          aria-label="Back to top"
          className="nb-panel nb-press shadow-nb bg-lime hover:bg-yellow font-display fixed right-4 bottom-4 z-40 grid h-14 w-14 place-items-center text-2xl sm:right-6 sm:bottom-6"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
