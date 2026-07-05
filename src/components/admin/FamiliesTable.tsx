"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DbRegistration } from "@/lib/types";

function downloadBlob(content: string, type: string, filename: string) {
  const blob = new Blob([content], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function csvEscape(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export default function FamiliesTable({
  initialRegs,
}: {
  initialRegs: DbRegistration[];
}) {
  const [regs, setRegs] = useState(initialRegs);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string) => {
    const supabase = createClient();
    const { error: err } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id);
    if (err) {
      setError(err.message);
      return;
    }
    setRegs((r) => r.filter((x) => x.id !== id));
    setConfirmId(null);
  };

  const exportJson = () =>
    downloadBlob(
      JSON.stringify(regs, null, 2),
      "application/json",
      "family-registrations.json"
    );

  const exportCsv = () => {
    const header = "parent_name,contact,zip,children,family_needs,created_at";
    const rows = regs.map((r) =>
      [
        r.parent_name || "",
        r.contact || "",
        r.zip || "",
        (r.children || [])
          .map((c) => `${c.name || "child"} (${c.age})`)
          .join("; "),
        Object.entries(r.family_needs || {})
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join("; "),
        r.created_at,
      ]
        .map(csvEscape)
        .join(",")
    );
    downloadBlob(
      [header, ...rows].join("\n"),
      "text/csv",
      "family-registrations.csv"
    );
  };

  return (
    <div className="bg-[#fff5fa] px-4 py-3.5 min-h-[50vh]">
      <div className="text-[10px] font-extrabold tracking-[0.1em] text-cat-identity mb-2">
        {regs.length} SAVED FAMILY REGISTRATION{regs.length !== 1 ? "S" : ""} ·
        OPTED-IN ONLY
      </div>
      <p className="text-[10px] text-[#b088a0] mb-2.5 leading-normal">
        Families appear here only if they explicitly checked the navigator
        follow-up box. Handle with care — contact them to help, then delete.
      </p>
      {regs.length > 0 && (
        <div className="mb-3 flex gap-1.5">
          <button onClick={exportCsv} className="bg-cat-education text-white rounded px-2.5 py-1 text-[10px]">
            ⬇ EXPORT CSV
          </button>
          <button onClick={exportJson} className="bg-cat-education text-white rounded px-2.5 py-1 text-[10px]">
            ⬇ EXPORT JSON
          </button>
        </div>
      )}
      {error && (
        <div className="text-[11px] text-cat-identity mb-2" role="alert">
          {error}
        </div>
      )}
      {regs.length === 0 && (
        <div className="text-[11px] text-[#b088a0]">
          No saved registrations.
        </div>
      )}
      {regs.map((r) => (
        <div
          key={r.id}
          className="bg-white border border-[#f0c8de] rounded-md p-2 my-1.5 text-[11px] text-[#555]"
        >
          <b>{r.parent_name || "—"}</b> · {r.contact || "no contact"} ·{" "}
          {r.zip || "no zip"}
          <br />
          Children:{" "}
          {(r.children || [])
            .map((c) => `${c.name || "child"} (${c.age})`)
            .join(", ")}
          {Object.values(r.family_needs || {}).some(Boolean) && (
            <>
              <br />
              Needs:{" "}
              {Object.entries(r.family_needs || {})
                .filter(([, v]) => v)
                .map(([k]) => k)
                .join(", ")}
            </>
          )}
          <br />
          <span className="text-[#999]">
            {new Date(r.created_at).toLocaleString()}
          </span>
          <button
            onClick={() =>
              confirmId === r.id ? remove(r.id) : setConfirmId(r.id)
            }
            className={`ml-2 border border-[#e0a8c4] rounded-[3px] text-[9px] px-1.5 py-0.5 ${
              confirmId === r.id
                ? "bg-cat-identity text-white"
                : "bg-transparent text-cat-identity"
            }`}
          >
            {confirmId === r.id ? "confirm" : "delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
