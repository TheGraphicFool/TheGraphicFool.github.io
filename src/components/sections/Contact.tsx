import { site } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-yellow border-ink relative overflow-hidden border-b-[3px]"
    >
      <div aria-hidden className="nb-grid-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[1800px] px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
        <Reveal>
          <p className="nb-label opacity-60">Contact</p>

          <h2
            id="contact-heading"
            className="mt-4 max-w-5xl text-[clamp(2.6rem,10vw,8rem)] leading-[0.84]"
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
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="nb-panel bg-white p-5">
              <p className="nb-label opacity-55">Availability</p>
              <p className="font-display mt-2 text-lg">
                {site.available ? `Open from ${site.availableFrom}` : "Currently booked"}
              </p>
            </div>
            <div className="nb-panel bg-white p-5">
              <p className="nb-label opacity-55">Based in</p>
              <p className="font-display mt-2 text-lg">{site.location}</p>
            </div>
            <div className="nb-panel bg-white p-5 sm:col-span-2">
              <p className="nb-label opacity-55">Elsewhere</p>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-lg underline-offset-4 hover:underline"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
