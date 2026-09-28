import type { CategoryId, ServeType } from "./types";

/**
 * Category colors are text colors, shown on a light tint of themselves.
 * They match the `cat-*` tokens in tailwind.config.ts and all pass WCAG AA.
 */
export const CAT: Record<CategoryId, { label: string; color: string; tint: string }> = {
  education: { label: "Education", color: "#255a94", tint: "#ebf0f5" },
  health: { label: "Health", color: "#1e6a47", tint: "#ebf2ee" },
  food: { label: "Food", color: "#8a4710", tint: "#f4eee9" },
  enrichment: { label: "Enrichment", color: "#673d8c", tint: "#f1eef5" },
  technology: { label: "Technology", color: "#0f5f6d", tint: "#e9f1f2" },
  identity: { label: "Identity & advocacy", color: "#9a2b58", tint: "#f6ecf0" },
};

export const SERVE_BADGE: Record<ServeType, { label: string }> = {
  online: { label: "Self-serve online" },
  inperson: { label: "In person" },
  navigator: { label: "Navigator helps" },
};
