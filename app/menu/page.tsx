import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { HoursDisplay } from "@/components/HoursDisplay";
import { Logo } from "@/components/Logo";
import { MenuItemsList } from "@/components/MenuItemsList";
import { brand } from "@/content/brand";
import { restaurant } from "@/content/restaurant";
import { displayPhone } from "@/lib/phone";

/**
 * /menu — standalone, mobile-first menu view designed for QR-code scanning at the table or
 * for direct sharing on social posts / Google Business Profile menu links.
 *
 * Single source of truth: this page reads the same `restaurant.menu` data the homepage does,
 * and delegates per-item rendering to the same `MenuItemsList` client component. If Beverly
 * updates a price in content/restaurant.ts, both surfaces update automatically.
 *
 * What's deliberately NOT here (vs. the homepage):
 *   • Full Nav with its dropdown — replaced by a minimal logo + back-to-home link
 *   • Hero, Story, Gallery, Press, Reviews, FAQ, Location — none of it
 *   • Marketing CTAs — only the phone CTA at the top, because that's the action
 *     someone scanning a QR is most likely to need
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${restaurant.domain}`;

export const metadata: Metadata = {
  title: { absolute: "Menu | Bamboo Fire Cafe" },
  description:
    "Caribbean and World Cuisine menu at Bamboo Fire Cafe, Delray Beach. Family-owned restaurant serving jerk chicken, oxtail, curry goat, and Berbice-style Caribbean dishes.",
  alternates: {
    canonical: `${SITE_URL}/menu`,
  },
  openGraph: {
    title: "Menu | Bamboo Fire Cafe",
    description:
      "Family-owned Caribbean and World Cuisine in Delray Beach. Browse the full Bamboo Fire Cafe menu.",
    url: `${SITE_URL}/menu`,
    type: "website",
  },
};

function MenuPageHeader() {
  return (
    <header className="border-b border-ink/5 bg-surface-warm">
      <div className="container flex h-24 items-center justify-between gap-4 md:h-32">
        <Link
          href="/"
          className="flex items-center"
          aria-label={`${restaurant.name} home`}
        >
          <Logo
            brand={brand}
            className="w-[150px] md:w-[220px]"
            sizes="(min-width: 768px) 220px, 150px"
            priority
          />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand-fire focus-visible:outline-none focus-visible:text-brand-fire"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to home
        </Link>
      </div>
    </header>
  );
}

function MenuPageFooter() {
  const phoneDisplay = displayPhone(restaurant.contact.phone);
  return (
    <footer className="border-t border-ink/10 bg-surface-warm py-10">
      <div className="container mx-auto max-w-2xl space-y-6 text-sm text-ink-muted">
        <div>
          <h3 className="font-serif text-base text-ink">Hours</h3>
          <HoursDisplay hours={restaurant.hours} className="mt-3 w-full" />
        </div>
        <div>
          <h3 className="font-serif text-base text-ink">Visit</h3>
          <address className="mt-2 not-italic leading-relaxed">
            <a
              href={`tel:${restaurant.contact.phone}`}
              className="block text-ink underline-offset-4 hover:underline"
            >
              {phoneDisplay}
            </a>
            <span className="block">
              {restaurant.address.street}
              <br />
              {restaurant.address.city}, {restaurant.address.state}{" "}
              {restaurant.address.postalCode}
            </span>
          </address>
        </div>
      </div>
    </footer>
  );
}

export default function MenuPage() {
  const { menu } = restaurant;
  const visibleSections = menu.sections.filter((s) => s.items.length > 0);
  const phoneHref = `tel:${restaurant.contact.phone}`;
  const phoneDisplay = displayPhone(restaurant.contact.phone);

  return (
    <>
      <MenuPageHeader />
      <main>
        <section
          aria-labelledby="menu-page-heading"
          className="bg-surface-warm pb-10 pt-12 md:pb-14 md:pt-16"
        >
          <div className="container mx-auto max-w-3xl text-center">
            <h1
              id="menu-page-heading"
              className="font-serif text-3xl leading-tight text-ink md:text-4xl"
            >
              {restaurant.name} Menu
            </h1>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPin className="h-4 w-4" aria-hidden />
              {restaurant.address.street} · {restaurant.address.city},{" "}
              {restaurant.address.state}
            </p>
            <div className="mt-6">
              <a
                href={phoneHref}
                className="inline-flex items-center gap-2 rounded-card bg-brand-fire px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-fire-600 active:bg-brand-fire-700"
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call to order: {phoneDisplay}
              </a>
            </div>
          </div>
        </section>

        <div className="bg-surface py-10 md:py-14">
          <div className="container mx-auto max-w-3xl space-y-12">
            {visibleSections.map((section) => (
              <div key={section.title}>
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/10 pb-3">
                  <h2 className="font-serif text-2xl text-ink">
                    {section.title}
                  </h2>
                  {section.priceRangeIndicator && (
                    <span className="text-sm text-ink-muted">
                      {section.priceRangeIndicator}
                    </span>
                  )}
                </div>

                {section.blurb && (
                  <p className="mb-5 max-w-prose font-serif text-base italic text-ink-muted">
                    {section.blurb}
                  </p>
                )}
                {section.callout && (
                  <p className="mb-5 inline-block rounded-card bg-brand-bamboo-50 px-4 py-2 text-sm text-brand-bamboo-700">
                    {section.callout}
                  </p>
                )}

                <MenuItemsList
                  items={section.items}
                  restaurantName={restaurant.name}
                  restaurantCity={restaurant.address.city}
                />
              </div>
            ))}

            {menu.footnotes.length > 0 && (
              <div className="rounded-card bg-surface-warm p-5 text-sm text-ink-muted">
                <ul className="space-y-2">
                  {menu.footnotes.map((fn, i) => (
                    <li key={i}>{fn}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <MenuPageFooter />
    </>
  );
}
