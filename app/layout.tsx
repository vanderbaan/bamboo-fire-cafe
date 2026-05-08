import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
      <body>{children}</body>
    </html>
  );
}
