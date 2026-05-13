"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Shared open/closed state for the OrderDropdown.
 *
 * Why a context: there is only one OrderDropdown component instance on the page (in the
 * Nav, which is sticky and always visible). The Hero's "Order" CTA needs to open THAT
 * dropdown — not its own — so that after the page smooth-scrolls to the menu, the popover
 * stays visible at the top of the viewport instead of scrolling off-screen with the hero.
 *
 * The context is intentionally tiny:
 *   • `open` — boolean
 *   • `setOpen` — plain `(open: boolean) => void`, not a React updater. Both call sites
 *     read the current `open` from the same context, so closure freshness is fine.
 */
interface OrderDropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const OrderDropdownContext = createContext<OrderDropdownContextValue>({
  open: false,
  setOpen: () => {},
});

export function OrderDropdownProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // useMemo so the value object identity is stable when `open` doesn't change. The setter
  // is already a stable reference from useState, so it doesn't need to be in deps.
  const value = useMemo<OrderDropdownContextValue>(
    () => ({ open, setOpen }),
    [open]
  );

  return (
    <OrderDropdownContext.Provider value={value}>
      {children}
    </OrderDropdownContext.Provider>
  );
}

export function useOrderDropdown(): OrderDropdownContextValue {
  return useContext(OrderDropdownContext);
}
