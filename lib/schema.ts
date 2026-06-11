import type {
  Faq,
  MenuItem,
  MenuSection,
  RestaurantContent,
} from "@/types/content";
import { todayInNY } from "./admin/dates";
import { getDay } from "./admin/kv";
import type { DayRecord, SpecialItem } from "./admin/types";
import { schemaOpeningHoursSpecification } from "./hours";

/**
 * Parse a menu-data price string into a Schema.org-compatible decimal string ("11" → "11.00").
 *
 *   "$11"    → "11.00"
 *   "$4.50"  → "4.50"
 *   "11"     → "11.00"
 *   "+$4"    → null  (add-on prefix; add-ons are filtered out earlier anyway)
 *   "MKT"    → null  (market price; no clean number to emit)
 *   "Market price (~$25)" → null
 */
function parsePriceDecimal(priceStr: string): string | null {
  const m = priceStr.trim().match(/^\$?(\d+(?:\.\d{1,2})?)$/);
  if (!m) return null;
  return parseFloat(m[1]).toFixed(2);
}

/**
 * Build the `offers` value for a MenuItem. Three branches:
 *   1. Item has `sizes` → emit an array of Offer entries (one per size) with the size label
 *      as the offer `name`. Size variants whose price doesn't parse cleanly are dropped.
 *   2. Item has `price` → emit a single Offer. Returns null if price doesn't parse.
 *   3. Neither / unparseable → returns null (the caller omits the offers field entirely).
 *
 * Add-ons are intentionally NOT modeled as separate Offers or MenuItems per the brief.
 */
function buildItemOffers(item: MenuItem): unknown {
  if (item.sizes && item.sizes.length > 0) {
    const parsed = item.sizes
      .map((s) => ({ label: s.label, decimal: parsePriceDecimal(s.price) }))
      .filter((o): o is { label: string; decimal: string } => o.decimal !== null);
    if (parsed.length === 0) return null;
    if (parsed.length === 1) {
      return {
        "@type": "Offer",
        price: parsed[0].decimal,
        priceCurrency: "USD",
      };
    }
    return parsed.map((o) => ({
      "@type": "Offer",
      name: o.label,
      price: o.decimal,
      priceCurrency: "USD",
    }));
  }
  if (item.price) {
    const decimal = parsePriceDecimal(item.price);
    if (decimal === null) return null;
    return { "@type": "Offer", price: decimal, priceCurrency: "USD" };
  }
  return null;
}

function buildMenuItem(item: MenuItem, siteUrl: string) {
  const offers = buildItemOffers(item);
  return {
    "@type": "MenuItem",
    name: item.name,
    ...(item.description ? { description: item.description } : {}),
    // image URL must be absolute (full https://www.host/...) so Google can crawl and
    // index it for image rich results. Relative paths would silently fail.
    ...(item.image ? { image: `${siteUrl}${item.image}` } : {}),
    ...(offers ? { offers } : {}),
  };
}

function buildMenuSection(section: MenuSection, siteUrl: string) {
  return {
    "@type": "MenuSection",
    name: section.title,
    ...(section.blurb ? { description: section.blurb } : {}),
    hasMenuItem: section.items.map((item) => buildMenuItem(item, siteUrl)),
  };
}

/**
 * Build the full Menu Schema.org object from `content/restaurant.ts`'s menu data. Maps each
 * non-empty section → MenuSection, each item → MenuItem with Offer(s). Single source of
 * truth: change a price in content, the schema reflects it on the next deploy. Sections
 * with zero items (Today's Special, Seasonal placeholders) are filtered out so they don't
 * surface as hollow nodes in the schema.
 */
export function buildMenuSchema(r: RestaurantContent, siteUrl: string) {
  return {
    "@type": "Menu",
    "@id": `${siteUrl}#menu`,
    name: `${r.name} Menu`,
    hasMenuSection: r.menu.sections
      .filter((s) => s.items.length > 0)
      .map((section) => buildMenuSection(section, siteUrl)),
  };
}

/**
 * Build a MenuSection from today's specials. Returns null when nothing is active so the
 * caller can omit the section entirely. Specials prices use the same numeric parsing as
 * the regular menu items (parsePriceDecimal); items without parseable prices still appear
 * with `name` only, no Offer.
 */
function buildSpecialItem(item: SpecialItem, siteUrl: string, photoUrl: string | null) {
  const decimal = parsePriceDecimal(item.price);
  const offers = decimal
    ? { "@type": "Offer", price: decimal, priceCurrency: "USD" as const }
    : null;
  return {
    "@type": "MenuItem",
    name: item.name,
    ...(photoUrl ? { image: photoUrl } : {}),
    ...(offers ? { offers } : {}),
  };
}

function buildTodaysSpecialsSection(
  record: DayRecord,
  siteUrl: string
): Record<string, unknown> {
  const photoUrl = record.photo
    ? record.photo.jpgUrl.startsWith("http")
      ? record.photo.jpgUrl
      : `${siteUrl}${record.photo.jpgUrl}`
    : null;
  return {
    "@type": "MenuSection",
    name: "Today's Specials",
    ...(record.description ? { description: record.description } : {}),
    hasMenuItem: record.items
      .filter((i) => i.name.trim().length > 0)
      .map((i) => buildSpecialItem(i, siteUrl, photoUrl)),
  };
}

