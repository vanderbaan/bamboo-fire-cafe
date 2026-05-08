import type { MetadataRoute } from "next";
import { restaurant } from "@/content/restaurant";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${restaurant.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
