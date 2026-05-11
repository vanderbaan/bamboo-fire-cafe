import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { fillTenure } from "@/lib/tenure";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

/**
 * Server-side check whether a /public-relative asset exists on disk. Lets us commit the
 * canonical SEO filename in content/ before the actual photo lands — Story.tsx will keep
 * showing the placeholder until Beverly drops the file in /public/story/, then the next
 * deploy renders the photo automatically with no content change required.
 *
 * fs.existsSync is available because Story is a server component. The check runs at build
 * time for static pages; on Vercel that means a redeploy is required to pick up a newly
 * added asset, which happens automatically on push to main.
 */
function publicAssetExists(publicSrc: string): boolean {
  return existsSync(join(process.cwd(), "public", publicSrc.replace(/^\//, "")));
}

export function Story({ restaurant }: Props) {
  const { story } = restaurant;
  // Substitute `{years}` per paragraph so any tenure-bearing prose tracks foundedYear without
  // duplicating the integer here.
  const paragraphs = story.paragraphs.map((p) =>
    fillTenure(p, restaurant.foundedYear)
  );
  // Resolve the photo: render only if content set storyImage AND the file is on disk.
  const renderableImage =
    story.storyImage && publicAssetExists(story.storyImage.src)
      ? story.storyImage
      : null;

  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="bg-surface-warm py-20 md:py-28"
    >
      <div className="container grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          {renderableImage ? (
            // Aspect-[4/5] portrait container reserves layout space (CLS-free) regardless
            // of the actual image's dimensions; next/image fill mode handles the cover.
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card">
              <Image
                src={renderableImage.src}
                alt={renderableImage.alt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
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
            {paragraphs.map((p, i) => (
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
