/**
 * Single source of truth for everything about *you*.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  ⚠  PLACEHOLDERS TO REPLACE — every value tagged `[DRAFT]` below was
 *     written as a stand-in. The name is real (pulled from your git config);
 *     the rest is a plausible draft so the layout is filled out. Edit this
 *     one file and the whole site updates.
 *
 *     Specifically: `email`, `location`, `availableFrom`, `socials`, `bio`,
 *     `facts`, and `toolkit`.
 *
 *     NOTE ON EMAIL: deliberately left as a placeholder rather than your
 *     personal gmail — publishing a personal address on a live portfolio is
 *     your call to make, not mine. Swap in whatever you want public.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Muhammad Ali Zahid",
  /** Studio / brand name. Used in titles, structured data and visible copy so
   * searches for "The Graphic Fool" land here. */
  brand: "The Graphic Fool",
  /** Other spellings people search for — fed to structured data. */
  aliases: ["TheGraphicFool", "Graphic Fool", "Ali Zahid", "Muhammad Ali Zahid designer"],
  /** Canonical origin. Overridable at build time with NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thegraphicfool.github.io",
  /** Square-ish photo used for structured data and the share card. */
  portrait: "/portrait.webp",
  /** Compact form for the header lockup and tight spaces. */
  shortName: "Ali Zahid",
  initials: "AZ",

  /** [DRAFT] */
  role: "Brand & Print Designer",
  /** [DRAFT] Sits under the hero headline. Two short sentences, max. */
  tagline:
    "I build identity systems and printed matter that refuse to be ignored. Loud where it counts, disciplined everywhere else.",

  /** [DRAFT] */
  location: "Lahore, PK",
  /** [DRAFT] */
  email: "info.aliz.gg@gmail.com",
  /** [DRAFT] Shown in the availability pill. */
  availableFrom: "Q4 2026",
  available: true,

  /**
   * Paste the code from Google Search Console's "HTML tag" verification
   * method here (just the content="…" value). Empty = no tag.
   */
  googleSiteVerification: "",

  /** Search keywords — kept short and honest; Google mostly ignores the
   * keywords tag, but other engines and some tools still read it. */
  keywords: [
    "The Graphic Fool",
    "TheGraphicFool",
    "Muhammad Ali Zahid",
    "Ali Zahid designer",
    "graphic designer Lahore",
    "brand identity designer Pakistan",
    "print designer",
    "packaging design",
    "editorial design",
    "art direction",
    "portfolio",
  ],

  /** Behance profile — the fallback for any project without its own `behance` link. */
  behance: "https://www.behance.net/TheGraphicFool",

  /** [DRAFT] Delete any you don't use — the UI adapts to the list length. */
  socials: [
    { label: "Instagram", handle: "@example", href: "https://instagram.com/example" },
    { label: "Behance", handle: "/TheGraphicFool", href: "https://www.behance.net/TheGraphicFool" },
    { label: "LinkedIn", handle: "in/muhammadalizahidpng", href: "https://www.linkedin.com/in/muhammadalizahidpng/" },
  ],

  /** [DRAFT] About section. Kept as paragraphs so it stays easy to rewrite. */
  bio: [
    "I'm a designer working across brand identity and print. Most of what I make starts as a system — a grid, a mark, a set of rules — and ends as something you can hold, hang, or walk past on a street and still recognise.",
    "I care about the parts that survive contact with reality: how a logo holds up at 12px, whether a colour survives a cheap print run, if a layout still works when the copy doubles in length. Good design is mostly the boring decisions made well.",
    "I take on identity systems, packaging, editorial layouts, and the occasional campaign. If it needs to be printed, folded, stacked, or shipped, I'm interested.",
  ],

  /** [DRAFT] Rendered as a mono spec table in the About section. */
  facts: [
    { label: "Based in", value: "Lahore, PK" },
    { label: "Working since", value: "2019" },
    { label: "Focus", value: "Identity · Impact . Print" },
    { label: "Available", value: "Q4 2026" },
  ],

  /** [DRAFT] */
  toolkit: [
    "Illustrator",
    "InDesign",
    "Photoshop",
    "Figma",
    "Blender",
    "Risograph",
    "Letterpress",
  ],
} as const;

/**
 * Marquee ticker content. Short, punchy, uppercase — these scroll past fast.
 */
export const marqueeItems = [
  "Brand Identity",
  "Packaging",
  "Editorial Design",
  "Art Direction",
  "Typography",
  "Print Production",
  "Visual Systems",
  "Campaigns",
] as const;

export type Service = {
  id: string;
  index: string;
  title: string;
  summary: string;
  deliverables: string[];
  /** Token name from globals.css — drives the card's fill. */
  accent: "yellow" | "pink" | "cyan" | "violet";
};

/** [DRAFT] Rewrite the copy; the structure is what matters. */
export const services: Service[] = [
  {
    id: "identity",
    index: "01",
    title: "Brand Identity",
    summary:
      "The mark, and everything that has to survive alongside it. Built as a system with rules, not a single logo file and good luck.",
    deliverables: [
      "Logotype & marks",
      "Colour & type systems",
      "Grid & layout rules",
      "Brand guidelines",
      "Asset libraries",
    ],
    accent: "yellow",
  },
  {
    id: "print",
    index: "02",
    title: "Print & Editorial",
    summary:
      "Layouts built to hold real content at real lengths. Zines, books, reports, magazines — anything with a spine or a fold.",
    deliverables: [
      "Editorial layout",
      "Cover systems",
      "Typesetting",
      "Print-ready artwork",
      "Press checks",
    ],
    accent: "pink",
  },
  {
    id: "packaging",
    index: "03",
    title: "Packaging",
    summary:
      "Structure and surface together. Designed for the shelf it actually sits on, the light it sits under, and the budget it ships on.",
    deliverables: [
      "Structural design",
      "Surface graphics",
      "Dielines & specs",
      "Range architecture",
      "Production files",
    ],
    accent: "cyan",
  },
  {
    id: "direction",
    index: "04",
    title: "Art Direction",
    summary:
      "Setting the visual argument and holding the line on it across every format the campaign has to land in.",
    deliverables: [
      "Campaign concepting",
      "Photo & illustration direction",
      "Format adaptation",
      "Rollout systems",
      "Launch assets",
    ],
    accent: "violet",
  },
];
