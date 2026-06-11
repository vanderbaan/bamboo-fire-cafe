import { NextResponse, type NextRequest } from "next/server";
import { isValidDateString, sundayOfWeek, todayInNY } from "@/lib/admin/dates";
import { getWeekSlice } from "@/lib/admin/kv";

/**
 * GET /api/admin/schedule?weekOf=YYYY-MM-DD
 *
 * Returns the 7-day slice (Sun → Sat) of the week containing `weekOf`. If no `weekOf`
 * provided, returns the current week (NY-tz). Records are null when no day is published.
 *
 * Auth: enforced by middleware before this handler runs.
 */
export async function GET(req: NextRequest) {
  const weekOfParam = req.nextUrl.searchParams.get("weekOf");
  const reference =
    weekOfParam && isValidDateString(weekOfParam) ? weekOfParam : todayInNY();
  const sunday = sundayOfWeek(reference);
  const slice = await getWeekSlice(sunday);
  return NextResponse.json(slice);
}

export const runtime = "nodejs";
