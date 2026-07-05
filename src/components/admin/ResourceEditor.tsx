"use client";

import { useState } from "react";
import { CAT } from "@/lib/constants";
import type { CategoryId, Resource, ServeType } from "@/lib/types";

const inp =
  "w-full box-border border border-[#d8d0c4] rounded px-2 py-1.5 text-xs mb-1.5 font-sans bg-white text-ink";
const lbl = "text-[9px] tracking-[0.06em] text-[#998] block mb-0.5";

export default function ResourceEditor({
  res,
  color,
  onSave,
  onCancel,
  isNew,
}: {
  res: Resource;
  color: string;
  onSave: (patch: Partial<Resource>) => void;
  onCancel: () => void;
  isNew?: boolean;
}) {
  const [f, setF] = useState<Resource>(res);
  const [err, setErr] = useState(false);
  const set = <K extends keyof Resource>(k: K, v: Resource[K]) =>
    setF({ ...f, [k]: v });

  return (
    <div
      className="bg-white rounded-md mb-1.5 p-3"
      style={{ border: `2px solid ${color}` }}
    >
      <label className={lbl} htmlFor={`re-name-${res.id}`}>NAME</label>
      <input id={`re-name-${res.id}`} className={inp} value={f.name} onChange={(e) => set("name", e.target.value)} />
      <label className={lbl} htmlFor={`re-desc-${res.id}`}>DESCRIPTION</label>
      <textarea id={`re-desc-${res.id}`} className={`${inp} min-h-[60px]`} value={f.desc} onChange={(e) => set("desc", e.target.value)} />
      <label className={lbl} htmlFor={`re-how-${res.id}`}>HOW TO ACCESS</label>
      <input id={`re-how-${res.id}`} className={inp} value={f.how} onChange={(e) => set("how", e.target.value)} />
      <label className={lbl} htmlFor={`re-url-${res.id}`}>URL</label>
      <input id={`re-url-${res.id}`} className={inp} value={f.url} onChange={(e) => set("url", e.target.value)} />
      <div className="flex gap-2">
        <div className="flex-1">
          <label className={lbl} htmlFor={`re-cat-${res.id}`}>CATEGORY</label>
          <select id={`re-cat-${res.id}`} className={inp} value={f.cat} onChange={(e) => set("cat", e.target.value as CategoryId)}>
            {Object.entries(CAT).map(([id, v]) => (
              <option key={id} value={id}>{v.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className={lbl} htmlFor={`re-serve-${res.id}`}>ACCESS TYPE</label>
          <select id={`re-serve-${res.id}`} className={inp} value={f.serve} onChange={(e) => set("serve", e.target.value as ServeType)}>
            <option value="online">Self-serve online</option>
            <option value="inperson">In person</option>
            <option value="navigator">Navigator helps</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className={lbl} htmlFor={`re-min-${res.id}`}>MIN AGE</label>
          <input id={`re-min-${res.id}`} type="number" className={inp} value={f.minAge} onChange={(e) => set("minAge", Number(e.target.value))} />
        </div>
        <div className="flex-1">
          <label className={lbl} htmlFor={`re-max-${res.id}`}>MAX AGE</label>
          <input id={`re-max-${res.id}`} type="number" className={inp} value={f.maxAge} onChange={(e) => set("maxAge", Number(e.target.value))} />
        </div>
      </div>
      {err && (
        <div className="text-[10px] text-cat-identity mb-1.5" role="alert">
          Name is required.
        </div>
      )}
      <button
        onClick={() => {
          if (!f.name.trim()) {
            setErr(true);
            return;
          }
          onSave(f);
        }}
        className="text-white rounded px-3.5 py-1.5 text-[11px] font-bold mr-1.5"
        style={{ background: color }}
      >
        {isNew ? "ADD" : "SAVE"}
      </button>
      <button
        onClick={onCancel}
        className="bg-transparent text-[#999] border border-[#ccc] rounded px-3.5 py-1.5 text-[11px]"
      >
        CANCEL
      </button>
    </div>
  );
}
