"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { displayPhone } from "@/lib/phone";
import type { Ordering } from "@/types/content";

interface Props {
  ordering: Ordering;
}

/** Pretty-print a delivery provider id for menu copy. */
const DELIVERY_LABEL: Record<NonNullable<Ordering["delivery"]>["provider"], string> = {
  ubereats: "Uber Eats",
  doordash: "DoorDash",
  grubhub: "Grubhub",
  uberdirect: "delivery",
};

/**
 * "Order" trigger + popover menu in the nav. Data-driven from the merchant's `ordering` config:
 *   • Pickup is always rendered (every restaurant accepts a phone call).
 *   • Delivery is rendered only when `ordering.delivery.url` is set, so a merchant who
 *     hasn't onboarded to a delivery marketplace gets a single-option menu instead of an
 *     awkward dangling option.
 *
 * Pickup is positioned first AND tagged "Recommended" because it's the highest-margin path
 * for the merchant — same nudge the Hero CTA gives, just inside the nav too. The Recommended
 * label is rendered as muted small caps rather than a bright pill so it informs without
 * preaching.
 *
 * a11y / interaction model:
 *   • Trigger: aria-haspopup="menu", aria-expanded, aria-controls.
 *   • Menu container: role="menu", aria-label.
 *   • Each option: role="menuitem".
 *   • Open: focus the first menuitem.
 *   • ESC: close menu, return focus to trigger.
 *   • Outside click (mousedown on document outside the container): close.
 *   • Item activation: closes the menu (then the native href fires its tel:/external nav).
 *   • Arrow Down/Up cycles between menuitems for keyboard users; Tab still cycles too in
 *     case anyone prefers it (deviation from strict ARIA menu pattern, but more permissive
 *     and the menu is small enough that it doesn't trap users).
 */
export function OrderDropdown({ ordering }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Outside-click + ESC to close. Listeners only attached while open so the cost is zero
  // when the menu is dismissed.
  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // On open, focus the first menuitem. RAF defers focus until after the menu has rendered.
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>("[role='menuitem']")?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // Arrow-key navigation across menuitems.
  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? []
    );
    if (items.length === 0) return;
    const idx = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === "ArrowDown"
        ? items[(idx + 1) % items.length]
        : items[(idx - 1 + items.length) % items.length];
    next?.focus();
  };

  const close = () => setOpen(false);

  /**
   * On open, also smooth-scroll to the menu so the customer sees what they're choosing
   * between while the popover reveals their pickup/delivery options. We skip the scroll
   * on close — auto-scrolling on dismiss would feel hostile.
   *
   * scrollIntoView is a no-op when the section is already in view, so a click while sitting
   * at the menu just opens the popover (no scroll, no jump).
   *
   * Note: html `scroll-padding-top` (set in app/globals.css) keeps the section's top edge
   * from sliding under the sticky nav header.
   */
  const handleTriggerClick = () => {
    if (!open) {
      document
        .getElementById("menu")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen((v) => !v);
  };

  const deliveryLabel = ordering.delivery
    ? DELIVERY_LABEL[ordering.delivery.provider] ?? "delivery"
    : null;

  return (
    <div ref={containerRef} className="relative">
      <Button
        ref={triggerRef}
        type="button"
        variant="primary"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={handleTriggerClick}
        className="gap-1.5"
      >
        Order
        <ChevronDown
          aria-hidden
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </Button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Ordering options"
          onKeyDown={onMenuKeyDown}
          // Anchored to the trigger's right edge so the menu stays within the viewport on
          // narrow phones (where the trigger sits near the right of the header). The
          // max-w cap keeps it inside the viewport even in the worst case.
          className="absolute right-0 top-full z-40 mt-2 w-[280px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-card border border-ink/10 bg-surface shadow-lg"
        >
          {/* Pickup — always present, always first, marked Recommended */}
          <a
            role="menuitem"
            href={`tel:${ordering.pickup.phoneNumber}`}
            onClick={close}
            className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-brand-bamboo/5 focus:bg-brand-bamboo/5 focus:outline-none"
          >
            <Phone
              aria-hidden
              className="mt-0.5 h-4 w-4 text-ink-muted transition-colors group-hover:text-brand-bamboo group-focus:text-brand-bamboo"
            />
            <span className="flex-1 min-w-0">
              <span className="flex items-center gap-2">
                <span className="font-medium text-ink">Call for Pickup</span>
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-bamboo-700">
                  Recommended
                </span>
              </span>
              <span className="block text-xs text-ink-muted">
                {displayPhone(ordering.pickup.phoneNumber)}
              </span>
            </span>
          </a>

          {/* Delivery — rendered only when configured */}
          {ordering.delivery?.url && deliveryLabel && (
            <a
              role="menuitem"
              href={ordering.delivery.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="group flex items-start gap-3 border-t border-ink/5 px-4 py-3 transition-colors hover:bg-brand-bamboo/5 focus:bg-brand-bamboo/5 focus:outline-none"
            >
              <ArrowUpRight
                aria-hidden
                className="mt-0.5 h-4 w-4 text-ink-muted transition-colors group-hover:text-brand-bamboo group-focus:text-brand-bamboo"
              />
              <span className="flex-1 min-w-0">
                <span className="block font-medium text-ink">
                  Delivery via {deliveryLabel}
                </span>
                <span className="block text-xs text-ink-muted">
                  Opens in a new tab
                </span>
              </span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
