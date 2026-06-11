import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { TodaysSpecial } from "@/components/TodaysSpecial";
import { Menu } from "@/components/sections/Menu";
import { Gallery } from "@/components/sections/Gallery";
import { Press } from "@/components/sections/Press";
import { FAQ } from "@/components/sections/FAQ";
import { Reviews } from "@/components/sections/Reviews";
import { Location } from "@/components/sections/Location";
import { Footer } from "@/components/sections/Footer";
import { restaurant } from "@/content/restaurant";
import { buildFAQSchema, restaurantJsonLdWithSpecials } from "@/lib/schema";

/**
 * Lightweight teaser for the /berbice-kitchen coming-soon page. Sits between Reviews and
 * Location as a hint rather than a feature — single card, lighter section padding, no full
 * eyebrow + headline + body weight.
 */
function BerbiceKitchenTeaser() {
  return (
    <section
      aria-labelledby="berbice-teaser-heading"
      className="bg-surface py-12 md:py-16"
    >
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-card border border-brand-bamboo/30 bg-brand-bamboo-50/60 p-8 text-center md:p-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-brand-bamboo-700">
            Coming Soon
          </p>
          <h2
            id="berbice-teaser-heading"
            className="font-serif text-3xl text-ink"
          >
            Berbice Kitchen
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-muted">
            Beverly's home-region cuisine, delivered. Five chef-cooked meals a
            week, starting at $18/meal.
          </p>
          <Link
            href="/berbice-kitchen"
            className="mt-6 inline-flex items-center gap-1.5 font-medium text-brand-fire underline-offset-4 hover:underline"
          >
            Get notified →
          </Link>
        </div>
      </div>
    </section>
  );
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${restaurant.domain}`;

export default async function HomePage() {
  const restaurantSchema = await restaurantJsonLdWithSpecials(restaurant, SITE_URL);
  // Emitted as its own script tag so Google can attach FAQ rich snippets to this page
  // independently of the Restaurant/LocalBusiness entity.
  const faqSchema = buildFAQSchema(restaurant.faqs);

  return (
    <>
      <script
        type="application/ld+json"
        // Server-rendered, no useEffect needed.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Nav restaurant={restaurant} />
      <main>
        <Hero restaurant={restaurant} />
        {/* TodaysSpecial is a server component that reads KV directly. It renders nothing
            when there's no active special for today (NY-tz), so this slot stays empty on
            ordinary days and the layout collapses without a gap. */}
        <TodaysSpecial />
        <Story restaurant={restaurant} />
        <Menu restaurant={restaurant} />
        <Gallery restaurant={restaurant} />
        <Press restaurant={restaurant} />
        <FAQ restaurant={restaurant} />
        <Reviews restaurant={restaurant} />
        <BerbiceKitchenTeaser />
        <Location restaurant={restaurant} />
      </main>
      <Footer restaurant={restaurant} />
    </>
  );
}
