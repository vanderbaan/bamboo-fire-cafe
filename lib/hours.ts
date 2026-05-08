import type { Hours, OpenInterval, WeekdayKey } from "@/types/content";

const ORDER: ReadonlyArray<WeekdayKey> = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

const LABELS: Record<WeekdayKey, { short: string; long: string }> = {
  sun: { short: "Sun", long: "Sunday" },
  mon: { short: "Mon", long: "Monday" },
  tue: { short: "Tue", long: "Tuesday" },
  wed: { short: "Wed", long: "Wednesday" },
  thu: { short: "Thu", long: "Thursday" },
  fri: { short: "Fri", long: "Friday" },
  sat: { short: "Sat", long: "Saturday" },
};

/** Format a 24h "HH:mm" string as "5:00 PM". */
export function formatTime(t: string | null): string {
  if (!t) return "";
  const [hRaw, m] = t.split(":");
  const h = Number(hRaw);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return m === "00" ? `${h12} ${ampm}` : `${h12}:${m} ${ampm}`;
}

/** Format an interval as "5 PM – 10 PM" or "Closed". */
export function formatInterval(iv: OpenInterval): string {
  if (!iv.open || !iv.close) return "Closed";
  return `${formatTime(iv.open)} – ${formatTime(iv.close)}`;
}

export interface HoursRow {
  key: WeekdayKey;
  short: string;
  long: string;
  display: string;
  isClosed: boolean;
}

/** Materialize Hours as a sorted array starting Sunday. */
export function hoursRows(h: Hours): HoursRow[] {
  return ORDER.map((key) => {
    const iv = h[key];
    return {
      key,
      short: LABELS[key].short,
      long: LABELS[key].long,
      display: formatInterval(iv),
      isClosed: !iv.open || !iv.close,
    };
  });
}

/** Group consecutive identical-hours days into a compact summary array.
 *  Example: [{label: "Wed–Thu", display: "5 PM – 10 PM"}, …] */
export function hoursSummary(h: Hours): { label: string; display: string }[] {
  const rows = hoursRows(h);
  const groups: { label: string; display: string }[] = [];
  let i = 0;
  while (i < rows.length) {
    let j = i;
    while (
      j + 1 < rows.length &&
      rows[j + 1].display === rows[i].display
    ) {
      j += 1;
    }
    const label =
      i === j
        ? rows[i].short
        : `${rows[i].short}–${rows[j].short}`;
    groups.push({ label, display: rows[i].display });
    i = j + 1;
  }
  return groups;
}

/**
 * Schema.org `openingHours` strings. Excludes closed days.
 * Format example: "Mo 17:00-22:00".
 */
export function schemaOpeningHours(h: Hours): string[] {
  const map: Record<WeekdayKey, string> = {
    sun: "Su",
    mon: "Mo",
    tue: "Tu",
    wed: "We",
    thu: "Th",
    fri: "Fr",
    sat: "Sa",
  };
  const out: string[] = [];
  for (const key of ORDER) {
    const iv = h[key];
    if (iv.open && iv.close) out.push(`${map[key]} ${iv.open}-${iv.close}`);
  }
  return out;
}

// `isOpenNow` lives in lib/openNow.ts so the client bundle imported by OpenNowBadge.tsx
// does not have to pull in any of the SSR-only formatters above. Re-export here for any
// future server-side caller (currently none) without forcing the client bundle to swallow
// this whole file.
export { isOpenNow } from "./openNow";
