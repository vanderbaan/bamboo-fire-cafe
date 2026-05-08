import type { RestaurantContent } from "@/types/content";
import { schemaOpeningHours } from "./hours";

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
    openingHours: schemaOpeningHours(r.hours),
    hasMenu: `${siteUrl}#menu`,
    sameAs,
  };
}
