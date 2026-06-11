"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/content/brand";

/**
 * Login form — client component. Lives in its own file (rather than inline in the page)
 * because it uses useSearchParams() to read the `?next=` redirect target; Next 14 requires
 * any component that calls useSearchParams to be wrapped in a Suspense boundary, and the
 * page-level Suspense in `app/admin/login/page.tsx` enforces that.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push(nextPath);
        return;
      }
      // Generic message — no info leakage. Server already enforces a 200 ms delay.
      setError("Incorrect password");
    } catch {
      setError("Network error — try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-warm px-6 py-12">
      <Link href="/" aria-label="Bamboo Fire Cafe home" className="mb-10">
        <Image
          src={brand.logoSrc}
          alt={brand.logoAlt}
          width={brand.logoWidth}
          height={brand.logoHeight}
          priority
          sizes="240px"
          className="h-auto w-[200px] md:w-[240px]"
        />
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-card border border-ink/10 bg-surface p-6 shadow-card"
      >
        <h1 className="font-serif text-2xl text-ink">Daily Specials</h1>
        <p className="mt-1 text-sm text-ink-muted">Sign in to manage today&rsquo;s special.</p>

        <label className="mt-6 block text-sm font-medium text-ink" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-md border border-ink/15 bg-white px-4 py-3 text-base placeholder:text-ink-muted focus:border-brand-bamboo focus:outline-none focus:ring-2 focus:ring-brand-bamboo/30"
        />

        {error && (
          <p className="mt-3 text-sm text-brand-fire-700" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || password.length === 0}
          // min-h enforces the 56 px tap target from the spec
          className="mt-6 inline-flex min-h-[56px] w-full items-center justify-center rounded-md bg-brand-fire px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-brand-fire-600 active:bg-brand-fire-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
