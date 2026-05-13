import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import { OrderDropdown } from "@/components/OrderDropdown";
import { MapPin, Phone } from "lucide-react";
import { displayPhone } from "@/lib/phone";
import { fillTenure, yearsSince } from "@/lib/tenure";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

export function Hero({ restaurant }: Props) {
  // Both the subhead and the info row derive from foundedYear — keeping the two phrasings
  // pinned to the same number so they can't drift apart in copy edits.
  const yearsOpen = yearsSince(restaurant.foundedYear);
  const subhead = fillTenure(restaurant.hero.subhead, restaurant.foundedYear);
  const headline = restaurant.hero.headline ?? restaurant.name;

  return (
    // overflow-hidden removed and z-10 added so the OrderDropdown popover, which positions
    // absolute below its trigger near the bottom of the hero, can render past the hero's
    // box and paint above the Story section beneath it while the page is mid-scroll. The
    // background image and gradient inside the absolute inset-0 -z-10 wrapper are already
    // constrained to the section's bounds (next/image fill), so removing overflow-hidden
    // doesn't expose any image overflow.
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate z-10"
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
            Unified ordering CTA: same OrderDropdown component as the nav, just sized large.
            One click does both jobs — smooth-scrolls the page to the menu AND opens the
            pickup/delivery popover. The popover momentarily overlaps the Story section
            below the hero (made possible by removing overflow-hidden + adding z-10 to the
            section, see comment above). After the smooth scroll completes the hero is off
            the viewport and the nav's identical OrderDropdown remains available for the
            customer to revisit the options.

            View Menu is the secondary action — visual hierarchy: big red Order button on
            top, outlined View Menu below it next to the OpenNow status badge.
          */}
          <div className="mt-8 flex flex-col items-start gap-5">
            <OrderDropdown ordering={restaurant.ordering} size="lg" />

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
