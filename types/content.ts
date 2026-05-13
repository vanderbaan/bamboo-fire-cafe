/**
 * Lōcal restaurant template — content schema.
 *
 * These types describe the shape of `content/restaurant.ts`. Components consume this
 * shape, never merchant-specific strings. To onboard a new Lōcal merchant: copy the
 * content file, swap values, swap brand tokens in tailwind.config.ts, and the site
 * is reskinned.
 */

export type WeekdayKey =
  | "sun"
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat";

export interface OpenInterval {
  /** 24-hour clock, e.g. "17:00". `null` means closed all day. */
  open: string | null;
  /** 24-hour clock, e.g. "22:00". `null` means closed all day. */
  close: string | null;
}

export type Hours = Record<WeekdayKey, OpenInterval>;

export interface MenuItem {
  name: string;
  /** Optional short blurb (≤120 chars). Skip if the dish name speaks for itself. */
  description?: string;
  /**
   * Display string — flexible to accommodate "$10", "Market price", "Market price (typically $25)".
   * Optional so legacy sections that only show a price-range indicator still work.
   */
  price?: string;
  /** Dietary tags — fill in once owner confirms. */
  tags?: ReadonlyArray<"V" | "VG" | "GF" | "DF" | "spicy" | "signature">;
  /**
   * Path under /public for a photo of the dish. When set, the menu row becomes clickable
   * and opens a photo modal. Reuse gallery filenames where possible so a single image asset
   * serves multiple surfaces (gallery + menu modal + future Open Graph cards).
   */
  image?: string;
  /** Alt text for the photo. Required content-wise when `image` is set; mirror gallery alts. */
  imageAlt?: string;
}

export interface MenuSection {
  /** Section heading shown on the page (e.g. "Greatest Hits"). */
  title: string;
  /** Optional one-line intro under the heading. */
  blurb?: string;
  /** Display indicator like "$$" while real prices are pending. */
  priceRangeIndicator?: "$" | "$$" | "$$$" | "$$$$";
  /** Special pre-item callout (e.g. "Each entrée comes with a side of your choice"). */
  callout?: string;
  items: ReadonlyArray<MenuItem>;
}

export interface PressItem {
  publication: string;
  date: string; // human-readable, e.g. "March 2022" or just "2024"
  /** Paraphrased blurb — never lift verbatim from the source article. */
  paraphrase: string;
  url: string;
  /**
   * Optional media type — defaults to "article" when omitted. Used by Press.tsx to swap
   * the icon (PlayCircle vs ExternalLink) and the CTA copy ("Watch the video" vs
   * "Read the article") on video mentions.
   */
  type?: "article" | "video";
}

export interface ReviewItem {
  /** First name only for privacy. */
  name: string;
  /** Whole stars, 1–5. */
  stars: 1 | 2 | 3 | 4 | 5;
  /** Paraphrased praise — never quote verbatim from external review platforms. */
  paraphrase: string;
  source: string; // e.g. "Google Reviews", "Yelp"
}

/**
 * Aggregate stat card for a single review platform. Drives the Reviews-section "stats band":
 *   • `rating` is a display string ("4.8" or "96") — kept as string so platforms with
 *     non-5-scale metrics (Facebook's recommend-percent) render naturally.
 *   • `label` is the unit token rendered next to the rating ("★", "% recommend").
 *   • `count` is a display string ("307 reviews", "140+ ratings") rather than a number, so
 *     approximate counts can be expressed honestly.
 *   • `featured` flips the card to enhanced visual treatment (larger rating, tinted card,
 *     spans extra grid cells on desktop). Exactly one card per merchant should be featured;
 *     the component doesn't enforce this but the layout assumes it.
 */
export interface ReviewStat {
  platform: string;
  rating: string;
  label: string;
  count: string;
  url: string;
  featured?: boolean;
}

/**
 * Schema.org AggregateRating for the Restaurant JSON-LD. Merchant-specific numbers live in
 * content (here, not in lib/schema.ts) so the schema function stays template-clean and any
 * future merchant overrides their own values.
 */
export interface AggregateRating {
  /** Average across rated platforms — display string per Schema.org convention. */
  ratingValue: string;
  /** Total review count across all platforms. */
  reviewCount: number;
  bestRating: "5";
  worstRating: "1";
}

/**
 * Ordering channels available to the merchant. `pickup` is required (every restaurant accepts
 * a phone call); `delivery` is optional so merchants who haven't onboarded to a delivery
 * marketplace simply don't render the secondary CTA. Future modes (Uber Direct white-label,
 * native ordering) extend the union.
 */
export interface Ordering {
  pickup: {
    primary: "phone";
    /** E.164 format for tel: links and Schema.org. */
    phoneNumber: string;
  };
  delivery?: {
    provider: "ubereats" | "doordash" | "grubhub" | "uberdirect";
    /** Public storefront URL on the delivery marketplace. */
    url: string;
  };
}

