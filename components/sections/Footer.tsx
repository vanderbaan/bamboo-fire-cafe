import { Logo } from "@/components/Logo";
import { brand } from "@/content/brand";
import { hoursSummary } from "@/lib/hours";
import { displayPhone } from "@/lib/phone";
import { Facebook, Instagram } from "lucide-react";
import type { RestaurantContent } from "@/types/content";

interface Props {
  restaurant: RestaurantContent;
}

export function Footer({ restaurant }: Props) {
  const summary = hoursSummary(restaurant.hours);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-surface">
      <div className="container grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="bg-surface-warm inline-block rounded-card p-3">
            {/* Matches previous footer size (~160 px); kept fixed across breakpoints because
                the dark footer doesn't have the same overpower-the-page concern as the nav. */}
            <Logo brand={brand} className="w-[160px]" sizes="160px" />
          </div>
          <p className="mt-4 text-sm text-surface/70">
            {restaurant.tagline} · {restaurant.address.city}, {restaurant.address.state}
          </p>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-surface/60">
            Visit
          </h3>
          <address className="mt-3 not-italic text-sm leading-relaxed text-surface/90">
            {restaurant.address.street}
            <br />
            {restaurant.address.city}, {restaurant.address.state}{" "}
            {restaurant.address.postalCode}
          </address>
          <p className="mt-3 text-sm">
            <a
              href={`tel:${restaurant.contact.phone}`}
              className="text-surface/90 underline-offset-4 hover:underline"
            >
              {displayPhone(restaurant.contact.phone)}
            </a>
          </p>
          <p className="text-sm">
            <a
              href={`mailto:${restaurant.contact.email}`}
              className="text-surface/90 underline-offset-4 hover:underline"
            >
              {restaurant.contact.email}
            </a>
          </p>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-surface/60">
            Hours
          </h3>
          <ul className="mt-3 space-y-1 text-sm text-surface/90">
            {summary.map((g) => (
              <li key={g.label} className="flex justify-between gap-4">
                <span>{g.label}</span>
                <span className="text-surface/70">{g.display}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xs uppercase tracking-[0.2em] text-surface/60">
            Follow
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {restaurant.social.facebook && (
              <li>
                <a
                  href={restaurant.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-surface/90 hover:text-surface"
                >
                  <Facebook className="h-4 w-4" aria-hidden /> Facebook
                </a>
              </li>
            )}
            {restaurant.social.instagram && (
              <li>
                <a
                  href={restaurant.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-surface/90 hover:text-surface"
                >
                  <Instagram className="h-4 w-4" aria-hidden /> Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-surface/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-surface/60 md:flex-row">
          <p>
            © {year} {restaurant.name}. All rights reserved.
          </p>
          <p>
            Powered by{" "}
            {/* TODO: replace with the resolved Lōcal master brand URL once provisioned (the IDN
                lōcal.com vs. ASCII fallback decision is open — see README open questions). */}
            <span className="text-surface/80">Lōcal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
