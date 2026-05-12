import { GalleryGrid } from "@/components/GalleryGrid";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

/**
 * Gallery section. Heading stays server-rendered; the grid + lightbox interaction live in
 * the client-side GalleryGrid component. Same server/client split as the Menu section.
 */
export function Gallery({ restaurant }: Props) {
  const { gallery } = restaurant;
  if (gallery.length === 0) return null;
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="bg-surface-warm py-20 md:py-28"
    >
      <div className="container">
        <header className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-bamboo-700">
            Gallery
          </p>
          <h2
            id="gallery-heading"
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            From the kitchen and the dining room.
          </h2>
        </header>

        <GalleryGrid items={gallery} />
      </div>
    </section>
  );
}
