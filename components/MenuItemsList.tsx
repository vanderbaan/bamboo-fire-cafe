"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { MenuItemModal } from "./MenuItemModal";
import { MenuTag } from "./MenuTag";
import type { MenuItem } from "@/types/content";

interface Props {
  items: ReadonlyArray<MenuItem>;
}

interface RowProps {
  item: MenuItem;
  hasPhoto: boolean;
}

/**
 * Inner row layout — identical for clickable and static variants. Extracted as a function
 * (not a component) so a single React element tree describes both branches without
 * duplicating the JSX between them.
 */
function RowInner({ item, hasPhoto }: RowProps) {
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
      <div className="flex items-baseline justify-between gap-3">
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
          {hasPhoto && (
            <ImageIcon
              aria-hidden
              className="h-3.5 w-3.5 text-brand-bamboo opacity-60 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          )}
        </div>
        {priceSlot}
      </div>
      {item.description && (
        <p className="text-sm text-ink-muted">{item.description}</p>
      )}
      {/* Protein/topping add-ons rendered as a small indented list. The "+" prefix in
          the price communicates additive nature; matching alignment with the main price
          slot keeps the column tidy at row scale. */}
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
    </>
  );
}

/**
 * Client island that renders one section's items grid AND owns the modal state for any
 * photo-bearing rows in that section. State is scoped per section, which means two photos
 * cannot be open at once even theoretically — keeps focus management simple.
 *
 * Items without an `image` render exactly as the old static layout (no button wrapper, no
 * camera icon, no hover tint). Items with an image become a real <button> with:
 *   • a small ImageIcon next to the dish name as the affordance signal
 *   • subtle bamboo-tinted hover background, kept inside the row's natural footprint via
 *     the `-m-2 p-2` "expand-while-not-shifting-layout" pattern
 *   • a focus-visible ring so keyboard users see the focused row
 */
export function MenuItemsList({ items }: Props) {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);

  return (
    <>
      <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
        {items.map((item) => {
          const hasPhoto = !!item.image;
          if (!hasPhoto) {
            return (
              <li key={item.name} className="flex flex-col gap-1">
                <RowInner item={item} hasPhoto={false} />
              </li>
            );
          }
          return (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => setActiveItem(item)}
                aria-label={`View photo and details for ${item.name}`}
                className="group -m-2 flex w-full flex-col gap-1 rounded-card p-2 text-left transition-colors hover:bg-brand-bamboo/5 focus-visible:bg-brand-bamboo/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bamboo/40 cursor-pointer"
              >
                <RowInner item={item} hasPhoto />
              </button>
            </li>
          );
        })}
      </ul>

      {activeItem && (
        <MenuItemModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
        />
      )}
    </>
  );
}
