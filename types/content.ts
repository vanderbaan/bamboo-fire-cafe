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
}

export interface MenuSection {
  /** Section heading shown on the page (e.g. "Greatest Hits"). */
  title: string;
  /** Optional one-line intro under the heading. */
  blurb?: string;
  /** Display indicator like "$$" while real prices are pending. */
  priceRangeIndicator?: "$" | "$$" | "$$$" | "$$$$";
  /** Special pre-item callout (e.g. "Pick 3 sides included with every main"). */
  callout?: string;
  items: ReadonlyArray<MenuItem>;
}

export interface PressItem {
  publication: string;
  date: string; // human-readable, e.g. "March 2022"
  /** Paraphrased blurb — never lift verbatim from the source article. */
  paraphrase: string;
  url: string;
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
  alt: string;
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
    /** Photo of the family / interior — public path. Optional. */
    photo?: { src: string; alt: string; width: number; height: number };
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
