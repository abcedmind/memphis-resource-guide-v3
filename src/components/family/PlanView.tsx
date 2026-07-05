"use client";

import { CAT, SERVE_BADGE } from "@/lib/constants";
import { buildCoworkPayload, coworkReadyPrograms } from "@/lib/eligibility";
import type { FamilyPlan, FlatResource } from "@/lib/types";

function Prog({ r }: { r: FlatResource }) {
  const col = CAT[r.cat]?.color || "#777";
  return (
    <div
      className="bg-white border border-line-sand rounded-md px-3 py-2.5 mb-1.5"
      style={{ borderLeft: `4px solid ${col}` }}
    >
      <div className="flex justify-between items-start gap-2 flex-wrap">
        <div className="text-[13px] font-semibold text-ink flex-1">{r.name}</div>
        <div className="flex gap-1 shrink-0">
          {r.basicInfoOnly && (
            <span className="text-[7px] text-cat-technology border border-[#2980b955] px-1 py-0.5 rounded-[3px] whitespace-nowrap tracking-[0.04em]">
              ⚡ COWORK
            </span>
          )}
          {r.serve && (
            <span
              className="text-[7px] tracking-[0.04em] border px-1 py-0.5 rounded-[3px] whitespace-nowrap"
              style={{
                color: SERVE_BADGE[r.serve].color,
                borderColor: `${SERVE_BADGE[r.serve].color}55`,
              }}
            >
              {SERVE_BADGE[r.serve].label.toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div className="text-[11px] text-[#666] mt-1 mb-[5px] leading-normal">
        <b>How: </b>
        {r.how}
      </div>
      {r.url && (
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] no-underline"
          style={{ color: col }}
        >
          ↗ Register / learn more
        </a>
      )}
    </div>
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

  return (
    <div className="px-4 pt-[18px] pb-10">
      <button onClick={onBack} className="bg-transparent text-[#888] text-xs p-0 mb-3">
        ← edit answers
      </button>
      <h2 className="text-[19px] font-extrabold text-ink m-0 mb-1">
        {parent ? `${parent}'s` : "Your"} Family Plan
      </h2>
      <p className="text-xs text-[#888] m-0 mb-3.5 leading-normal">
        Every free program your family qualifies for. Start with ⚡ Cowork
        programs if you have Claude Desktop.
      </p>
      {optIn && saveState === "saved" && (
        <p className="text-[11px] text-serve-online m-0 mb-3.5">
          ✓ Info saved — a navigator can follow up.
        </p>
      )}
      {optIn && saveState === "saving" && (
        <p className="text-[11px] text-[#888] m-0 mb-3.5">Saving your info…</p>
      )}
      {optIn && saveState === "error" && (
        <p className="text-[11px] text-cat-identity m-0 mb-3.5" role="alert">
          Couldn&apos;t save your info (connection issue). Your plan below
          still works — try again later or call 2-1-1.
        </p>
      )}

      {/* ── Cowork block ── */}
      {coworkReady.length > 0 && (
        <div className="bg-[#eef4fb] border-2 border-cat-education rounded-[10px] p-3.5 mb-[22px]">
          <div className="text-xs font-extrabold tracking-[0.08em] text-[#2c5aa0] mb-2">
            ⚡ {coworkReady.length} PROGRAM{coworkReady.length !== 1 ? "S" : ""} — COWORK READY
          </div>
          <p className="text-[11px] text-[#3a5a7a] m-0 mb-2.5 leading-relaxed">
            These only need name, contact info, and age — no SSNs or income
            docs. Claude Cowork + Chrome can pre-fill them. You review and
            approve each form before it submits. Nothing goes through without
            your OK.
          </p>

          <button
            onClick={exportCowork}
            className="w-full bg-[#2c5aa0] text-white rounded-[7px] py-[11px] text-[13px] font-bold mb-3"
          >
            ⬇ Export plan for Cowork (.json)
          </button>

          <details>
            <summary className="text-[10px] text-[#2c5aa0] cursor-pointer font-bold tracking-[0.06em] mb-1.5">
              COWORK SETUP INSTRUCTIONS (tap to expand)
            </summary>
            <div className="text-[11px] text-[#3a5a7a] leading-[1.8] mt-2">
              <b>One-time setup:</b>
              <br />
              1. Claude Pro or Max subscription required
              <br />
              2. Install Claude Desktop →{" "}
              <span className="text-[#2c5aa0]">claude.ai/download</span>
              <br />
              3. Install Claude in Chrome extension from the Chrome Web Store
              (search &quot;Claude&quot; by Anthropic)
              <br />
              4. Open Claude Desktop → Cowork tab → enable Chrome integration
              <br />
              <br />
              <b>Each time you use it:</b>
              <br />
              1. Export the plan file (button above) → it saves to Downloads
              <br />
              2. Open Cowork and type (or copy-paste):
              <br />
              <div className="bg-[#d8e8f8] rounded-[5px] px-2.5 py-2 my-1.5 font-mono text-[10px] leading-relaxed text-[#1a2a3a]">
                Open memphis-family-registration-plan.json from my Downloads.
                For each program listed, open its URL in Chrome and fill in
                the form fields with the family&apos;s information. Pause
                after filling each form and show me what you&apos;ve entered
                before submitting. Only submit after I say OK.
              </div>
              3. Claude opens each form in Chrome and fills it
              <br />
              4. You review → tap OK → it submits → moves to the next one
              <br />
              <br />
              <b>Programs in this export:</b>
              <br />
              {coworkReady.map((r) => (
                <span key={r.id} className="block pl-1.5">
                  · {r.name}
                </span>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* ── Per-child plans ── */}
      {plan.childPlans.map((cp, i) => (
        <div key={i} className="mb-5">
          <div className="text-xs font-extrabold tracking-[0.06em] text-cat-education border-b-2 border-line-sand pb-[5px] mb-2">
            {cp.child.name ? cp.child.name.toUpperCase() : `CHILD ${i + 1}`} ·
            AGE {cp.child.age}
          </div>
          {cp.programs.length ? (
            cp.programs.map((r) => <Prog key={r.id} r={r} />)
          ) : (
            <div className="text-[11px] text-[#aaa] pb-1">
              See family-wide programs below.
            </div>
          )}
        </div>
      ))}

      {/* ── Family-wide ── */}
      <div className="mt-1.5">
        <div className="text-xs font-extrabold tracking-[0.06em] text-cat-enrichment border-b-2 border-line-sand pb-[5px] mb-2">
          FOR THE WHOLE FAMILY
        </div>
        {plan.family.map((r) => (
          <Prog key={r.id} r={r} />
        ))}
      </div>

      <button
        onClick={() => window.print()}
        className="w-full mt-4 bg-cat-education text-white rounded-lg py-[11px] text-[13px] font-semibold print:hidden"
      >
        Print / Save this plan
      </button>
    </div>
  );
}
