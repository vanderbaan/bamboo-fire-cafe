import Link from "next/link";
import { PressCarousel } from "@/components/PressCarousel";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

/**
 * Homepage Press section. The full list lives at /press; this surface is a horizontal
 * carousel that keeps the section visually light (~1/3 the height of the prior 4-column
 * grid) while still surfacing every mention. Eyebrow is "Featured in" to frame the section
 * as social proof rather than industry self-reference.
 */
export function Press({ restaurant }: Props) {
  const { press } = restaurant;
  if (press.length === 0) return null;
  return (
    <section
      id="press"
      aria-labelledby="press-heading"
      className="bg-surface py-20 md:py-28"
    >
      <div className="container">
        <header className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-bamboo-700">
            Featured in
          </p>
          <h2
            id="press-heading"
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            What People Are Saying
          </h2>
        </header>

        <div className="mt-12">
          {/* pr-4 negative on the inner wrapper compensates for the slide pl-4 gutter,
              so the first slide aligns with the section's left edge. */}
          <div className="-ml-4">
            <PressCarousel items={press} />
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href="/press"
              className="text-sm font-medium text-brand-fire underline-offset-4 hover:underline"
            >
              View all coverage →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
