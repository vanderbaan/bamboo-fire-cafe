/**
 * Tenure helpers — keep every "how long has the restaurant been open" string consistent.
 *
 * `RestaurantContent.foundedYear` is the canonical source of truth. Hero subhead, hero info row,
 * and Story prose all derive from it via `yearsSince` (a number) or `fillTenure` (substitutes
 * a `{years}` placeholder in any string). If a merchant prefers a more poetic phrasing
 * ("nearly two decades"), put it directly in content; otherwise use a `{years}` template so
 * the prose updates automatically each calendar year.
 *
 * Caveat: under static export, this evaluates at build time. The site rebuilds on every
 * content change anyway, so the year-rollover lag is bounded by deploy cadence. Acceptable for
 * a marketing page; revisit if the numbers ever drift visibly stale.
 */
export function yearsSince(foundedYear: number, now: Date = new Date()): number {
  return Math.max(0, now.getFullYear() - foundedYear);
}

/** Replace every `{years}` token in `template` with `yearsSince(foundedYear)`. */
export function fillTenure(template: string, foundedYear: number, now?: Date): string {
  const years = String(yearsSince(foundedYear, now));
  return template.replace(/\{years\}/g, years);
}
