import type { Metadata } from "next";
import { ArrowDown } from "lucide-react";
import { FaqItem } from "@/components/FaqItem";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { ButtonLink } from "@/components/ui/Button";
import { WaitlistForm } from "@/components/WaitlistForm";
import { restaurant } from "@/content/restaurant";
import type { Faq } from "@/types/content";

/**
 * /berbice-kitchen — coming-soon landing page for Beverly's meal subscription product.
 *
 * Page goals:
 *   1. Validate demand via email waitlist (Formspree, two capture points)
 *   2. Educate visitors on what "Berbice" cuisine means (distinguishes from Jamaican-focused
 *      Caribbean food most US restaurants serve)
 *   3. Set pricing/cadence expectations so signups are pre-qualified
 *   4. SEO: rank for "Caribbean meal subscription Delray Beach" and similar
 *
 * Content is inline rather than in content/ because this is a bespoke Bamboo Fire product
 * page — future Lōcal merchants will have their own subscription products with their own
 * landing pages. The shared building blocks (Nav, Footer, FaqItem, WaitlistForm, Button)
 * stay reusable.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${restaurant.domain}`;

// Page-specific metadata, per spec. `title.absolute` prevents the root layout's title
// template (`%s | Bamboo Fire Cafe`) from appending an extra " | Bamboo Fire Cafe" tail
// since the desired title already names the restaurant.
export const metadata: Metadata = {
  title: {
    absolute:
      "Berbice Kitchen | Caribbean meal subscription from Bamboo Fire Cafe, Delray Beach",
  },
  description:
    "Five chef-cooked Berbice-style Caribbean meals a week from Bamboo Fire Cafe. Cooked fresh by Beverly Jacobs in Delray Beach. Starting at $18/meal. Join the waitlist.",
  openGraph: {
    title: "Berbice Kitchen | Caribbean meal subscription, Delray Beach",
    description:
      "Beverly Jacobs' home-region cuisine, delivered to your Delray Beach table. Five chef-cooked meals a week. Join the waitlist.",
    url: `${SITE_URL}/berbice-kitchen`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/berbice-kitchen`,
  },
};

const BERBICE_FAQS: ReadonlyArray<Faq> = [
  {
    q: "When does Berbice Kitchen launch?",
    a: "Targeting Q3 2026. The waitlist gets first access and an early-bird discount.",
  },
  {
    q: "What's the difference between Berbice and Caribbean food I've had before?",
    a: "Berbice cuisine reflects the meeting of Indo-Caribbean, Afro-Caribbean, and Indigenous Guyanese traditions. You'll find curries from Beverly's South Asian heritage, pepperpot from her West African heritage, and dishes you won't typically see at Jamaican-focused Caribbean restaurants in the US.",
  },
  {
    q: "Where do you deliver?",
    a: "Delivery starts within 10 miles of Bamboo Fire Cafe in Delray Beach. Pickup available for closer neighborhoods at a lower price.",
  },
  {
    q: "How does the weekly menu work?",
    a: "Beverly publishes the upcoming week's options every Sunday. You select what you want from her three-options-per-day menu by Monday night. We cook and deliver on your scheduled days.",
  },
  {
    q: "Can I pause or skip weeks?",
    a: "Yes, anytime. No contracts. Pause for vacation, skip a single week, cancel whenever — all from your subscriber dashboard.",
  },
  {
    q: "How is this different from Factor or Freshly?",
    a: "Different in every way that matters. National services ship frozen meals made in industrial kitchens by people you'll never meet. Berbice Kitchen meals are cooked fresh by Beverly and her family in the same kitchen that's anchored Pineapple Grove for 17 years.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-brand-bamboo-700">
      {children}
    </p>
  );
}

function Hero() {
  return (
    <section className="bg-surface-warm py-20 md:py-28 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow>Coming Soon</Eyebrow>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl">
            Berbice Kitchen
          </h1>
          <p className="mt-5 text-xl text-ink-muted md:text-2xl">
            Beverly's home-region cuisine, delivered to yours.
          </p>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-ink md:text-lg">
            Berbice is a region in eastern Guyana where Beverly Jacobs grew up — and
            where Indo-Caribbean and Afro-Caribbean cooking blend in a way you won't
            find at most Caribbean restaurants. Pepperpot, curry, roti, dhal — the
            food she's been cooking for her family her whole life. Soon, five meals a
            week, ready to eat, on your weeknight table.
          </p>
          <div className="mt-10">
            <ButtonLink href="#waitlist" variant="primary" size="lg">
              Join the waitlist
              <ArrowDown className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhereIsBerbice() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Where we're from</Eyebrow>
          <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl">
            A real place, a specific cuisine.
          </h2>
          <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink">
            Berbice is a county in eastern Guyana, on the Berbice River, where
            Donald and Beverly Jacobs were born and raised — in Rosignol and New
            Amsterdam. It's where Caribbean, South Asian, and West African food
            traditions meet on the same plate. The curries come from Beverly's
            South Asian roots. The pepperpot comes from West African heritage.
            The seafood and tropical produce reflect generations of Guyanese
            cooking. You'll find dishes here you can't get at most Caribbean
            restaurants in the US — because they're Guyanese, not Jamaican.
          </p>
          {/* Image slot reserved — Berbice photo or map graphic drops in here later. */}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Pick your meals weekly",
      body:
        "Each Sunday you see Beverly's curated menu and choose what you want for the upcoming week. Three dishes per day, mix and match.",
    },
    {
      n: "2",
      title: "Cooked fresh, delivered",
      body:
        "Same-day from the same kitchen that's served Delray Beach for 17 years. Not frozen, not shipped from a warehouse.",
    },
    {
      n: "3",
      title: "You're in control",
      body:
        "Pause anytime, skip a week, change selections. No contracts, no commitment beyond the next week.",
    },
  ];
  return (
    <section className="bg-surface-warm py-20 md:py-28">
      <div className="container">
        <header className="mx-auto max-w-2xl text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl">
            Simple. Flexible. Cooked fresh.
          </h2>
        </header>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <li key={s.n} className="flex flex-col gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-bamboo/10 font-serif text-lg font-semibold text-brand-bamboo-700">
                {s.n}
              </span>
              <h3 className="font-serif text-xl text-ink">{s.title}</h3>
              <p className="text-ink-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PricingTease() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-brand-bamboo md:text-5xl">
            Starting at $18 per meal
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-ink-muted">
            About the cost of one dinner out for a full week of chef-cooked
            dinners. Final pricing and meal options finalized at launch — sign up
            below to be the first to know.
          </p>
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-heading"
      // scroll-mt accounts for the sticky nav so the eyebrow doesn't land under the
      // header when the Hero CTA anchors here.
      className="scroll-mt-24 bg-surface-warm py-20 md:py-28"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Join the waitlist</Eyebrow>
          <h2
            id="waitlist-heading"
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            Be first when Berbice Kitchen opens.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-ink-muted">
            We'll email you the moment sign-ups open — no spam, no aggregator
            marketing, just one note from Beverly when it's ready.
          </p>
          <div className="mx-auto mt-8 max-w-xl text-left">
            <WaitlistForm source="berbice-kitchen-waitlist" />
          </div>
        </div>
      </div>
    </section>
  );
}

