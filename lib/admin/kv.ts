import { kv } from "@vercel/kv";
import { addDaysNY, weekDates } from "./dates";
import type { DayRecord, WeekSlice } from "./types";

/**
 * Thin Vercel KV layer for the daily specials schedule. One key per day so reads of a
 * single day are O(1) and writes don't have to RMW a big blob. The week-slice helper
 * issues 7 reads in parallel — fine on KV's free tier (rate limits are per-month, not
 * per-second).
 *
 * Key shape: `specials-schedule:{YYYY-MM-DD}` — date in America/New_York calendar terms.
 *
 * The kv client picks up `KV_REST_API_URL` + `KV_REST_API_TOKEN` automatically from env.
 * Locally without those env vars, every call will throw at runtime — that's intentional;
 * we don't want to silently no-op in production.
 */

const KEY_PREFIX = "specials-schedule";

function key(dateStr: string): string {
  return `${KEY_PREFIX}:${dateStr}`;
}

export async function getDay(dateStr: string): Promise<DayRecord | null> {
  const record = await kv.get<DayRecord>(key(dateStr));
  return record ?? null;
}

export async function setDay(record: DayRecord): Promise<void> {
  await kv.set(key(record.date), record);
}

export async function deleteDay(dateStr: string): Promise<void> {
  await kv.del(key(dateStr));
}

/**
 * Read the 7 days starting at `sunday`. Returns one entry per day, with `record: null`
 * when nothing is published for that day. Order matches `weekDates`: Sun → Sat.
 */
export async function getWeekSlice(sunday: string): Promise<WeekSlice> {
  const dates = weekDates(sunday);
  const records = await Promise.all(dates.map(getDay));
  return {
    weekStart: sunday,
    weekEnd: addDaysNY(sunday, 6),
    days: dates.map((date, i) => ({ date, record: records[i] ?? null })),
  };
}
