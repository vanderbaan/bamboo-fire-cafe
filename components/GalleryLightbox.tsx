"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/types/content";

interface Props {
  items: ReadonlyArray<GalleryImage>;
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Full-viewport gallery lightbox. Same architectural pattern as MenuItemModal — hand-rolled
 * <div role="dialog"> (over the native <dialog>) so transitions work without the still-shipping
 * `@starting-style` CSS, plus standard focus-trap and body-scroll-lock plumbing.
 *
 * The siblings (GalleryGrid) own the `activeIndex` state and pass paged navigation callbacks;
 * this component is dumb about the gallery beyond "show item at activeIndex." That separation
 * keeps modal state isolated when the grid re-renders.
 *
 * a11y mirrors the rest of the site's modal pattern (see MenuItemModal):
 *   • role="dialog" + aria-modal="true" on the dialog box.
 *   • aria-labelledby points at the visible caption.
 *   • Focus moves to the close button on mount; Tab cycles only inside the dialog.
 *   • ESC closes; ArrowLeft/Right navigate (we explicitly stopPropagation so they don't bubble).
 *   • Backdrop click closes; modal-content clicks stopPropagation.
 *   • Body scroll locked while open; focus restored to triggering element on close.
 *   • All `.focus()` calls pass `{ preventScroll: true }` so the page doesn't jump if the
 *     triggering thumbnail isn't currently in view.
 */
export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const item = items[activeIndex];
  const captionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  // `visible` flips one frame after mount so the entrance transition runs.
  const [visible, setVisible] = useState(false);

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
        onPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      // Focus trap — same selector list as MenuItemModal.
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
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  const showArrows = items.length > 1;

  return (
    <div
      onClick={onClose}
      // Darker backdrop than MenuItemModal (gallery wants the image to be the only thing
      // your eye lands on; menu modal had brand-relevant surface around it).
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 transition-opacity duration-200 ease-out md:p-12 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={captionId}
        onClick={(e) => e.stopPropagation()}
        className={`relative flex max-h-full max-w-full flex-col items-center transition-all duration-300 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          // On mobile, sits inside the image area (top-right corner) so it's tappable
          // without crowding edges; on desktop, floats just above-right of the image.
          className="absolute right-2 top-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:-right-12 md:-top-2"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {showArrows && (
          <>
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:-left-14"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:-right-14"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        )}

        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          quality={90}
          sizes="90vw"
          priority
          // max-h caps the image at 80% of viewport height; w-auto preserves aspect.
          // Image-frame's own `display: block` keeps the figcaption-style caption right below.
          className="max-h-[80vh] w-auto rounded-card object-contain"
        />

        <p
          id={captionId}
          className="mt-4 text-center font-serif text-lg text-white drop-shadow-md"
        >
          {item.caption}
        </p>

        {showArrows && (
          <p className="mt-1 text-center text-xs text-white/60">
            {activeIndex + 1} of {items.length}
          </p>
        )}
      </div>
    </div>
  );
}
