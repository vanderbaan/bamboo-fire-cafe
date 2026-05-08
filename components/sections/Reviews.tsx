import { Star } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import type { RestaurantContent } from "@/types/content";

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

export function Reviews({ restaurant }: Props) {
  const { reviews } = restaurant;
  if (reviews.length === 0) return null;
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="bg-surface-warm py-20 md:py-28"
    >
      <div className="container">
        <header className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-bamboo-700">
            Reviews
          </p>
          <h2
            id="reviews-heading"
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            What guests are saying.
          </h2>
        </header>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={i}>
              <Card className="h-full">
                <CardBody className="flex h-full flex-col">
                  <Stars count={r.stars} />
                  <p className="mt-4 text-ink">{r.paraphrase}</p>
                  <p className="mt-auto pt-6 text-sm text-ink-muted">
                    {r.name} · <span className="italic">via {r.source}</span>
                  </p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
