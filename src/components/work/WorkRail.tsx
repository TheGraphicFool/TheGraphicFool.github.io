"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  categories,
  projects,
  type ProjectCategory,
} from "@/data/projects";
import { CategoryFilter } from "./CategoryFilter";
import { RailCard } from "./RailCard";
import { CursorProvider } from "./CustomCursor";
import { Reveal } from "@/components/motion/Reveal";

type Category = ProjectCategory | "All";
type View = "grid" | "rail";

/**
 * Convert vertical wheel movement into horizontal rail movement.
 *
 * Off by default. Hijacking page scroll is the single most common complaint
 * about horizontal galleries, and trackpad swipe + shift-wheel already scroll
 * the rail natively. Flip to `true` if you want the more aggressive feel — the
 * handler below already releases the wheel back to the page at either edge, so
 * it won't trap the reader.
 */
const WHEEL_TO_HORIZONTAL: boolean = false;

/** Pointer travel (px) past which a release counts as a drag, not a click. */
const DRAG_THRESHOLD = 6;

type Metrics = { progress: number; thumb: number; atStart: boolean; atEnd: boolean };

const INITIAL_METRICS: Metrics = {
  progress: 0,
  thumb: 0.3,
  atStart: true,
  atEnd: false,
};

export function WorkRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<Category>("All");
  // Grid first: every project is visible at a glance. The rail is the
  // browse-one-at-a-time alternative.
  const [view, setView] = useState<View>("grid");
  const [metrics, setMetrics] = useState<Metrics>(INITIAL_METRICS);

  const drag = useRef({
    /** Pointer is down and a drag is still possible. */
    pending: false,
    /** Threshold passed — we've taken pointer capture and are scrolling. */
    active: false,
    startX: 0,
    startScroll: 0,
    moved: 0,
  });
  const frame = useRef(0);

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: projects.length };
    for (const project of projects) {
      result[project.category] = (result[project.category] ?? 0) + 1;
    }
    return result;
  }, []);

  /** Numbering stays tied to the full archive so it doesn't reshuffle on filter. */
  const numbered = useMemo(
    () => projects.map((project, i) => ({ project, number: i + 1 })),
    []
  );

  const visible = useMemo(
    () =>
      category === "All"
        ? numbered
        : numbered.filter((entry) => entry.project.category === category),
    [category, numbered]
  );

  /** The rail element only exists in rail view with something to show; the
   * effects below re-bind whenever it (re)mounts. */
  const railMounted = view === "rail" && visible.length > 0;

  const measure = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    setMetrics({
      progress: max > 0 ? Math.min(1, Math.max(0, left / max)) : 0,
      thumb: el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1,
      atStart: left <= 1,
      atEnd: max <= 0 || left >= max - 1,
    });
  }, []);

  /** Coalesce scroll events to one measurement per frame. */
  const scheduleMeasure = useCallback(() => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    measure();
    el.addEventListener("scroll", scheduleMeasure, { passive: true });

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", scheduleMeasure);
      observer.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [measure, scheduleMeasure, railMounted]);

  // A new filter shows a different set — start it from the left.
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "auto" });
    measure();
  }, [category, measure, railMounted]);

  const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Step to the next/previous card edge, honouring the rail's scroll padding. */
  const goto = useCallback((direction: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;

    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const railLeft = el.getBoundingClientRect().left;
    const stops = Array.from(el.querySelectorAll<HTMLElement>("[data-card]")).map(
      (card) => el.scrollLeft + (card.getBoundingClientRect().left - railLeft) - pad
    );

    const current = el.scrollLeft;
    const EPSILON = 8;
    const target =
      direction === 1
        ? stops.find((stop) => stop > current + EPSILON)
        : [...stops].reverse().find((stop) => stop < current - EPSILON);

    el.scrollTo({
      left: target ?? (direction === 1 ? el.scrollWidth : 0),
      behavior: prefersReduced() ? "auto" : "smooth",
    });
  }, []);

  // --- Pointer drag -------------------------------------------------------
  // Touch and pen already scroll this natively and far better; only mouse
  // pointers get the drag treatment.

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const el = railRef.current;
    if (!el || event.pointerType !== "mouse" || event.button !== 0) return;

    // Arm the drag but take no capture yet — see handlePointerMove.
    drag.current = {
      pending: true,
      active: false,
      startX: event.clientX,
      startScroll: el.scrollLeft,
      moved: 0,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = railRef.current;
    if (!el || !drag.current.pending) return;

    const dx = event.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));

    if (!drag.current.active) {
      if (drag.current.moved <= DRAG_THRESHOLD) return;
      /*
       * Capture is deferred until the pointer has actually travelled.
       * Capturing on pointerdown would retarget the subsequent `click` from
       * the card's <a> to this container, so every card link would go dead.
       */
      drag.current.active = true;
      el.setPointerCapture(event.pointerId);
      el.dataset.dragging = "true";
    }

    el.scrollLeft = drag.current.startScroll - dx;
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const el = railRef.current;
    if (!el || !drag.current.pending) return;

    drag.current.pending = false;
    if (drag.current.active) {
      drag.current.active = false;
      delete el.dataset.dragging;
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
    }
  }

  /**
   * Swallow the click that ends a drag, so releasing over a card after
   * dragging doesn't navigate to it.
   */
  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (drag.current.moved > DRAG_THRESHOLD) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = 0;
    }
  }

  // --- Wheel (opt-in) -----------------------------------------------------

  useEffect(() => {
    const el = railRef.current;
    if (!el || !WHEEL_TO_HORIZONTAL) return;

    function onWheel(event: WheelEvent) {
      const rail = railRef.current;
      if (!rail) return;
      // Horizontal intent already works natively — leave it alone.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const max = rail.scrollWidth - rail.clientWidth;
      const next = rail.scrollLeft + event.deltaY;
      // At either edge, hand the wheel back to the page rather than trapping it.
      if ((next <= 0 && event.deltaY < 0) || (next >= max && event.deltaY > 0)) {
        return;
      }
      event.preventDefault();
      rail.scrollLeft = next;
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [railMounted]);

  // --- Keyboard -----------------------------------------------------------

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const el = railRef.current;
    if (!el) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goto(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goto(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      el.scrollTo({ left: 0, behavior: prefersReduced() ? "auto" : "smooth" });
    } else if (event.key === "End") {
      event.preventDefault();
      el.scrollTo({
        left: el.scrollWidth,
        behavior: prefersReduced() ? "auto" : "smooth",
      });
    }
  }

  const thumbPercent = Math.max(8, metrics.thumb * 100);

  return (
    <CursorProvider>
      <section id="work" aria-labelledby="work-heading" className="border-ink border-b-[3px]">
        {/* Header */}
        <div className="border-ink border-b-[3px] px-4 pt-14 pb-8 sm:px-6 sm:pt-20 lg:px-10">
          <div className="mx-auto w-full max-w-[1800px]">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
                <div>
                  <p className="nb-label opacity-60">Selected work</p>
                  <h2
                    id="work-heading"
                    className="mt-3 text-[clamp(2.75rem,9vw,7rem)] leading-[0.85]"
                  >
                    The
                    <br />
                    <span className="nb-outline-text">Archive</span>
                  </h2>
                </div>
                <p className="max-w-xs text-sm leading-relaxed sm:text-base">
                  {projects.length} projects. Identity systems, printed matter, and
                  the occasional campaign that got out of hand.
                </p>
              </div>
            </Reveal>

            <div className="mt-9 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <CategoryFilter
                categories={categories}
                active={category}
                counts={counts}
                onChange={setCategory}
              />

              <div role="group" aria-label="Layout" className="flex items-center gap-2">
                {(
                  [
                    { id: "grid", label: "Grid", icon: "▦" },
                    { id: "rail", label: "Rail", icon: "⇆" },
                  ] as const
                ).map((option) => {
                  const active = view === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setView(option.id)}
                      className={`nb-panel nb-press font-display flex items-center gap-2 px-3.5 py-2.5 text-sm ${
                        active
                          ? "bg-pink shadow-nb-none translate-x-[3px] translate-y-[3px]"
                          : "bg-white shadow-nb-xs hover:bg-yellow"
                      }`}
                    >
                      <span aria-hidden>{option.icon}</span>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Rail */}
        {visible.length === 0 ? (
          <div className="px-4 py-20 text-center sm:px-6">
            <div className="nb-panel bg-paper-2 shadow-nb mx-auto max-w-md p-10">
              <div className="nb-hazard border-ink mx-auto mb-6 h-6 w-full border-[3px] opacity-30" />
              <p className="font-display text-xl">Nothing filed here yet</p>
              <p className="mt-2 text-sm opacity-70">
                Try another category.
              </p>
            </div>
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:gap-8 lg:px-10 lg:py-10 2xl:grid-cols-4">
            {visible.map(({ project, number }, i) => (
              <RailCard
                key={project.id}
                project={project}
                number={number}
                index={i}
                priority={i < 4}
                layout="grid"
              />
            ))}
          </div>
        ) : (
          <div
            ref={railRef}
            className="nb-rail cursor-grab"
            role="region"
            aria-label="Selected work — scroll or drag horizontally"
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={handleClickCapture}
            onKeyDown={handleKeyDown}
            onDragStart={(event) => event.preventDefault()}
          >
            {visible.map(({ project, number }, i) => (
              <RailCard
                key={project.id}
                project={project}
                number={number}
                index={i}
                priority={i < 2}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        {visible.length > 0 && view === "rail" && (
          <div className="border-ink flex items-center gap-4 border-t-[3px] px-4 py-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goto(-1)}
                disabled={metrics.atStart}
                aria-label="Previous project"
                className="nb-panel nb-press shadow-nb-xs bg-white hover:bg-yellow grid h-11 w-11 place-items-center text-xl disabled:pointer-events-none disabled:opacity-25"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => goto(1)}
                disabled={metrics.atEnd}
                aria-label="Next project"
                className="nb-panel nb-press shadow-nb-xs bg-white hover:bg-yellow grid h-11 w-11 place-items-center text-xl disabled:pointer-events-none disabled:opacity-25"
              >
                →
              </button>
            </div>

            {/* Progress track — a real scrollbar, styled as an object. */}
            <div
              className="nb-panel bg-paper-2 relative h-4 flex-1 overflow-hidden"
              aria-hidden
            >
              <div
                className="bg-ink absolute inset-y-0"
                style={{
                  width: `${thumbPercent}%`,
                  left: `${metrics.progress * (100 - thumbPercent)}%`,
                }}
              />
            </div>

            <p className="nb-label hidden shrink-0 opacity-60 sm:block">
              Drag · Swipe · ← →
            </p>
          </div>
        )}
      </section>
    </CursorProvider>
  );
}
