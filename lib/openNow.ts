import type { Hours, WeekdayKey } from "@/types/content";

const DAY_FROM_INTL: Record<string, WeekdayKey> = {
  Sun: "sun",
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
};

/**
 * Tz-aware "open now" check. Lives in its own file so the client bundle that imports it from
 * OpenNowBadge.tsx does not have to pull in the SSR-only formatters in lib/hours.ts.
 *
 * Note: doesn't currently handle past-midnight closes (close < open). None in current Bamboo
 * Fire data, but worth fixing if a merchant ever opens 5pm–2am.
 */
export function isOpenNow(h: Hours, timezone: string, now: Date = new Date()): boolean {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = fmt.formatToParts(now);
  const wkRaw = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hourRaw = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minRaw = parts.find((p) => p.type === "minute")?.value ?? "00";

  const today = DAY_FROM_INTL[wkRaw];
  if (!today) return false;
  const iv = h[today];
  if (!iv.open || !iv.close) return false;

  // Intl returns "24" at midnight in en-US hour12:false; normalize.
  const hh = hourRaw === "24" ? "00" : hourRaw;
  const nowMin = Number(hh) * 60 + Number(minRaw);
  const [oh, om] = iv.open.split(":").map(Number);
  const [ch, cm] = iv.close.split(":").map(Number);
  return nowMin >= oh * 60 + om && nowMin <= ch * 60 + cm;
}
