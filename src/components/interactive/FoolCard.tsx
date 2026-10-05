"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useState } from "react";
import { site } from "@/data/site";
import { usePointerFine } from "@/hooks/usePointerFine";

/**
 * 0 — THE FOOL. In tarot the Fool is card zero: the beginning, the leap.
 * Here it's the hero's centrepiece and a pun on the studio name.
 *
 * Front: the portrait printed as a duotone over a sunburst, in a framed
 * card. Hover tilts it toward the pointer with a foil sheen; click / tap
 * flips it to a "reading" — a fortune that changes on every draw, plus the
 * quick facts as the card's meanings.
 */

/** --shadow-nb-lg with x flipped (see the card back). */
const MIRRORED_SHADOW = Array.from({ length: 10 }, (_, i) => `${-(i + 1)}px ${i + 1}px 0 var(--ink)`).join(", ");

const FORTUNES = [
  "You will hire a designer who refuses to be ignored.",
  "A brand you love is one bold decision away.",
  "Beige is not a personality. Change is coming.",
  "Your logo will survive a cheap print run. Rejoice.",
  "The deadline is closer than it appears. So is the fix.",
  "Something loud is about to be printed in your name.",
  "Trust the grid. Break it once, on purpose.",
];

/** The card back's border motif, also used on the front frame corners. */
function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
    </svg>
  );
}

export function FoolCard() {
  const reduceMotion = useReducedMotion();
  const isFine = usePointerFine();
  const [flipped, setFlipped] = useState(false);
  const [draw, setDraw] = useState(0);

  // Pointer position over the card, 0..1 — drives tilt and the foil sheen.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.6 };
  const tiltX = useSpring(useTransform(py, [0, 1], [10, -10]), spring);
  const tiltY = useSpring(useTransform(px, [0, 1], [-12, 12]), spring);
  const sheenX = useTransform(px, [0, 1], [0, 100]);
  const sheenY = useTransform(py, [0, 1], [0, 100]);
  const sheen = useMotionTemplate`${sheenX}% ${sheenY}%`;

  const tiltOn = isFine && !reduceMotion;

  const flip = () => {
    if (!flipped) setDraw((d) => d + 1);
    setFlipped((f) => !f);
  };

  const fortune = FORTUNES[(draw - 1 + FORTUNES.length) % FORTUNES.length];

  return (
    <div className="mx-auto w-full max-w-[330px] [perspective:1400px]">
      {/* Two-colour print: shadows → ink, highlights → yellow. */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="fool-duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.04 0.12 0.75 1 1" />
            <feFuncG type="table" tableValues="0.04 0.1 0.66 0.9 0.94" />
            <feFuncB type="table" tableValues="0.04 0.05 0.05 0.12 0.6" />
          </feComponentTransfer>
        </filter>
      </svg>
      <motion.div
        style={tiltOn ? { rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" } : undefined}
        onPointerMove={(event) => {
          if (!tiltOn) return;
          const rect = event.currentTarget.getBoundingClientRect();
          px.set((event.clientX - rect.left) / rect.width);
          py.set((event.clientY - rect.top) / rect.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
      >
        <motion.button
          type="button"
          onClick={flip}
          aria-pressed={flipped}
          aria-label={flipped ? "Turn the card back over" : "Turn over The Fool card for a reading"}
          className="relative block aspect-[7/11.5] w-full cursor-pointer text-left [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16 }}
        >
          {/* ---------------- Front ---------------- */}
          <div className="nb-panel shadow-nb-lg absolute inset-0 flex flex-col overflow-hidden rounded-[18px] bg-paper p-3 [backface-visibility:hidden]">
            <div className="border-ink relative flex flex-1 flex-col overflow-hidden rounded-[10px] border-[3px]">
              {/* Number plate */}
              <div className="border-ink bg-paper relative z-10 flex items-center justify-between border-b-[3px] px-3 py-1.5">
                <Star className="h-3.5 w-3.5" />
                <span className="font-display text-xl leading-none">0</span>
                <Star className="h-3.5 w-3.5" />
              </div>

              {/* Art: the portrait as a two-colour print with halftone dots */}
              <div className="bg-yellow relative flex-1 overflow-hidden">
                <Image
                  src={site.portrait}
                  alt={`${site.name} as The Fool`}
                  fill
                  priority
                  sizes="330px"
                  className="object-cover object-top [filter:url(#fool-duotone)_contrast(1.1)]"
                />
                <div aria-hidden className="nb-halftone pointer-events-none absolute inset-0" />
                <Star className="text-ink absolute top-3 left-3 h-5 w-5" />
                <Star className="text-pink absolute top-10 right-4 h-4 w-4" />
                <Star className="text-ink absolute right-3 bottom-4 h-3 w-3" />
              </div>

              {/* Title banner */}
              <div className="border-ink bg-pink relative z-10 border-t-[3px] px-3 py-2 text-center">
                <p className="font-display text-[clamp(1.4rem,3.4vw,2rem)] leading-none">The Fool</p>
                <p className="nb-label mt-1 opacity-70">The Graphic · Est. 2019</p>
              </div>
            </div>

            {/* Foil sheen that follows the pointer */}
            <motion.div
              aria-hidden
              className="nb-foil pointer-events-none absolute inset-0 rounded-[18px]"
              style={tiltOn ? { backgroundPosition: sheen } : undefined}
            />
            <span className="nb-label bg-ink text-paper absolute right-5 bottom-[4.6rem] z-20 px-2 py-1 font-bold">
              {isFine ? "Click for a reading" : "Tap for a reading"}
            </span>
          </div>

          {/* ---------------- Back ---------------- */}
          <div
            className="nb-panel absolute inset-0 flex flex-col overflow-hidden rounded-[18px] bg-ink p-3 text-paper [backface-visibility:hidden] [transform:rotateY(180deg)]"
            // This face is mirrored by the flip, so its shadow is drawn
            // mirrored too — it then lands bottom-right like the front's.
            style={{ boxShadow: MIRRORED_SHADOW }}
          >
            <div className="border-paper flex flex-1 flex-col rounded-[10px] border-[3px] p-4 sm:p-5">
              <p className="nb-label text-yellow">Your reading · draw #{Math.max(draw, 1)}</p>
              <p className="font-display mt-3 text-[clamp(1.2rem,3vw,1.6rem)] leading-tight">
                “{fortune}”
              </p>

              <div className="mt-auto">
                <p className="nb-label text-cyan mb-2">Upright</p>
                <p className="text-sm leading-snug">Identity, print, loud ideas, disciplined grids.</p>
                <p className="nb-label text-pink mt-3 mb-2">Reversed</p>
                <p className="text-sm leading-snug opacity-80">Beige decks, safe logos, “make it pop”.</p>

                <dl className="border-paper/30 mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t pt-3">
                  {site.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="nb-label opacity-55">{fact.label}</dt>
                      <dd className="font-display text-xs">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="nb-label text-lime mt-4">↺ Tap to turn back · draw again</p>
              </div>
            </div>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
