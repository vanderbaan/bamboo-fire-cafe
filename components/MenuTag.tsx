import { Flame, Leaf, Star, WheatOff } from "lucide-react";
import type { ComponentType } from "react";
import type { MenuItem } from "@/types/content";

type Tag = NonNullable<MenuItem["tags"]>[number];

const TAG_META: Record<Tag, { label: string; icon: ComponentType<{ className?: string }> }> = {
  V: { label: "Vegetarian", icon: Leaf },
  VG: { label: "Vegan", icon: Leaf },
  GF: { label: "Gluten-free", icon: WheatOff },
  DF: { label: "Dairy-free", icon: WheatOff },
  spicy: { label: "Spicy", icon: Flame },
  signature: { label: "Signature", icon: Star },
};

/**
 * Dietary / signature pill. Universal component (no client-only APIs) — server-rendered when
 * Menu.tsx imports it directly, ships to the client when MenuItemsList / MenuItemModal pull
 * it in. Lifted out of Menu.tsx so the row layout and the modal layout render identical pills.
 */
export function MenuTag({ tag }: { tag: Tag }) {
  const meta = TAG_META[tag];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span
      title={meta.label}
      aria-label={meta.label}
      className="inline-flex items-center gap-1 rounded-full bg-surface-warm px-2 py-0.5 text-[0.7rem] font-medium text-ink-muted"
    >
      <Icon className="h-3 w-3" aria-hidden />
      {meta.label}
    </span>
  );
}
