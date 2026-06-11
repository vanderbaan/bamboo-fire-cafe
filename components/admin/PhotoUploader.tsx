"use client";

import { useState } from "react";
import Image from "next/image";
import type { SpecialPhoto } from "@/lib/admin/types";

interface Props {
  value: SpecialPhoto | null;
  onChange: (next: SpecialPhoto | null) => void;
  /** Auto-generated alt text shown as placeholder. */
  altPlaceholder: string;
}

/**
 * Photo upload + preview. Holds its own upload-error state so a failed upload doesn't
 * lose the rest of the form. On success, hands the new SpecialPhoto up to the parent.
 *
 * Optional alt-text input: empty → null (caller defaults to auto-gen at render time).
 */
export function PhotoUploader({ value, onChange, altPlaceholder }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload-photo", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "Upload failed");
      }
      const data = (await res.json()) as {
        jpgUrl: string;
        webpUrl: string;
        width: number;
        height: number;
      };
      onChange({
        jpgUrl: data.jpgUrl,
        webpUrl: data.webpUrl,
        alt: value?.alt ?? null,
        width: data.width,
        height: data.height,
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Couldn't upload — try again or use a smaller photo"
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-ink">Photo</label>
        <div className="mt-2 flex flex-wrap items-start gap-3">
          {value && (
            <div className="overflow-hidden rounded-lg border border-ink/10">
              <Image
                src={value.jpgUrl}
                alt="Special preview"
                width={value.width || 160}
                height={value.height || 120}
                className="h-20 w-28 object-cover"
              />
            </div>
          )}

          <label className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-warm">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
              disabled={uploading}
            />
            {uploading
              ? "Uploading…"
              : value
                ? "Replace photo"
                : "Add photo"}
          </label>

          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-ink/15 px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-warm"
            >
              × Remove
            </button>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-brand-fire-700" role="alert">
            {error}
          </p>
        )}
      </div>

      {value && (
        <div>
          <label
            className="block text-sm font-medium text-ink"
            htmlFor="photo-alt"
          >
            Alt text <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="photo-alt"
            type="text"
            value={value.alt ?? ""}
            placeholder={altPlaceholder}
            onChange={(e) =>
              onChange({
                ...value,
                alt: e.target.value.trim().length === 0 ? null : e.target.value,
              })
            }
            className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-base placeholder:text-ink-muted focus:border-brand-bamboo focus:outline-none focus:ring-2 focus:ring-brand-bamboo/30"
          />
        </div>
      )}
    </div>
  );
}
