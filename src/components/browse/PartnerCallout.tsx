"use client";

import { PARTNER, partnerOn } from "@/lib/partner";
import { useLang } from "@/lib/i18n";

/**
 * "Start here: a library card." Shown at the top of Browse in partner mode. The card
 * is the one free thing that unlocks the most on this list (the Library's own programs,
 * computers, and the 901 Pass), so it goes first. Facts on this card come from the
 * guide's own Memphis Public Library entries in seed-data.ts, not from this file.
 */
export default function PartnerCallout() {
  const { t } = useLang();
  if (!partnerOn) return null;
  return (
    <aside
      aria-label={t.partner.calloutTitle}
      className="mx-4 mt-4 mb-1 rounded-card border-l-4 border-partner bg-white px-4 py-3"
    >
      <div className="font-display text-[10px] tracking-[0.15em] text-partner font-extrabold mb-1">
        {t.partner.calloutTitle}
      </div>
      <p className="text-[13px] leading-[1.5] text-ink m-0 mb-2">
        {t.partner.calloutBody}
      </p>
      <div className="flex flex-wrap gap-3 text-[12px]">
        {/* Two CTAs, two colors — mirrors the split on the Library's own
            header (maroon "My Account" / blue "Donate"): the card, like an
            account, gets the maroon; the 901 Pass gets the blue. */}
        <a
          href={PARTNER.cardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-partner font-bold underline"
        >
          {t.partner.calloutCard} →
        </a>
        <a
          href={PARTNER.passUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-partner-accent font-bold underline"
        >
          {t.partner.calloutPass} →
        </a>
      </div>
    </aside>
  );
}
