import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { site } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  const params = getPosts().map((post) => ({ slug: post.slug }));
  // A static export refuses an empty list. With no posts yet, emit one
  // placeholder route that just renders the 404 page.
  return params.length > 0 ? params : [{ slug: "_" }];
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  const description = post.excerpt || `${post.title} — a post by ${site.name} (${site.brand}).`;
  const url = `/blog/${post.slug}/`;
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: site.brand,
      title: `${post.title} — ${site.brand}`,
      description,
      publishedTime: post.date,
      authors: [site.name],
      images: [{ url: post.cover, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — ${site.brand}`,
      description,
      images: [{ url: post.cover, alt: post.title }],
    },
  };
}

export default async function BlogPost(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const posts = getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: absoluteUrl(post.cover),
    datePublished: post.date,
    url: absoluteUrl(`/blog/${post.slug}/`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}/`),
    author: { "@id": absoluteUrl("/#person") },
    publisher: { "@id": absoluteUrl("/#person") },
    isPartOf: { "@id": absoluteUrl("/#website") },
  };

  return (
    <article>
      <JsonLd data={structuredData} />
      <div className="border-ink border-b-[3px]">
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <Link
            href="/blog"
            className="font-display hover:bg-yellow -mx-2 flex items-center gap-2 px-2 py-1 text-sm transition-colors"
          >
            <span aria-hidden>←</span> All posts
          </Link>
          <p className="nb-label opacity-55">{formatDate(post.date)}</p>
        </div>
      </div>

      <header className="border-ink relative overflow-hidden border-b-[3px]">
        <div aria-hidden className="nb-grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1100px] px-4 pt-10 pb-12 sm:px-6 sm:pt-14">
          <h1 className="text-[clamp(2.25rem,8vw,6rem)] leading-[0.86]">{post.title}</h1>
          {post.excerpt && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">{post.excerpt}</p>
          )}
        </div>
      </header>

      <figure className="border-ink border-b-[3px] p-4 sm:p-6 lg:p-10">
        <div className="nb-panel shadow-nb-lg relative mx-auto max-w-[1400px] overflow-hidden bg-white">
          {/* Plain <img> so the cover keeps its natural aspect ratio, whatever it is. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt={post.title} className="block h-auto w-full" />
        </div>
      </figure>

      {post.html && (
        <div className="border-ink border-b-[3px]">
          <div
            className="nb-prose mx-auto w-full max-w-[760px] px-4 py-14 sm:px-6 sm:py-20"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      )}

      {(newer || older) && (
        <nav aria-label="More posts" className="border-ink grid border-b-[3px] sm:grid-cols-2">
          {older ? (
            <Link
              href={`/blog/${older.slug}`}
              className="border-ink hover:bg-yellow group border-b-[3px] px-4 py-8 transition-colors sm:border-r-[3px] sm:border-b-0 sm:px-6 sm:py-12 lg:px-10"
            >
              <p className="nb-label opacity-55">← Older</p>
              <p className="font-display mt-3 text-2xl leading-none uppercase sm:text-3xl">{older.title}</p>
            </Link>
          ) : (
            <span className="border-ink hidden sm:block sm:border-r-[3px]" />
          )}
          {newer && (
            <Link
              href={`/blog/${newer.slug}`}
              className="hover:bg-yellow px-4 py-8 text-right transition-colors sm:px-6 sm:py-12 lg:px-10"
            >
              <p className="nb-label opacity-55">Newer →</p>
              <p className="font-display mt-3 text-2xl leading-none uppercase sm:text-3xl">{newer.title}</p>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
