import type { Config } from "tailwindcss";

/**
 * Lōcal restaurant template — brand tokens for Bamboo Fire Cafe.
 * The next merchant onboarding to Lōcal swaps this palette and the content/ files;
 * components consume tokens (bg-brand, text-brand-fire, …) and stay merchant-agnostic.
 *
 * Canonical hex values were extracted from the brand SVG fills.
 *  - bamboo:  #69933a  (BAMBOO wordmark)
 *  - fire:    #d32e1b  (FIRE wordmark)
 *  - script:  #000000  (Café script)
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Merchant brand tokens — change these to re-skin for the next merchant.
        brand: {
          DEFAULT: "#69933a",
          bamboo: "#69933a",
          "bamboo-50": "#f3f8ec",
          "bamboo-100": "#dcebc2",
          "bamboo-200": "#c1da94",
          "bamboo-600": "#5b8233",
          "bamboo-700": "#46662a",
          fire: "#d32e1b",
          "fire-50": "#fdecea",
          "fire-600": "#b3251a",
          "fire-700": "#8e1c14",
          script: "#0f0f0f",
        },
        surface: {
          DEFAULT: "#ffffff",
          warm: "#fafaf7",
          wood: "#d9c5a8",
        },
        ink: {
          DEFAULT: "#1a1a1a",
          muted: "#6b655e",
        },
      },
      fontFamily: {
        // Wired up via next/font in app/layout.tsx as CSS variables.
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      maxWidth: {
        prose: "65ch",
        "prose-wide": "75ch",
      },
      borderRadius: {
        card: "0.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 15, 15, 0.04), 0 4px 12px rgba(15, 15, 15, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
