import { sundayOfWeek, todayInNY } from "@/lib/admin/dates";
import { getWeekSlice } from "@/lib/admin/kv";
import { WeekView } from "@/components/admin/WeekView";

export const dynamic = "force-dynamic";

/** /admin — week view. Server fetches the current week, client handles navigation. */
export default async function AdminHomePage() {
  const sunday = sundayOfWeek(todayInNY());
  const slice = await getWeekSlice(sunday);
  return <WeekView initial={slice} />;
}
