import { MapPin, Phone, Mail, Car, Calendar } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { HoursDisplay } from "@/components/HoursDisplay";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

function buildMapsEmbedSrc(r: RestaurantContent, key: string | undefined) {
  const q = encodeURIComponent(
    `${r.name}, ${r.address.street}, ${r.address.city}, ${r.address.state} ${r.address.postalCode}`
  );
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&zoom=16`;
  }
  // Keyless fallback works for `?output=embed` style URLs without an API key.
  return `https://maps.google.com/maps?q=${q}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
}

function buildDirectionsHref(r: RestaurantContent) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${r.address.street}, ${r.address.city}, ${r.address.state} ${r.address.postalCode}`
  )}`;
}

function displayPhone(intl: string) {
  const m = intl.match(/^\+1?(\d{3})(\d{3})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : intl;
}

export function Location({ restaurant }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const embedSrc = buildMapsEmbedSrc(restaurant, apiKey);
  const directionsHref = buildDirectionsHref(restaurant);

  return (
    <section
      id="location"
      aria-labelledby="location-heading"
      className="bg-surface py-20 md:py-28"
    >
      <div className="container">
        <header className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-bamboo-700">
            Visit
          </p>
          <h2
            id="location-heading"
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            Find us in Pineapple Grove.
          </h2>
        </header>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="overflow-hidden rounded-card border border-ink/10 shadow-card">
              <iframe
                title={`Map showing ${restaurant.name}`}
                src={embedSrc}
                width="100%"
                height="420"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="space-y-5 text-ink">
              <OpenNowBadge
                hours={restaurant.hours}
                timezone={restaurant.timezone}
              />

              <p className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-brand-fire" aria-hidden />
                <span>
                  {restaurant.address.street}
                  <br />
                  {restaurant.address.city}, {restaurant.address.state}{" "}
                  {restaurant.address.postalCode}
                </span>
              </p>

              <p className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-fire" aria-hidden />
                <a
                  href={`tel:${restaurant.contact.phone}`}
                  className="underline-offset-4 hover:underline"
                >
                  {displayPhone(restaurant.contact.phone)}
                </a>
              </p>

              <p className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-fire" aria-hidden />
                <a
                  href={`mailto:${restaurant.contact.email}`}
                  className="underline-offset-4 hover:underline"
                >
                  {restaurant.contact.email}
                </a>
              </p>

              {restaurant.address.parkingNote && (
                <p className="flex items-start gap-3 text-ink-muted">
                  <Car className="mt-1 h-5 w-5 text-brand-bamboo" aria-hidden />
                  <span>{restaurant.address.parkingNote}</span>
                </p>
              )}

              <div className="border-t border-ink/10 pt-5">
                <h3 className="mb-3 flex items-center gap-2 font-serif text-lg text-ink">
                  <Calendar className="h-4 w-4 text-brand-fire" aria-hidden />
                  Hours
                </h3>
                <HoursDisplay hours={restaurant.hours} className="w-full" />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <ButtonLink
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                >
                  Get Directions
                </ButtonLink>
                <ButtonLink
                  href={`tel:${restaurant.contact.phone}`}
                  variant="outline"
                >
                  Call to Reserve
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
