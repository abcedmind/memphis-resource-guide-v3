"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CAT } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import type { CategoryId, ServeType } from "@/lib/types";
import {
  btnPrimary,
  fieldCls,
  inputCls,
  labelCls,
  textareaCls,
} from "@/components/ui";

/** The guide's published contact address (also on the About page). */
const CONTACT_EMAIL = "zandenkelly@gmail.com";

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

/** The same suggestion as a pre-filled email, for when the form can't reach the database. */
function mailtoFor(f: FormState) {
  const body = [
    `Program: ${f.name}`,
    `What it is: ${f.desc}`,
    `How to access it: ${f.how}`,
    `Website: ${f.url}`,
    `Category: ${CAT[f.cat]?.label ?? f.cat}`,
    `Access type: ${f.serve}`,
    `Ages: ${f.minAge}–${f.maxAge}`,
    `Suggested by: ${f.submitter}`,
  ].join("\n");
  const subject = `Resource guide suggestion: ${f.name}`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

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
      <div className="max-w-page mx-auto px-4 pt-10 pb-4">
        <h1 className="text-3xl font-bold leading-tight text-ink m-0">{t.suggest.thanksTitle}</h1>
        <p className="text-base leading-relaxed text-ink mt-3 mb-6">{t.suggest.thanksBody}</p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setF(EMPTY);
          }}
          className={`${btnPrimary} sm:w-auto sm:px-6`}
        >
          {t.suggest.another}
        </button>
      </div>
    );

  return (
    <div className="max-w-page mx-auto px-4 pt-8 pb-4">
      <h1 className="text-3xl font-bold leading-tight tracking-[-0.01em] text-ink m-0">
        {t.suggest.title}
      </h1>
      <p className="text-base leading-relaxed text-muted mt-2 mb-8">{t.suggest.intro}</p>

      <div className={fieldCls}>
        <label className={labelCls} htmlFor="sf-name">{t.suggest.nameLabel}</label>
        <input id="sf-name" className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder={t.suggest.namePlaceholder} required />
      </div>
      <div className={fieldCls}>
        <label className={labelCls} htmlFor="sf-desc">{t.suggest.descLabel}</label>
        <textarea id="sf-desc" className={textareaCls} value={f.desc} onChange={(e) => set("desc", e.target.value)} placeholder={t.suggest.descPlaceholder} required />
      </div>
      <div className={fieldCls}>
        <label className={labelCls} htmlFor="sf-how">{t.suggest.howLabel}</label>
        <input id="sf-how" className={inputCls} value={f.how} onChange={(e) => set("how", e.target.value)} placeholder={t.suggest.howPlaceholder} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls} htmlFor="sf-url">{t.suggest.urlLabel}</label>
        <input id="sf-url" type="url" inputMode="url" className={inputCls} value={f.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" />
      </div>
      <div className="flex gap-3">
        <div className={`${fieldCls} flex-1 min-w-0`}>
          <label className={labelCls} htmlFor="sf-cat">{t.suggest.catLabel}</label>
          <select id="sf-cat" className={inputCls} value={f.cat} onChange={(e) => set("cat", e.target.value as CategoryId)}>
            {(Object.keys(CAT) as CategoryId[]).map((id) => (
              <option key={id} value={id}>{t.cat[id]}</option>
            ))}
          </select>
        </div>
        <div className={`${fieldCls} flex-1 min-w-0`}>
          <label className={labelCls} htmlFor="sf-serve">{t.suggest.serveLabel}</label>
          <select id="sf-serve" className={inputCls} value={f.serve} onChange={(e) => set("serve", e.target.value as ServeType)}>
            <option value="online">{t.serve.online}</option>
            <option value="inperson">{t.serve.inperson}</option>
            <option value="navigator">{t.serve.navigator}</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <div className={`${fieldCls} flex-1 min-w-0`}>
          <label className={labelCls} htmlFor="sf-min">{t.suggest.minAge}</label>
          <input id="sf-min" type="number" inputMode="numeric" className={inputCls} value={f.minAge} onChange={(e) => set("minAge", e.target.value)} />
        </div>
        <div className={`${fieldCls} flex-1 min-w-0`}>
          <label className={labelCls} htmlFor="sf-max">{t.suggest.maxAge}</label>
          <input id="sf-max" type="number" inputMode="numeric" className={inputCls} value={f.maxAge} onChange={(e) => set("maxAge", e.target.value)} />
        </div>
      </div>
      <div className={fieldCls}>
        <label className={labelCls} htmlFor="sf-submitter">{t.suggest.submitterLabel}</label>
        <input id="sf-submitter" className={inputCls} value={f.submitter} onChange={(e) => set("submitter", e.target.value)} placeholder={t.suggest.submitterPlaceholder} />
      </div>
      {err && (
        <div className="mb-4 rounded bg-error-tint px-3 py-2.5 text-[0.9375rem] text-error" role="alert">
          <p className="m-0">{err === "required" ? t.suggest.required : t.suggest.error}</p>
          {err === "network" && (
            <a
              href={mailtoFor(f)}
              className="inline-block mt-2 font-semibold text-primary underline underline-offset-2"
            >
              {t.suggest.emailInstead}
            </a>
          )}
        </div>
      )}
      <button type="button" onClick={submit} disabled={busy} className={btnPrimary}>
        {busy ? t.suggest.submitting : t.suggest.submit}
      </button>
    </div>
  );
}
