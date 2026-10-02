"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { Sticker } from "@/components/ui/Sticker";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();

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
    <section className="border-ink relative overflow-hidden border-b-[3px]">
      <div aria-hidden className="nb-grid-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-10">
        <motion.div
          {...slam(0, 12)}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-10 lg:pt-14"
        >
          <p className="nb-label opacity-60">Portfolio — Vol. 01</p>
          <span aria-hidden className="bg-ink h-[3px] w-10" />
          <p className="nb-label opacity-60">{site.location}</p>
        </motion.div>

        {/*
          The name gets the full container width. Sized so the longest line
          ("Muhammad") still fits at every breakpoint — a narrower track here
          clips it at desktop widths.
        */}
        <h1 className="mt-6 text-[clamp(2.75rem,11.5vw,10.5rem)] leading-[0.82]">
          <motion.span {...slam(0.06, 34)} className="block overflow-hidden">
            Muhammad
          </motion.span>
          <motion.span {...slam(0.14, 34)} className="block overflow-hidden">
            Ali <span className="nb-outline-text">Zahid</span>
          </motion.span>
        </h1>

        <div className="grid gap-12 pt-10 pb-14 lg:grid-cols-12 lg:gap-10 lg:pb-16">
          <motion.div {...slam(0.24)} className="lg:col-span-7">
            <p className="bg-ink text-yellow font-display border-ink inline-block border-[3px] px-4 py-2.5 text-sm sm:text-base">
              {site.role}
            </p>

            <p className="mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
              {site.tagline}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
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

          {/* Spec card */}
          <motion.div
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, x: 32 },
                  animate: { opacity: 1, x: 0 },
                  transition: { duration: 0.6, delay: 0.3, ease: EASE },
                })}
            className="relative self-start lg:col-span-5"
          >
            {site.available && (
              <div className="absolute -top-5 right-2 z-10 sm:right-6 lg:right-0">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.4, rotate: 14 }}
                  animate={{ opacity: 1, scale: 1, rotate: -7 }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { type: "spring", stiffness: 260, damping: 14, delay: 0.62 }
                  }
                >
                  <Sticker rotate={0} className="bg-lime">
                    <span
                      aria-hidden
                      className="bg-ink block h-2.5 w-2.5 rounded-full"
                    />
                    Open · {site.availableFrom}
                  </Sticker>
                </motion.div>
              </div>
            )}

            <div className="nb-panel shadow-nb-lg bg-white">
              <div className="bg-pink border-ink grid place-items-center border-b-[3px] py-10">
                <span className="font-display text-[clamp(3.5rem,9vw,5.5rem)] leading-none">
                  {site.initials}
                </span>
              </div>
              <dl>
                {site.facts.map((fact, i) => (
                  <div
                    key={fact.label}
                    className={`flex items-center justify-between gap-4 px-4 py-3.5 ${
                      i > 0 ? "border-ink border-t-[3px]" : ""
                    }`}
                  >
                    <dt className="nb-label opacity-55">{fact.label}</dt>
                    <dd className="font-display text-right text-sm">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
