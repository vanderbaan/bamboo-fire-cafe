"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { GalleryLightbox } from "./GalleryLightbox";
import type { GalleryImage } from "@/types/content";

interface Props {
  items: ReadonlyArray<GalleryImage>;
}

/**
 * Client island that renders the gallery grid and owns lightbox state. State is the index
 * of the active item (not the item itself) so prev/next can advance through `items` from
 * within the lightbox without lifting state any higher.
 *
 * Why this lives in a separate file from the server-rendered Gallery section: keeps the
 * server/client boundary at the smallest possible surface — the section heading and intro
 * stay SSR, only the interactive grid + modal ship JS to the client. Same architecture as
 * components/MenuItemsList.tsx + components/MenuItemModal.tsx.
 *
 * Hover behavior:
 *   • Image scales up subtly (`group-hover:scale-105`) on the image element.
 *   • Whole tile is a real <button> with `aria-label` combining the short caption and the
 *     long alt — screen reader users hear both the dish name and the descriptive text.
 *   • Caption gradient is always visible (no hover-reveal) because phones can't hover and
 *     captions are useful information, not a flourish.
 */
export function GalleryGrid({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // useCallback so the effect inside GalleryLightbox doesn't rebind its keydown listener
  // every parent render. Only depends on items.length.
  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + items.length) % items.length
    );
  }, [items.length]);
  const next = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);

  return (
    <>
      <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {items.map((item, i) => (
          <li
            key={`${item.src}-${i}`}
            // aspect-square + relative establish the box that <Image fill> fills.
            className="group relative aspect-square overflow-hidden rounded-card bg-ink/5 shadow-card"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View ${item.caption} — ${item.alt}`}
              className="absolute inset-0 block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bamboo focus-visible:ring-offset-2 focus-visible:ring-offset-surface-warm"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                loading={i < 3 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              />
              <span
                // Gradient overlay always visible — caption is informative, not decorative.
                // pt-12 pulls the gradient up so the fade starts above the text and the text
                // sits cleanly readable against the dark portion.
                className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-12 font-serif text-lg text-white drop-shadow-md"
              >
                {item.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {activeIndex !== null && (
        <GalleryLightbox
          items={items}
          activeIndex={activeIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}
