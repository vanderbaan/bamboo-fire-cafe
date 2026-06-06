import type { BrandIdentity } from "@/types/content";

/**
 * Brand bundle for Bamboo Fire Cafe. Hex values are duplicated here AND in tailwind.config.ts.
 * Tailwind classes are the canonical way to apply colors; these tokens are only for the rare
 * inline-style or JSON-LD case.
 *
 * Canonical hex was extracted from the master SVG — `fill="#69933a"` (BAMBOO) and
 * `fill="#d32e1b"` (FIRE). The brief's earlier approximations (#7CA943, #D43027) are superseded.
 *
 * Logo asset: switched to the watercolor PNG at /logo.png (1000×500, 2:1, transparent
 * background). The wordmark reads "BAMBOO FIRE Delray" — alt reflects that. Previous SVG
 * (3:1 ratio) stays at /logo.svg in /public for quick rollback if needed.
 */
export const brand: BrandIdentity = {
  logoSrc: "/logo.png",
  // 1000×500 (2:1). Render at responsive sizes via next/image; at the Nav's 220 px width
  // the logo computes to 110 px tall (was ~73 px under the prior 3:1 SVG).
  logoWidth: 1000,
  logoHeight: 500,
  logoAlt:
    "Bamboo Fire Delray watercolor logo — Caribbean & World Cuisine",
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
