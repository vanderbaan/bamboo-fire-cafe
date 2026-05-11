"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mpqbkkna";

interface Props {
  /**
   * Tag sent to Formspree as the `source` field so we can filter submissions in the
   * dashboard as more forms come online. Defaults to "berbice-kitchen-waitlist".
   */
  source?: string;
}

/**
 * Email-capture form for the Berbice Kitchen waitlist (and any future waitlists — pass a
 * different `source` to segment them in the Formspree dashboard).
 *
 * Behavior:
 *   • idle    → input + button visible, ready for submission
 *   • loading → button disabled, label "Sending..."
 *   • success → form replaced by a confirmation card
 *   • error   → input row stays, error message renders below it
 *
 * The error message is placed OUTSIDE the input/button row so it doesn't become a third
 * flex-row item at sm+ breakpoints; the form element still wraps everything so the native
 * submit behavior (Enter key, validation) fires correctly.
 */
export function WaitlistForm({ source = "berbice-kitchen-waitlist" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card border border-brand-bamboo/30 bg-brand-bamboo/5 p-6 text-center">
        <p className="text-lg font-medium text-brand-bamboo-700">Thanks!</p>
        <p className="mt-2 text-ink-muted">
          Beverly will be in touch when Berbice Kitchen launches.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address for Berbice Kitchen waitlist"
          className="flex-1 rounded-md border border-ink/15 bg-white px-4 py-3 text-base placeholder:text-ink-muted focus:border-brand-bamboo focus:outline-none focus:ring-2 focus:ring-brand-bamboo/30"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-brand-fire px-6 py-3 font-medium text-white transition hover:bg-brand-fire-600 active:bg-brand-fire-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Notify Me"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-3 text-sm text-brand-fire-700" role="alert">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  );
}
