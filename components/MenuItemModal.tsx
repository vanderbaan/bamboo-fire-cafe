"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { MenuTag } from "./MenuTag";
import type { MenuItem } from "@/types/content";

interface Props {
  /**
   * Photo-bearing items in menu order, filtered upstream. This array drives carousel
   * navigation — the modal is dumb about which items have photos. Items without `image`
   * shouldn't be passed in.
   */
  items: ReadonlyArray<MenuItem>;
  /** Where in `items` to start. The modal manages its own index from there. */
  currentIndex: number;
  onClose: () => void;
  /** Merchant name + city for auto-generated alt fallback. */
  restaurantName: string;
  restaurantCity: string;
}

/**
 * Photo modal for clickable menu items. The single-item lightbox grew into a swipeable
 * carousel that navigates through every photo-bearing menu item.
 *
 * Navigation:
 *   • Left/Right chevron buttons inside the photo (hidden at boundaries — no loop).
 *   • ArrowLeft / ArrowRight keys.
 *   • Touch/pointer swipe via react-swipeable, 50 px threshold.
 *   • ESC closes (existing behavior unchanged).
 *
 * The next image is preloaded into the browser cache so swiping right feels instant.
 *
 * Hydration / a11y plumbing (unchanged from the prior single-item modal):
 *   • role="dialog" + aria-modal="true" + aria-labelledby on the dish name.
 *   • Focus moves to the close button on mount; Tab cycles only inside the dialog.
 *   • Backdrop click closes; modal-content clicks stopPropagation.
 *   • Body scroll locked while open; focus restored on close.
 *   • All `.focus()` calls pass `{ preventScroll: true }`.
 *   • An aria-live polite region announces "Now showing: {name}, {N} of {total}" on
 *     index change so screen-reader users hear the slide change.
 */
export function MenuItemModal({
  items,
  currentIndex,
  onClose,
  restaurantName,
  restaurantCity,
}: Props) {
  const [index, setIndex] = useState(currentIndex);
  const item = items[index];

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  const canPrev = index > 0;
  const canNext = index < items.length - 1;

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i));
  }, []);
  const goNext = useCallback(
    () => setIndex((i) => (i < items.length - 1 ? i + 1 : i)),
    [items.length]
  );

  // Preload the next photo so swiping right feels instant. Uses the native browser
  // Image constructor (window.Image to avoid colliding with next/image's `Image`).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = items[index + 1];
    if (next?.image) {
      const img = new window.Image();
      img.src = next.image;
    }
  }, [index, items]);

  // Touch / pointer swipe handlers. trackMouse off because click-drag isn't a useful
  // gesture on desktop and would conflict with selecting text in the description.
  const swipeHandlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    delta: 50,
    trackMouse: false,
  });

  // Mount/unmount lifecycle: focus, body scroll lock, keyboard handlers, focus restore.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    closeBtnRef.current?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setVisible(true));

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      // Focus trap — recompute focusables on each Tab so newly-mounted prev/next buttons
      // (which appear/disappear at the boundaries) are picked up.
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [onClose, goPrev, goNext]);

  if (!item) return null;

  const altText =
    item.imageAlt ??
    `${item.name} at ${restaurantName}, ${restaurantCity}`;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-ink/70 transition-opacity duration-200 ease-out md:items-center md:p-6 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className={`relative flex h-full w-full max-w-2xl flex-col overflow-hidden bg-surface shadow-card transition-all duration-300 ease-out md:h-auto md:max-h-[90vh] md:rounded-card ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {/* Live region — sits outside the keyed content so it stays mounted across nav
            and the screen reader announces every index change. */}
        <div role="status" aria-live="polite" className="sr-only">
          Now showing: {item.name}, {index + 1} of {items.length}
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface/95 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-surface hover:text-brand-fire focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-fire"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {/* Keyed wrapper so the fade animation runs on every nav. The two regions inside
            (photo + content) update together — name, badges, price, description, add-ons
            all swap at the same time. Animation class is defined in app/globals.css. */}
        <div
          key={index}
          className="animate-menu-modal-fade flex flex-1 flex-col overflow-hidden"
        >
          {item.image && (
            <div
              {...swipeHandlers}
              className="relative aspect-[3/2] w-full bg-ink/5"
            >
              <Image
                src={item.image}
                alt={altText}
                fill
                sizes="(min-width: 768px) 700px, 100vw"
                quality={80}
                priority
                className="object-cover"
              />

              {/* Prev/Next arrows — hidden at boundaries per spec. White-circle pills,
                  vertically centered on the photo, semi-transparent backdrop. */}
              {canPrev && (
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous menu item"
                  className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-surface hover:text-brand-fire focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-fire"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
              )}
              {canNext && (
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next menu item"
                  className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-surface hover:text-brand-fire focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-fire"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              )}
            </div>
          )}

          <div className="overflow-y-auto p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h2
                id={titleId}
                className="font-serif text-2xl text-ink md:text-3xl"
              >
                {item.name}
              </h2>
              {/* Price slot: sizes win over plain price; softened weight matches the row. */}
              {item.sizes && item.sizes.length > 0 ? (
                <span className="shrink-0 font-serif text-xl font-normal text-ink md:text-2xl">
                  {item.sizes
                    .map((s) => `${s.label} ${s.price}`)
                    .join(" · ")}
                </span>
              ) : item.price ? (
                <span className="shrink-0 font-serif text-xl font-normal text-ink md:text-2xl">
                  {item.price}
                </span>
              ) : null}
            </div>

            {(item.isNew || (item.tags && item.tags.length > 0)) && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {item.isNew && (
                  <span className="inline-flex items-center rounded-full bg-brand-bamboo px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white">
                    New
                  </span>
                )}
                {item.tags?.map((t) => (
                  <MenuTag key={t} tag={t} />
                ))}
              </div>
            )}

            {item.description && (
              <p className="mt-4 leading-relaxed text-ink-muted">
                {item.description}
              </p>
            )}

            {item.addOns && item.addOns.length > 0 && (
              <ul className="mt-4 space-y-1 border-t border-ink/10 pt-4 text-sm text-ink-muted">
                {item.addOns.map((a) => (
                  <li
                    key={a.name}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span>+ {a.name}</span>
                    <span className="shrink-0 tabular-nums">{a.price}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Counter — sits outside the animated wrapper so it doesn't flicker on nav.
            Border separates it from the content above. */}
        {items.length > 1 && (
          <div className="border-t border-ink/5 px-6 py-3 text-center text-xs text-ink-muted">
            {index + 1} of {items.length}
          </div>
        )}
      </div>
    </div>
  );
}