/**
 * FAQ entry. Short field names (`q`/`a`) keep the per-merchant content file readable when
 * scanning long lists. Plain strings only for v1 — if a merchant ever needs links or formatting
 * inside an answer, widen `a` to `string | { html: string }` and parse selectively in the
 * component (avoid letting raw HTML through merchant content by default).
 */
export interface Faq {
  q: string;
  a: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  google?: string;
  tripadvisor?: string;
  yelp?: string;
}

export interface GalleryImage {
  /** Public path or remote URL. Remote hosts must be allowlisted in next.config.mjs. */
  src: string;
  /**
   * Long, descriptive alt text — for accessibility AND SEO. Mirrors the filename-SEO
   * convention; this is the primary signal Google uses for image search.
   * Example: "Curry goat and roti at Bamboo Fire Cafe in Delray Beach"
   */
  alt: string;
  /**
   * Short visible label rendered as an overlay on the grid and below the lightbox image.
   * Punchy, dish-only — no need to repeat the restaurant or city since the page already
   * provides that context.
   * Example: "Curry Goat"
   */
  caption: string;
  /** Aspect hint — used to keep CLS at 0. */
  width: number;
  height: number;
}

export interface RestaurantContent {
  /** Internal slug — used in IDs, schema, etc. */
  slug: string;
  name: string;
  tagline: string;
  cuisine: string;
  /** ISO year founded — used for "Family-owned since YYYY" copy. Confirm with owner. */
  foundedYear: number;
  /** Domain at which the site is served, no protocol. */
  domain: string;

  contact: {
    /** Primary, voice line. */
    phone: string;
    /** Secondary, SMS-capable. Optional. */
    smsPhone?: string;
    /** Customer-facing email. */
    email: string;
  };

  /** Ordering channels — see Ordering interface. Pickup is required; delivery is optional. */
  ordering: Ordering;

  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    /** Decimal lat/lng — used for schema and Maps embed. */
    lat: number;
    lng: number;
    /** Free-form parking note shown on the location section. */
    parkingNote?: string;
  };

  hours: Hours;
  /** IANA tz used by open-now logic. */
  timezone: string;

  hero: {
    headline?: string;
    subhead: string;
    /** Hero background image — public path. */
    backgroundImage: string;
    backgroundAlt: string;
  };

  story: {
    paragraphs: ReadonlyArray<string>;
    /** Optional short pull-quote (<=15 words) attributed to a press source. */
    pullQuote?: { text: string; attribution: string; sourceUrl: string };
    /**
     * Photo of the family / interior — public path. Optional.
     *
     * Story.tsx renders this image when:
     *   1. `storyImage` is set in content, AND
     *   2. the file at `src` actually exists in /public (checked at build time via fs).
     *
     * If either condition fails, the "Family photo coming soon" placeholder shows. This
     * lets us commit the SEO filename ahead of time so search engines have a stable URL,
     * and have the photo go live the moment Beverly drops the file in /public/story/.
     *
     * Aspect ratio is controlled by Story.tsx's container (currently 4/5 portrait); no
     * width/height needed on the field because the component uses next/image fill mode.
     */
    storyImage?: { src: string; alt: string };
  };

  menu: {
    sections: ReadonlyArray<MenuSection>;
    /** Footnote shown at end of menu (dietary adjustments, sides, etc.). */
    footnotes: ReadonlyArray<string>;
    /** "Catering coming soon" placeholder copy. */
    cateringTeaser?: string;
  };

  gallery: ReadonlyArray<GalleryImage>;

  press: ReadonlyArray<PressItem>;
  /**
   * Frequently asked questions. Drives the visible accordion AND the FAQPage JSON-LD —
   * keep answers concise (1–3 sentences), factual, and standalone (don't reference "above" or
   * "below" since they may surface in AI search/voice answers without surrounding context).
   */
  faqs: ReadonlyArray<Faq>;
  reviews: ReadonlyArray<ReviewItem>;
  /** Aggregate stat cards rendered above the prose review snippets. Optional — early-stage
   *  merchants without enough reviews simply skip the stats band. */
  reviewStats?: ReadonlyArray<ReviewStat>;
  /** Schema.org AggregateRating for rich snippets. Optional alongside `reviewStats`. */
  aggregateRating?: AggregateRating;

  social: SocialLinks;

  paymentMethods: ReadonlyArray<string>;
  acceptsReservations: boolean;
  servesCuisine: ReadonlyArray<string>;
  /** Schema.org price range token, e.g. "$$". */
  priceRange: "$" | "$$" | "$$$" | "$$$$";
}

/** Brand identity bundle — distinct from content because copy and visuals iterate on different cycles. */
export interface BrandIdentity {
  /** Public path to the master logo SVG. */
  logoSrc: string;
  /** Logo dimensions for next/image. */
  logoWidth: number;
  logoHeight: number;
  /** Short alt text used everywhere the logo renders. */
  logoAlt: string;
  /** Hex tokens — duplicated from tailwind.config.ts for use in inline styles (rare). */
  colors: {
    bamboo: string;
    fire: string;
    script: string;
    surface: string;
    surfaceWarm: string;
    ink: string;
    inkMuted: string;
  };
}
