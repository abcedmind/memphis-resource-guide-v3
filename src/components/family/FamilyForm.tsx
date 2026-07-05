"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildPlan } from "@/lib/eligibility";
import type { ChildInput, FamilyNeeds, FamilyPlan, FlatResource } from "@/lib/types";
import PlanView from "./PlanView";

const inp =
  "w-full box-border border border-[#d8d0c4] rounded-md px-2.5 py-[9px] text-[13px] mb-2.5 font-sans bg-white text-ink";
const lbl =
  "text-[10px] tracking-[0.05em] text-[#888] block mb-[3px] font-semibold";

export default function FamilyForm({
  flatResources,
}: {
  flatResources: FlatResource[];
}) {
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
    <div className="px-4 pt-[18px] pb-10">
      <div className="bg-[#eef4fb] border border-[#cfe0f2] rounded-lg px-3.5 py-3 mb-4 text-xs text-[#3a5a7a] leading-relaxed">
        Enter your children&apos;s ages and a few needs, and this builds a
        personalized list of every free program each child qualifies for —
        with direct links and how to register.
        <div className="mt-2 text-[11px] text-[#6a7a8a]">
          <b>This does not auto-enroll anyone.</b> Each program has its own
          sign-up; we point you straight to it. Your info is <b>not saved</b>{" "}
          unless you check the box at the bottom.
        </div>
      </div>

      <label className={lbl} htmlFor="ff-parent">PARENT / GUARDIAN NAME (optional)</label>
      <input id="ff-parent" className={inp} value={parent} onChange={(e) => setParent(e.target.value)} placeholder="e.g. Jordan Smith" />

      <label className={lbl} htmlFor="ff-contact">PHONE OR EMAIL (optional)</label>
      <input id="ff-contact" className={inp} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="So a navigator can follow up, if you opt in below" />

      <label className={lbl} htmlFor="ff-zip">ZIP CODE (optional)</label>
      <input id="ff-zip" className={inp} value={zip} onChange={(e) => setZip(e.target.value)} placeholder="e.g. 38104" inputMode="numeric" />

      <div className="text-[11px] font-extrabold tracking-[0.08em] text-cat-education mt-3.5 mb-2">
        CHILDREN
      </div>
      {children.map((c, i) => (
        <div key={i} className="bg-white border border-line-sand rounded-lg p-3 mb-2.5">
          <div className="flex gap-2 mb-1.5">
            <div className="flex-[2]">
              <label className={lbl} htmlFor={`ff-cname-${i}`}>NAME (optional)</label>
              <input id={`ff-cname-${i}`} className={`${inp} mb-0`} value={c.name} onChange={(e) => setChild(i, "name", e.target.value)} placeholder="Child's name" />
            </div>
            <div className="flex-1">
              <label className={lbl} htmlFor={`ff-cage-${i}`}>AGE</label>
              <input id={`ff-cage-${i}`} type="number" min={0} max={18} className={`${inp} mb-0`} value={c.age} onChange={(e) => setChild(i, "age", e.target.value)} placeholder="0–18" />
            </div>
          </div>
          <div className="flex gap-3.5 flex-wrap mt-2">
            <label className="text-[11px] text-[#555] flex items-center gap-[5px] cursor-pointer">
              <input type="checkbox" checked={c.disability} onChange={(e) => setChild(i, "disability", e.target.checked)} />{" "}
              Has a disability / is neurodivergent / has an IEP
            </label>
            <label className="text-[11px] text-[#555] flex items-center gap-[5px] cursor-pointer">
              <input type="checkbox" checked={c.lgbtq} onChange={(e) => setChild(i, "lgbtq", e.target.checked)} />{" "}
              LGBTQ+ youth (12–17)
            </label>
          </div>
          {children.length > 1 && (
            <button onClick={() => rmChild(i)} className="mt-2 bg-transparent text-cat-identity text-[10px] p-0">
              − remove this child
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addChild}
        className="w-full bg-transparent border-[1.5px] border-dashed border-[#c4bbae] rounded-lg py-[9px] text-xs text-[#998] mb-4"
      >
        + Add another child
      </button>

      <div className="text-[11px] font-extrabold tracking-[0.08em] text-cat-education mt-1.5 mb-2">
        FAMILY NEEDS (optional)
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-xs text-[#555] flex items-center gap-[7px] cursor-pointer">
          <input type="checkbox" checked={fam.food} onChange={(e) => setFam({ ...fam, food: e.target.checked })} />{" "}
          We could use help with food / groceries
        </label>
        <label className="text-xs text-[#555] flex items-center gap-[7px] cursor-pointer">
          <input type="checkbox" checked={fam.immigrant} onChange={(e) => setFam({ ...fam, immigrant: e.target.checked })} />{" "}
          We&apos;re an immigrant / refugee / multilingual family
        </label>
      </div>

      {/* Required consent */}
      <div className="text-[11px] font-extrabold tracking-[0.08em] text-cat-identity mt-4 mb-1.5">
        CONSENT (REQUIRED)
      </div>
      <label
        className={`text-xs text-ink flex items-start gap-2 cursor-pointer rounded-lg p-3 mb-2.5 leading-relaxed border-[1.5px] ${
          consent
            ? "bg-[#f0f9f4] border-[#3aab7c]"
            : "bg-[#fff8f8] border-[#e0a0a0]"
        }`}
      >
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-[3px] shrink-0" />
        <span>
          <b>I understand and agree:</b> This tool will match my children to
          free programs based on what I&apos;ve entered. If I use the Cowork
          export, my family&apos;s name, contact info, and children&apos;s
          ages may be used to pre-fill registration forms — one at a time,
          with my review and approval before anything is submitted.{" "}
          <b>No SSNs, income records, or medical information will be used or
          entered on my behalf.</b>
        </span>
      </label>

      {/* Optional navigator save */}
      <label className="text-[11px] text-[#555] flex items-start gap-2 cursor-pointer bg-[#faf6ef] border border-[#e8ddc8] rounded-lg px-3 py-2.5 mb-4 leading-normal">
        <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-0.5 shrink-0" />
        <span>
          Also save my info so a community navigator can follow up and help
          me register. <b>Leave unchecked to keep everything private</b> —
          your plan still works either way.
        </span>
      </label>

      <button
        onClick={generate}
        disabled={!consent}
        className={`w-full text-white rounded-lg py-[13px] text-sm font-bold transition-colors ${
          consent ? "bg-ink cursor-pointer" : "bg-[#ccc] cursor-not-allowed"
        }`}
      >
        {consent
          ? "Build my family's plan →"
          : "Check the consent box above to continue"}
      </button>
    </div>
  );
}
