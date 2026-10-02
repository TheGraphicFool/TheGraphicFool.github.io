import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/** /sitemap.xml — every public page, so search engines find all of them. */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const latestPost = posts[0]?.date;

  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1, images: [absoluteUrl("/portrait.webp")] },
    {
      url: absoluteUrl("/blog/"),
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.id}/`),
      changeFrequency: "yearly" as const,
      priority: 0.8,
      images: [absoluteUrl(project.images[0].src)],
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}/`),
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      images: [absoluteUrl(post.cover)],
    })),
  ];
}
