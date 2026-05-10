"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { MenuTag } from "./MenuTag";
import type { MenuItem } from "@/types/content";

interface Props {
  item: MenuItem;
  onClose: () => void;
}

/**
 * Photo modal for a clickable menu item.
 *
 * Why a hand-rolled <div role="dialog"> instead of the native <dialog> element: <dialog>
 * gives us free focus trap + ESC + top-layer rendering, but its open/close transition story
 * still requires `@starting-style` and `transition-behavior: allow-discrete` (Chrome 117+/
 * Safari 17.4+/Firefox 129+). The hand-rolled version is broadly supported, animates with
 * the same Tailwind transitions everything else uses, and the focus-trap implementation
 * below is small enough to be auditable.
 *
 * a11y:
 *  • role="dialog" + aria-modal="true" on the dialog box (not the backdrop) so screen
 *    readers identify the dialog correctly while still announcing its contents.
 *  • aria-labelledby points at the item-name <h2> via a useId-generated id, so multiple
 *    modals on the page never collide on ids.
 *  • Focus moves to the close button on mount; Tab cycles inside the modal only.
 *  • ESC closes; clicking the backdrop closes; both restore focus to the triggering button.
 *  • body scroll is locked while open.
 */
export function MenuItemModal({ item, onClose }: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  // `visible` flips one frame after mount so the entrance transition runs.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    closeBtnRef.current?.focus();
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setVisible(true));

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      // Focus trap. Compute focusables fresh on each Tab so newly-mounted elements
      // (e.g. images that switched from loading skeleton to focusable surface) are picked up.
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      // Restore focus to whatever was focused before the modal opened (typically the
      // triggering menu-item button), so keyboard users don't lose their place.
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    // Outer is the backdrop — click anywhere here closes. The dialog box stops propagation.
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
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface/95 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-surface hover:text-brand-fire focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-fire"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {item.image && (
          <div className="relative aspect-[3/2] w-full bg-ink/5">
            <Image
              src={item.image}
              alt={item.imageAlt ?? item.name}
              fill
              sizes="(min-width: 768px) 700px, 100vw"
              quality={80}
              priority
              className="object-cover"
            />
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
            {item.price && (
              <span className="shrink-0 font-serif text-xl font-medium text-ink md:text-2xl">
                {item.price}
              </span>
            )}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <MenuTag key={t} tag={t} />
              ))}
            </div>
          )}

          {item.description && (
            <p className="mt-4 leading-relaxed text-ink-muted">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
