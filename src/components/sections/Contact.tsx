import { site } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";
import { BriefBuilder } from "@/components/interactive/BriefBuilder";
import { CopyButton } from "@/components/interactive/CopyButton";
import { AsciiPlanet } from "@/components/interactive/AsciiPlanet";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-yellow border-ink relative overflow-hidden border-b-[3px]"
    >
      <div aria-hidden className="nb-grid-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[1800px] px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="nb-label opacity-60">Contact</p>

            <h2
              id="contact-heading"
              className="mt-4 max-w-5xl text-[clamp(2.6rem,10vw,8rem)] leading-[0.84] lg:text-[clamp(2.6rem,6.5vw,8rem)]"
            >
              Let&apos;s make
              <br />
              something{" "}
              <span className="nb-outline-text">loud</span>
            </h2>

            <p className="mt-8 max-w-xl text-base leading-relaxed sm:text-lg">
              Identity systems, packaging, editorial, campaigns. Send the brief, the
              half-formed idea, or just the deadline you&apos;re worried about.
            </p>
          </Reveal>

          {/* Decorative: an ASCII planet in the same ink as the headline. */}
          <Reveal className="lg:col-span-5" delay={0.15}>
            <div className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[560px]">
              <AsciiPlanet />
              <span className="nb-label pointer-events-none absolute right-0 bottom-0 opacity-50">
                Drag to spin ⟲
              </span>
            </div>
          </Reveal>
        </div>

        {/* Email — the primary action, sized like it. */}
        <Reveal delay={0.1}>
          <a
            href={`mailto:${site.email}`}
            className="nb-panel nb-press shadow-nb-lg bg-white hover:bg-pink font-display mt-10 flex flex-wrap items-center justify-between gap-4 px-5 py-6 text-[clamp(1.25rem,4.5vw,2.75rem)] leading-none break-all sm:px-8 sm:py-8"
          >
            {site.email}
            <span aria-hidden className="shrink-0">
              →
            </span>
          </a>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <CopyButton value={site.email} label="Copy email" />
            <p className="nb-label opacity-60">or build a quick brief below ↓</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal delay={0.12} className="lg:col-span-8">
            <BriefBuilder />
          </Reveal>

          {/* Quick facts sit beside the brief on desktop, below it on mobile. */}
          <Reveal delay={0.18} className="lg:col-span-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div className="nb-panel shadow-nb bg-white p-5">
                <p className="nb-label opacity-55">Availability</p>
                <p className="font-display mt-2 flex items-center gap-2.5 text-lg">
                  {site.available && (
                    <span aria-hidden className="bg-lime border-ink block h-3.5 w-3.5 animate-pulse border-2" />
                  )}
                  {site.available ? `Open from ${site.availableFrom}` : "Currently booked"}
                </p>
              </div>
              <div className="nb-panel shadow-nb bg-white p-5">
                <p className="nb-label opacity-55">Based in</p>
                <p className="font-display mt-2 text-lg">{site.location}</p>
              </div>
              <div className="nb-panel shadow-nb bg-white p-5 sm:col-span-2 lg:col-span-1">
                <p className="nb-label opacity-55">Elsewhere</p>
                <ul className="mt-3 grid gap-2">
                  {site.socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nb-panel nb-press shadow-nb-xs bg-paper hover:bg-pink font-display flex items-center justify-between gap-3 px-4 py-2.5 text-base"
                      >
                        {social.label}
                        <span aria-hidden className="text-sm">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
