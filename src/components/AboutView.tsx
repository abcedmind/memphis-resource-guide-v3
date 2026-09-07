"use client";

import Link from "next/link";
import { PARTNER, partnerAgreed, partnerOn } from "@/lib/partner";
import { useLang } from "@/lib/i18n";

/** Dates on this page are facts about the guide, kept by hand. Update them when they change. */
const DATA_GATHERED = "June 2026";
const LAST_REVIEWED = "2026-09-07";

export default function AboutView() {
  const { t } = useLang();
  const a = t.about;
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-5">
      <h2 className="text-[11px] font-extrabold tracking-[0.12em] text-ink mb-1.5">{title}</h2>
      <div className="text-[13.5px] leading-[1.6] text-ink">{children}</div>
    </section>
  );
  return (
    <div className="px-4 pt-5 pb-10">
      <h1 className="text-[18px] font-extrabold text-ink mb-1">{a.title}</h1>
      <p className="text-[11px] text-[#777] mb-5">
        {a.dataGathered} {DATA_GATHERED} · {a.lastReviewed} {LAST_REVIEWED}
      </p>

      <Section title={a.whatTitle}>
        <p>{a.whatBody}</p>
      </Section>

      <Section title={a.whoTitle}>
        <p>{a.whoBody}</p>
      </Section>

      <Section title={a.howTitle}>
        <p>{a.howBody}</p>
      </Section>

      <Section title={a.suggestTitle}>
        <p>
          {a.suggestBody}{" "}
          <Link href="/suggest" className="underline font-bold">
            {a.suggestLink}
          </Link>
          .
        </p>
      </Section>

      <Section title={a.sourcesTitle}>
        <p>{a.sourcesBody}</p>
      </Section>

      {partnerOn && (
        <Section title={a.libraryTitle}>
          <p>{partnerAgreed ? a.libraryAgreed : a.libraryProposed}</p>
          <p className="mt-2">
            <a href={PARTNER.url} target="_blank" rel="noopener noreferrer" className="underline">
              {PARTNER.name}
            </a>
          </p>
        </Section>
      )}

      <Section title={a.privacyTitle}>
        <p>{a.privacyBody}</p>
      </Section>

      <Section title={a.notTitle}>
        <p>{a.notBody}</p>
      </Section>

      <Section title={a.contactTitle}>
        <p>{a.contactBody}</p>
      </Section>
    </div>
  );
}
