import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { OrderDropdownProvider } from "@/contexts/OrderDropdownContext";
import { restaurant } from "@/content/restaurant";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "700"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${restaurant.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${restaurant.name} | ${restaurant.tagline} in ${restaurant.address.city}`,
    template: `%s | ${restaurant.name}`,
  },
  description:
    "Family-owned Caribbean restaurant in Delray Beach with deep Guyanese roots and a world-cuisine menu. Authentic jerk chicken, oxtail, curry goat, and rum cake. Open Wednesday through Sunday.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${restaurant.name} | ${restaurant.tagline}`,
    description:
      "Family-owned Caribbean restaurant in Delray Beach with deep Guyanese roots and a world-cuisine menu.",
    url: "/",
    siteName: restaurant.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${restaurant.name} | ${restaurant.tagline}`,
    description:
      "Family-owned Caribbean restaurant in Delray Beach with deep Guyanese roots and a world-cuisine menu.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Icon coverage:
  //   • app/icon.svg is auto-detected by Next.js — emits <link rel="icon" type="image/svg+xml">
  //     for modern browsers (preferred when supported because it scales without resampling).
  //   • /favicon.ico is found at the root by browser convention (no link tag strictly needed,
  //     but declared here so it shows up in the page-source audit).
  //   • Raster PNGs cover Android home-screen / PWA / iOS-add-to-home cases where the SVG
  //     isn't honored.
  // Generated from app/icon.svg via ImageMagick — regenerate (and bump favicon hash if a
  // CDN is caching) whenever the SVG changes.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: undefined, // PWA manifest comes online in Phase 4.5; icon-512 is ready when it does
  category: "Restaurant",
};

export const viewport: Viewport = {
  themeColor: "#fafaf7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        {/* OrderDropdownProvider lifts the dropdown's open state out of the Nav so the
            Hero "Order" CTA can open the same (sticky) dropdown instead of its own. Lives
            at the root so any future cross-tree consumer can also reach it. */}
        <OrderDropdownProvider>{children}</OrderDropdownProvider>
      </body>
    </html>
  );
}
