"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ScrollProgress } from "@/components/interactive/ScrollProgress";

/** Absolute hashes so the nav works identically from `/work/[slug]`. */
const NAV = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  { label: "Blog", href: "/blog" },
];

/** Section ids for the in-page entries ("/#work" → "work"). */
const SECTION_IDS = NAV.filter((item) => item.href.startsWith("/#")).map((item) =>
  item.href.slice(2)
);

export function Header() {
  const [open, setOpen] = useState(false);

  useLockBodyScroll(open);
  // trailingSlash is on, so normalise "/blog/" → "/blog".
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const section = useActiveSection(SECTION_IDS, pathname);
  const isCurrent = (href: string) =>
    href.startsWith("/#")
      ? pathname === "/" && section === href.slice(2)
      : pathname === href || pathname.startsWith(`${href}/`);

  // Note: the panel closes from each link's own onClick rather than a
  // pathname effect — same result, without a render cascade on every nav.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="bg-paper border-ink sticky top-0 z-50 border-b-[3px]">
      <div className="mx-auto flex w-full max-w-[1800px] items-stretch justify-between">
        {/* Logo lockup */}
        <Link
          href="/"
          className="border-ink group flex min-w-0 flex-1 items-center gap-3 py-3 pr-4 pl-4 sm:gap-4 sm:pr-6 sm:pl-6 lg:flex-none lg:border-r-[3px]"
          aria-label={`${site.brand} — ${site.name}, home`}
        >
          <span className="bg-ink text-yellow font-display grid h-9 w-9 place-items-center text-sm transition-colors group-hover:bg-pink group-hover:text-ink sm:h-11 sm:w-11 sm:text-base">
            {site.initials}
          </span>
          <span className="leading-none">
            <span className="font-display block text-sm sm:text-base">
              {site.shortName}
            </span>
            {/* Role is the first thing to go when space gets tight. */}
            <span className="nb-label mt-1 hidden whitespace-nowrap opacity-60 sm:block">
              {site.role}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-stretch lg:flex" aria-label="Main">
          {NAV.map((item) => {
            const isActive = isCurrent(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? (item.href.startsWith("/#") ? "location" : "page") : undefined}
                className={`border-ink font-display flex items-center gap-2 border-l-[3px] px-5 text-sm xl:px-7 transition-colors last:border-r-[3px] ${
                  isActive ? "bg-ink text-yellow" : "hover:bg-yellow"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-stretch">
          {site.available && (
            <p className="border-ink hidden items-center gap-2 border-l-[3px] px-5 xl:flex">
              <span className="bg-lime border-ink block h-3 w-3 border-2" aria-hidden />
              <span className="nb-label">Open · {site.availableFrom}</span>
            </p>
          )}

          <Link
            href="/#contact"
            className="border-ink bg-pink text-ink font-display hidden items-center border-l-[3px] px-6 text-sm whitespace-nowrap transition-colors hover:bg-cyan sm:flex"
          >
            Get in touch
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="border-ink bg-yellow flex items-center gap-2 border-l-[3px] px-5 lg:hidden"
          >
            <span className="nb-label font-bold">{open ? "Close" : "Menu"}</span>
            <span aria-hidden className="grid gap-[3px]">
              <span
                className={`bg-ink block h-[3px] w-5 transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span
                className={`bg-ink block h-[3px] w-5 transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`bg-ink block h-[3px] w-5 transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      <ScrollProgress />

      {/* Mobile panel */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="bg-paper border-ink absolute inset-x-0 top-full border-b-[3px] lg:hidden"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-ink font-display hover:bg-yellow flex items-center justify-between border-b-[3px] px-4 py-5 text-2xl last:border-b-0 sm:px-6"
            >
              {item.label}
              <span aria-hidden className="text-xl">
                →
              </span>
            </Link>
          ))}
          {site.available && (
            <p className="bg-lime border-ink flex items-center gap-2 border-t-[3px] px-4 py-4 sm:px-6">
              <span className="bg-ink block h-3 w-3" aria-hidden />
              <span className="nb-label font-bold">
                Open for work · {site.availableFrom}
              </span>
            </p>
          )}
        </nav>
      )}
    </header>
  );
}
