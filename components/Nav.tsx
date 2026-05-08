import { Logo } from "./Logo";
import { ButtonLink } from "./ui/Button";
import { brand } from "@/content/brand";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#story", label: "Story" },
  { href: "#gallery", label: "Gallery" },
  { href: "#location", label: "Visit" },
] as const;

export function Nav({ restaurant }: Props) {
  return (
    // Header is taller than typical (h-20 mobile / h-24 desktop) so the merchant logo —
    // which is wider than a typical wordmark thanks to the bamboo-leaves art on the left —
    // has room to breathe at the desktop size the brand wants without overflowing the bar.
    <header className="sticky top-0 z-30 border-b border-ink/5 bg-surface-warm/85 backdrop-blur supports-[backdrop-filter]:bg-surface-warm/70">
      <div className="container flex h-20 items-center justify-between gap-4 md:h-24">
        <a
          href="#top"
          className="flex items-center"
          aria-label={`${restaurant.name} home`}
        >
          {/* 150px on mobile, 220px on desktop — both sit inside the user-confirmed range
              (140–160 mobile, 200–240 desktop). Aspect ratio (3:1) yields ~50/73px tall,
              comfortably inside the h-20/h-24 header. */}
          <Logo
            brand={brand}
            className="w-[150px] md:w-[220px]"
            sizes="(min-width: 768px) 220px, 150px"
            priority
          />
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm text-ink">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="hover:text-brand-fire focus-visible:outline-none focus-visible:text-brand-fire"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ButtonLink
          href={`tel:${restaurant.contact.phone}`}
          variant="primary"
          size="sm"
        >
          Reserve
        </ButtonLink>
      </div>
    </header>
  );
}
