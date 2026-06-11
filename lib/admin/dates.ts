import { addDays, format } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

/**
 * America/New_York date helpers. Day boundaries are 00:00 ET regardless of where the
 * Vercel function runs from — the merchant works in their own timezone, period.
 *
 * Conventions throughout the admin:
 *   • Date strings are always `YYYY-MM-DD` in NY calendar terms.
 *   • Timestamps are ISO 8601 with explicit offset (formatInTimeZone "...XXX").
 *   • Week boundaries are Sunday → Saturday (matches Beverly's mental model — common
 *     in US contexts, including most paper calendars).
 */

export const NY_TZ = "America/New_York";

/** Today's date in NY-tz, formatted YYYY-MM-DD. */
export function todayInNY(now: Date = new Date()): string {
  return formatInTimeZone(now, NY_TZ, "yyyy-MM-dd");
}

/** Now, formatted ISO 8601 with NY offset. */
export function nowIsoNY(now: Date = new Date()): string {
  return formatInTimeZone(now, NY_TZ, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

/** Validate that a string is in YYYY-MM-DD shape and represents a real calendar date. */
export function isValidDateString(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

/** Resolve a YYYY-MM-DD date string to a Date object representing midnight NY-tz. */
export function dateAtMidnightNY(dateStr: string): Date {
  // Parse the calendar date and pin it to 00:00 in NY-tz.
  return fromZonedTime(`${dateStr}T00:00:00`, NY_TZ);
}

/** Compare two YYYY-MM-DD strings: -1 if a < b, 0 if equal, 1 if a > b. Pure string. */
export function compareDateStrings(a: string, b: string): -1 | 0 | 1 {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** Sunday-of-week for a given YYYY-MM-DD date (Sunday = start of week). */
export function sundayOfWeek(dateStr: string): string {
  const dt = dateAtMidnightNY(dateStr);
  const zoned = toZonedTime(dt, NY_TZ);
  const dayOfWeek = zoned.getDay(); // 0 = Sunday
  const sundayDate = addDays(zoned, -dayOfWeek);
  return format(sundayDate, "yyyy-MM-dd");
}

/** Saturday-of-week for a given YYYY-MM-DD date. */
export function saturdayOfWeek(dateStr: string): string {
  const sunday = sundayOfWeek(dateStr);
  return addDaysNY(sunday, 6);
}

/** Add `days` to a YYYY-MM-DD date string (NY-tz semantics). Negative ok. */
export function addDaysNY(dateStr: string, days: number): string {
  const dt = dateAtMidnightNY(dateStr);
  const zoned = toZonedTime(dt, NY_TZ);
  return format(addDays(zoned, days), "yyyy-MM-dd");
}

/** Array of 7 YYYY-MM-DD dates starting at `sunday`. */
export function weekDates(sunday: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDaysNY(sunday, i));
}

/** Human label for a date (e.g. "Wed · Jun 10"). */
export function shortDayLabel(dateStr: string): string {
  const dt = dateAtMidnightNY(dateStr);
  return formatInTimeZone(dt, NY_TZ, "EEE · MMM d");
}

/** Long label ("Wednesday · June 10, 2026"). */
export function longDayLabel(dateStr: string): string {
  const dt = dateAtMidnightNY(dateStr);
  return formatInTimeZone(dt, NY_TZ, "EEEE · MMMM d, yyyy");
}

/** "Wed" / "Friday" / etc. */
export function dayOfWeekName(
  dateStr: string,
  variant: "short" | "long" = "long"
): string {
  const dt = dateAtMidnightNY(dateStr);
  return formatInTimeZone(dt, NY_TZ, variant === "short" ? "EEE" : "EEEE");
}

/** "Jun 8–14, 2026" style label for a Sunday-of-week. */
export function weekRangeLabel(sunday: string): string {
  const saturday = addDaysNY(sunday, 6);
  const sundayDt = dateAtMidnightNY(sunday);
  const saturdayDt = dateAtMidnightNY(saturday);
  const sundayMonth = formatInTimeZone(sundayDt, NY_TZ, "MMM");
  const saturdayMonth = formatInTimeZone(saturdayDt, NY_TZ, "MMM");
  const sundayDay = formatInTimeZone(sundayDt, NY_TZ, "d");
  const saturdayDay = formatInTimeZone(saturdayDt, NY_TZ, "d");
  const year = formatInTimeZone(saturdayDt, NY_TZ, "yyyy");
  if (sundayMonth === saturdayMonth) {
    return `${sundayMonth} ${sundayDay}–${saturdayDay}, ${year}`;
  }
  return `${sundayMonth} ${sundayDay} – ${saturdayMonth} ${saturdayDay}, ${year}`;
}

/** Is `dateStr` in the past relative to today (in NY-tz)? Strict less-than. */
export function isPastDate(dateStr: string, now: Date = new Date()): boolean {
  return compareDateStrings(dateStr, todayInNY(now)) === -1;
}

/** Is `dateStr` today (in NY-tz)? */
export function isToday(dateStr: string, now: Date = new Date()): boolean {
  return dateStr === todayInNY(now);
}

/**
 * Relative-time label like "2 min ago", "yesterday at 3:14 PM", etc. Tuned for the
 * admin "last edited" line. Always rendered NY-side because that's what Beverly cares
 * about (and matches her clock).
 */
export function relativeTimeNY(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  if (diffMs < 0) return "just now";
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 6) return `${hr}h ago`;
  // 6 hours or more ago: show absolute clock time, also account for "yesterday" boundary
  const todayStr = todayInNY(now);
  const thenStr = formatInTimeZone(then, NY_TZ, "yyyy-MM-dd");
  const time = formatInTimeZone(then, NY_TZ, "h:mm a");
  if (thenStr === todayStr) return `today at ${time}`;
  if (thenStr === addDaysNY(todayStr, -1)) return `yesterday at ${time}`;
  return formatInTimeZone(then, NY_TZ, "MMM d 'at' h:mm a");
}
