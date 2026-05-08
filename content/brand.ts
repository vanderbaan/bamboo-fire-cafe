import type { BrandIdentity } from "@/types/content";

/**
 * Brand bundle for Bamboo Fire Cafe. Hex values are duplicated here AND in tailwind.config.ts.
 * Tailwind classes are the canonical way to apply colors; these tokens are only for the rare
 * inline-style or JSON-LD case.
 *
 * Canonical hex was extracted from the master SVG — `fill="#69933a"` (BAMBOO) and
 * `fill="#d32e1b"` (FIRE). The brief's earlier approximations (#7CA943, #D43027) are superseded.
 */
export const brand: BrandIdentity = {
  logoSrc: "/logo.svg",
  // Source SVG is 1500×500 in viewBox terms; we render at responsive sizes via next/image.
  logoWidth: 1500,
  logoHeight: 500,
  logoAlt: "Bamboo Fire Cafe — Caribbean & World Cuisine",
  colors: {
    bamboo: "#69933a",
    fire: "#d32e1b",
    script: "#0f0f0f",
    surface: "#ffffff",
    surfaceWarm: "#fafaf7",
    ink: "#1a1a1a",
    inkMuted: "#6b655e",
  },
};
