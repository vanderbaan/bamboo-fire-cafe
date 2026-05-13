"use client";

import { Button } from "@/components/ui/Button";
import { useOrderDropdown } from "@/contexts/OrderDropdownContext";
import { scrollToMenuSection } from "@/lib/scrollToMenu";

/**
 * Hero-section "Order" CTA.
 *
 * Does NOT render its own dropdown. Instead it:
 *   1. Calls `setOpen(true)` from the OrderDropdownContext, which opens the single
 *      OrderDropdown that lives in the (sticky) Nav.
 *   2. Smooth-scrolls the page to the #menu section.
 *
 * The two effects fire together, and because the Nav is sticky, the dropdown remains
 * visible at the top of the viewport throughout the scroll and after it lands. From the
 * customer's perspective: one click, page glides to the menu, options appear above it.
 *
 * Why a separate component rather than another <OrderDropdown> instance: two instances
 * each with their own state had the Hero's popover scrolling off-screen with the hero
 * during the animation. Lifting state to context means there's exactly one popover (in
 * the Nav) for both triggers to drive.
 */
export function HeroOrderButton() {
  const { setOpen } = useOrderDropdown();

  const handleClick = () => {
    // State first, scroll second — same ordering as OrderDropdown.handleTriggerClick.
    // React commits the open=true update; the Nav's OrderDropdown re-renders its popover;
    // its open-effect focuses the first menuitem with preventScroll; meanwhile our RAF
    // (inside scrollToMenuSection) kicks off the smooth scroll on the very next frame.
    setOpen(true);
    scrollToMenuSection();
  };

  return (
    <Button onClick={handleClick} variant="primary" size="lg">
      Order
    </Button>
  );
}
