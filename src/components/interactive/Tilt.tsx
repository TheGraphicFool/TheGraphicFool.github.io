"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { usePointerFine } from "@/hooks/usePointerFine";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the card's edge. Keep it small — it's a slab, not a hologram. */
  max?: number;
};

/**
 * Leans its child toward the pointer. Mouse-only and off under reduced motion,
 * so touch users just get the static card.
 */
export function Tilt({ children, className, max = 6 }: TiltProps) {
  const isFine = usePointerFine();
  const reduceMotion = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

  const enabled = isFine && !reduceMotion;

  return (
    <motion.div
      className={className}
      style={enabled ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      onPointerMove={(event) => {
        if (!enabled) return;
        const rect = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width);
        py.set((event.clientY - rect.top) / rect.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}
