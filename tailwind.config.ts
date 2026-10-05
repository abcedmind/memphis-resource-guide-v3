import type { Config } from "tailwindcss";

/**
 * Tailwind reads the design tokens from `src/app/tokens.css` (2026-09-30):
 * three colours (ink, paper, accent) plus their mixes, one exception
 * (`signal`, errors only), one face, one spacing scale. No hex values live
 * here; change a colour in tokens.css and every page follows.
 *
 * `primary*`, `success*`, `error*`, `cream`, `line-sand`, `serve-online` and
 * `cat-*` are older names kept as aliases so no screen breaks.
 */
const v = (name: string) => `var(--${name})`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: v("ink"),
        paper: v("paper"),
        accent: v("accent"),
        canvas: v("canvas"),
        line: v("line"),
        "line-strong": v("line-strong"),
        muted: v("muted"),
        "accent-dark": v("accent-dark"),
        "accent-tint": v("accent-tint"),
        signal: v("signal"),
        "signal-tint": v("signal-tint"),
        // Aliases (older names).
        primary: v("accent"),
        "primary-dark": v("accent-dark"),
        "primary-tint": v("accent-tint"),
        success: v("accent"),
        "success-tint": v("accent-tint"),
        error: v("signal"),
        "error-tint": v("signal-tint"),
        cream: v("canvas"),
        "line-sand": v("line"),
        "serve-online": v("accent"),
        "cat-education": v("accent"),
        "cat-identity": v("signal"),
      },
      fontFamily: {
        sans: ["var(--face)"],
      },
      spacing: {
        s1: v("s1"),
        s2: v("s2"),
        s3: v("s3"),
        s4: v("s4"),
        s5: v("s5"),
        s6: v("s6"),
        s7: v("s7"),
        gutter: v("gutter"),
      },
      maxWidth: {
        page: v("col"),
      },
    },
  },
  plugins: [],
};

export default config;
