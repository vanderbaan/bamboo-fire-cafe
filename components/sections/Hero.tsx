import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import { MapPin, Phone } from "lucide-react";
import { displayPhone } from "@/lib/phone";
import { fillTenure, yearsSince } from "@/lib/tenure";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

/** Pretty-print a delivery provider id for the secondary CTA label. */
const DELIVERY_LABEL: Record<string, string> = {
  ubereats: "Uber Eats",
  doordash: "DoorDash",
  grubhub: "Grubhub",
  uberdirect: "delivery",
};

export function Hero({ restaurant }: Props) {
  // Both the subhead and the info row derive from foundedYear — keeping the two phrasings
  // pinned to the same number so they can't drift apart in copy edits.
  const yearsOpen = yearsSince(restaurant.foundedYear);
  const subhead = fillTenure(restaurant.hero.subhead, restaurant.foundedYear);
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
            {subhead}
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

          {/*
            Two-tier order CTA.
              • Primary: brand-fire phone-pickup button — highest margin for the merchant.
              • Secondary: muted text-link to the delivery marketplace storefront. Renders only
                when ordering.delivery.url is set, so merchants who aren't on a delivery
                platform get a single CTA instead of an awkward dangling link.
            "View Menu" stays as a tertiary outline button on a separate row so it doesn't
            compete with the primary action's visual weight, and on mobile each row stacks
            cleanly with the primary order button on top.
          */}
          <div className="mt-8 flex flex-col items-start gap-5">
            <div className="flex flex-col items-start gap-2.5">
              <ButtonLink
                href={`tel:${restaurant.ordering.pickup.phoneNumber}`}
                variant="primary"
                size="lg"
              >
                Call to Order Pickup
              </ButtonLink>
              {restaurant.ordering.delivery?.url && (
                <a
                  href={restaurant.ordering.delivery.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-surface/80 underline-offset-4 hover:text-surface hover:underline"
                >
                  Or order delivery via{" "}
                  {DELIVERY_LABEL[restaurant.ordering.delivery.provider] ??
                    "delivery"}{" "}
                  →
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
      </div>
    </section>
  );
}
