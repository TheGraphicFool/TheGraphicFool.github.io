"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

/**
 * Floating "up" button that appears once you're well past the hero, and
 * gets out of the way again once the footer is on screen (on a phone it
 * would otherwise sit on top of the footer's links and copyright line).
 */
export function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const footer = document.querySelector("footer");
    const footerInView = footer ? footer.getBoundingClientRect().top < window.innerHeight - 24 : false;
    const next = y > 900 && !footerInView;
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
          className="nb-panel nb-press shadow-nb bg-lime hover:bg-yellow font-display fixed right-3 bottom-3 z-40 grid h-11 w-11 place-items-center text-xl sm:right-6 sm:bottom-6 sm:h-14 sm:w-14 sm:text-2xl"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
