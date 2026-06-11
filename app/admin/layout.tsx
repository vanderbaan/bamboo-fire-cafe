import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Admin shell. Kept minimal because each page does its own chrome — the login screen
 * doesn't want the same chrome as the week view. Metadata sets noindex so search
 * engines never index the admin surface even if it leaks past the auth gate (defense
 * in depth — not a substitute for auth).
 */

export const metadata: Metadata = {
  title: { absolute: "Admin — Bamboo Fire" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-surface-warm">{children}</div>;
}
