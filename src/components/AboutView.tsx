"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

/** Dates on this page are facts about the guide, kept by hand. Update them when they change. */
const DATA_GATHERED = "June 2026";
const LAST_REVIEWED = "2026-09-28";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold leading-snug text-ink m-0">{title}</h2>
      <div className="mt-2 text-base leading-relaxed text-ink">{children}</div>
    </section>
  );
}

export default function AboutView() {
  const { t } = useLang();
  const a = t.about;
  return (
    <article className="max-w-page mx-auto px-4 pt-8 pb-4">
      <h1 className="text-3xl font-bold leading-tight tracking-[-0.01em] text-ink m-0">{a.title}</h1>
      <p className="text-sm text-muted mt-2 mb-0">
        {a.dataGathered} {DATA_GATHERED} · {a.lastReviewed} {LAST_REVIEWED}
      </p>

      <Section title={a.whatTitle}>
        <p className="m-0">{a.whatBody}</p>
      </Section>

      <Section title={a.whoTitle}>
        <p className="m-0">{a.whoBody}</p>
      </Section>

      <Section title={a.howTitle}>
        <p className="m-0">{a.howBody}</p>
      </Section>

      <Section title={a.suggestTitle}>
        <p className="m-0">
          {a.suggestBody}{" "}
          <Link href="/suggest" className="text-primary font-semibold underline underline-offset-2">
            {a.suggestLink}
          </Link>
          .
        </p>
      </Section>

      <Section title={a.sourcesTitle}>
        <p className="m-0">{a.sourcesBody}</p>
      </Section>

      <Section title={a.privacyTitle}>
        <p className="m-0">{a.privacyBody}</p>
      </Section>

      <Section title={a.notTitle}>
        <p className="m-0">{a.notBody}</p>
      </Section>

      <Section title={a.contactTitle}>
        <p className="m-0">{a.contactBody}</p>
      </Section>
    </article>
  );
}
