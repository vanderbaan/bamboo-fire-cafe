import { Star } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import type { RestaurantContent, ReviewStat } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

function Stars({ count }: { count: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span aria-label={`${count} out of 5 stars`} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={`h-4 w-4 ${i <= count ? "fill-brand-fire text-brand-fire" : "text-ink/20"}`}
        />
      ))}
    </span>
  );
}

/**
 * Non-featured stat card. The featured and compact variants are split into separate
 * components so each variant's grid classes are explicit, rather than fighting Tailwind's
 * static-extraction with conditional className concat.
 */
function StatCardCompact({ stat }: { stat: ReviewStat }) {
  return (
    <a
      href={stat.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`See ${stat.platform} reviews for the restaurant (opens in a new tab)`}
      className="group block h-full col-span-1 lg:col-span-3 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02]"
    >
      <div className="flex h-full flex-col justify-center rounded-card border border-ink/10 bg-surface p-6 shadow-card transition-shadow duration-200 group-hover:shadow-md">
        <p className="text-sm font-medium text-ink">{stat.platform}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-serif text-3xl font-medium leading-none text-brand-bamboo md:text-4xl">
            {stat.rating}
          </span>
          <span className="text-sm text-ink-muted">{stat.label}</span>
        </div>
        <p className="mt-2 text-xs text-ink-muted">{stat.count}</p>
      </div>
    </a>
  );
}

/**
 * Featured stat card — bamboo-tinted, oversized type, spans 6 cols + 2 rows on desktop so it
 * dominates the left half. On tablet (sm) takes the full row above the 2×2 grid; on mobile
 * sits at the top, full-width.
 *
 * Type scale is tuned for the typical "rating + ★" featured platform (Google here). If a
 * future merchant features a platform whose `label` is multi-word (Facebook's "% recommend",
 * say), the label-line typography would be too large — the card would still render, but
 * "% recommend" at text-8xl would dominate the rating. If that comes up, branch on label
 * length here rather than restructuring the layout.
 */
function StatCardFeatured({ stat }: { stat: ReviewStat }) {
  return (
    <a
      href={stat.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`See ${stat.platform} reviews for the restaurant (opens in a new tab)`}
      className="group col-span-1 block h-full transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] sm:col-span-2 lg:col-span-6 lg:row-span-2"
    >
      <div className="flex h-full flex-col justify-center rounded-card border border-brand-bamboo/30 bg-brand-bamboo-50 p-8 shadow-card transition-shadow duration-200 group-hover:shadow-md md:p-10 lg:p-12">
        <p className="text-base font-medium uppercase tracking-[0.18em] text-brand-bamboo-700 md:text-lg">
          {stat.platform}
        </p>
        <div className="mt-6 flex items-baseline gap-4">
          <span className="font-serif text-7xl font-semibold leading-none text-brand-bamboo md:text-8xl lg:text-9xl">
            {stat.rating}
          </span>
          {/* Label sized one tier below the rating so the glyph (typically ★, which carries
              more visual weight than digits at the same nominal size) doesn't overpower the
              number. */}
          <span className="text-6xl leading-none text-ink-muted md:text-7xl lg:text-8xl">
            {stat.label}
          </span>
        </div>
        <p className="mt-6 text-base text-ink-muted md:text-lg">{stat.count}</p>
      </div>
    </a>
  );
}

export function Reviews({ restaurant }: Props) {
  const { reviews, reviewStats } = restaurant;
  const stats = reviewStats ?? [];
  const featured = stats.find((s) => s.featured);
  const others = stats.filter((s) => !s.featured);
  const hasStats = stats.length > 0;
  const hasReviews = reviews.length > 0;
  if (!hasStats && !hasReviews) return null;

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="bg-surface-warm py-20 md:py-28"
    >
      <div className="container">
        <header className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-bamboo-700">
            What guests say
          </p>
          <h2
            id="reviews-heading"
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            1,200+ reviews. 4.6 stars.
            <br className="hidden md:inline" />{" "}
            <span className="text-ink-muted">
              Across the platforms that matter.
            </span>
          </h2>
        </header>

        {hasStats && (
          <div
            // Mobile (< sm): single column, every card stacks full width.
            // Tablet (sm to lg): 2 columns; featured spans both → full-width on top, then 4
            //   compact cards in a 2×2 below.
            // Desktop (lg+): 12 columns; featured occupies cols 1–6 across 2 rows, the 4
            //   compact cards each occupy 3 cols, filling the right half in a 2×2.
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12"
          >
            {featured && <StatCardFeatured stat={featured} />}
            {others.map((s) => (
              <StatCardCompact key={s.platform} stat={s} />
            ))}
          </div>
        )}

        {hasStats && hasReviews && (
          <p className="mx-auto mt-16 max-w-2xl text-center text-ink-muted">
            Here's what a few of them said:
          </p>
        )}

        {hasReviews && (
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <li key={i}>
                <Card className="h-full">
                  <CardBody className="flex h-full flex-col">
                    <Stars count={r.stars} />
                    <p className="mt-4 text-ink">{r.paraphrase}</p>
                    <p className="mt-auto pt-6 text-sm text-ink-muted">
                      {r.name} ·{" "}
                      <span className="italic">via {r.source}</span>
                    </p>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
