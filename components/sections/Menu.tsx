import { MenuItemsList } from "@/components/MenuItemsList";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
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
          {/*
            Sections with zero items are filtered out so optional sections (Today's Special,
            Seasonal) don't render hollow headings when Beverly hasn't published a special
            for the day. To enable a section, just add items in content/restaurant.ts.
          */}
          {menu.sections
            .filter((section) => section.items.length > 0)
            .map((section) => (
              <div key={section.title}>
                <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/10 pb-3">
                  <h3 className="font-serif text-2xl text-ink">{section.title}</h3>
                  {section.priceRangeIndicator && (
                    <span className="text-sm text-ink-muted">
                      {section.priceRangeIndicator}
                    </span>
                  )}
                </div>

                {/* Section subhead. Serif + italic gives it editorial weight without
                    competing with the section heading. Used by "Bar food, Caribbean-style…"
                    under Loaded Fries and "Build your own…" under Mac & Cheese. */}
                {section.blurb && (
                  <p className="mb-6 max-w-prose font-serif text-lg italic text-ink-muted">
                    {section.blurb}
                  </p>
                )}
                {section.callout && (
                  <p className="mb-6 inline-block rounded-card bg-brand-bamboo-50 px-4 py-2 text-sm text-brand-bamboo-700">
                    {section.callout}
                  </p>
                )}

                {/* Items grid is delegated to a client island so rows with photos can open the
                    modal. Rows without photos render the original static layout — no behaviour
                    difference for items that haven't been wired up with a photo yet. */}
                <MenuItemsList
                  items={section.items}
                  restaurantName={restaurant.name}
                  restaurantCity={restaurant.address.city}
                />
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
