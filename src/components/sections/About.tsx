import Image from "next/image";
import { site } from "@/data/site";
import { DragSticker } from "@/components/interactive/DragSticker";
import { Reveal } from "@/components/motion/Reveal";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-ink bg-paper-2 relative border-b-[3px]"
    >
      <div aria-hidden className="nb-dots-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[1800px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="nb-label opacity-60">About — {site.brand}</p>
            <h2
              id="about-heading"
              className="mt-3 text-[clamp(2.5rem,8vw,6rem)] leading-[0.85]"
            >
              Systems
              <br />
              <span className="nb-outline-text">first</span>
            </h2>

            <div className="mt-8 max-w-2xl space-y-5">
              {site.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-lg leading-relaxed sm:text-xl"
                      : "text-base leading-relaxed opacity-80"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10">
              <p className="nb-label mb-4 opacity-60">Toolkit</p>
              <ul className="flex flex-wrap gap-2.5">
                {site.toolkit.map((tool) => (
                  <li
                    key={tool}
                    className="nb-panel nb-label nb-wiggle shadow-nb-xs bg-white hover:bg-lime px-3 py-2 font-bold transition-colors"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>

            {site.experience.length > 0 && (
              <div className="mt-10">
                <p className="nb-label mb-4 opacity-60">Also worked on</p>
                <ul className="space-y-4">
                  {site.experience.map((item) => (
                    <li key={item.org} className="nb-panel shadow-nb-xs bg-white">
                      <div className="border-ink flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-[3px] px-4 py-3">
                        <h3 className="text-lg leading-none">{item.org}</h3>
                        <p className="nb-label opacity-60">{item.period}</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="font-display text-sm">{item.role}</p>
                        <p className="mt-2 text-sm leading-relaxed opacity-80">{item.summary}</p>
                        <p className="nb-label mt-3 opacity-55">{item.note}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>

          {/* Portrait slot */}
          <Reveal className="lg:col-span-5" delay={0.12} distance={30}>
            <div className="relative">
              <div className="absolute -top-5 -left-3 z-10 sm:-left-5">
                <DragSticker rotate={6} className="bg-cyan">
                  Say hello · drag me
                </DragSticker>
              </div>

              <div className="nb-panel shadow-nb-lg bg-white">
                <div className="bg-violet border-ink relative aspect-[4/5] overflow-hidden border-b-[3px]">
                  <Image
                    src="/portrait.webp"
                    alt={`Portrait of ${site.name}`}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <p className="font-display text-base">{site.name}</p>
                  <p className="nb-label opacity-55">{site.location}</p>
                </div>
              </div>

              {/* Socials */}
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nb-panel nb-press shadow-nb-xs bg-white hover:bg-yellow flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <span className="font-display text-sm">{social.label}</span>
                      <span aria-hidden className="text-sm opacity-50">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
