"use client";

import { CAT } from "@/lib/constants";
import { buildCoworkPayload, coworkReadyPrograms } from "@/lib/eligibility";
import { useLang } from "@/lib/i18n";
import type { FamilyPlan, FlatResource } from "@/lib/types";
import { displayUrl, ExternalIcon } from "@/components/browse/GroupBlock";
import { btnPrimary } from "@/components/ui";

const tag = "inline-flex items-center h-6 px-2 rounded text-[0.8125rem] leading-none whitespace-nowrap";

function Prog({ r }: { r: FlatResource }) {
  const { t } = useLang();
  const cat = CAT[r.cat];
  return (
    <li className="bg-white border border-line rounded-md px-4 py-3.5 print:break-inside-avoid print:border-0 print:border-b print:rounded-none print:px-0">
      <p className="text-base font-semibold leading-snug text-ink m-0">{r.name}</p>
      <div className="flex flex-wrap gap-1.5 mt-2 print:hidden">
        {cat && (
          <span className={tag} style={{ color: cat.color, background: cat.tint }}>
            {t.cat[r.cat] ?? cat.label}
          </span>
        )}
        {r.serve && (
          <span className={`${tag} border border-line text-muted`}>{t.serve[r.serve]}</span>
        )}
        {r.basicInfoOnly && (
          <span className={`${tag} border border-line text-muted`}>Cowork</span>
        )}
      </div>
      <p className="text-[0.9375rem] leading-normal text-ink mt-2.5 mb-0">
        <b>{t.browse.howToAccess}:</b> {r.how}
      </p>
      {r.url && (
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-[0.9375rem] font-semibold text-primary underline underline-offset-2 break-all"
        >
          <span className="print:hidden">
            {t.browse.registerLearnMore}
            <ExternalIcon />
          </span>
          <span className="hidden print:inline">{displayUrl(r.url)}</span>
        </a>
      )}
    </li>
  );
}

