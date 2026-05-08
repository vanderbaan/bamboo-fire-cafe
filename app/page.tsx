import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Menu } from "@/components/sections/Menu";
import { Gallery } from "@/components/sections/Gallery";
import { Press } from "@/components/sections/Press";
import { Reviews } from "@/components/sections/Reviews";
import { Location } from "@/components/sections/Location";
import { Footer } from "@/components/sections/Footer";
import { restaurant } from "@/content/restaurant";
import { restaurantJsonLd } from "@/lib/schema";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${restaurant.domain}`;

export default function HomePage() {
  const jsonLd = restaurantJsonLd(restaurant, SITE_URL);

  return (
    <>
      <script
        type="application/ld+json"
        // Server-rendered, no useEffect needed.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav restaurant={restaurant} />
      <main>
        <Hero restaurant={restaurant} />
        <Story restaurant={restaurant} />
        <Menu restaurant={restaurant} />
        <Gallery restaurant={restaurant} />
        <Press restaurant={restaurant} />
        <Reviews restaurant={restaurant} />
        <Location restaurant={restaurant} />
      </main>
      <Footer restaurant={restaurant} />
    </>
  );
}
