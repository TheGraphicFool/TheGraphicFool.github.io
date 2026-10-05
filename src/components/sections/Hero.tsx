"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { useRef } from "react";
import { BouncyText } from "@/components/interactive/BouncyText";
import { DragSticker } from "@/components/interactive/DragSticker";
import { FoolCard } from "@/components/interactive/FoolCard";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /** On-load entrance only (not scroll-triggered — this is the first paint). */
  const slam = (delay: number, distance = 22) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: distance },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: EASE },
        };

  return (
    <section ref={sectionRef} className="border-ink relative overflow-hidden border-b-[3px]">
      <div aria-hidden className="nb-grid-bg pointer-events-none absolute inset-0" />

      {/*
        Desktop: two columns — name + intro on the left, the Fool card on the
        right, centred vertically against them so neither side leaves dead
        space. The name is sized to its column (not the viewport) so it fills
        the left side exactly. Mobile: everything stacks.
      */}
      <div className="relative mx-auto w-full max-w-[1800px] px-4 pt-10 pb-14 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-12 lg:px-10 lg:py-16 xl:gap-x-20">
        {/* @container: the name below sizes itself to this column's width. */}
        <div className="@container min-w-0">
          <motion.div {...slam(0, 12)} className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="nb-label font-bold">{site.brand}</p>
            <span aria-hidden className="bg-ink h-[3px] w-10" />
            <p className="nb-label opacity-60">Portfolio — Vol. 01</p>
            <span aria-hidden className="bg-ink h-[3px] w-10" />
            <p className="nb-label opacity-60">{site.location}</p>
          </motion.div>

          {/* "MUHAMMAD" is ~6.8em wide in Archivo Black, so 100cqw / 6.9 makes
              the longest line run the full width of its column at any size. */}
          <h1 className="mt-6 text-[calc(100cqw/6.9)] leading-[0.82]">
            <motion.span {...slam(0.06, 34)} className="block">
              <BouncyText text="Muhammad" />
            </motion.span>
            <motion.span {...slam(0.14, 34)} className="block">
              <BouncyText text="Ali" />{" "}
              <BouncyText text="Zahid" className="nb-outline-text" />
            </motion.span>
          </h1>

          <motion.div {...slam(0.24)} className="mt-9 lg:mt-10">
            <p className="bg-ink text-yellow font-display border-ink inline-block border-[3px] px-4 py-2.5 text-sm sm:text-base">
              {site.role}
            </p>

            <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
              {site.tagline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#work"
                className="nb-panel nb-press shadow-nb bg-yellow font-display inline-flex items-center gap-3 px-6 py-4 text-base sm:text-lg"
              >
                See the work
                <span aria-hidden>↓</span>
              </Link>
              <Link
                href="#contact"
                className="nb-panel nb-press shadow-nb bg-white hover:bg-cyan font-display inline-flex items-center gap-3 px-6 py-4 text-base sm:text-lg"
              >
                Start a project
                <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 0 — THE FOOL: the studio name as a tarot card. Flips for a reading. */}
        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, x: 32 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.6, delay: 0.3, ease: EASE },
              })}
          className="relative z-20 mx-auto mt-14 w-full max-w-[340px] lg:mt-0 lg:w-[clamp(300px,23vw,400px)] lg:max-w-none lg:rotate-[4deg]"
        >
          {site.available && (
            <div className="absolute -top-5 right-4 z-30">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.4, rotate: 14 }}
                animate={{ opacity: 1, scale: 1, rotate: -7 }}
                transition={
                  reduceMotion
                    ? undefined
                    : { type: "spring", stiffness: 260, damping: 14, delay: 0.62 }
                }
              >
                <DragSticker rotate={0} className="bg-lime" constraints={sectionRef}>
                  <span aria-hidden className="bg-ink block h-2.5 w-2.5 animate-pulse rounded-full" />
                  Open · {site.availableFrom}
                </DragSticker>
              </motion.div>
            </div>
          )}

          <FoolCard />
        </motion.div>
      </div>
    </section>
  );
}
