"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dayOfWeekName, isPastDate, longDayLabel, relativeTimeNY } from "@/lib/admin/dates";
import { defaultPhotoAlt } from "@/lib/admin/shareText";
import type { DayRecord, SpecialItem, SpecialPhoto, UpsertDayBody } from "@/lib/admin/types";
import { PhotoUploader } from "./PhotoUploader";
import { shareToFacebook } from "./FacebookShareButton";

const MAX_ITEMS = 4;
const AUTOSAVE_DEBOUNCE_MS = 500;

interface Props {
  date: string;
  initial: DayRecord | null;
}

interface FormState {
  items: SpecialItem[];
  description: string;
  photo: SpecialPhoto | null;
  active: boolean;
}

function emptyForm(): FormState {
  return {
    items: [{ name: "", price: "", soldOut: false }],
    description: "",
    photo: null,
    active: true,
  };
}

function recordToForm(r: DayRecord): FormState {
  return {
    items: r.items.length > 0 ? r.items : [{ name: "", price: "", soldOut: false }],
    description: r.description ?? "",
    photo: r.photo,
    active: r.active,
  };
}

function draftKey(date: string): string {
  return `admin-draft-${date}`;
}

interface DraftBlob {
  form: FormState;
  savedAt: string; // ISO
}

export function DayEditor({ date, initial }: Props) {
  const router = useRouter();
  const past = isPastDate(date);
  const dayName = dayOfWeekName(date); // "Friday"
  const longLabel = longDayLabel(date);
  const dayShort = dayOfWeekName(date, "short");

  const [form, setForm] = useState<FormState>(
    () => (initial ? recordToForm(initial) : emptyForm())
  );
  const [savedAt, setSavedAt] = useState<string | null>(
    initial?.updatedAt ?? null
  );
  const [savedBy, setSavedBy] = useState<DayRecord["updatedBy"] | null>(
    initial?.updatedBy ?? null
  );
  const [draftBanner, setDraftBanner] = useState<{
    savedAt: string;
    form: FormState;
  } | null>(null);
  const [showOptional, setShowOptional] = useState(
    !!initial?.description || !!initial?.photo
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; tone: "ok" | "err" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Draft restore on mount: if a draft exists in localStorage and is newer than the
  // server record, show the banner offering Discard / Keep.
  useEffect(() => {
    if (past) return; // no editing on past days, no drafts
    try {
      const raw = localStorage.getItem(draftKey(date));
      if (!raw) return;
      const parsed = JSON.parse(raw) as DraftBlob;
      const serverSavedAt = initial?.updatedAt;
      if (
        parsed.savedAt &&
        (!serverSavedAt || parsed.savedAt > serverSavedAt)
      ) {
        setDraftBanner({ savedAt: parsed.savedAt, form: parsed.form });
      }
    } catch {
      // Corrupt draft — ignore.
    }
  }, [date, initial, past]);

  // Autosave to localStorage on every form change, debounced.
  useEffect(() => {
    if (past) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      try {
        const blob: DraftBlob = { form, savedAt: new Date().toISOString() };
        localStorage.setItem(draftKey(date), JSON.stringify(blob));
      } catch {
        // Quota or private mode — ignore.
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [form, date, past]);

  const showToast = useCallback((msg: string, tone: "ok" | "err" = "ok") => {
    setToast({ msg, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function patchItem(idx: number, patch: Partial<SpecialItem>) {
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  }
  function addItem() {
    setForm((f) =>
      f.items.length >= MAX_ITEMS
        ? f
        : {
            ...f,
            items: [...f.items, { name: "", price: "", soldOut: false }],
          }
    );
  }
  function removeItem(idx: number) {
    setForm((f) => ({
      ...f,
      items: f.items.length > 1
        ? f.items.filter((_, i) => i !== idx)
        : f.items,
    }));
  }

  const altPlaceholder = defaultPhotoAlt(form.items);

  async function save(active: boolean) {
    if (past) return;
    const validItems = form.items.filter((i) => i.name.trim().length > 0);
    if (validItems.length === 0) {
      showToast("Add at least one item with a name", "err");
      return;
    }
    setSaving(true);
    try {
      const body: UpsertDayBody = {
        items: validItems.map((i) => ({
          name: i.name.trim(),
          price: i.price.trim(),
          soldOut: i.soldOut,
        })),
        description: form.description.trim().length > 0 ? form.description.trim() : null,
        photo: form.photo,
        active,
      };
      const res = await fetch(`/api/admin/day/${date}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = (await res.json()) as { ok: boolean; record: DayRecord };
      setSavedAt(data.record.updatedAt);
      setSavedBy(data.record.updatedBy);
      setForm(recordToForm(data.record));
      localStorage.removeItem(draftKey(date));
      showToast(active ? "Saved" : "Hidden");
    } catch {
      showToast(
        "Couldn't save — your changes are kept as a draft. Try again when you have signal.",
        "err"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (confirmText !== dayName) {
      showToast(`Type "${dayName}" to confirm`, "err");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/day/${date}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      localStorage.removeItem(draftKey(date));
      router.push("/admin");
    } catch {
      showToast("Couldn't delete — try again", "err");
      setSaving(false);
    }
  }

  const lastSavedRecord: DayRecord | null =
    savedAt && savedBy && initial
      ? { ...initial, ...form, date, updatedAt: savedAt, updatedBy: savedBy }
      : null;

  const isToday = !past && date === new Date().toISOString().slice(0, 10);
  const badge = past ? "Ended" : isToday ? "Today" : "Scheduled";

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/admin"
        className="text-sm text-ink-muted underline-offset-4 hover:underline"
      >
        ← Back to week
      </Link>
      <h1 className="mt-3 font-serif text-2xl text-ink md:text-3xl">{longLabel}</h1>
      <p className="mt-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-bamboo-700">
        {badge}
        {past && (
          <span className="text-ink-muted">· past day — view only</span>
        )}
      </p>

      {draftBanner && (
        <div className="mt-4 rounded-card border border-brand-bamboo/30 bg-brand-bamboo-50/60 p-4 text-sm">
          <p>
            Draft restored from {relativeTimeNY(draftBanner.savedAt)}. Keep editing
            it, or discard.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setForm(draftBanner.form);
                setDraftBanner(null);
              }}
              className="inline-flex min-h-[40px] items-center justify-center rounded-md bg-brand-bamboo px-3 py-2 text-sm font-medium text-white"
            >
              Keep draft
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(draftKey(date));
                setDraftBanner(null);
              }}
              className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-ink/15 px-3 py-2 text-sm text-ink"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <fieldset
        disabled={past || saving}
        className="mt-6 space-y-6 disabled:opacity-70"
      >
        <div className="space-y-3">
          {form.items.map((item, i) => (
            <div
              key={i}
              className="rounded-card border border-ink/10 bg-surface p-3 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label
                    htmlFor={`item-name-${i}`}
                    className="block text-sm font-medium text-ink"
                  >
                    Item {i + 1}
                  </label>
                  <input
                    id={`item-name-${i}`}
                    type="text"
                    value={item.name}
                    autoFocus={i === 0 && !initial}
                    placeholder="Oxtail Mac"
                    onChange={(e) => patchItem(i, { name: e.target.value })}
                    className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-base placeholder:text-ink-muted focus:border-brand-bamboo focus:outline-none focus:ring-2 focus:ring-brand-bamboo/30"
                  />
                </div>
                <div className="sm:w-32">
                  <label
                    htmlFor={`item-price-${i}`}
                    className="block text-sm font-medium text-ink"
                  >
                    Price
                  </label>
                  <input
                    id={`item-price-${i}`}
                    type="text"
                    value={item.price}
                    placeholder="$28"
                    inputMode="decimal"
                    onChange={(e) => patchItem(i, { price: e.target.value })}
                    className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-base placeholder:text-ink-muted focus:border-brand-bamboo focus:outline-none focus:ring-2 focus:ring-brand-bamboo/30"
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    aria-label={`Mark ${item.name || `item ${i + 1}`} as sold out`}
                    checked={item.soldOut}
                    onChange={(e) =>
                      patchItem(i, { soldOut: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-ink/30 text-brand-fire focus:ring-brand-fire"
                  />
                  <span className="text-ink">Sold out</span>
                </label>
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    aria-label={`Remove item ${i + 1}`}
                    className="text-sm text-ink-muted underline-offset-4 hover:underline"
                  >
                    × Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          {form.items.length < MAX_ITEMS && (
            <button
              type="button"
              onClick={addItem}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md border border-dashed border-brand-bamboo/40 bg-brand-bamboo-50/40 px-4 py-2 text-sm font-medium text-brand-bamboo-700 transition-colors hover:bg-brand-bamboo-50"
            >
              + Add another item
            </button>
          )}
        </div>

        <div>
          {!showOptional ? (
            <button
              type="button"
              onClick={() => setShowOptional(true)}
              className="text-sm font-medium text-brand-bamboo-700 underline-offset-4 hover:underline"
            >
              + Add description or photo
            </button>
          ) : (
            <div className="space-y-4 rounded-card border border-ink/10 bg-surface p-3">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-ink"
                >
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  rows={2}
                  value={form.description}
                  placeholder="Made fresh today"
                  onChange={(e) => patch("description", e.target.value)}
                  className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-base placeholder:text-ink-muted focus:border-brand-bamboo focus:outline-none focus:ring-2 focus:ring-brand-bamboo/30"
                />
              </div>
              <PhotoUploader
                value={form.photo}
                onChange={(v) => patch("photo", v)}
                altPlaceholder={altPlaceholder}
              />
            </div>
          )}
        </div>
      </fieldset>

      {!past && (
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className="inline-flex min-h-[56px] w-full items-center justify-center rounded-md bg-brand-bamboo px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-bamboo-600 disabled:opacity-60"
          >
            {saving ? "Saving…" : `Save for ${dayShort}`}
          </button>
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="inline-flex min-h-[56px] w-full items-center justify-center rounded-md border border-ink/15 px-6 py-3 text-base font-medium text-ink transition hover:bg-surface-warm disabled:opacity-60"
          >
            Hide special
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            disabled={saving}
            className="inline-flex min-h-[56px] w-full items-center justify-center rounded-md border border-brand-fire/30 px-6 py-3 text-base font-medium text-brand-fire-700 transition hover:bg-brand-fire-50 disabled:opacity-60"
          >
            Delete day
          </button>
          {showConfirm && (
            <div className="rounded-card border border-brand-fire/30 bg-brand-fire-50/60 p-3 text-sm">
              <label htmlFor="confirm-day" className="block text-ink">
                Type <strong>{dayName}</strong> to confirm permanent deletion.
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  id="confirm-day"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={dayName}
                  className="min-w-0 flex-1 rounded-md border border-ink/15 bg-white px-3 py-2 text-base focus:border-brand-fire focus:outline-none focus:ring-2 focus:ring-brand-fire/30"
                />
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={confirmText !== dayName || saving}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-brand-fire px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {savedAt && lastSavedRecord && !past && (
        <div className="mt-6 space-y-3 rounded-card border border-brand-bamboo/30 bg-brand-bamboo-50/40 p-4">
          <p className="text-sm text-ink">
            Last saved {relativeTimeNY(savedAt)} by{" "}
            {savedBy === "beverly" ? "Beverly" : "Jan"}
          </p>
          <button
            type="button"
            onClick={() => shareToFacebook(lastSavedRecord, (msg) => showToast(msg))}
            className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-brand-fire px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-fire-600"
          >
            📤 Share to Facebook
          </button>
        </div>
      )}

      {toast && (
        <div
          role={toast.tone === "err" ? "alert" : "status"}
          aria-live="polite"
          className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
        >
          <div
            className={`max-w-md rounded-full px-4 py-2 text-sm shadow-lg ${
              toast.tone === "err"
                ? "bg-brand-fire text-white"
                : "bg-ink text-surface"
            }`}
          >
            {toast.msg}
          </div>
        </div>
      )}
    </main>
  );
}
