"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PressItemCard } from "./PressItemCard";
import type { PressItem } from "@/types/content";

interface Props {
  items: ReadonlyArray<PressItem>;
}

/** Detect prefers-reduced-motion at module level. Evaluated once on the client; if the user
 *  toggles the setting mid-session a refresh is needed (acceptable). Server-side we default
 *  to "motion allowed" because reduced-motion is a runtime user preference. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Horizontal press carousel — 1-up on mobile, 2-up at md+. Built on embla-carousel-react
 * with the official Autoplay plugin (omitted entirely when the user prefers reduced motion,
 * per the brief's accessibility requirement — autoplay won't run AT ALL in that case).
 *
 * a11y model:
 *   • Container is a focusable region (tabIndex=0) so Left/Right arrow keys advance slides.
 *   • Prev/Next buttons carry "Previous mention"/"Next mention" labels.
 *   • Dot indicators are real buttons with per-slide labels and aria-current.
 *   • Autoplay pauses on hover, focus, and any user interaction.
 *   • prefers-reduced-motion: no autoplay plugin loaded (zero motion).
 *
 * The Card-vs-iframe decision for video items lives in PressItemCard.tsx; this component
 * doesn't know or care about item types — it just renders slides.
 */
export function PressCarousel({ items }: Props) {
  // Plugins are decided once on mount. The Autoplay plugin is omitted entirely when the
  // user prefers reduced motion — not just paused.
  const plugins = useMemo(() => {
    if (prefersReducedMotion()) return [];
    return [
      Autoplay({
        delay: 7000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    ];
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      // `containScroll` keeps the last slide flush right on tablet+ where we show 2-up.
      containScroll: "trimSnaps",
    },
    plugins
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (idx: number) => emblaApi?.scrollTo(idx),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const updateSnaps = () => setScrollSnaps(emblaApi.scrollSnapList());
    updateSnaps();
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      updateSnaps();
      onSelect();
    });
  }, [emblaApi]);

  // Container-level keyboard nav. Embla doesn't ship arrow-key handling out of the box,
  // so we add it on the carousel region. Only fires when the carousel itself has focus
  // (i.e. user tabbed onto the region) — doesn't hijack global page arrow-key behavior.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  if (items.length === 0) return null;

  return (
    <div className="relative">
      {/* Embla viewport. tabIndex makes the region keyboard-focusable for arrow navigation. */}
      <div
        ref={emblaRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Press mentions"
        onKeyDown={onKeyDown}
        className="overflow-hidden rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bamboo focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <div className="flex">
          {items.map((item, i) => (
            <div
              key={`${item.url}-${i}`}
              // Slide widths: 100% mobile (1-up), 50% at md+ (2-up). The pl-* + -ml-*
              // pattern adds gutters between slides without breaking the basis math.
              className="min-w-0 shrink-0 grow-0 basis-full pl-4 md:basis-1/2"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
            >
              <PressItemCard item={item} variant="carousel" />
            </div>
          ))}
        </div>
      </div>

      {/* Arrow controls — sit just below the slides for thumb reach on mobile, alongside
          the dots so all controls live in one row. */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous mention"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-surface text-ink-muted transition-colors hover:border-ink/30 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bamboo"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>

        <div className="flex items-center gap-1.5" role="tablist" aria-label="Press mention slides">
          {scrollSnaps.map((_, i) => {
            const isActive = i === selectedIndex;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Go to mention ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bamboo focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                  isActive ? "w-6 bg-brand-bamboo" : "w-2 bg-ink/20 hover:bg-ink/40"
                }`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next mention"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-surface text-ink-muted transition-colors hover:border-ink/30 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bamboo"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
