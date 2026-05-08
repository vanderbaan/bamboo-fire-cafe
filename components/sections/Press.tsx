import { ExternalLink } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

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
            Press
          </p>
          <h2
            id="press-heading"
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            What people are writing.
          </h2>
        </header>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {press.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardBody className="flex h-full flex-col">
                    <p className="text-xs uppercase tracking-[0.18em] text-brand-bamboo-700">
                      {item.publication}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">{item.date}</p>
                    <p className="mt-4 text-ink">{item.paraphrase}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-brand-fire">
                      Read the article
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </CardBody>
                </Card>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
