import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/interactive/BackToTop";
import { site } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteJsonLd } from "@/lib/seo";
import { OG_ALT, OG_SIZE } from "@/lib/og";

const shareImage = { url: "/og.png", ...OG_SIZE, alt: OG_ALT, type: "image/png" };

/** Display — single weight by design; Archivo Black has no lighter cuts. */
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Search results show ~60 characters of title and ~155 of description, so the
// target phrase ("The Graphic Fool") leads and both stay inside those limits.
const defaultTitle = `${site.brand} — ${site.name}, ${site.role}`;
const description = `${site.brand} is the portfolio of ${site.name}, a ${site.role.toLowerCase()} in Lahore — identity systems, packaging, editorial and art direction.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: `%s — ${site.brand}`,
  },
  description,
  applicationName: site.brand,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: defaultTitle,
    description,
    siteName: site.brand,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description,
    images: [shareImage],
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
  ...(site.googleSiteVerification
    ? { verification: { google: site.googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Next 16 no longer overrides scroll-behavior on navigation unless asked;
      // this keeps in-page anchors smooth while route changes stay instant.
      data-scroll-behavior="smooth"
      className={`${archivoBlack.variable} ${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={siteJsonLd()} />
        <a
          href="#main"
          className="nb-panel bg-yellow font-display sr-only px-4 py-3 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[70]"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