/** Build a Schema.org Restaurant + LocalBusiness JSON-LD object for the home page. */
export function restaurantJsonLd(r: RestaurantContent, siteUrl: string) {
  // sameAs lists every authoritative profile for the same real-world entity so Google
  // can consolidate them. Pulled from `content/restaurant.ts` so onboarding a new merchant
  // is content-only. The Uber Eats listing (from ordering.delivery) participates as a
  // first-party profile too — it's where customers find canonical menu data on the
  // marketplace and a stable id for the restaurant.
  const sameAs = [
    r.social.facebook,
    r.social.instagram,
    r.social.google,
    r.social.tripadvisor,
    r.social.yelp,
    r.ordering.delivery?.url,
  ].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "@id": `${siteUrl}#restaurant`,
    name: r.name,
    url: siteUrl,
    description: `${r.name} — ${r.tagline} in ${r.address.city}.`,
    telephone: r.contact.phone,
    email: r.contact.email,
    // Google prefers a photographic image for image rich results over an SVG logo. Points
    // at the hero JPG used by the homepage Hero — same asset surfaces both as the page
    // hero and as the schema image.
    image: `${siteUrl}/gallery/bamboo-fire-cafe-caribbean-restaurant-delray-beach.jpg`,
    // `logo` is a separate Schema.org property from `image` — it feeds the Knowledge Graph
    // brand-logo slot specifically (vs. `image` which feeds image rich results). The
    // watercolor PNG at /logo.png is the canonical brand asset; absolute URL required.
    logo: `${siteUrl}/logo.png`,
    priceRange: r.priceRange,
    servesCuisine: [...r.servesCuisine],
    acceptsReservations: r.acceptsReservations,
    paymentAccepted: r.paymentMethods.join(", "),
    address: {
      "@type": "PostalAddress",
      streetAddress: r.address.street,
      addressLocality: r.address.city,
      addressRegion: r.address.state,
      postalCode: r.address.postalCode,
      addressCountry: r.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: r.address.lat,
      longitude: r.address.lng,
    },
    // Structured form (preferred by Google) instead of the older `openingHours` strings —
    // each entry names the day(s), opens, closes explicitly. Friday/Saturday entries reflect
    // the 4:30 PM open time per the current schedule.
    openingHoursSpecification: schemaOpeningHoursSpecification(r.hours),
    // Full Menu entity — sections, items, prices — built programmatically from the same
    // content/restaurant.ts data the visible menu reads from. The synchronous variant
    // omits today's specials; use `restaurantJsonLdWithSpecials` (below) when you want
    // the live KV-driven Today's Specials MenuSection mixed in.
    hasMenu: buildMenuSchema(r, siteUrl),
    sameAs,
    // aggregateRating intentionally NOT emitted. The visible "1,200+ reviews · 4.6 stars"
    // section is an assembled cross-platform total (Google + Yelp + TripAdvisor + Facebook
    // + Uber Eats). Google's structured-data policy requires Restaurant.aggregateRating to
    // reflect first-party reviews displayed on the page — and the page only shows 3
    // testimonial quotes. Emitting it would risk a manual action or silent demotion.
    // Re-enable only when first-party review volume justifies a real on-page rating.
  };
}

/**
 * Async variant of `restaurantJsonLd` that mixes today's specials (read live from KV) in
 * as an additional MenuSection on the Menu entity. Used by the homepage so the JSON-LD
 * surfaces today's published specials alongside the regular menu.
 *
 * KV failures degrade silently — if the admin layer isn't configured (e.g. local dev
 * without env vars), the function returns the same shape as the synchronous variant so
 * the homepage still renders schema correctly.
 */
export async function restaurantJsonLdWithSpecials(
  r: RestaurantContent,
  siteUrl: string
) {
  const base = restaurantJsonLd(r, siteUrl);
  let todays: DayRecord | null = null;
  try {
    todays = await getDay(todayInNY());
  } catch {
    todays = null;
  }
  if (!todays || !todays.active || todays.items.length === 0) {
    return base;
  }
  const specialsSection = buildTodaysSpecialsSection(todays, siteUrl);
  // Today's specials section gets prepended so it surfaces above the regular menu.
  const existing = base.hasMenu.hasMenuSection ?? [];
  return {
    ...base,
    hasMenu: {
      ...base.hasMenu,
      hasMenuSection: [specialsSection, ...existing],
    },
  };
}

/**
 * Build a Schema.org FAQPage object from the merchant's FAQ array. Emitted alongside the
 * Restaurant + LocalBusiness JSON-LD on the home page (separate <script> tag) so search
 * engines can attach FAQ rich snippets without colliding with the LocalBusiness entity.
 *
 * Same array drives the visible accordion in components/sections/FAQ.tsx, which keeps the
 * structured data and the rendered text in lockstep — Google penalizes mismatch.
 */
export function buildFAQSchema(faqs: ReadonlyArray<Faq>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}