export default function PlanView({
  plan,
  parent,
  optIn,
  saveState,
  onBack,
}: {
  plan: FamilyPlan;
  parent: string;
  optIn: boolean;
  saveState: "idle" | "saving" | "saved" | "error";
  onBack: () => void;
}) {
  const { t } = useLang();
  const coworkReady = coworkReadyPrograms(plan);

  const exportCowork = () => {
    const payload = buildCoworkPayload(plan, new Date().toISOString());
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "memphis-family-registration-plan.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const sectionHead =
    "text-[0.9375rem] font-bold tracking-[0.04em] uppercase text-ink border-b-2 border-ink pb-2 m-0";

  return (
    <div className="max-w-page mx-auto px-4 pt-6 pb-4">
      {/* Print-only letterhead: turns the browser's Save-as-PDF into a
          clean, shareable document a navigator can hand to a family. */}
      <div className="hidden print:block border-b-2 border-ink pb-3 mb-4">
        <div className="text-sm font-bold">{t.plan.printedFrom}</div>
        <div className="text-xs text-muted mt-1">
          {t.plan.printedOn}:{" "}
          {new Date().toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="text-[0.9375rem] font-semibold text-primary underline underline-offset-2 mb-4 print:hidden"
      >
        ← {t.plan.editAnswers}
      </button>
      <h1 className="text-3xl font-bold leading-tight tracking-[-0.01em] text-ink m-0">
        {parent
          ? t.plan.familyPlanOf.replace("{name}", parent)
          : t.plan.yourFamilyPlan}
      </h1>
      <p className="text-base leading-relaxed text-muted mt-2 mb-0 print:hidden">
        {t.plan.subtitle}
      </p>
      {optIn && saveState === "saved" && (
        <p className="mt-3 mb-0 rounded bg-success-tint px-3 py-2 text-[0.9375rem] text-success print:hidden">
          {t.plan.saved}
        </p>
      )}
      {optIn && saveState === "saving" && (
        <p className="mt-3 mb-0 text-[0.9375rem] text-muted print:hidden">{t.plan.saving}</p>
      )}
      {optIn && saveState === "error" && (
        <p
          className="mt-3 mb-0 rounded bg-error-tint px-3 py-2 text-[0.9375rem] text-error print:hidden"
          role="alert"
        >
          {t.plan.saveError}
        </p>
      )}

      {/* ── Per-child plans ── */}
      {plan.childPlans.map((cp, i) => (
        <section key={i} className="mt-8">
          <h2 className={sectionHead}>
            {cp.child.name ? cp.child.name : `${t.plan.child} ${i + 1}`} · {t.plan.age}{" "}
            {cp.child.age}
          </h2>
          {cp.programs.length ? (
            <ul className="list-none p-0 m-0 mt-3 flex flex-col gap-2">
              {cp.programs.map((r) => (
                <Prog key={r.id} r={r} />
              ))}
            </ul>
          ) : (
            <p className="text-[0.9375rem] text-muted mt-3 mb-0">{t.plan.seeFamilyWide}</p>
          )}
        </section>
      ))}

      {/* ── Family-wide ── */}
      <section className="mt-8">
        <h2 className={sectionHead}>{t.plan.familyWideTitle}</h2>
        <ul className="list-none p-0 m-0 mt-3 flex flex-col gap-2">
          {plan.family.map((r) => (
            <Prog key={r.id} r={r} />
          ))}
        </ul>
      </section>

      <button type="button" onClick={() => window.print()} className={`${btnPrimary} mt-8 print:hidden`}>
        {t.plan.printButton}
      </button>

      {/* ── Cowork block (interactive only — pointless on paper) ── */}
      {coworkReady.length > 0 && (
        <section className="mt-10 rounded-md border border-line bg-white p-4 print:hidden">
          <h2 className="text-lg font-bold text-ink m-0">
            {t.plan.coworkReady} · {coworkReady.length}{" "}
            {coworkReady.length === 1 ? t.browse.program : t.browse.programs}
          </h2>
          <p className="text-[0.9375rem] leading-relaxed text-ink mt-2 mb-4">
            {t.plan.coworkBody}
          </p>

          <button
            type="button"
            onClick={exportCowork}
            className="inline-flex items-center justify-center w-full h-11 rounded border border-primary bg-white text-primary text-base font-semibold hover:bg-primary-tint"
          >
            {t.plan.exportButton}
          </button>

          <details className="mt-4">
            <summary className="text-[0.9375rem] font-semibold text-primary cursor-pointer">
              {t.plan.setupSummary}
            </summary>
            <div className="text-[0.9375rem] leading-relaxed text-ink mt-3">
              <p className="font-semibold m-0">One-time setup:</p>
              <ol className="list-decimal pl-5 mt-1 mb-4">
                <li>Claude Pro or Max subscription required</li>
                <li>
                  Install Claude Desktop → <span className="font-mono text-sm">claude.ai/download</span>
                </li>
                <li>
                  Install Claude in Chrome extension from the Chrome Web Store (search
                  &quot;Claude&quot; by Anthropic)
                </li>
                <li>Open Claude Desktop → Cowork tab → enable Chrome integration</li>
              </ol>
              <p className="font-semibold m-0">Each time you use it:</p>
              <ol className="list-decimal pl-5 mt-1 mb-4">
                <li>Export the plan file (button above) → it saves to Downloads</li>
                <li>
                  Open Cowork and type (or copy-paste):
                  <div className="bg-canvas border border-line rounded px-3 py-2 my-2 font-mono text-[0.8125rem] leading-relaxed">
                    Open memphis-family-registration-plan.json from my Downloads.
                    For each program listed, open its URL in Chrome and fill in
                    the form fields with the family&apos;s information. Pause
                    after filling each form and show me what you&apos;ve entered
                    before submitting. Only submit after I say OK.
                  </div>
                </li>
                <li>Claude opens each form in Chrome and fills it</li>
                <li>You review → tap OK → it submits → moves to the next one</li>
              </ol>
              <p className="font-semibold m-0">Programs in this export:</p>
              <ul className="list-disc pl-5 mt-1 mb-0">
                {coworkReady.map((r) => (
                  <li key={r.id}>{r.name}</li>
                ))}
              </ul>
            </div>
          </details>
        </section>
      )}
    </div>
  );
}
