"use client";

import Link from "next/link";
import Image from "next/image";
import {
  isPastDate,
  isToday,
  relativeTimeNY,
  shortDayLabel,
} from "@/lib/admin/dates";
import type { DayRecord } from "@/lib/admin/types";

interface Props {
  date: string;
  record: DayRecord | null;
  /** Optional handler — when provided, the active-day "Share" button calls back. */
  onShare?: (record: DayRecord) => void;
}

/** Per-day card in the week view. Visual state derived from record + date. */
export function DayCard({ date, record, onShare }: Props) {
  const past = isPastDate(date);
  const today = isToday(date);
  const editHref = `/admin/day/${date}`;
  const hidden = record !== null && record.active === false;
  const hasItems = record !== null && record.items.length > 0;

  return (
    <article
      className={`rounded-card border border-ink/10 bg-surface p-4 shadow-sm ${
        past ? "opacity-70" : ""
      } ${today ? "ring-2 ring-brand-fire/40" : ""}`}
    >
      <header className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg text-ink">
          {shortDayLabel(date)}
          {today && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand-fire-50 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-brand-fire-700">
              🌶️ Today
            </span>
          )}
          {past && !today && (
            <span className="ml-2 text-xs font-normal text-ink-muted">Ended</span>
          )}
          {hidden && (
            <span className="ml-2 rounded-full bg-ink/5 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-ink-muted">
              Hidden
            </span>
          )}
        </h2>
      </header>

      {!hasItems && !past && (
        <Link
          href={editHref}
          className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center rounded-md border border-dashed border-brand-bamboo/40 bg-brand-bamboo-50/40 px-4 py-2 text-sm font-medium text-brand-bamboo-700 transition-colors hover:bg-brand-bamboo-50"
        >
          + Add special for {shortDayLabel(date).split(" · ")[0]}
        </Link>
      )}

      {!hasItems && past && (
        <p className="mt-3 text-sm text-ink-muted">No special posted.</p>
      )}

      {hasItems && record && (
        <>
          <ul className="mt-3 space-y-1.5 text-sm">
            {record.items.map((item, i) => (
              <li
                key={`${item.name}-${i}`}
                className="flex items-baseline justify-between gap-3"
              >
                <span
                  className={`flex-1 ${
                    item.soldOut ? "line-through text-ink-muted" : "text-ink"
                  }`}
                >
                  {item.name}
                </span>
                <span className="flex shrink-0 items-baseline gap-2 tabular-nums text-ink-muted">
                  {item.price}
                  {item.soldOut && (
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-ink-muted">
                      Sold out
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {record.photo && (
            <div className="mt-3 overflow-hidden rounded-lg">
              <Image
                src={record.photo.jpgUrl}
                alt={record.photo.alt ?? `Daily special on ${date}`}
                width={record.photo.width || 160}
                height={record.photo.height || 120}
                className="h-[60px] w-20 object-cover"
              />
            </div>
          )}

          <p className="mt-3 text-xs text-ink-muted">
            Last edited by {record.updatedBy === "beverly" ? "Beverly" : "Jan"},{" "}
            {relativeTimeNY(record.updatedAt)}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={editHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-warm"
            >
              {past ? "View" : "Edit"}
            </Link>
            {!past && onShare && (
              <button
                type="button"
                onClick={() => onShare(record)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-brand-bamboo px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-bamboo-600"
              >
                📤 Share to Facebook
              </button>
            )}
          </div>
        </>
      )}
    </article>
  );
}
