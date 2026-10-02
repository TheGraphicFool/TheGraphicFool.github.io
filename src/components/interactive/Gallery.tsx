"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { ProjectImage } from "@/data/projects";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type GalleryProps = {
  title: string;
  images: ProjectImage[];
  width: number;
  height: number;
  /** Number shown next to the first gallery image (the cover is 01). */
  startAt?: number;
};

/** Case-study gallery: stacked artwork that opens into a keyboard-driven lightbox. */
export function Gallery({ title, images, width, height, startAt = 2 }: GalleryProps) {
  const [open, setOpen] = useState<number | null>(null);
  useLockBodyScroll(open !== null);

  const step = useCallback(
    (direction: 1 | -1) =>
      setOpen((current) =>
        current === null ? current : (current + direction + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const current = open === null ? null : images[open];

  return (
    <>
      <div className="grid gap-10 lg:gap-14">
        {images.map((image, i) => (
          <figure key={image.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open ${title} artwork ${String(i + startAt).padStart(2, "0")} full screen`}
              className="nb-panel nb-lift shadow-nb-lg group relative mx-auto block w-full max-w-[1200px] cursor-zoom-in overflow-hidden bg-white"
            >
              <Image
                src={image.src}
                alt={`${title} — ${image.caption}`}
                width={width}
                height={height}
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="h-auto w-full"
                loading={i === 0 ? "eager" : "lazy"}
              />
              <span className="nb-panel nb-label bg-yellow shadow-nb-xs absolute right-4 bottom-4 px-3 py-2 font-bold opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                Zoom ⤢
              </span>
            </button>
            <figcaption className="nb-label mx-auto mt-4 flex max-w-[1200px] gap-3 opacity-55">
              <span>{String(i + startAt).padStart(2, "0")}</span>
              <span>{image.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <AnimatePresence>
        {current && open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — artwork viewer`}
            className="bg-ink/95 fixed inset-0 z-[80] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(null)}
          >
            <div
              className="text-paper flex items-center justify-between gap-4 px-4 py-3 sm:px-6"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="nb-label">
                {String(open + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                {current.caption && <span className="ml-3 opacity-60">{current.caption}</span>}
              </p>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(null)}
                className="nb-panel nb-press bg-yellow text-ink font-display px-4 py-2 text-sm"
              >
                Close ✕
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={`${title} — ${current.caption}`}
                  className="border-paper max-h-full max-w-full border-[3px] object-contain"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) step(1);
                    else if (info.offset.x > 80) step(-1);
                  }}
                  onClick={(event) => event.stopPropagation()}
                  draggable={false}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous artwork"
                    onClick={(event) => {
                      event.stopPropagation();
                      step(-1);
                    }}
                    className="nb-panel nb-press bg-white text-ink absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center text-xl sm:grid"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next artwork"
                    onClick={(event) => {
                      event.stopPropagation();
                      step(1);
                    }}
                    className="nb-panel nb-press bg-white text-ink absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center text-xl sm:grid"
                  >
                    →
                  </button>
                </>
              )}
            </div>
            <p className="nb-label text-paper pb-4 text-center opacity-50">
              ← → to browse · swipe on touch · Esc to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
