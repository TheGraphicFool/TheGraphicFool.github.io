import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  coverOf,
  getNeighbours,
  getProject,
  projects,
  RATIO_DIMENSIONS,
} from "@/data/projects";
import { ACCENT_BG, ACCENT_TEXT } from "@/lib/accents";
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/data/site";

/** Every project is known at build time — prerender the lot. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.description,
      images: [{ url: coverOf(project).src }],
    },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const neighbours = getNeighbours(slug);
  const position = projects.findIndex((p) => p.id === slug) + 1;
  const { width, height } = RATIO_DIMENSIONS[project.ratio];
  const [cover, ...gallery] = project.images;

  const meta = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Role", value: project.role },
    { label: "Category", value: project.category },
  ];

  const body = [
    { label: "Overview", text: project.overview },
    { label: "Approach", text: project.approach },
    { label: "Outcome", text: project.outcome },
  ];

  return (
    <article>
      {/* Breadcrumb bar */}
      <div className="border-ink border-b-[3px]">
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <Link
            href="/#work"
            className="font-display hover:bg-yellow -mx-2 flex items-center gap-2 px-2 py-1 text-sm transition-colors"
          >
            <span aria-hidden>←</span> Back to archive
          </Link>
          <p className="nb-label opacity-55">
            {String(position).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Title */}
      <header className="border-ink relative overflow-hidden border-b-[3px]">
        <div aria-hidden className="nb-grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1800px] px-4 pt-10 pb-12 sm:px-6 sm:pt-14 lg:px-10">
          <p
            className={`nb-panel nb-label inline-block px-3 py-2 font-bold ${ACCENT_BG[project.accent]} ${ACCENT_TEXT[project.accent]}`}
          >
            {project.category}
          </p>
          <h1 className="mt-6 max-w-6xl text-[clamp(2.5rem,10vw,8rem)] leading-[0.84]">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
            {project.description}
          </p>
        </div>
      </header>

      {/* Spec strip */}
      <dl className="border-ink grid grid-cols-2 border-b-[3px] lg:grid-cols-4">
        {meta.map((item, i) => (
          <div
            key={item.label}
            className={`border-ink px-4 py-5 sm:px-6 ${
              i % 2 === 1 ? "border-l-[3px]" : ""
            } ${i < 2 ? "border-b-[3px] lg:border-b-0" : ""} ${
              i === 2 ? "lg:border-l-[3px]" : ""
            }`}
          >
            <dt className="nb-label opacity-55">{item.label}</dt>
            <dd className="font-display mt-2 text-base sm:text-lg">{item.value}</dd>
          </div>
        ))}
      </dl>

      {/* Cover */}
      <figure className="border-ink border-b-[3px] p-4 sm:p-6 lg:p-10">
        <div className="nb-panel shadow-nb-lg bg-white mx-auto max-w-[1400px] overflow-hidden">
          <Image
            src={cover.src}
            alt={`${project.title} — ${cover.caption}`}
            width={width}
            height={height}
            sizes="(min-width: 1440px) 1400px, 100vw"
            className="h-auto w-full"
            priority
          />
        </div>
        <figcaption className="nb-label mx-auto mt-4 max-w-[1400px] opacity-55">
          {cover.caption}
        </figcaption>
      </figure>

      {/* Write-up */}
      <div className="border-ink border-b-[3px]">
        <div className="mx-auto w-full max-w-[1800px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="space-y-10 lg:col-span-8">
              {body.map((block) => (
                <section key={block.label}>
                  <h2 className="border-ink flex items-baseline gap-3 border-b-[3px] pb-3 text-2xl sm:text-3xl">
                    {block.label}
                  </h2>
                  <p className="mt-5 max-w-3xl text-base leading-relaxed sm:text-lg">
                    {block.text}
                  </p>
                </section>
              ))}
            </div>

            <aside className="lg:col-span-4">
              <div className="nb-panel shadow-nb bg-white lg:sticky lg:top-28">
                <h2
                  className={`border-ink border-b-[3px] px-5 py-4 text-lg ${ACCENT_BG[project.accent]} ${ACCENT_TEXT[project.accent]}`}
                >
                  Deliverables
                </h2>
                <ul className="p-5">
                  {project.deliverables.map((item, i) => (
                    <li
                      key={item}
                      className={`flex gap-3 py-2.5 text-sm ${i > 0 ? "border-t border-dotted" : ""}`}
                    >
                      <span className="nb-label shrink-0 opacity-40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {gallery.length > 0 && (
        <div className="border-ink bg-paper-2 border-b-[3px]">
          <div className="mx-auto w-full max-w-[1800px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
            <p className="nb-label mb-8 opacity-60">
              Selected artwork — {gallery.length}{" "}
              {gallery.length === 1 ? "piece" : "pieces"}
            </p>
            <div className="grid gap-10 lg:gap-14">
              {gallery.map((image, i) => (
                <figure key={image.src}>
                  <div className="nb-panel shadow-nb-lg bg-white mx-auto max-w-[1200px] overflow-hidden">
                    <Image
                      src={image.src}
                      alt={`${project.title} — ${image.caption}`}
                      width={width}
                      height={height}
                      sizes="(min-width: 1280px) 1200px, 100vw"
                      className="h-auto w-full"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                  <figcaption className="nb-label mx-auto mt-4 flex max-w-[1200px] gap-3 opacity-55">
                    <span>{String(i + 2).padStart(2, "0")}</span>
                    <span>{image.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="border-ink border-b-[3px]">
        <div className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center gap-3 px-4 py-6 sm:px-6 lg:px-10">
          <p className="nb-label opacity-55">Filed under</p>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="nb-panel nb-label shadow-nb-xs bg-white px-3 py-2 font-bold"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <Marquee
        items={[project.title, project.category, project.year, project.client]}
        duration={30}
        className="bg-ink text-cyan"
      />

      {/* Prev / next */}
      {neighbours && (
        <nav
          aria-label="More projects"
          className="border-ink grid border-b-[3px] sm:grid-cols-2"
        >
          <Link
            href={`/work/${neighbours.prev.id}`}
            className="border-ink hover:bg-yellow group border-b-[3px] px-4 py-8 transition-colors sm:border-r-[3px] sm:border-b-0 sm:px-6 sm:py-12 lg:px-10"
          >
            <p className="nb-label flex items-center gap-2 opacity-55">
              <span aria-hidden className="transition-transform group-hover:-translate-x-1">
                ←
              </span>
              Previous
            </p>
            <p className="mt-3 text-2xl leading-none sm:text-4xl font-display uppercase">
              {neighbours.prev.title}
            </p>
          </Link>
          <Link
            href={`/work/${neighbours.next.id}`}
            className="hover:bg-yellow group px-4 py-8 text-right transition-colors sm:px-6 sm:py-12 lg:px-10"
          >
            <p className="nb-label flex items-center justify-end gap-2 opacity-55">
              Next
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </p>
            <p className="mt-3 text-2xl leading-none sm:text-4xl font-display uppercase">
              {neighbours.next.title}
            </p>
          </Link>
        </nav>
      )}

      {/* Closing CTA */}
      <div className="bg-yellow border-ink border-b-[3px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center justify-between gap-6">
          <h2 className="text-[clamp(1.9rem,6vw,4rem)] leading-[0.9]">
            Got something
            <br />
            like this?
          </h2>
          <a
            href={`mailto:${site.email}`}
            className="nb-panel nb-press shadow-nb bg-white hover:bg-cyan font-display inline-flex items-center gap-3 px-6 py-4 text-base sm:text-lg"
          >
            Start a project <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </article>
  );
}
