import { ExternalLink, PlayCircle } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import type { PressItem } from "@/types/content";

type Variant = "carousel" | "page";

interface Props {
  item: PressItem;
  /**
   * Where this card renders. Affects video handling:
   *   "carousel" → uniform-height thumbnail card for videos (avoids tall slides + lazy iframes)
   *   "page"     → real YouTube iframe inline (TikTok still thumbnail-card because their
   *                 embed requires their JS script)
   */
  variant?: Variant;
}

/** YouTube ID extractor — supports youtu.be/, /watch?v=, /embed/ forms. */
function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&#/]+)/
  );
  return m ? m[1] : null;
}

function isTikTokUrl(url: string): boolean {
  return /tiktok\.com/.test(url);
}

/**
 * Universal press-item renderer. Used by:
 *   • PressCarousel (homepage) — pass variant="carousel"
 *   • /press route          — pass variant="page"
 *
 * Three branches by URL detection:
 *   1. type="video" + YouTube URL → embedded iframe on page; thumbnail card in carousel
 *   2. type="video" + TikTok URL  → thumbnail card with TikTok branding, click opens source
 *   3. anything else              → article card with paraphrase + "Read the article" CTA
 *
 * Why TikTok isn't a real embed: TikTok's official embed is a blockquote that requires
 * loading their `embed.js` script — heavy in carousels, and embed.js has its own quirks
 * (re-runs init when DOM mutates, variable heights). The click-out treatment keeps the
 * page lightweight while still surfacing the social proof.
 */
export function PressItemCard({ item, variant = "carousel" }: Props) {
  const isVideo = item.type === "video";
  const ytId = isVideo ? getYouTubeId(item.url) : null;
  const isTikTok = isVideo && isTikTokUrl(item.url);

  // Branch 1: YouTube on the /press page — real iframe embed.
  if (isVideo && ytId && variant === "page") {
    return (
      <article className="overflow-hidden rounded-card border border-ink/10 bg-surface shadow-card">
        <div className="relative aspect-video w-full bg-ink">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}`}
            title={`${item.publication} video`}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="p-6">
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-brand-bamboo-700">
            <PlayCircle className="h-3.5 w-3.5" aria-hidden />
            {item.publication}
          </p>
          <p className="mt-1 text-xs text-ink-muted">{item.date}</p>
          <p className="mt-3 text-ink">{item.paraphrase}</p>
        </div>
      </article>
    );
  }

  // Branch 2: video in carousel OR TikTok anywhere — uniform-height thumbnail card. The
  // whole card is a link to the source URL.
  if (isVideo) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch ${item.publication} on ${isTikTok ? "TikTok" : "YouTube"} (opens in a new tab)`}
        className="group block h-full"
      >
        <Card className="h-full transition-shadow hover:shadow-md">
          <CardBody className="flex h-full flex-col">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-brand-bamboo-700">
              <PlayCircle className="h-3.5 w-3.5" aria-hidden />
              {item.publication}
            </p>
            <p className="mt-1 text-xs text-ink-muted">{item.date}</p>
            <p className="mt-4 text-ink">{item.paraphrase}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-brand-fire">
              Watch the video
              <PlayCircle className="h-3.5 w-3.5" aria-hidden />
            </span>
          </CardBody>
        </Card>
      </a>
    );
  }

  // Branch 3: article — text card with read-more CTA.
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read ${item.publication} article (opens in a new tab)`}
      className="group block h-full"
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
  );
}
