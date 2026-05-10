"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import type { Faq } from "@/types/content";

interface Props {
  faq: Faq;
}

/**
 * Single FAQ row. Lives in its own client component so the surrounding section can stay
 * server-rendered. State is local — each row toggles independently (multiple can be open at
 * the same time), which matches user expectation for FAQ accordions and keeps the markup
 * crawlable without JS (the answer is always in the DOM, just visually collapsed).
 *
 * Animation strategy: the answer is wrapped in a `grid` whose `grid-template-rows` animates
 * between `0fr` and `1fr` — the modern way to transition to/from `auto` height without
 * measuring with JS. The inner element uses `min-h-0 overflow-hidden` so the row clips
 * cleanly. Reduced-motion users get the snap behavior via the global stylesheet.
 *
 * a11y:
 *  • The question is a real <button> with `aria-expanded` and `aria-controls`.
 *  • The answer panel has the matching `id` and `role="region"` plus `aria-labelledby`.
 *  • `aria-hidden` on the panel when collapsed so screen readers skip it.
 */
export function FaqItem({ faq }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonId = `${panelId}-q`;

  return (
    <div className="border-b border-ink/10 last:border-0">
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={`flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium transition-colors md:py-6 md:text-lg ${
            open ? "text-brand-bamboo-700" : "text-ink hover:text-brand-bamboo-700"
          }`}
        >
          <span>{faq.q}</span>
          <Plus
            aria-hidden
            className={`h-5 w-5 shrink-0 transition-transform duration-300 ease-out ${
              open ? "rotate-45 text-brand-bamboo" : "text-ink-muted"
            }`}
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <p className="pb-6 pr-10 text-[0.95rem] leading-relaxed text-ink-muted md:text-base">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}
