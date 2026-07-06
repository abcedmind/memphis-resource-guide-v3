"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CAT } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import type { CategoryId, ServeType } from "@/lib/types";

const inp =
  "w-full box-border border border-[#d8d0c4] rounded-md px-2.5 py-[9px] text-[13px] mb-2.5 font-sans bg-white text-ink";
const lbl =
  "text-[10px] tracking-[0.05em] text-[#888] block mb-[3px] font-semibold";

interface FormState {
  name: string;
  cat: CategoryId;
  desc: string;
  how: string;
  url: string;
  minAge: number | string;
  maxAge: number | string;
  serve: ServeType;
  submitter: string;
}

const EMPTY: FormState = {
  name: "",
  cat: "education",
  desc: "",
  how: "",
  url: "",
  minAge: 0,
  maxAge: 18,
  serve: "navigator",
  submitter: "",
};

export default function SubmitForm() {
  const { t } = useLang();
  const [f, setF] = useState<FormState>(EMPTY);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<"required" | "network" | null>(null);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setF({ ...f, [k]: v });

  const submit = async () => {
    if (!f.name.trim() || !f.desc.trim()) {
      setErr("required");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("submissions").insert({
        name: f.name.trim(),
        category: f.cat,
        description: f.desc.trim(),
        how_to_access: f.how || null,
        url: f.url || null,
        min_age: Number(f.minAge) || 0,
        max_age: Number(f.maxAge) || 99,
        serve: f.serve,
        target_group: "all",
        submitter_name: f.submitter || null,
      });
      if (error) throw error;
      setDone(true);
    } catch {
      setErr("network");
    } finally {
      setBusy(false);
    }
  };

  if (done)
    return (
      <div className="px-6 py-10 text-center">
        <div className="text-[40px] mb-2.5" aria-hidden="true">✓</div>
        <h2 className="text-lg text-ink m-0 mb-2">{t.suggest.thanksTitle}</h2>
        <p className="text-[13px] text-[#888] leading-relaxed max-w-[360px] mx-auto mb-[18px]">
          {t.suggest.thanksBody}
        </p>
        <button
          onClick={() => {
            setDone(false);
            setF(EMPTY);
          }}
          className="bg-ink text-white rounded-lg px-5 py-2.5 text-[13px]"
        >
          {t.suggest.another}
        </button>
      </div>
    );

  return (
    <div className="px-4 pt-[18px] pb-10">
      <div className="bg-[#f0f9f4] border border-[#c8e6d4] rounded-lg px-3.5 py-3 mb-4 text-xs text-[#2a6b48] leading-relaxed">
        {t.suggest.intro}
      </div>
      <label className={lbl} htmlFor="sf-name">{t.suggest.nameLabel}</label>
      <input id="sf-name" className={inp} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder={t.suggest.namePlaceholder} />
      <label className={lbl} htmlFor="sf-desc">{t.suggest.descLabel}</label>
      <textarea id="sf-desc" className={`${inp} min-h-[70px]`} value={f.desc} onChange={(e) => set("desc", e.target.value)} placeholder={t.suggest.descPlaceholder} />
      <label className={lbl} htmlFor="sf-how">{t.suggest.howLabel}</label>
      <input id="sf-how" className={inp} value={f.how} onChange={(e) => set("how", e.target.value)} placeholder={t.suggest.howPlaceholder} />
      <label className={lbl} htmlFor="sf-url">{t.suggest.urlLabel}</label>
      <input id="sf-url" className={inp} value={f.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" />
      <div className="flex gap-2">
        <div className="flex-1">
          <label className={lbl} htmlFor="sf-cat">{t.suggest.catLabel}</label>
          <select id="sf-cat" className={inp} value={f.cat} onChange={(e) => set("cat", e.target.value as CategoryId)}>
            {(Object.keys(CAT) as CategoryId[]).map((id) => (
              <option key={id} value={id}>{t.cat[id]}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className={lbl} htmlFor="sf-serve">{t.suggest.serveLabel}</label>
          <select id="sf-serve" className={inp} value={f.serve} onChange={(e) => set("serve", e.target.value as ServeType)}>
            <option value="online">{t.serve.online}</option>
            <option value="inperson">{t.serve.inperson}</option>
            <option value="navigator">{t.serve.navigator}</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className={lbl} htmlFor="sf-min">{t.suggest.minAge}</label>
          <input id="sf-min" type="number" className={inp} value={f.minAge} onChange={(e) => set("minAge", e.target.value)} />
        </div>
        <div className="flex-1">
          <label className={lbl} htmlFor="sf-max">{t.suggest.maxAge}</label>
          <input id="sf-max" type="number" className={inp} value={f.maxAge} onChange={(e) => set("maxAge", e.target.value)} />
        </div>
      </div>
      <label className={lbl} htmlFor="sf-submitter">{t.suggest.submitterLabel}</label>
      <input id="sf-submitter" className={inp} value={f.submitter} onChange={(e) => set("submitter", e.target.value)} placeholder={t.suggest.submitterPlaceholder} />
      {err && (
        <div className="text-[11px] text-cat-identity mb-2" role="alert">
          {err === "required" ? t.suggest.required : t.suggest.error}
        </div>
      )}
      <button
        onClick={submit}
        disabled={busy}
        className="w-full bg-ink text-white rounded-lg py-[13px] text-sm font-bold mt-1 disabled:opacity-60"
      >
        {busy ? t.suggest.submitting : t.suggest.submit}
      </button>
    </div>
  );
}
