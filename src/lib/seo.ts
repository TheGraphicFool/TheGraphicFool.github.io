import { site } from "@/data/site";

/** Absolute URL for a site path ("/work/x/" → "https://…/work/x/"). */
export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}

/** Social profiles that are real (placeholders like instagram.com/example are skipped). */
export const profileLinks = site.socials
  .map((social) => social.href)
  .filter((href) => !/\/example\/?$/.test(href));

/** Person + WebSite graph, shared by every page. */
export function siteJsonLd() {
  const personId = absoluteUrl("/#person");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        alternateName: [site.brand, ...site.aliases],
        url: absoluteUrl("/"),
        image: absoluteUrl(site.portrait),
        jobTitle: site.role,
        description: site.tagline,
        email: `mailto:${site.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressCountry: "PK",
        },
        knowsAbout: [
          "Brand identity",
          "Graphic design",
          "Print design",
          "Packaging design",
          "Editorial design",
          "Art direction",
          "Typography",
        ],
        sameAs: profileLinks,
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: site.brand,
        alternateName: [site.name, "TheGraphicFool"],
        description: site.tagline,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
    ],
  };
}

/** Renders a JSON-LD block. `<` is escaped so content can't close the tag. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
