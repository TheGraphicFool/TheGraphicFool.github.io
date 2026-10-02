"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { behanceOf, coverOf, RATIO_DIMENSIONS, type Project } from "@/data/projects";
import { BehanceButton } from "@/components/ui/BehanceButton";
import { ACCENT_BG, ACCENT_TEXT } from "@/lib/accents";
import { useProjectCursor } from "./CustomCursor";

type RailCardProps = {
  project: Project;
  /** Position in the *unfiltered* archive, so numbering is stable. */
  number: number;
  /** Position in the currently visible (filtered) set — drives the entrance
   * stagger and the alternating hover tilt. Resets naturally on refilter. */
  index: number;
  priority: boolean;
};

export function RailCard({ project, number, index, priority }: RailCardProps) {
  const cover = coverOf(project);
  const { width, height } = RATIO_DIMENSIONS[project.ratio];
  const cursor = useProjectCursor();
  const reduceMotion = useReducedMotion();
  const tilt = index % 2 === 0 ? "1.5deg" : "-1.5deg";

  return (
    /*
     * Width lives on the flex item, not the media box. Sizing the media
     * instead lets the caption's intrinsic text width stretch the card —
     * which silently overrides `aspect-ratio` and produces 550px cards on a
     * 390px phone. Fixing the article's width makes the caption wrap to it.
     */
    <motion.article
      data-card
      className="flex shrink-0 flex-col"
      style={
        {
          width: `min(calc(var(--card-h) * ${(width / height).toFixed(4)}), var(--card-max-w))`,
          "--tilt": tilt,
        } as CSSProperties
      }
      initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: index % 2 === 0 ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* The panel is a div so the Behance link can sit beside (not inside)
          the card link — nested anchors are invalid. */}
      <div className="nb-panel nb-lift shadow-nb-lg group flex h-full flex-col bg-white">
        <Link
          href={`/work/${project.id}`}
          onPointerEnter={() => cursor.show("View")}
          onPointerLeave={cursor.hide}
          onFocus={cursor.hide}
          className="flex flex-1 flex-col"
        >
          {/* Media — fixed height, full card width, cropped to fit. */}
          <div
            className="border-ink relative w-full overflow-hidden border-b-[3px]"
            style={{ height: "var(--card-h)" }}
          >
            <Image
              src={cover.src}
              alt={`${project.title} — ${project.description}`}
              fill
              draggable={false}
              sizes="(min-width: 1280px) 620px, (min-width: 640px) 55vw, 85vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              priority={priority}
            />

            {/* Index badge */}
            <span className="bg-ink text-paper nb-label border-ink absolute top-0 left-0 border-r-[3px] border-b-[3px] px-3 py-2 font-bold">
              {String(number).padStart(2, "0")}
            </span>

            {/* Category badge */}
            <span
              className={`nb-label border-ink absolute top-0 right-0 border-b-[3px] border-l-[3px] px-3 py-2 font-bold ${ACCENT_BG[project.accent]} ${ACCENT_TEXT[project.accent]}`}
            >
              {project.category}
            </span>
          </div>

          {/* Caption bar */}
          <div className="flex flex-1 items-start justify-between gap-4 p-4">
            <div className="min-w-0">
              <h3 className="text-lg leading-none sm:text-xl">{project.title}</h3>
              <p className="mt-2 text-sm leading-snug opacity-70">
                {project.description}
              </p>
            </div>
            <span
              aria-hidden
              className="nb-panel bg-paper group-hover:bg-yellow grid h-9 w-9 shrink-0 place-items-center text-lg transition-colors"
            >
              →
            </span>
          </div>
        </Link>

        {/* Foot rule */}
        <div className="border-ink flex items-center justify-between gap-3 border-t-[3px] px-4 py-2.5">
          <span className="nb-label opacity-60">
            {[project.client, project.year].filter(Boolean).join(" · ")}
          </span>
          <BehanceButton
            href={behanceOf(project)}
            label="Behance"
            ariaLabel={`${project.title} on Behance`}
            size="sm"
          />
        </div>
      </div>
    </motion.article>
  );
}
