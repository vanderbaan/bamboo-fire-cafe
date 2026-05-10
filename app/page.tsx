import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Menu } from "@/components/sections/Menu";
import { Gallery } from "@/components/sections/Gallery";
import { Press } from "@/components/sections/Press";
import { FAQ } from "@/components/sections/FAQ";
import { Reviews } from "@/components/sections/Reviews";
import { Location } from "@/components/sections/Location";
import { Footer } from "@/components/sections/Footer";
import { restaurant } from "@/content/restaurant";
import { buildFAQSchema, restaurantJsonLd } from "@/lib/schema";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${restaurant.domain}`;

export default function HomePage() {
  const restaurantSchema = restaurantJsonLd(restaurant, SITE_URL);
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
        <Story restaurant={restaurant} />
        <Menu restaurant={restaurant} />
        <Gallery restaurant={restaurant} />
        <Press restaurant={restaurant} />
        <FAQ restaurant={restaurant} />
        <Reviews restaurant={restaurant} />
        <Location restaurant={restaurant} />
      </main>
      <Footer restaurant={restaurant} />
    </>
  );
}
