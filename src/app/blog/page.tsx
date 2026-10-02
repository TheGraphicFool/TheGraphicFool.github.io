import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatDate, getPosts } from "@/lib/blog";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes, process and work in progress from ${site.name} — ${site.brand}, a ${site.role.toLowerCase()} in ${site.location}.`,
  alternates: { canonical: "/blog/" },
  openGraph: {
    type: "website",
    url: "/blog/",
    siteName: site.brand,
    title: `Blog — ${site.brand}`,
    description: `Notes, process and work in progress from ${site.name}.`,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const TILTS = ["-1.5deg", "1deg", "-0.5deg", "1.5deg"];

export default function BlogIndex() {
  const posts = getPosts();
  const [lead, ...rest] = posts;

  return (
    <>
      <header className="border-ink relative overflow-hidden border-b-[3px]">
        <div aria-hidden className="nb-grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1800px] px-4 pt-12 pb-12 sm:px-6 sm:pt-16 lg:px-10">
          <p className="nb-label opacity-60">
            Journal — {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
          <h1 className="mt-4 text-[clamp(3rem,13vw,10rem)] leading-[0.82]">
            The <span className="nb-outline-text">Blog</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
            Process, half-finished thoughts, and things I made on a Tuesday.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1800px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        {posts.length === 0 ? (
          <div className="nb-panel bg-paper-2 shadow-nb mx-auto max-w-md p-10 text-center">
            <div className="nb-hazard border-ink mx-auto mb-6 h-6 w-full border-[3px] opacity-30" />
            <p className="font-display text-xl">Nothing posted yet</p>
            <p className="mt-2 text-sm opacity-70">Check back soon.</p>
          </div>
        ) : (
          <>
            {/* Newest post gets the big slot. */}
            <Reveal>
              <Link
                href={`/blog/${lead.slug}`}
                className="nb-panel nb-lift shadow-nb-lg group grid bg-white lg:grid-cols-12"
              >
                <div className="border-ink relative aspect-[16/10] overflow-hidden border-b-[3px] lg:col-span-7 lg:aspect-auto lg:min-h-[420px] lg:border-r-[3px] lg:border-b-0">
                  <Image
                    src={lead.cover}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="nb-label bg-pink border-ink absolute top-0 left-0 border-r-[3px] border-b-[3px] px-3 py-2 font-bold">
                    Latest
                  </span>
                </div>
                <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:col-span-5">
                  <div>
                    <p className="nb-label opacity-55">{formatDate(lead.date)}</p>
                    <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.75rem)] leading-[0.9]">
                      {lead.title}
                    </h2>
                    {lead.excerpt && (
                      <p className="mt-5 text-base leading-relaxed opacity-80 sm:text-lg">
                        {lead.excerpt}
                      </p>
                    )}
                  </div>
                  <span className="font-display group-hover:bg-yellow nb-panel inline-flex w-fit items-center gap-3 px-5 py-3 text-sm transition-colors">
                    Read <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </Reveal>

            {rest.length > 0 && (
              <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:gap-10 xl:grid-cols-3">
                {rest.map((post, i) => (
                  <li key={post.slug}>
                    <Reveal delay={(i % 3) * 0.08} className="h-full">
                      <Link
                        href={`/blog/${post.slug}`}
                        style={{ ["--tilt" as string]: TILTS[i % TILTS.length] }}
                        className="nb-panel nb-lift shadow-nb group flex h-full flex-col bg-white"
                      >
                        <div className="border-ink relative aspect-[4/3] overflow-hidden border-b-[3px]">
                          <Image
                            src={post.cover}
                            alt=""
                            fill
                            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <p className="nb-label opacity-55">{formatDate(post.date)}</p>
                          <h2 className="mt-3 text-xl leading-none sm:text-2xl">{post.title}</h2>
                          {post.excerpt && (
                            <p className="mt-3 text-sm leading-relaxed opacity-75">{post.excerpt}</p>
                          )}
                        </div>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
