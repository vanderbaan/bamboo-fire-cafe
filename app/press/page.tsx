import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { PressItemCard } from "@/components/PressItemCard";
import { restaurant } from "@/content/restaurant";
import type { PressItem } from "@/types/content";

/**
 * /press — full press index. Hosts all coverage as a vertical stack with embedded YouTube
 * iframes for video items (TikTok still uses the thumbnail-card pattern — see PressItemCard
 * for the rationale). Same content source as the homepage carousel, so any new entry shows
 * up in both surfaces via a single content edit.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${restaurant.domain}`;

export const metadata: Metadata = {
  title: { absolute: "Press & Coverage | Bamboo Fire Cafe" },
  description:
    "Bamboo Fire Cafe in Delray Beach featured in Boca Magazine, Broward Palm Beach, Coastal Star, and across social media. Caribbean restaurant press coverage and reviews.",
  alternates: {
    canonical: `${SITE_URL}/press`,
  },
  openGraph: {
    title: "Press & Coverage | Bamboo Fire Cafe",
    description:
      "Press and reviews of Bamboo Fire Cafe — Caribbean & World Cuisine in Delray Beach.",
    url: `${SITE_URL}/press`,
    type: "website",
  },
};

/** YouTube ID extractor — duplicated from PressItemCard so the schema can reference it
 *  without exporting client-only code. Same regex; consider lifting to a shared util if
 *  a third caller ever appears. */
function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&#/]+)/
  );
  return m ? m[1] : null;
}

/**
 * Build per-item Schema.org structured data. NewsArticle for written press, VideoObject for
 * videos. Wrapped in an ItemList so Google understands the page is an index. This is the
 * "bonus" structured data the brief mentioned — helps each mention get indexed separately.
 */
function buildPressSchema(items: ReadonlyArray<PressItem>) {
  const listItems = items.map((item, i) => {
    const ytId = item.type === "video" ? getYouTubeId(item.url) : null;
    const inner =
      item.type === "video"
        ? {
            "@type": "VideoObject",
            name: `${item.publication} feature`,
            description: item.paraphrase,
            contentUrl: item.url,
            ...(ytId
              ? { embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}` }
              : {}),
            uploadDate: item.date,
          }
        : {
            "@type": "NewsArticle",
            headline: item.paraphrase,
            url: item.url,
            datePublished: item.date,
            publisher: {
              "@type": "Organization",
              name: item.publication,
            },
            about: {
              "@type": "Restaurant",
              name: restaurant.name,
              url: SITE_URL,
            },
          };
    return {
      "@type": "ListItem",
      position: i + 1,
      item: inner,
    };
  });
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Press coverage of Bamboo Fire Cafe",
    itemListElement: listItems,
  };
}

export default function PressPage() {
  const { press } = restaurant;
  const schema = buildPressSchema(press);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Nav restaurant={restaurant} />
      <main>
        <section className="bg-surface-warm py-20 md:py-28">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-bamboo-700">
              Featured in
            </p>
            <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              Press &amp; Coverage
            </h1>
            <p className="mt-5 max-w-prose text-ink-muted mx-auto">
              Boca Magazine, Broward Palm Beach, Coastal Star, and a growing list of
              creators and reviewers — what people are saying about{" "}
              {restaurant.name}.
            </p>
          </div>
        </section>

        <section className="bg-surface py-16 md:py-20">
          <div className="container mx-auto max-w-3xl">
            {press.length === 0 ? (
              <p className="text-center text-ink-muted">No coverage to show yet.</p>
            ) : (
              <ul className="space-y-8 md:space-y-10">
                {press.map((item) => (
                  <li key={item.url}>
                    <PressItemCard item={item} variant="page" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer restaurant={restaurant} />
    </>
  );
}
