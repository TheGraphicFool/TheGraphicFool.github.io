"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, RefObject } from "react";
import { Sticker } from "@/components/ui/Sticker";

type DragStickerProps = {
  children: ReactNode;
  rotate?: number;
  className?: string;
  /** Element the sticker can't be dragged outside of. */
  constraints?: RefObject<HTMLElement | null>;
};

/**
 * A sticker you can peel off and slap somewhere else. It stays where it's
 * dropped (no snap-back) — that's the joke.
 */
export function DragSticker({ children, rotate = -4, className, constraints }: DragStickerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      drag={!reduceMotion}
      dragConstraints={constraints}
      dragElastic={0.15}
      dragMomentum={false}
      whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: rotate + 4 }}
      whileDrag={{ scale: 1.12, rotate: rotate - 6, cursor: "grabbing" }}
      style={{ rotate, touchAction: "none" }}
      className="inline-block cursor-grab select-none"
      title="Drag me"
    >
      <Sticker rotate={0} className={className}>
        {children}
      </Sticker>
    </motion.div>
  );
}