function BerbiceFAQ() {
  return (
    <section
      aria-labelledby="berbice-faq-heading"
      className="bg-surface py-20 md:py-28"
    >
      <div className="container">
        <header className="mx-auto max-w-2xl text-center">
          <Eyebrow>Frequently asked</Eyebrow>
          <h2
            id="berbice-faq-heading"
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            About Berbice Kitchen
          </h2>
        </header>
        <div className="mx-auto mt-12 max-w-3xl">
          {BERBICE_FAQS.map((faq) => (
            <FaqItem key={faq.q} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="bg-surface-warm py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Still hungry?</Eyebrow>
          <h2 className="font-serif text-3xl leading-tight text-ink md:text-4xl">
            Try the food now.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-ink-muted">
            Want to try Berbice cooking before Berbice Kitchen launches? Visit us
            in Pineapple Grove.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink
              href={`tel:${restaurant.contact.phone}`}
              variant="primary"
              size="lg"
            >
              Reserve a table
            </ButtonLink>
            <ButtonLink href="/#menu" variant="outline" size="lg">
              Order takeout
            </ButtonLink>
          </div>

          <div className="mx-auto mt-14 max-w-xl text-left">
            <p className="mb-3 text-center text-sm text-ink-muted">
              Or get notified when Berbice Kitchen launches
            </p>
            <WaitlistForm source="berbice-kitchen-waitlist-bottom" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BerbiceKitchenPage() {
  return (
    <>
      <Nav restaurant={restaurant} />
      <main>
        <Hero />
        <WhereIsBerbice />
        <HowItWorks />
        <PricingTease />
        <Waitlist />
        <BerbiceFAQ />
        <BottomCTA />
      </main>
      <Footer restaurant={restaurant} />
    </>
  );
}
