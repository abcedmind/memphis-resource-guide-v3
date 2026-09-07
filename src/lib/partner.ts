/**
 * Partner mode — the Memphis Public Library edition (added 2026-09-07).
 *
 * Three modes, chosen at build time by NEXT_PUBLIC_PARTNER:
 *   "mpl-proposed"  (default)  the site says "Designed for the Memphis Public Library".
 *                              This is a statement about the design, not about an agreement.
 *   "mpl"                      the site says "A Memphis Public Library resource". Set this
 *                              ONLY after the Library has agreed in writing.
 *   "off"                      no partner line anywhere.
 *
 * The rule behind the wording: a public page must not assert an agreement that does not
 * exist. Flipping to "mpl" is a one-line environment change on Vercel once it does.
 *
 * The logo slot renders only if /partner/mpl-logo.svg exists in public/ (the Library's own
 * file, supplied by the Library). Nothing here invents the Library's brand.
 */
export type PartnerMode = "off" | "mpl-proposed" | "mpl";

const raw = process.env.NEXT_PUBLIC_PARTNER;
export const PARTNER_MODE: PartnerMode =
  raw === "mpl" ? "mpl" : raw === "off" ? "off" : "mpl-proposed";

export const PARTNER = {
  mode: PARTNER_MODE,
  name: "Memphis Public Library",
  url: "https://www.memphislibrary.org/",
  cardUrl: "https://www.memphislibrary.org/start-here/",
  passUrl: "https://www.memphislibrary.org/901-pass-library-card/",
  logo: "/partner/mpl-logo.svg",
} as const;

export const partnerOn = PARTNER_MODE !== "off";
export const partnerAgreed = PARTNER_MODE === "mpl";
