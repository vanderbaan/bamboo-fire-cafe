"use client";

import { useState } from "react";
import Image from "next/image";
import { MenuItemModal } from "./MenuItemModal";
import { MenuTag } from "./MenuTag";
import type { MenuItem } from "@/types/content";

interface Props {
  items: ReadonlyArray<MenuItem>;
  /**
   * Photo-bearing items in menu order, sourced from ALL sections at the page level. Used
   * as the carousel pool inside MenuItemModal — when the user clicks a row in this section,
   * we look up its index in `photoItems` and start the modal there.
   */
  photoItems: ReadonlyArray<MenuItem>;
  /** Merchant name + city — forwarded to MenuItemModal for image alt auto-generation. */
  restaurantName: string;
  restaurantCity: string;
}

interface RowInnerProps {
  item: MenuItem;
  hasPhoto: boolean;
  altText: string;
}

/**
 * Inner row layout — identical for clickable and static variants. Extracted as a function
 * (not a component) so a single React element tree describes both branches without
 * duplicating the JSX between them.
 */
function RowInner({ item, hasPhoto, altText }: RowInnerProps) {
  // Right-side price slot. Three mutually-exclusive renderings:
  //   • sizes set → render the size variants joined by " · " (e.g. "Sm $12 · Lg $15")
  //   • plain price → render as-is
  //   • neither → empty
  let priceSlot: React.ReactNode = null;
  if (item.sizes && item.sizes.length > 0) {
    priceSlot = (
      <span className="shrink-0 font-normal tabular-nums text-ink-muted">
        {item.sizes.map((s) => `${s.label} ${s.price}`).join(" · ")}
      </span>
    );
  } else if (item.price) {
    // Price softened from font-medium → font-normal per menu-engineering pass:
    // keeps prices legible without making them the visual focus of the row.
    priceSlot = (
      <span className="shrink-0 font-normal tabular-nums text-ink-muted">
        {item.price}
      </span>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-medium text-ink">{item.name}</span>
            {/* NEW badge: distinct from MenuTag pills (which are dietary). Bamboo-green
                solid with white text reads as a confident editorial flag, not a dietary
                note. Rendered before tags so it sits closest to the dish name. */}
            {item.isNew && (
              <span className="inline-flex items-center rounded-full bg-brand-bamboo px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white">
                New
              </span>
            )}
            {item.tags?.map((t) => (
              <MenuTag key={t} tag={t} />
            ))}
            {/* Camera icon affordance removed for thumbnail rows — the visible thumbnail
                next to the price is itself the "click to view" signal. */}
          </div>
          {item.description && (
            <p className="text-sm text-ink-muted">{item.description}</p>
          )}
          {item.addOns && item.addOns.length > 0 && (
            <ul className="mt-1 space-y-0.5 pl-3 text-sm text-ink-muted">
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

        {/* Right column: price stacked above the thumbnail. items-start alignment keeps
            both pinned to the top of the row regardless of description length. */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          {priceSlot}
          {item.image && (
            <div className="ml-3 overflow-hidden rounded-lg shadow-sm">
              {/* Thumbnail: 64×48 mobile, 80×60 desktop. width/height props pin the
                  intrinsic 4:3 aspect; the Tailwind w/h classes force the actual rendered
                  size. width/height set to 2× display size so the source is sharp on
                  high-DPI screens. Loading lazy because most rows are below the fold. */}
              <Image
                src={item.image}
                alt={altText}
                width={160}
                height={120}
                loading="lazy"
                className="h-12 w-16 object-cover transition-transform duration-200 group-hover:scale-[1.03] group-focus-visible:scale-[1.03] md:h-[60px] md:w-20"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Client island that renders one section's items grid AND owns the modal state for any
 * photo-bearing rows in the page. State is the global photoItems index (number, not item)
 * so the modal carousel can navigate through every photo on the page from any starting
 * point — clicking a Dessert thumbnail still lets you swipe backward into Starters.
 *
 * Each photo-bearing row is a real <button> with:
 *   • a thumbnail on the right that scales subtly on hover/focus
 *   • a subtle bamboo-tinted hover background, kept inside the row's natural footprint
 *     via the `-m-2 p-2` "expand-while-not-shifting-layout" pattern
 *   • a focus-visible ring so keyboard users see the focused row
 *
 * Rows WITHOUT an image render plain (no button, no hover affordance) and are not part
 * of the carousel rotation.
 */
export function MenuItemsList({
  items,
  photoItems,
  restaurantName,
  restaurantCity,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openItem = (item: MenuItem) => {
    // Lookup by reference equality first (works when photoItems holds the same object
    // identities passed in via content/restaurant.ts). Fall back to name equality in case
    // a future refactor introduces a copy.
    let idx = photoItems.indexOf(item);
    if (idx < 0) idx = photoItems.findIndex((p) => p.name === item.name);
    if (idx >= 0) setActiveIndex(idx);
  };

  return (
    <>
      <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
        {items.map((item) => {
          const hasPhoto = !!item.image;
          const altText =
            item.imageAlt ??
            `${item.name} at ${restaurantName}, ${restaurantCity}`;
          if (!hasPhoto) {
            return (
              <li key={item.name} className="flex flex-col gap-1">
                <RowInner item={item} hasPhoto={false} altText={altText} />
              </li>
            );
          }
          return (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => openItem(item)}
                aria-label={`View photo and details for ${item.name}`}
                className="group -m-2 flex w-full flex-col gap-1 rounded-card p-2 text-left transition-colors hover:bg-brand-bamboo/5 focus-visible:bg-brand-bamboo/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bamboo/40 cursor-pointer"
              >
                <RowInner item={item} hasPhoto altText={altText} />
              </button>
            </li>
          );
        })}
      </ul>

      {activeIndex !== null && photoItems.length > 0 && (
        <MenuItemModal
          items={photoItems}
          currentIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          restaurantName={restaurantName}
          restaurantCity={restaurantCity}
        />
      )}
    </>
  );
}
