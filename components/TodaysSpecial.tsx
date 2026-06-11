import Image from "next/image";
import { dayOfWeekName, todayInNY } from "@/lib/admin/dates";
import { getDay } from "@/lib/admin/kv";
import { defaultPhotoAlt } from "@/lib/admin/shareText";
import type { DayRecord } from "@/lib/admin/types";

/**
 * Homepage "Today's Special" card. Server component — reads KV directly so it's part of
 * the home page's static-after-revalidation cache and refreshes automatically when the
 * admin edits today's record (the day POST/DELETE routes call revalidatePath("/")).
 *
 * Renders nothing when:
 *   • No record for today, OR
 *   • record.active === false, OR
 *   • record has no items.
 *
 * KV not provisioned (e.g. local dev without env vars): silently render nothing. Surface
 * shouldn't 500 the homepage just because the admin layer isn't configured.
 */
export async function TodaysSpecial() {
  let record: DayRecord | null = null;
  try {
    record = await getDay(todayInNY());
  } catch {
    return null;
  }
  if (!record || !record.active || record.items.length === 0) return null;

  const dayName = dayOfWeekName(record.date);
  const alt = record.photo?.alt ?? defaultPhotoAlt(record.items);

  return (
    <section
      aria-labelledby="todays-special-heading"
      className="bg-surface py-10 md:py-14"
    >
      <div className="container">
        <article className="mx-auto max-w-2xl overflow-hidden rounded-card border-t-2 border-brand-fire bg-brand-fire-50/40 p-6 shadow-card md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-fire-700">
            🌶️ Today&rsquo;s Special — {dayName}
          </p>

          {record.photo && (
            <div className="mt-4 overflow-hidden rounded-lg">
              {/* <picture> so the browser picks WebP when supported, otherwise JPG. */}
              <picture>
                <source srcSet={record.photo.webpUrl} type="image/webp" />
                <Image
                  src={record.photo.jpgUrl}
                  alt={alt}
                  width={record.photo.width || 1200}
                  height={record.photo.height || 900}
                  className="max-h-80 w-full object-cover"
                  sizes="(min-width: 768px) 640px, 100vw"
                  priority
                />
              </picture>
            </div>
          )}

          <h2
            id="todays-special-heading"
            className="mt-4 font-serif text-2xl text-ink md:text-3xl"
          >
            {dayName === "Sunday" ||
            dayName === "Monday" ||
            dayName === "Tuesday" ||
            dayName === "Wednesday" ||
            dayName === "Thursday" ||
            dayName === "Friday" ||
            dayName === "Saturday"
              ? `${dayName} at Bamboo Fire`
              : "Today at Bamboo Fire"}
          </h2>

          <ul className="mt-5 space-y-2">
            {record.items.map((item, i) => (
              <li
                key={`${item.name}-${i}`}
                className="flex items-baseline justify-between gap-3 border-b border-ink/10 pb-2 last:border-0"
              >
                <span
                  className={`font-serif text-lg ${
                    item.soldOut ? "text-ink-muted line-through" : "text-ink"
                  }`}
                >
                  {item.name}
                </span>
                <span className="flex shrink-0 items-baseline gap-2">
                  <span className="font-semibold tabular-nums text-brand-fire-700">
                    {item.price}
                  </span>
                  {item.soldOut && (
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-ink-muted">
                      Sold out
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {record.description && (
            <p className="mt-4 italic text-ink-muted">{record.description}</p>
          )}
        </article>
      </div>
    </section>
  );
}
