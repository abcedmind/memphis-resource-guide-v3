"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildPlan } from "@/lib/eligibility";
import { useLang } from "@/lib/i18n";
import type { ChildInput, FamilyNeeds, FamilyPlan, FlatResource } from "@/lib/types";
import {
  btnPrimary,
  btnSecondary,
  fieldCls,
  inputCls,
  labelCls,
  sectionTitleCls,
} from "@/components/ui";
import PlanView from "./PlanView";

const checkRow = "flex items-start gap-2.5 text-[0.9375rem] leading-snug text-ink cursor-pointer";

export default function FamilyForm({
  flatResources,
}: {
  flatResources: FlatResource[];
}) {
  const { t } = useLang();
  const [parent, setParent] = useState("");
  const [contact, setContact] = useState("");
  const [zip, setZip] = useState("");
  const [children, setChildren] = useState<ChildInput[]>([
    { name: "", age: "", disability: false, lgbtq: false },
  ]);
  const [fam, setFam] = useState<FamilyNeeds>({ immigrant: false, food: false });
  const [optIn, setOptIn] = useState(false);
  const [consent, setConsent] = useState(false);
  const [plan, setPlan] = useState<FamilyPlan | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const addChild = () =>
    setChildren([...children, { name: "", age: "", disability: false, lgbtq: false }]);
  const setChild = <K extends keyof ChildInput>(i: number, k: K, v: ChildInput[K]) =>
    setChildren(children.map((c, j) => (j === i ? { ...c, [k]: v } : c)));
  const rmChild = (i: number) => setChildren(children.filter((_, j) => j !== i));

  const generate = async () => {
    const newPlan = buildPlan(flatResources, { parent, contact, zip, children, fam });
    setPlan(newPlan);

    if (optIn) {
      setSaveState("saving");
      try {
        const supabase = createClient();
        const { error } = await supabase.from("registrations").insert({
          parent_name: parent || null,
          contact: contact || null,
          zip: zip || null,
          children: children.filter((c) => c.age !== ""),
          family_needs: fam,
        });
        setSaveState(error ? "error" : "saved");
      } catch {
        setSaveState("error");
      }
    }
  };

  if (plan)
    return (
      <PlanView
        plan={plan}
        parent={parent}
        optIn={optIn}
        saveState={saveState}
        onBack={() => {
          setPlan(null);
          setSaveState("idle");
        }}
      />
    );

  return (
    <div className="max-w-page mx-auto px-4 pt-8 pb-4">
      <h1 className="text-3xl font-bold leading-tight tracking-[-0.01em] text-ink m-0">
        {t.family.title}
      </h1>
      <div className="mt-4 mb-8 rounded-md border border-line bg-white px-4 py-3.5 text-base leading-relaxed text-ink">
        <p className="m-0">{t.family.introMain}</p>
        <p className="mt-2 mb-0 text-[0.9375rem] text-muted">
          <b className="text-ink">{t.family.introNoEnroll}</b>
          {t.family.introNoEnrollRest}
          <b className="text-ink">{t.family.introNotSaved}</b>.
        </p>
      </div>

      <div className={fieldCls}>
        <label className={labelCls} htmlFor="ff-parent">{t.family.parentLabel}</label>
        <input id="ff-parent" className={inputCls} value={parent} onChange={(e) => setParent(e.target.value)} placeholder={t.family.parentPlaceholder} autoComplete="name" />
      </div>

      <div className={fieldCls}>
        <label className={labelCls} htmlFor="ff-contact">{t.family.contactLabel}</label>
        <input id="ff-contact" className={inputCls} value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t.family.contactPlaceholder} />
      </div>

      <div className={fieldCls}>
        <label className={labelCls} htmlFor="ff-zip">{t.family.zipLabel}</label>
        <input id="ff-zip" className={`${inputCls} max-w-[10rem]`} value={zip} onChange={(e) => setZip(e.target.value)} placeholder={t.family.zipPlaceholder} inputMode="numeric" autoComplete="postal-code" />
      </div>

      <fieldset className="border-0 p-0 m-0 mt-8">
        <legend className={sectionTitleCls}>{t.family.childrenTitle}</legend>
        {children.map((c, i) => (
          <div key={i} className="bg-white border border-line rounded-md p-4 mt-3">
            <p className="text-sm font-semibold text-muted m-0 mb-3">
              {t.plan.child} {i + 1}
            </p>
            <div className="flex gap-3">
              <div className="flex-[2] min-w-0">
                <label className={labelCls} htmlFor={`ff-cname-${i}`}>{t.family.childNameLabel}</label>
                <input id={`ff-cname-${i}`} className={inputCls} value={c.name} onChange={(e) => setChild(i, "name", e.target.value)} placeholder={t.family.childNamePlaceholder} />
              </div>
              <div className="flex-1 min-w-0">
                <label className={labelCls} htmlFor={`ff-cage-${i}`}>{t.family.ageLabel}</label>
                <input id={`ff-cage-${i}`} type="number" min={0} max={18} inputMode="numeric" className={inputCls} value={c.age} onChange={(e) => setChild(i, "age", e.target.value)} placeholder={t.family.agePlaceholder} />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <label className={checkRow}>
                <input type="checkbox" className="mt-0.5 shrink-0" checked={c.disability} onChange={(e) => setChild(i, "disability", e.target.checked)} />
                <span>{t.family.disabilityCheck}</span>
              </label>
              <label className={checkRow}>
                <input type="checkbox" className="mt-0.5 shrink-0" checked={c.lgbtq} onChange={(e) => setChild(i, "lgbtq", e.target.checked)} />
                <span>{t.family.lgbtqCheck}</span>
              </label>
            </div>
            {children.length > 1 && (
              <button type="button" onClick={() => rmChild(i)} className="mt-4 text-sm font-semibold text-error underline underline-offset-2">
                {t.family.removeChild}
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addChild} className={`${btnSecondary} mt-3`}>
          + {t.family.addChild}
        </button>
      </fieldset>

      <fieldset className="border-0 p-0 m-0 mt-8">
        <legend className={sectionTitleCls}>{t.family.needsTitle}</legend>
        <div className="flex flex-col gap-3 mt-3">
          <label className={checkRow}>
            <input type="checkbox" className="mt-0.5 shrink-0" checked={fam.food} onChange={(e) => setFam({ ...fam, food: e.target.checked })} />
            <span>{t.family.needFood}</span>
          </label>
          <label className={checkRow}>
            <input type="checkbox" className="mt-0.5 shrink-0" checked={fam.immigrant} onChange={(e) => setFam({ ...fam, immigrant: e.target.checked })} />
            <span>{t.family.needImmigrant}</span>
          </label>
        </div>
      </fieldset>

      {/* Required consent */}
      <fieldset className="border-0 p-0 m-0 mt-8">
        <legend className={sectionTitleCls}>{t.family.consentTitle}</legend>
        <label
          className={`mt-3 flex items-start gap-3 cursor-pointer rounded-md p-4 text-[0.9375rem] leading-relaxed text-ink border-2 ${
            consent ? "bg-success-tint border-success" : "bg-white border-line-strong"
          }`}
        >
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 shrink-0" />
          <span>
            <b>{t.family.consentLead}</b>
            {t.family.consentBody}
            <b>{t.family.consentBold}</b>
          </span>
        </label>

        {/* Optional navigator save */}
        <label className="mt-3 flex items-start gap-3 cursor-pointer rounded-md p-4 text-[0.9375rem] leading-relaxed text-ink bg-white border border-line">
          <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-1 shrink-0" />
          <span>
            {t.family.optIn}
            <b>{t.family.optInBold}</b>
          </span>
        </label>
      </fieldset>

      <button type="button" onClick={generate} disabled={!consent} className={`${btnPrimary} mt-6`}>
        {consent ? t.family.buildPlan : t.family.checkConsent}
      </button>
    </div>
  );
}
