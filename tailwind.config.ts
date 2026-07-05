import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#faf7f2",
        ink: "#1a1a2e",
        "ink-deep": "#0f0f1f",
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
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
