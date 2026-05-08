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
    <header className="sticky top-0 z-30 border-b border-ink/5 bg-surface-warm/85 backdrop-blur supports-[backdrop-filter]:bg-surface-warm/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <a
          href="#top"
          className="flex items-center gap-3"
          aria-label={`${restaurant.name} home`}
        >
          <Logo brand={brand} width={140} priority />
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
