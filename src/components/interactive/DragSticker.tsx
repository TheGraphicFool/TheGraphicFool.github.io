"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, RefObject } from "react";
import { Sticker } from "@/components/ui/Sticker";
import { usePointerFine } from "@/hooks/usePointerFine";

type DragStickerProps = {
  children: ReactNode;
  rotate?: number;
  className?: string;
  /** Element the sticker can't be dragged outside of. */
  constraints?: RefObject<HTMLElement | null>;
  /** Appended (" · drag me") only where the sticker can actually be dragged. */
  hint?: string;
};

/**
 * A sticker you can peel off and slap somewhere else with a mouse. It stays
 * where it's dropped (no snap-back) — that's the joke.
 *
 * On touch screens it's a plain sticker: a draggable element there swallows
 * the swipe, so starting a scroll on it dragged the sticker instead of
 * scrolling the page.
 */
export function DragSticker({ children, rotate = -4, className, constraints, hint }: DragStickerProps) {
  const reduceMotion = useReducedMotion();
  const isFine = usePointerFine();
  const draggable = isFine && !reduceMotion;

  if (!draggable) {
    return (
      <div className="inline-block" style={{ transform: `rotate(${rotate}deg)` }}>
        <Sticker rotate={0} className={className}>
          {children}
        </Sticker>
      </div>
    );
  }

  return (
    <motion.div
      drag
      dragConstraints={constraints}
      dragElastic={0.15}
      dragMomentum={false}
      whileHover={{ scale: 1.06, rotate: rotate + 4 }}
      whileDrag={{ scale: 1.12, rotate: rotate - 6, cursor: "grabbing" }}
      style={{ rotate, touchAction: "none" }}
      className="inline-block cursor-grab select-none"
      title="Drag me"
    >
      <Sticker rotate={0} className={className}>
        {children}
        {hint && <span className="opacity-70">· {hint}</span>}
      </Sticker>
    </motion.div>
  );
}
