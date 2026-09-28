import type { Config } from "tailwindcss";

/**
 * Design tokens (2026-09-28). One restrained civic palette: near-black ink,
 * one blue for actions and links, neutral greys for structure. Every text
 * color below measures at least 4.5:1 against white and against `canvas`
 * (WCAG AA); `line-strong` is 3:1 for input borders. Category colors are
 * only ever used as text on their own light tint, never as fills.
 *
 * `cream`, `line-sand`, `cat-*` and `serve-online` keep their old names so
 * the admin screens pick up the new palette without a rewrite.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1b1f24",
        muted: "#545d68",
        line: "#d7dbe0",
        "line-strong": "#8a939e",
        canvas: "#f4f5f7",
        primary: "#1d5a8e",
        "primary-dark": "#153f63",
        "primary-tint": "#ebf1f7",
        success: "#1e6a47",
        "success-tint": "#ebf4ef",
        error: "#a3202a",
        "error-tint": "#fbeeef",
        // Category text colors (all AA on white and on their tint).
        "cat-education": "#255a94",
        "cat-health": "#1e6a47",
        "cat-food": "#8a4710",
        "cat-enrichment": "#673d8c",
        "cat-technology": "#0f5f6d",
        "cat-identity": "#9a2b58",
        // Legacy names used by the admin screens.
        cream: "#f4f5f7",
        "line-sand": "#d7dbe0",
        "serve-online": "#1e6a47",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      maxWidth: {
        page: "46rem",
      },
    },
  },
  plugins: [],
};

export default config;
