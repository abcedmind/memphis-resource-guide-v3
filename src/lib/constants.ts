import type { CategoryId, ServeType } from "./types";

export const CAT: Record<CategoryId, { label: string; color: string }> = {
  education: { label: "EDUCATION", color: "#4a7fcf" },
  health: { label: "HEALTH", color: "#3aab7c" },
  food: { label: "FOOD", color: "#e07c45" },
  enrichment: { label: "ENRICHMENT", color: "#9b59b6" },
  technology: { label: "TECHNOLOGY", color: "#2980b9" },
  identity: { label: "IDENTITY & ADVOCACY", color: "#c0397b" },
};

export const SERVE_BADGE: Record<ServeType, { label: string; color: string }> =
  {
    online: { label: "Self-serve online", color: "#3aab7c" },
    inperson: { label: "In person", color: "#e07c45" },
    navigator: { label: "Navigator helps", color: "#9b59b6" },
  };

// ════════════════════════════════════════════════════════════
//  PIXEL ART CHARACTERS (8px wide, pixel size 5px) — 5 growth
//  stages, a signature element of the guide. Preserved from v2.
// ════════════════════════════════════════════════════════════
export const CHARS: { colors: Record<string, string>; rows: string[] }[] = [
  {
    colors: { H: "#8B4513", S: "#f5c5a3", C: "#89CFF0", L: "#b8e0f5" },
    rows: [
      "..HHHH..", ".SSSSSS.", ".SSSSSS.", ".SSSSSS.",
      "..CCCC..", "..CCCC..", "..LLLL..", "..LLLL..",
    ],
  },
  {
    colors: { H: "#5c3317", S: "#f5c5a3", C: "#FFB347", L: "#4466DD" },
    rows: [
      "..HHHH..", ".SSSSSS.", ".SSSSSS.", ".SSSSSS.", "...SS...",
      "..CCCC..", "..CCCC..", "..CCCC..", "..LLLL..", "..LLLL..", "..LLLL..",
    ],
  },
  {
    colors: { H: "#333", S: "#f5c5a3", C: "#5cb85c", L: "#2244BB" },
    rows: [
      "..HHHH..", ".SSSSSS.", ".SSSSSS.", ".SSSSSS.", "...SS...",
      ".CCCCCC.", ".CCCCCC.", ".CCCCCC.", ".CCCCCC.",
      "..LLLL..", "..LL.LL.", "..LL.LL.", "..LL.LL.",
    ],
  },
  {
    colors: { H: "#222", S: "#f5c5a3", C: "#CC6677", L: "#222" },
    rows: [
      ".HSSSSH.", ".SSSSSS.", ".SSSSSS.", ".SSSSSS.", "...SS...",
      ".CCCCCC.", ".CCCCCC.", ".CCCCCC.", ".CCCCCC.", ".CCCCCC.",
      "..LLLL..", "..LL.LL.", "..LL.LL.", "..LL.LL.", "..LL.LL.",
    ],
  },
  {
    colors: { H: "#111", S: "#f5c5a3", C: "#9999CC", L: "#222", G: "#FFD700" },
    rows: [
      "..GGGG..", "GGGGGGGG", "..HHHH..", ".SSSSSS.", ".SSSSSS.", ".SSSSSS.",
      "...SS...", ".CCCCCC.", ".CCCCCC.", ".CCCCCC.", ".CCCCCC.", ".CCCCCC.",
      "..LLLL..", "..LL.LL.", "..LL.LL.", "..LL.LL.", "..LL.LL.",
    ],
  },
];
