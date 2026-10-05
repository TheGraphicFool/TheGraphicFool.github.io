"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useMemo, useState } from "react";
import {
  behanceOf,
  categories,
  coverOf,
  projects,
  RATIO_DIMENSIONS,
  type Accent,
  type Project,
  type ProjectCategory,
} from "@/data/projects";
import { ACCENT_BG, ACCENT_TEXT } from "@/lib/accents";
import { usePointerFine } from "@/hooks/usePointerFine";
import { CategoryFilter } from "./CategoryFilter";
import { BehanceButton } from "@/components/ui/BehanceButton";
import { Reveal } from "@/components/motion/Reveal";

type Category = ProjectCategory | "All";

/** Rows shown before "show all" — keeps the section compact. */
const INITIAL_ROWS = 8;

/** Text colour on the hover flood. Written out in full so Tailwind sees it. */
const HOVER_TEXT: Record<Accent, string> = {
  yellow: "",
  pink: "",
  cyan: "",
  violet: "group-hover:text-white group-focus-visible:text-white",
};

const PREVIEW_W = 300;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The work archive as a compact typographic index.
 *
 * Desktop: one row per project. Hovering a row floods it with the project's
 * accent and a tilted cover follows the cursor (it leans with the pointer's
 * speed). Touch / small screens: rows are an accordion — tap to reveal the
 * cover, the one-liner and the links.
 */
