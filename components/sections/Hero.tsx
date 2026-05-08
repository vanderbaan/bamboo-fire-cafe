import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import { MapPin, Phone } from "lucide-react";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

function displayPhone(intl: string) {
  // +15617490973 → (561) 749-0973
  const m = intl.match(/^\+1?(\d{3})(\d{3})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : intl;
}

export function Hero({ restaurant }: Props) {
  const yearsOpen = new Date().getFullYear() - restaurant.foundedYear;
  const headline = restaurant.hero.headline ?? restaurant.name;

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={restaurant.hero.backgroundImage}
          alt={restaurant.hero.backgroundAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/40 to-ink/70"
        />
      </div>

      <div className="container flex min-h-[78vh] flex-col justify-end py-16 text-surface md:min-h-[82vh] md:py-24">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-surface/85">
            {restaurant.tagline}
          </p>
          <h1
            id="hero-heading"
            className="font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl"
          >
            {headline}
          </h1>
          <p className="mt-5 max-w-xl text-base text-surface/90 md:text-lg">
            {restaurant.hero.subhead}
          </p>

          <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-surface/90">
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden />
              {restaurant.address.city}, {restaurant.address.state}
            </li>
            <li aria-hidden className="text-surface/40">
              •
            </li>
            <li className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" aria-hidden />
              <a
                href={`tel:${restaurant.contact.phone}`}
                className="underline-offset-4 hover:underline"
              >
                {displayPhone(restaurant.contact.phone)}
              </a>
            </li>
            {yearsOpen > 0 && (
              <>
                <li aria-hidden className="text-surface/40">
                  •
                </li>
                <li>{yearsOpen} years in Delray</li>
              </>
            )}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={`tel:${restaurant.contact.phone}`}
              variant="primary"
              size="lg"
            >
              Reserve a Table
            </ButtonLink>
            <ButtonLink
              href="#menu"
              variant="outline"
              size="lg"
              className="border-surface/40 bg-transparent text-surface hover:border-surface hover:bg-surface/10"
            >
              View Menu
            </ButtonLink>
            <span className="ml-1">
              <OpenNowBadge
                hours={restaurant.hours}
                timezone={restaurant.timezone}
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
