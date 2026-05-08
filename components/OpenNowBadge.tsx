"use client";

import { useEffect, useState } from "react";
import { isOpenNow } from "@/lib/openNow";
import type { Hours } from "@/types/content";

interface Props {
  hours: Hours;
  timezone: string;
}

/**
 * Client island. Re-evaluates at runtime on the user's device, not at build time, so the badge
 * tracks the actual restaurant open/close state through the night without requiring a redeploy.
 *
 * Hydration model:
 *   - SSR + first client paint render a neutral-but-dimensioned placeholder so layout doesn't
 *     shift when the real status flips in.
 *   - useEffect sets the live status once on mount, then ticks every 60 s.
 *   - The interval is cleared on unmount; tab-throttling in browsers is fine here — when the
 *     tab returns to the foreground the next tick fires within the minute.
 *
 * Why import isOpenNow from lib/openNow.ts instead of lib/hours.ts: keeps the client bundle
 * from pulling in SSR-only formatters (hoursRows, hoursSummary, schemaOpeningHours, formatTime,
 * formatInterval). Tree-shaking would probably handle it, but explicit is cheaper than hopeful.
 */
export function OpenNowBadge({ hours, timezone }: Props) {
  // null = not yet evaluated on the client. Required so SSR markup matches the first client
  // render and React doesn't bail with a hydration mismatch warning.
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOpen(isOpenNow(hours, timezone));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [hours, timezone]);

  // Pre-hydration placeholder. Same outer shape as the rendered badge so there is no layout
  // shift when the real value resolves. Text is invisible (text-transparent) and the dot is
  // transparent; aria-hidden so screen readers skip it until the real status arrives.
  if (open === null) {
    return (
      <span
        aria-hidden
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-transparent select-none"
      >
        <span className="h-2 w-2 rounded-full bg-transparent" />
        Currently closed
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        open
          ? "bg-brand-bamboo-50 text-brand-bamboo-700"
          : "bg-ink/5 text-ink-muted"
      }`}
    >
      <span
        aria-hidden
        className={`h-2 w-2 rounded-full ${open ? "bg-brand-bamboo" : "bg-ink-muted"}`}
      />
      {open ? "Open now" : "Currently closed"}
    </span>
  );
}
