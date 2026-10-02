"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { usePointerFine } from "@/hooks/usePointerFine";

type CursorContextValue = {
  show: (label?: string) => void;
  hide: () => void;
};

const CursorContext = createContext<CursorContextValue | null>(null);

/**
 * Lets any descendant raise the follow-cursor badge on hover. Falls back to
 * no-ops outside a provider so cards stay usable anywhere.
 */
export function useProjectCursor() {
  return useContext(CursorContext) ?? { show: () => {}, hide: () => {} };
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const isFine = usePointerFine();
  const reduceMotion = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 });
  const hasPosition = useRef(false);

  useEffect(() => {
    if (!isFine) return;
    function handleMove(event: MouseEvent) {
      if (!hasPosition.current) {
        // Jump on first sight so the badge doesn't fly in from the corner.
        x.jump(event.clientX);
        y.jump(event.clientY);
        hasPosition.current = true;
      } else {
        x.set(event.clientX);
        y.set(event.clientY);
      }
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isFine, x, y]);

  const show = useCallback(
    (next = "View") => {
      if (isFine) setLabel(next);
    },
    [isFine]
  );
  const hide = useCallback(() => setLabel(null), []);

  return (
    <CursorContext.Provider value={{ show, hide }}>
      {children}
      {isFine && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-[60] -translate-x-1/2 -translate-y-1/2"
          style={{
            x: reduceMotion ? x : springX,
            y: reduceMotion ? y : springY,
          }}
          initial={false}
          animate={{
            opacity: label ? 1 : 0,
            scale: label ? 1 : 0.5,
            rotate: label ? -6 : 0,
          }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="nb-panel nb-label bg-yellow shadow-nb-xs flex items-center gap-1.5 px-3 py-2 font-bold">
            {label}
            <span aria-hidden>→</span>
          </span>
        </motion.div>
      )}
    </CursorContext.Provider>
  );
}
