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
  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-medium text-ink">{item.name}</span>
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
        {item.price && (
          <span className="shrink-0 font-medium tabular-nums text-ink-muted">
            {item.price}
          </span>
        )}
      </div>
      {item.description && (
        <p className="text-sm text-ink-muted">{item.description}</p>
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
