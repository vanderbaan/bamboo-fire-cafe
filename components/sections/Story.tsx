import Image from "next/image";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

export function Story({ restaurant }: Props) {
  const { story } = restaurant;
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="bg-surface-warm py-20 md:py-28"
    >
      <div className="container grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          {story.photo ? (
            <Image
              src={story.photo.src}
              alt={story.photo.alt}
              width={story.photo.width}
              height={story.photo.height}
              className="h-auto w-full rounded-card object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          ) : (
            <div
              role="presentation"
              className="flex aspect-[4/5] items-center justify-center rounded-card border border-dashed border-ink/15 bg-surface text-sm text-ink-muted"
            >
              Family photo coming soon
            </div>
          )}
        </div>
        <div className="md:col-span-7">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-bamboo-700">
            Our story
          </p>
          <h2
            id="story-heading"
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            A family kitchen, rooted in Berbice and at home in Delray.
          </h2>

          <div className="mt-6 space-y-5 text-[1.0625rem] leading-relaxed text-ink">
            {story.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {story.pullQuote && (
            <figure className="mt-8 border-l-2 border-brand-fire pl-5">
              <blockquote className="font-serif text-xl italic text-ink">
                “{story.pullQuote.text}”
              </blockquote>
              <figcaption className="mt-2 text-sm text-ink-muted">
                {story.pullQuote.attribution} ·{" "}
                <a
                  href={story.pullQuote.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-brand-fire"
                >
                  read it
                </a>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
