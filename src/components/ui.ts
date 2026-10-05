/**
 * Shared class strings for form controls and buttons, so every form on the
 * site uses one set of sizes. Inputs are 16px (no zoom-on-focus on iPhone)
 * and at least 44px tall (a comfortable tap target).
 */
export const inputCls =
  "block w-full h-11 border border-line-strong rounded px-3 text-base font-sans bg-paper text-ink placeholder:text-muted";
export const textareaCls =
  "block w-full min-h-[6rem] border border-line-strong rounded px-3 py-2.5 text-base font-sans bg-paper text-ink placeholder:text-muted";
export const labelCls = "block text-[0.9375rem] font-semibold text-ink mb-1.5";
export const fieldCls = "mb-5";
export const btnPrimary =
  "inline-flex items-center justify-center w-full h-12 rounded bg-primary text-white text-base font-semibold hover:bg-primary-dark disabled:bg-line-strong disabled:cursor-not-allowed";
export const btnSecondary =
  "inline-flex items-center justify-center w-full h-11 rounded border border-primary bg-paper text-primary text-base font-semibold hover:bg-primary-tint";
export const sectionTitleCls = "text-lg font-bold text-ink m-0";
