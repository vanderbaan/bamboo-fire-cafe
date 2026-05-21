import type { Faq, RestaurantContent } from "@/types/content";
import { schemaOpeningHoursSpecification } from "./hours";

/** Build a Schema.org Restaurant + LocalBusiness JSON-LD object for the home page. */
export function restaurantJsonLd(r: RestaurantContent, siteUrl: string) {
  const sameAs = [
    r.social.facebook,
    r.social.instagram,
    r.social.google,
    r.social.tripadvisor,
    r.social.yelp,
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
    image: `${siteUrl}/logo.svg`,
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
    hasMenu: `${siteUrl}#menu`,
    sameAs,
    // aggregateRating drives the star-rating display in Google search snippets. Only emitted
    // when content/ provides values — early-stage merchants without enough reviews skip it
    // and don't risk an empty/wrong rating attached to their listing.
    ...(r.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: r.aggregateRating.ratingValue,
        reviewCount: r.aggregateRating.reviewCount,
        bestRating: r.aggregateRating.bestRating,
        worstRating: r.aggregateRating.worstRating,
      },
    }),
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
