import { notFound } from "next/navigation";
import { isValidDateString } from "@/lib/admin/dates";
import { getDay } from "@/lib/admin/kv";
import { DayEditor } from "@/components/admin/DayEditor";

interface PageProps {
  params: { date: string };
}

export const dynamic = "force-dynamic";

export default async function AdminDayPage({ params }: PageProps) {
  if (!isValidDateString(params.date)) notFound();
  const record = await getDay(params.date);
  return <DayEditor date={params.date} initial={record} />;
}