export function WorkIndex() {
  const [category, setCategory] = useState<Category>("All");
  const [showAll, setShowAll] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);

  const isFine = usePointerFine();
  const reduceMotion = useReducedMotion();

  // --- Floating preview: follows the pointer, tilts with its velocity ------
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });
  const tilt = useTransform(useVelocity(springX), [-1800, 0, 1800], [-14, -3, 10], { clamp: true });

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: projects.length };
    for (const project of projects) result[project.category] = (result[project.category] ?? 0) + 1;
    return result;
  }, []);

  /** Numbering stays tied to the full archive so it doesn't reshuffle on filter. */
  const filtered = useMemo(
    () =>
      projects
        .map((project, i) => ({ project, number: i + 1 }))
        .filter(({ project }) => category === "All" || project.category === category),
    [category]
  );
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_ROWS);
  const hiddenCount = filtered.length - visible.length;

  const previewOn = isFine && hovered !== null;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-ink border-b-[3px]"
      onPointerMove={(event) => {
        if (!isFine) return;
        x.set(event.clientX);
        y.set(event.clientY);
      }}
    >
      {/* Header — title, blurb and filters in one compact band */}
      <div className="border-ink border-b-[3px] px-4 pt-12 pb-7 sm:px-6 sm:pt-16 lg:px-10">
        <div className="mx-auto w-full max-w-[1800px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div>
                <p className="nb-label opacity-60">Selected work · {projects.length} projects</p>
                <h2 id="work-heading" className="mt-3 text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.85]">
                  The <span className="nb-outline-text">Archive</span>
                </h2>
              </div>
              <p className="hidden max-w-xs text-sm leading-relaxed sm:block sm:text-base">
                Identity systems, printed matter, and the occasional campaign that got out of hand.
              </p>
            </div>
          </Reveal>
          <div className="mt-7">
            <CategoryFilter
              categories={categories}
              active={category}
              counts={counts}
              onChange={(next) => {
                setCategory(next);
                setOpenId(null);
              }}
            />
          </div>
        </div>
      </div>

      {/* Column labels (desktop) */}
      <div className="border-ink nb-label hidden border-b-[3px] px-4 py-2.5 opacity-60 sm:px-6 md:block lg:px-10">
        <div className="mx-auto grid w-full max-w-[1800px] grid-cols-[3.5rem_1fr_11rem_5rem_8.5rem] items-center gap-4">
          <span>No.</span>
          <span>Project</span>
          <span>Category</span>
          <span>Year</span>
          <span />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-16 text-center sm:px-6">
          <p className="font-display text-xl">Nothing filed here yet</p>
          <p className="mt-2 text-sm opacity-70">Try another category.</p>
        </div>
      ) : (
        <ul onPointerLeave={() => setHovered(null)}>
          <AnimatePresence initial={false}>
            {visible.map(({ project, number }) => (
              <motion.li
                key={project.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="border-ink border-b-[3px] last:border-b-0"
              >
                <DesktopRow
                  project={project}
                  number={number}
                  onEnter={() => {
                    // First hover: appear at the pointer instead of flying in
                    // from wherever the spring last rested.
                    if (!hovered) {
                      springX.jump(x.get());
                      springY.jump(y.get());
                    }
                    setHovered(project);
                  }}
                />
                <MobileRow
                  project={project}
                  number={number}
                  open={openId === project.id}
                  onToggle={() => setOpenId((id) => (id === project.id ? null : project.id))}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {(hiddenCount > 0 || (showAll && filtered.length > INITIAL_ROWS)) && (
        <div className="border-ink border-t-[3px] px-4 py-4 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4">
            <p className="nb-label opacity-60">
              Showing {visible.length} of {filtered.length}
            </p>
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="nb-panel nb-press shadow-nb-xs font-display bg-white hover:bg-yellow px-4 py-2.5 text-sm"
            >
              {showAll ? "Show less ↑" : `Show all · +${hiddenCount} ↓`}
            </button>
          </div>
        </div>
      )}

      {/* The cursor-following cover (mouse only, decorative) */}
      {isFine && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-[55]"
          style={{ x: springX, y: springY, rotate: reduceMotion ? -3 : tilt }}
          initial={false}
          animate={{ opacity: previewOn ? 1 : 0, scale: previewOn ? 1 : 0.6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="translate-x-6 -translate-y-1/2">
            <AnimatePresence mode="popLayout" initial={false}>
              {hovered && <Preview key={hovered.id} project={hovered} />}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </section>
  );
}

function Preview({ project }: { project: Project }) {
  const { width, height } = RATIO_DIMENSIONS[project.ratio];
  const h = Math.round((PREVIEW_W * height) / width);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: 4 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.18 }}
      className="nb-panel shadow-nb-lg relative overflow-hidden bg-white"
      style={{ width: PREVIEW_W, height: h }}
    >
      <Image src={coverOf(project).src} alt="" fill sizes={`${PREVIEW_W}px`} className="object-cover" />
      <span
        className={`nb-label border-ink absolute bottom-0 left-0 border-t-[3px] border-r-[3px] px-2.5 py-1.5 font-bold ${ACCENT_BG[project.accent]} ${ACCENT_TEXT[project.accent]}`}
      >
        View project →
      </span>
    </motion.div>
  );
}

/** md and up: the whole row (minus Behance) is one link. */
function DesktopRow({
  project,
  number,
  onEnter,
}: {
  project: Project;
  number: number;
  onEnter: () => void;
}) {
  return (
    <div
      className="group relative hidden overflow-hidden px-4 sm:px-6 md:block lg:px-10"
      onPointerEnter={onEnter}
    >
      {/* Accent flood that wipes in from the left on hover / focus */}
      <span
        aria-hidden
        className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:scale-x-100 group-hover:scale-x-100 ${ACCENT_BG[project.accent]}`}
      />
      <div
        className={`relative mx-auto grid w-full max-w-[1800px] grid-cols-[3.5rem_1fr_11rem_5rem_8.5rem] items-center gap-4 ${HOVER_TEXT[project.accent]}`}
      >
        <Link
          href={`/work/${project.id}`}
          className="col-span-4 grid grid-cols-subgrid items-center py-3 outline-none lg:py-3.5"
        >
          <span className="nb-label font-bold opacity-60">{pad(number)}</span>
          <span className="flex min-w-0 items-center gap-3">
            <span className="font-display truncate text-[clamp(1.2rem,2vw,1.9rem)] leading-none transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-focus-within:translate-x-3">
              {project.title}
            </span>
            <span
              aria-hidden
              className="shrink-0 text-xl transition-transform duration-300 group-hover:translate-x-3 group-hover:-rotate-45 group-focus-within:translate-x-3"
            >
              →
            </span>
          </span>
          <span className="nb-label font-bold">{project.category}</span>
          <span className="nb-label">{project.year}</span>
        </Link>
        <div className="flex justify-end opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100">
          <BehanceButton
            href={behanceOf(project)}
            label="Behance"
            ariaLabel={`${project.title} on Behance`}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

/** Below md: tap a row to open it; links live inside the opened panel. */
function MobileRow({
  project,
  number,
  open,
  onToggle,
}: {
  project: Project;
  number: number;
  open: boolean;
  onToggle: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelId = `work-row-${project.id}`;
  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex w-full items-center gap-3 px-4 py-4 text-left transition-colors sm:px-6 ${
          open ? `${ACCENT_BG[project.accent]} ${ACCENT_TEXT[project.accent]}` : ""
        }`}
      >
        <span className="nb-label w-7 shrink-0 font-bold opacity-60">{pad(number)}</span>
        <span className="min-w-0 flex-1">
          <span className="font-display block truncate text-xl leading-none">{project.title}</span>
          <span className="nb-label mt-1.5 block opacity-70">
            {project.category} · {project.year}
          </span>
        </span>
        <span aria-hidden className="nb-panel grid h-8 w-8 shrink-0 place-items-center bg-white text-lg text-ink">
          <span className={`block leading-none transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-ink border-t-[3px] px-4 pt-4 pb-5 sm:px-6">
              <Link
                href={`/work/${project.id}`}
                className="nb-panel shadow-nb relative block aspect-[16/10] overflow-hidden bg-white"
              >
                <Image
                  src={coverOf(project).src}
                  alt={`${project.title} — cover`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </Link>
              <p className="mt-4 text-sm leading-relaxed">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/work/${project.id}`}
                  className="nb-panel nb-press shadow-nb-xs font-display bg-yellow inline-flex items-center gap-2 px-4 py-2.5 text-sm"
                >
                  View project <span aria-hidden>→</span>
                </Link>
                <BehanceButton
                  href={behanceOf(project)}
                  label="Behance"
                  ariaLabel={`${project.title} on Behance`}
                  size="sm"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
