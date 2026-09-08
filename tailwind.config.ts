import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Chrome tokens (header/body/background) are CSS custom properties so
        // partner mode can retheme them site-wide from one place: see
        // globals.css `:root` (default look) and `[data-partner]` (MPL look).
        cream: "var(--color-cream)",
        ink: "var(--color-ink)",
        "ink-deep": "var(--color-ink-deep)",
        "cat-education": "#4a7fcf",
        "cat-health": "#3aab7c",
        "cat-food": "#e07c45",
        "cat-enrichment": "#9b59b6",
        "cat-technology": "#2980b9",
        "cat-identity": "#c0397b",
        "serve-online": "#3aab7c",
        "serve-inperson": "#e07c45",
        "serve-navigator": "#9b59b6",
        "group-all": "#2d2b52",
        "band-sand": "#eee9e0",
        "band-demo": "#f0ece0",
        "line-sand": "#e8e2da",
        "coral": "#f4645f",
        // Partner accents (2026-09-07, retuned 2026-09-08 from the Library's own
        // site — see docs/MPL-ASSETS.md and globals.css for sourcing). Off partner
        // mode these resolve to the original placeholder teal so the default guide
        // is unchanged; see globals.css for the values used in each mode.
        partner: "var(--color-partner)",
        "partner-accent": "var(--color-partner-accent)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        // Display face for large/hero headings only. Falls back to --font-sans
        // (and its own system fallbacks) when no partner font is loaded.
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Card/chip radius as tokens: square-ish under the Library's flatter
        // button convention, the guide's own rounder default otherwise.
        card: "var(--radius-card)",
        chip: "var(--radius-chip)",
        button: "var(--radius-button)",
      },
    },
  },
  plugins: [],
};

export default config;
