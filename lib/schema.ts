import type {
  Faq,
  MenuItem,
  MenuSection,
  RestaurantContent,
} from "@/types/content";
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

function buildMenuItem(item: MenuItem) {
  const offers = buildItemOffers(item);
  return {
    "@type": "MenuItem",
    name: item.name,
    ...(item.description ? { description: item.description } : {}),
    ...(offers ? { offers } : {}),
  };
}

function buildMenuSection(section: MenuSection) {
  return {
    "@type": "MenuSection",
    name: section.title,
    ...(section.blurb ? { description: section.blurb } : {}),
    hasMenuItem: section.items.map(buildMenuItem),
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
      .map(buildMenuSection),
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
    // content/restaurant.ts data the visible menu reads from. Replaces the prior bare URL
    // string so each MenuItem has machine-readable name/description/Offer.
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
