import { Leaf, Flame, WheatOff, Star } from "lucide-react";
import type { MenuItem, RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

const TAG_META: Record<NonNullable<MenuItem["tags"]>[number], { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  V: { label: "Vegetarian", icon: Leaf },
  VG: { label: "Vegan", icon: Leaf },
  GF: { label: "Gluten-free", icon: WheatOff },
  DF: { label: "Dairy-free", icon: WheatOff },
  spicy: { label: "Spicy", icon: Flame },
  signature: { label: "Signature", icon: Star },
};

function Tag({ tag }: { tag: NonNullable<MenuItem["tags"]>[number] }) {
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

export function Menu({ restaurant }: Props) {
  const { menu } = restaurant;
  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="bg-surface py-20 md:py-28"
    >
      <div className="container">
        <header className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-bamboo-700">
            Menu
          </p>
          <h2
            id="menu-heading"
            className="font-serif text-3xl leading-tight text-ink md:text-4xl"
          >
            Caribbean &amp; world cuisine, by way of one family.
          </h2>
          <p className="mt-4 text-ink-muted">
            Each entrée comes with your choice of rice, vegetables, or sweet
            plantains.
          </p>
        </header>

        <div className="mt-14 space-y-14">
          {menu.sections.map((section) => (
            <div key={section.title}>
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/10 pb-3">
                <h3 className="font-serif text-2xl text-ink">{section.title}</h3>
                {section.priceRangeIndicator && (
                  <span className="text-sm text-ink-muted">
                    {section.priceRangeIndicator}
                  </span>
                )}
              </div>

              {section.blurb && (
                <p className="mb-6 max-w-prose text-ink-muted">{section.blurb}</p>
              )}
              {section.callout && (
                <p className="mb-6 inline-block rounded-card bg-brand-bamboo-50 px-4 py-2 text-sm text-brand-bamboo-700">
                  {section.callout}
                </p>
              )}

              <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
                {section.items.map((item) => (
                  <li key={item.name} className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-medium text-ink">{item.name}</span>
                        {item.tags?.map((t) => (
                          <Tag key={t} tag={t} />
                        ))}
                      </div>
                      {item.price && (
                        <span className="shrink-0 font-medium tabular-nums text-ink-muted">
                          {item.price}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-ink-muted">
                        {item.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {menu.footnotes.length > 0 && (
          <div className="mx-auto mt-14 max-w-3xl rounded-card bg-surface-warm p-6 text-sm text-ink-muted">
            <ul className="space-y-2">
              {menu.footnotes.map((fn, i) => (
                <li key={i}>{fn}</li>
              ))}
            </ul>
          </div>
        )}

        {menu.cateringTeaser && (
          <div className="mx-auto mt-10 max-w-3xl rounded-card border border-dashed border-brand-bamboo/40 bg-brand-bamboo-50/40 p-6 text-center">
            <h3 className="font-serif text-xl text-ink">Catering</h3>
            <p className="mt-2 text-ink-muted">{menu.cateringTeaser}</p>
            <a
              href={`mailto:${restaurant.contact.email}?subject=${encodeURIComponent(
                "Catering Inquiry"
              )}`}
              className="mt-4 inline-block font-medium text-brand-fire underline-offset-4 hover:underline"
            >
              Email a catering inquiry →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
