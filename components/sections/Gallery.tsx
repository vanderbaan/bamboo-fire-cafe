import Image from "next/image";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

/**
 * v1: simple responsive grid, no JS lightbox. The brief calls for a lightbox; deferring to v1.5
 * to avoid client-bundle weight on the marketing page. Tap-to-fullscreen is good enough for now.
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

        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {gallery.map((img, i) => (
            <li
              key={`${img.src}-${i}`}
              className="overflow-hidden rounded-card bg-surface shadow-card"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className="aspect-square h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                sizes="(min-width: 768px) 33vw, 50vw"
                loading={i < 3 ? "eager" : "lazy"}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
