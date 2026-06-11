"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addDaysNY, sundayOfWeek, todayInNY, weekRangeLabel } from "@/lib/admin/dates";
import type { WeekSlice } from "@/lib/admin/types";
import { DayCard } from "./DayCard";
import { shareToFacebook } from "./FacebookShareButton";

const MAX_WEEKS_FORWARD = 4;
const MAX_WEEKS_BACKWARD = 4;

interface Props {
  initial: WeekSlice;
}

/** Week navigator. Server fetched `initial`; client fetches subsequent weeks via API. */
export function WeekView({ initial }: Props) {
  const router = useRouter();
  const [slice, setSlice] = useState<WeekSlice>(initial);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const todaySunday = sundayOfWeek(todayInNY());
  const weeksFromToday = weeksBetween(todaySunday, slice.weekStart);
  const canBack = weeksFromToday > -MAX_WEEKS_BACKWARD;
  const canFwd = weeksFromToday < MAX_WEEKS_FORWARD;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const navigateWeek = useCallback(
    async (newSunday: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/schedule?weekOf=${newSunday}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as WeekSlice;
        setSlice(data);
      } catch {
        showToast("Couldn't load week — check your connection");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const isEmptyWeek = slice.days.every((d) => d.record === null);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink md:text-3xl">
            Bamboo Fire — Daily Specials
          </h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-ink-muted underline-offset-4 hover:underline"
        >
          Sign out
        </button>
      </header>

      <nav
        aria-label="Week navigation"
        className="mt-6 flex items-center justify-between gap-3 rounded-card bg-surface p-3 shadow-sm"
      >
        <button
          type="button"
          disabled={!canBack || loading}
          onClick={() => navigateWeek(addDaysNY(slice.weekStart, -7))}
          aria-label="Previous week"
          className="inline-flex min-h-[44px] items-center gap-1 px-3 py-2 text-sm font-medium text-ink disabled:opacity-40"
        >
          ← Last week
        </button>
        <span className="text-sm font-medium text-ink">
          Week of {weekRangeLabel(slice.weekStart)}
        </span>
        <button
          type="button"
          disabled={!canFwd || loading}
          onClick={() => navigateWeek(addDaysNY(slice.weekStart, 7))}
          aria-label="Next week"
          className="inline-flex min-h-[44px] items-center gap-1 px-3 py-2 text-sm font-medium text-ink disabled:opacity-40"
        >
          Next week →
        </button>
      </nav>

      {isEmptyWeek && (
        <p className="mt-6 rounded-card border border-dashed border-ink/15 bg-surface-warm p-6 text-center text-sm text-ink-muted">
          No specials this week. Tap any day below to add one.
        </p>
      )}

      <section className="mt-6 space-y-3">
        {slice.days.map(({ date, record }) => (
          <DayCard
            key={date}
            date={date}
            record={record}
            onShare={(rec) => shareToFacebook(rec, showToast)}
          />
        ))}
      </section>

      <p className="mt-8 text-center text-xs text-ink-muted">
        <Link href="/" className="hover:underline">
          ← Back to bamboofiredelray.com
        </Link>
      </p>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
        >
          <div className="rounded-full bg-ink px-4 py-2 text-sm text-surface shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </main>
  );
}

function weeksBetween(a: string, b: string): number {
  // a, b are Sunday-of-week. Return how many weeks from a to b (b - a).
  const days = Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.round(days / 7);
}
