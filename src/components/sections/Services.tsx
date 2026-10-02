import { services } from "@/data/site";
import { ACCENT_BG, ACCENT_TEXT } from "@/lib/accents";
import { Reveal } from "@/components/motion/Reveal";

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-ink border-b-[3px]"
    >
      <div className="mx-auto w-full max-w-[1800px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
            <div>
              <p className="nb-label opacity-60">What I do</p>
              <h2
                id="services-heading"
                className="mt-3 text-[clamp(2.5rem,8vw,6rem)] leading-[0.85]"
              >
                Four <span className="nb-outline-text">ways</span>
                <br />
                in
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed sm:text-base">
              Most projects are some combination of these. If yours doesn&apos;t fit
              neatly, that&apos;s usually the interesting one.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.08}>
              <article className="nb-panel nb-lift shadow-nb flex h-full flex-col bg-white">
                <header
                  className={`border-ink flex items-baseline justify-between gap-3 border-b-[3px] px-5 py-4 ${ACCENT_BG[service.accent]} ${ACCENT_TEXT[service.accent]}`}
                >
                  <h3 className="text-xl leading-none">{service.title}</h3>
                  <span className="nb-label font-bold opacity-70">
                    {service.index}
                  </span>
                </header>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm leading-relaxed">{service.summary}</p>

                  <ul className="mt-6 flex-1 space-y-2 border-t-[3px] border-dotted pt-4">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm">
                        <span aria-hidden className="opacity-40">
                          ▸
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
