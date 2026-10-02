/**
 * Project archive.
 *
 * ⚠  These 14 projects are PLACEHOLDERS — fictional clients paired with the
 *    generated SVG artwork in `public/projects/`. Swap in real work by editing
 *    this file; the rail, the filters, and the `/work/[slug]` case study pages
 *    all read from here and need no other changes.
 *
 *    To add a project: append an entry, drop images in
 *    `public/projects/<id>/`, and set `ratio` to match their aspect ratio.
 */

export type ProjectCategory =
  | "Identity"
  | "Packaging"
  | "Editorial"
  | "Campaigns"
  | "Concept"
  ;

/** Card shape in the rail. Must match the artwork's actual aspect ratio. */
export type ProjectRatio = "portrait" | "square" | "landscape";

/** Accent token from globals.css — colours the card shadow and case study. */
export type Accent = "yellow" | "pink" | "cyan" | "violet";

export const RATIO_DIMENSIONS: Record<
  ProjectRatio,
  { width: number; height: number }
> = {
  portrait: { width: 1000, height: 1250 },
  square: { width: 1200, height: 1200 },
  landscape: { width: 1600, height: 1200 },
};

export type ProjectImage = {
  src: string;
  caption: string;
};

export type Project = {
  /** Also the URL slug: /work/<id> */
  id: string;
  title: string;
  category: ProjectCategory;
  ratio: ProjectRatio;
  accent: Accent;
  year: string;
  client: string;
  role: string;
  /** One line, shown on the rail card. Keep it under ~90 characters. */
  description: string;
  overview: string;
  approach: string;
  outcome: string;
  deliverables: string[];
  /** First image is the cover. */
  images: ProjectImage[];
  tags: string[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "fido-dido",
    title: "Fido & Dido x 7up",
    category: "Concept",
    ratio: "square",
    accent: "pink",
    year: "2026",
    client: "",
    role: "Brand Identity, Art Direction",
    description:
      "A conceptual brand revival for Fido Dido, reimagining the iconic 7UP mascot for a new generation through the idea “Cool Never Left.”",
    overview:
      "This project explores a minimal 2D vector design language combined with bold typography and clean editorial layouts to reposition Fido Dido as a timeless symbol of effortless attitude in today’s fast-moving digital culture. Instead of nostalgia, the focus is on relevance — showing how simplicity, confidence, and calm presence feel more powerful than ever in a noisy world.",
    approach:
      "The mark is built from five modular segments that can break apart and recompose. Each release gets its own arrangement and its own two-colour palette, drawn from a fixed set. What never moves is the grid: the same margins, the same type scale, the same corner placement on every sleeve, poster, and shirt.",
    outcome:
      "A seamless, brand mascot revival campaign that resonantes with the target audience, resulting in increased engagement and brand recognition. The modular system allows for continuous evolution of the brand identity while maintaining a cohesive visual language.",
    deliverables: [
      "Key Visuals",
      "Modular Design System",
      "Typography & Colour Palette",
      "Merchandise & Packaging",
      "Digital & Social Media Assets"
    ],
    images: [
      { src: "/projects/fido-dido/cover.png", caption: "" },
      { src: "/projects/fido-dido/5.png", caption: "" },
      { src: "/projects/fido-dido/8.1.png", caption: "" },
      { src: "/projects/fido-dido/8.2.png", caption: "" },
      { src: "/projects/fido-dido/8.3.png", caption: "" },
      { src: "/projects/fido-dido/8.4.png", caption: "" },
      { src: "/projects/fido-dido/9.png", caption: "" },
      { src: "/projects/fido-dido/10.png", caption: "" },
      
    ],
    tags: ["Identity", "Modular System", "Music"],
    featured: true,
  },
  {
    id: "quiet-hours",
    title: "Quiet Hours",
    category: "Editorial",
    ratio: "portrait",
    accent: "violet",
    year: "2025",
    client: "Quiet Hours Journal",
    role: "Editorial Design",
    description:
      "A quarterly essay journal on solitude, set to be read slowly.",
    overview:
      "A quarterly of long-form essays on attention and solitude, running 120 pages with almost no imagery. The brief was simple and hard: make the reading experience match the subject without the design disappearing entirely.",
    approach:
      "A single-column measure at 62 characters, set in a transitional serif at generous leading. Every essay opens on a right-hand page with three-quarters of it empty. Section markers and folios are the only place colour appears, and only ever one colour per issue.",
    outcome:
      "Average session length reported by their reader survey went from 11 minutes to 34. Four issues have now shipped on the system with no template changes.",
    deliverables: [
      "Cover system",
      "Interior grid & type scale",
      "Section marker set",
      "Master InDesign templates",
      "Print specifications",
    ],
    images: [
      { src: "/projects/quiet-hours/cover.svg", caption: "Issue 04 cover — one colour, one form." },
      { src: "/projects/quiet-hours/01.svg", caption: "Essay opener with three-quarter empty page." },
      { src: "/projects/quiet-hours/02.svg", caption: "Section markers across a full volume." },
    ],
    tags: ["Editorial", "Typography", "Print"],
  },
  {
    id: "north-field",
    title: "North Field",
    category: "Identity",
    ratio: "landscape",
    accent: "cyan",
    year: "2026",
    client: "North Field Analytics",
    role: "Brand Identity, Data Design",
    description:
      "Identity and annual report system for an agricultural research body.",
    overview:
      "North Field publishes soil and yield data that farmers actually use to make decisions. Their previous reports were dense, grey, and — by their own admission — mostly unread.",
    approach:
      "The identity takes the field itself as its unit: a bar system where every bar is a plot, scaled to real data. It works as a logo, as a chart, and as a page-edge index in the annual report. Colour is restricted to four values, each mapped to a fixed data band so a reader learns the code once.",
    outcome:
      "The 2026 annual report was requested in print by 4× the previous year's distribution. Three regional bodies have since adopted the chart conventions.",
    deliverables: [
      "Wordmark & bar system",
      "Data colour coding",
      "Annual report design",
      "Chart component library",
      "Signage & field markers",
    ],
    images: [
      { src: "/projects/north-field/cover.svg", caption: "Bar system scaled to live plot data." },
      { src: "/projects/north-field/01.svg", caption: "Annual report cover and page-edge index." },
      { src: "/projects/north-field/02.svg", caption: "Four-value data colour code." },
    ],
    tags: ["Identity", "Data Design", "Report"],
  },
  {
    id: "glass-market",
    title: "Glass Market",
    category: "Campaigns",
    ratio: "landscape",
    accent: "yellow",
    year: "2025",
    client: "Glass Market Co.",
    role: "Campaign Design, Art Direction",
    description:
      "An autumn OOH campaign built on one silhouette that never repeats.",
    overview:
      "A home goods retailer with a strong product range and no campaign coherence — every seasonal push had looked like a different company. The autumn launch had to run across billboards, transit, social, and in-store simultaneously.",
    approach:
      "One silhouette, recomposed for every format rather than cropped into it. The billboard version and the square social version share no pixels but read as the same image. Type is locked to two sizes across all placements: enormous, and small.",
    outcome:
      "Unprompted brand recall rose 22 points over the campaign window. The silhouette system was carried into the following two seasons without redesign.",
    deliverables: [
      "Campaign concept",
      "OOH artwork (6 formats)",
      "Social adaptation kit",
      "In-store graphics",
      "Format adaptation rules",
    ],
    images: [
      { src: "/projects/glass-market/cover.svg", caption: "48-sheet billboard composition." },
      { src: "/projects/glass-market/01.svg", caption: "The same silhouette recomposed for square." },
      { src: "/projects/glass-market/02.svg", caption: "In-store vinyl and shelf talkers." },
    ],
    tags: ["Campaigns", "OOH", "Art Direction"],
    featured: true,
  },
  {
    id: "paper-trail",
    title: "Paper Trail",
    category: "Editorial",
    ratio: "square",
    accent: "yellow",
    year: "2024",
    client: "Paper Trail Zine",
    role: "Editorial Design, Print Production",
    description:
      "A zine grid that holds twenty contributor styles without flattening them.",
    overview:
      "A risograph zine on independent publishing, with a rotating cast of around twenty contributors per issue, each submitting work in a completely different visual register. Previous issues had read as a pile rather than a publication.",
    approach:
      "A four-column modular grid with deliberately loose rules: contributors can occupy any rectangle of modules they like, but the gutters, the folio position, and the two-spot-colour limit are fixed. The constraint sits in the structure, not the style.",
    outcome:
      "Issues 07 through 11 ran on the grid. Contributor satisfaction — they surveyed it — went up, which is unusual for a project that adds constraints.",
    deliverables: [
      "Modular grid system",
      "Contributor submission guide",
      "Two-colour riso separations",
      "Cover series",
      "Print production management",
    ],
    images: [
      { src: "/projects/paper-trail/cover.svg", caption: "Four-column module map." },
      { src: "/projects/paper-trail/01.svg", caption: "Five contributors, one spread." },
      { src: "/projects/paper-trail/02.svg", caption: "Two-spot riso separation test." },
    ],
    tags: ["Editorial", "Risograph", "Grid Systems"],
  },
  {
    id: "coastline-radio",
    title: "Coastline Radio",
    category: "Identity",
    ratio: "square",
    accent: "cyan",
    year: "2025",
    client: "Coastline Radio",
    role: "Brand Identity",
    description:
      "Tidal rhythm turned into a mark that shifts with the broadcast schedule.",
    overview:
      "An independent coastal station broadcasting 18 hours a day, with programming that swings from 6am shipping forecasts to 2am experimental sets. One flat identity was never going to hold that range.",
    approach:
      "The mark is an arc whose curvature is tied to the schedule — flat and wide in the morning, steep and compressed at night. It's generated from a single parameter, so the station can set it themselves per show. The wordmark underneath never changes.",
    outcome:
      "Producers now pick their own arc when they submit a show. The station's social output became visually distinct per slot without any additional design work.",
    deliverables: [
      "Parametric arc mark",
      "Wordmark",
      "Schedule-linked variants",
      "Social templates",
      "Studio & merchandise application",
    ],
    images: [
      { src: "/projects/coastline-radio/cover.svg", caption: "Arc at three schedule positions." },
      { src: "/projects/coastline-radio/01.svg", caption: "Wordmark lockup and clear space." },
      { src: "/projects/coastline-radio/02.svg", caption: "Per-show social templates." },
    ],
    tags: ["Identity", "Parametric", "Broadcast"],
  },
  {
    id: "midnight-transit",
    title: "Midnight Transit",
    category: "Identity",
    ratio: "portrait",
    accent: "violet",
    year: "2026",
    client: "Midnight Transit Authority",
    role: "Wayfinding, Environmental Graphics",
    description:
      "Night-bus wayfinding legible at 3am, from across the road, half asleep.",
    overview:
      "A night bus network serving eleven routes, all sharing daytime stops designed for daytime conditions. Riders were consistently boarding the wrong service — the existing signage simply wasn't readable under sodium lighting.",
    approach:
      "Route identity moved from colour to shape, because colour dies under sodium and shape doesn't. Each route gets a distinct geometric badge at a minimum 180mm, high-contrast, retroreflective. Numerals are set in a single weight at one size, network-wide, with no exceptions.",
    outcome:
      "Wrong-service boardings dropped 61% across the pilot corridor in the first quarter. The badge set is being extended to the full network.",
    deliverables: [
      "Route badge system",
      "Stop signage design",
      "Retroreflective specifications",
      "Numeral & type standards",
      "Installation manual",
    ],
    images: [
      { src: "/projects/midnight-transit/cover.svg", caption: "Route badge under sodium simulation." },
      { src: "/projects/midnight-transit/01.svg", caption: "Eleven-route badge set." },
      { src: "/projects/midnight-transit/02.svg", caption: "Stop pole assembly and sightlines." },
    ],
    tags: ["Wayfinding", "Environmental", "Accessibility"],
  },
  {
    id: "citrus-press",
    title: "Citrus Press",
    category: "Packaging",
    ratio: "square",
    accent: "yellow",
    year: "2024",
    client: "Citrus Press",
    role: "Packaging, Brand Identity",
    description:
      "A cold-press range that reads from the far end of the aisle.",
    overview:
      "Six cold-press juices competing in a chilled cabinet against roughly forty other bottles, most of them white with a photograph of fruit on them. The range needed to be identifiable at four metres, through glass, at an angle.",
    approach:
      "Two colours per SKU, edge to edge, no photography and no white. The flavour is communicated by colour pairing alone. Type occupies exactly one band across the bottle's midpoint, at a size that would be considered irresponsible on a shelf that wasn't this loud.",
    outcome:
      "Shelf-identification testing put recognition at four metres at 88%, against a 31% category baseline. The range expanded from six SKUs to ten on the same system.",
    deliverables: [
      "Range colour architecture",
      "Bottle & label artwork",
      "Dielines and specs",
      "Secondary packaging",
      "Shelf & display units",
    ],
    images: [
      { src: "/projects/citrus-press/cover.svg", caption: "Two-colour SKU across the full range." },
      { src: "/projects/citrus-press/01.svg", caption: "Label wrap and midpoint type band." },
      { src: "/projects/citrus-press/02.svg", caption: "Cabinet mock at four metres." },
    ],
    tags: ["Packaging", "Colour Systems", "FMCG"],
  },
  {
    id: "faultline",
    title: "Faultline",
    category: "Campaigns",
    ratio: "square",
    accent: "pink",
    year: "2025",
    client: "Faultline Institute",
    role: "Campaign Design",
    description:
      "Climate data as campaign material, without the disaster photography.",
    overview:
      "A climate research nonprofit launching its annual report into a media environment saturated with catastrophe imagery. They wanted attention without sensationalism — a genuinely difficult brief, since one usually buys the other.",
    approach:
      "No photography at all. The campaign is built from the report's own charts, blown up past the point of comfort and cropped so the trend line becomes the image. Black on a single warning colour. The only copy is the number and its unit.",
    outcome:
      "The report was covered by four outlets that had not previously covered the institute. Two ran the campaign artwork itself as the article image.",
    deliverables: [
      "Campaign concept",
      "Chart-as-image system",
      "Print & digital placements",
      "Report cover",
      "Press kit",
    ],
    images: [
      { src: "/projects/faultline/cover.svg", caption: "Trend line cropped to become the image." },
      { src: "/projects/faultline/01.svg", caption: "Placement set — black on warning." },
      { src: "/projects/faultline/02.svg", caption: "Annual report cover." },
    ],
    tags: ["Campaigns", "Data", "Nonprofit"],
  },
  {
    id: "echo-chamber",
    title: "Echo Chamber",
    category: "Campaigns",
    ratio: "square",
    accent: "cyan",
    year: "2026",
    client: "Echo Chamber Exhibition",
    role: "Exhibition Identity, Print",
    description:
      "Exhibition identity where every poster is a different distance from the source.",
    overview:
      "A sound-art exhibition whose central installation is a room of concentric reflective rings. The identity needed to work as posters, wall vinyl, a catalogue, and a ticket — all of which are physically different distances from that room.",
    approach:
      "Concentric rings are the constant; what changes is how many you see. The poster carries three rings, the catalogue cover one, the ticket a fragment of one. Walk the exhibition in order and the identity resolves. It's a small joke that most people won't notice, which is the correct scale of joke for an exhibition.",
    outcome:
      "The catalogue sold through its print run during the exhibition's first three weeks. The ring fragment was adopted as the venue's permanent programme marker.",
    deliverables: [
      "Exhibition identity",
      "Poster series (4)",
      "Catalogue design",
      "Wall vinyl & wayfinding",
      "Ticketing artwork",
    ],
    images: [
      { src: "/projects/echo-chamber/cover.svg", caption: "Three-ring poster." },
      { src: "/projects/echo-chamber/01.svg", caption: "Catalogue cover — one ring." },
      { src: "/projects/echo-chamber/02.svg", caption: "Wall vinyl at entry threshold." },
    ],
    tags: ["Exhibition", "Print", "Identity"],
  },
  {
    id: "terra-nova",
    title: "Terra Nova",
    category: "Identity",
    ratio: "landscape",
    accent: "yellow",
    year: "2025",
    client: "Terra Nova Studio",
    role: "Brand Identity, Signage",
    description:
      "One structural mark, from business card to building signage.",
    overview:
      "A sustainable architecture studio whose previous identity worked at screen size and fell apart at building scale — the mark had detail that simply vanished when fabricated in steel at three metres.",
    approach:
      "The mark was rebuilt from a single stroke weight tied to a ratio, so it scales without ever needing optical correction. It's tested at both extremes of its range: 8mm on a business card and 3.2m on a facade. Nothing in between required a special case.",
    outcome:
      "Fabricated in three materials across four sites with no artwork revisions. The studio has since used the same ratio logic for their project numbering.",
    deliverables: [
      "Structural mark",
      "Scale-tested artwork set",
      "Fabrication drawings",
      "Signage specification",
      "Stationery system",
    ],
    images: [
      { src: "/projects/terra-nova/cover.svg", caption: "Mark at facade scale." },
      { src: "/projects/terra-nova/01.svg", caption: "Stroke ratio construction." },
      { src: "/projects/terra-nova/02.svg", caption: "8mm to 3.2m scale test." },
    ],
    tags: ["Identity", "Signage", "Architecture"],
  },
  {
    id: "slow-current",
    title: "Slow Current",
    category: "Editorial",
    ratio: "portrait",
    accent: "cyan",
    year: "2024",
    client: "Slow Current Magazine",
    role: "Editorial Design",
    description:
      "A river photo essay paced so you can't rush it.",
    overview:
      "A 40-page photo essay on river ecosystems, shot over eighteen months. The photography was excellent and the previous layout had crammed it four-up to a page, which turned a slow subject into a contact sheet.",
    approach:
      "One image per spread, minimum. Captions moved off the image and onto the following page, so you have to turn to find out what you just looked at. Margins widen progressively through the essay as the river widens, which nobody will consciously register and everybody will feel.",
    outcome:
      "The essay was reprinted as a standalone edition. The progressive margin device has since been reused for two more of the magazine's long-form pieces.",
    deliverables: [
      "Essay layout",
      "Progressive margin system",
      "Caption architecture",
      "Standalone edition design",
      "Print specification",
    ],
    images: [
      { src: "/projects/slow-current/cover.svg", caption: "Opening spread." },
      { src: "/projects/slow-current/01.svg", caption: "Progressive margin across the essay." },
      { src: "/projects/slow-current/02.svg", caption: "Caption page following its image." },
    ],
    tags: ["Editorial", "Photography", "Print"],
  },
  {
    id: "static-bloom",
    title: "Static Bloom",
    category: "Packaging",
    ratio: "square",
    accent: "pink",
    year: "2026",
    client: "Static Bloom",
    role: "Packaging, Art Direction",
    description:
      "A fragrance range where the bloom motif never appears the same way twice.",
    overview:
      "A botanical fragrance line launching with five scents and a plan to add two a year indefinitely. Any packaging system had to accommodate additions without the range ever looking like it had been extended.",
    approach:
      "A radial bloom generated from the scent's note count — a three-note scent gets three petals, an eight-note gets eight. New scents generate their own artwork by definition. The box structure, foil, and type are identical across the range, so the only variable is the one that means something.",
    outcome:
      "Two additional scents launched in the first year, both generating their own artwork with no design input. Retail partners describe the range as reading as a set, which is the whole trick.",
    deliverables: [
      "Generative bloom system",
      "Carton & bottle artwork",
      "Foil & finish specification",
      "Range extension rules",
      "Launch art direction",
    ],
    images: [
      { src: "/projects/static-bloom/cover.svg", caption: "Bloom generated from note count." },
      { src: "/projects/static-bloom/01.svg", caption: "Five-scent launch range." },
      { src: "/projects/static-bloom/02.svg", caption: "Carton structure and foil placement." },
    ],
    tags: ["Packaging", "Generative", "Fragrance"],
  },
  {
    id: "helio",
    title: "Helio",
    category: "Identity",
    ratio: "landscape",
    accent: "violet",
    year: "2025",
    client: "Helio",
    role: "Brand Identity, Packaging",
    description:
      "One reduced sun-mark holding a hardware range together.",
    overview:
      "A solar hardware startup shipping panels, inverters, and mounting kits — three product categories with completely different physical packaging constraints, from a flat 2m carton to a small parts box.",
    approach:
      "The mark reduces to a single arc and a baseline, which survives being printed on corrugated at low resolution. Category is carried by carton colour, not by a sub-mark, because sub-marks disappear on brown board. Everything else is a stencil, applied at one of three fixed sizes.",
    outcome:
      "Packaging costs dropped 18% by moving to single-colour stencil printing on unbleached board. The mark has held across two product generations.",
    deliverables: [
      "Reduced sun-mark",
      "Category colour system",
      "Corrugated packaging artwork",
      "Stencil application standards",
      "Technical documentation design",
    ],
    images: [
      { src: "/projects/helio/cover.svg", caption: "Mark reduced for corrugated print." },
      { src: "/projects/helio/01.svg", caption: "Three-category carton colour system." },
      { src: "/projects/helio/02.svg", caption: "Stencil sizes on unbleached board." },
    ],
    tags: ["Identity", "Packaging", "Hardware"],
  },
];

export const categories: (ProjectCategory | "All")[] = [
  "All",
  "Identity",
  "Packaging",
  "Editorial",
  "Campaigns",
  "Concept"
];

/** Cover image is always the first in the list. */
export function coverOf(project: Project): ProjectImage {
  return project.images[0];
}

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

/** Wraps at both ends so the case study footer always has somewhere to go. */
export function getNeighbours(id: string): { prev: Project; next: Project } | null {
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) return null;
  return {
    prev: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}
