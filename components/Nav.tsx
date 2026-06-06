import Link from "next/link";
import { Logo } from "./Logo";
import { OrderDropdown } from "./OrderDropdown";
import { ButtonLink } from "./ui/Button";
import { brand } from "@/content/brand";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

// Root-relative hrefs (e.g. "/#menu") so the same nav works from any route — from /
// the browser treats it as a fragment-only navigation (smooth-scroll); from /berbice-kitchen
// or any other route it navigates back to / and lands at the anchor. Next/link handles
// both cases. The Berbice Kitchen route is a real page, not a fragment.
const links = [
  { href: "/#menu", label: "Menu" },
  { href: "/#story", label: "Story" },
  { href: "/berbice-kitchen", label: "Berbice Kitchen" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#location", label: "Visit" },
] as const;

export function Nav({ restaurant }: Props) {
  return (
    // Header grew when we swapped from the 3:1 SVG wordmark to the 2:1 watercolor PNG.
    // h-24 mobile / h-32 desktop accommodates the new logo at 150×75 / 220×110 with a
    // comfortable margin top and bottom.
    <header className="sticky top-0 z-30 border-b border-ink/5 bg-surface-warm/85 backdrop-blur supports-[backdrop-filter]:bg-surface-warm/70">
      <div className="container flex h-24 items-center justify-between gap-4 md:h-32">
        <Link
          href="/"
          className="flex items-center"
          aria-label={`${restaurant.name} home`}
        >
          {/* 150px on mobile, 220px on desktop. Watercolor PNG aspect (2:1) yields
              75/110px tall, comfortably inside the h-24/h-32 header. */}
          <Logo
            brand={brand}
            className="w-[150px] md:w-[220px]"
            sizes="(min-width: 768px) 220px, 150px"
            priority
          />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm text-ink">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-brand-fire focus-visible:outline-none focus-visible:text-brand-fire"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Order → Reserve reading order: ordering is the more common visit intent than booking,
            so the Order popover sits to the left and gets the brand-fire primary treatment.
            Reserve is demoted to outline so we don't ship two competing red CTAs in the bar. */}
        <div className="flex items-center gap-2">
          <OrderDropdown ordering={restaurant.ordering} />
          <ButtonLink
            href={`tel:${restaurant.contact.phone}`}
            variant="outline"
            size="sm"
          >
            Reserve
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
