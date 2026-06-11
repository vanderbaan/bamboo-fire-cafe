import { NextResponse } from "next/server";
import { todayInNY } from "@/lib/admin/dates";
import { getDay } from "@/lib/admin/kv";
import type { PublicTodayResponse } from "@/lib/admin/types";

/**
 * GET /api/specials/today — public, no auth.
 *
 * Returns today's special when:
 *   • a record exists for today (NY-tz), AND
 *   • record.active === true, AND
 *   • at least one item is present.
 *
 * Returns null otherwise. Consumers (homepage TodaysSpecial) treat null as "render nothing."
 *
 * Cache: this route is intended to be fetched at request time. The homepage uses its
 * server component to fetch KV directly, but exposing the same data here lets curious
 * folks pull it (and gives us a stable contract for any future native app).
 */
export const runtime = "nodejs";

export async function GET() {
  const date = todayInNY();
  const record = await getDay(date);
  if (!record || !record.active || record.items.length === 0) {
    return NextResponse.json<PublicTodayResponse>(null);
  }
  return NextResponse.json<PublicTodayResponse>({
    date: record.date,
    items: record.items,
    description: record.description,
    photo: record.photo,
  });
}
