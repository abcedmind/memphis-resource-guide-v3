import type { CategoryId, ServeType } from "./types";

/**
 * Categories. Since 2026-09-30 they carry no colour of their own: every
 * category tag is ink on canvas (src/app/tokens.css), and the label does the work.
 */
export const CAT: Record<CategoryId, { label: string }> = {
  education: { label: "Education" },
  health: { label: "Health" },
  food: { label: "Food" },
  enrichment: { label: "Enrichment" },
  technology: { label: "Technology" },
  identity: { label: "Identity & advocacy" },
};

export const SERVE_BADGE: Record<ServeType, { label: string }> = {
  online: { label: "Self-serve online" },
  inperson: { label: "In person" },
  navigator: { label: "Navigator helps" },
};
