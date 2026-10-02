"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const FILLS = ["bg-pink", "bg-yellow", "bg-cyan", "bg-lime", "bg-orange", "bg-violet"] as const;

/** The hero monogram block. Click it to cycle the accent fill. */
export function ColorBlock({ label }: { label: string }) {
  const [index, setIndex] = useState(0);
  const [spins, setSpins] = useState(0);
  const reduceMotion = useReducedMotion();
  const fill = FILLS[index % FILLS.length];
  const onDark = fill === "bg-violet";

  return (
    <button
      type="button"
      onClick={() => {
        setIndex((i) => i + 1);
        setSpins((s) => s + 1);
      }}
      aria-label="Shuffle the colour"
      title="Click me"
      className={`${fill} border-ink group relative grid w-full cursor-pointer place-items-center border-b-[3px] py-10 transition-colors duration-200`}
    >
      <motion.span
        animate={reduceMotion ? undefined : { rotate: spins * 360 }}
        transition={{ type: "spring", stiffness: 140, damping: 14 }}
        className={`font-display text-[clamp(3.5rem,9vw,5.5rem)] leading-none ${onDark ? "text-white" : "text-ink"}`}
      >
        {label}
      </motion.span>
      <span
        className={`nb-label absolute right-3 bottom-3 opacity-0 transition-opacity group-hover:opacity-70 ${onDark ? "text-white" : ""}`}
      >
        Click to shuffle
      </span>
    </button>
  );
}
