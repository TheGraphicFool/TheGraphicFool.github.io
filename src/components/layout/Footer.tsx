import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  const year = 2026; // Bumped by hand — avoids a hydration mismatch from new Date().

  return (
    <footer className="bg-ink border-ink border-t-[3px] text-paper">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          <div className="px-4 py-8 sm:px-6 lg:py-10">
            <p className="font-display text-yellow text-2xl">{site.shortName}</p>
            <p className="nb-label mt-3 opacity-60">{site.role}</p>
            <p className="nb-label mt-1 opacity-60">{site.location}</p>
          </div>

          <div className="px-4 py-8 sm:px-6 lg:py-10">
            <p className="nb-label text-cyan mb-4">Elsewhere</p>
            <ul className="space-y-2">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline"
                  >
                    {social.label}
                    <span aria-hidden className="text-xs opacity-50">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 py-8 sm:px-6 lg:py-10">
            <p className="nb-label text-cyan mb-4">Navigate</p>
            <ul className="space-y-2 text-sm">
              {["Work", "Services", "About", "Contact"].map((label) => (
                <li key={label}>
                  <Link
                    href={`/#${label.toLowerCase()}`}
                    className="hover:text-yellow underline-offset-4 hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 py-8 sm:px-6 lg:py-10">
            <p className="nb-label text-cyan mb-4">Start something</p>
            <a
              href={`mailto:${site.email}`}
              className="font-display hover:text-yellow block text-lg break-all"
            >
              {site.email}
            </a>
          </div>
        </div>

        <div className="border-paper/25 flex flex-col gap-2 border-t px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="nb-label opacity-60">
            © {year} {site.name}
          </p>
          <p className="nb-label opacity-60">
            Built with Next.js · Set in Archivo Black & Space Grotesk
          </p>
        </div>
      </div>
    </footer>
  );
}
