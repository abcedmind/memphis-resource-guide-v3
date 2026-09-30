"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CAT } from "@/lib/constants";
import type { DbSubmission } from "@/lib/types";

export default function SubmissionsQueue({
  initialSubmissions,
}: {
  initialSubmissions: DbSubmission[];
}) {
  const [pending, setPending] = useState(
    initialSubmissions.filter((s) => s.status === "pending")
  );
  const [error, setError] = useState<string | null>(null);

  const approve = async (sub: DbSubmission) => {
    const supabase = createClient();
    // Mirror v2's approve(): copy into resources under the target group.
    const { error: insErr } = await supabase.from("resources").insert({
      group_id: sub.target_group || "all",
      name: sub.name,
      category: sub.category,
      description: sub.description,
      how_to_access: sub.how_to_access || "",
      url: sub.url || null,
      min_age: Number(sub.min_age) || 0,
      max_age: Number(sub.max_age) || 99,
      flags: [],
      serve: sub.serve || "navigator",
      is_approved: true,
    });
    if (insErr) {
      setError(insErr.message);
      return;
    }
    const { error: updErr } = await supabase
      .from("submissions")
      .update({ status: "approved" })
      .eq("id", sub.id);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    setPending((p) => p.filter((s) => s.id !== sub.id));
  };

  const reject = async (sub: DbSubmission) => {
    const supabase = createClient();
    const { error: err } = await supabase
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", sub.id);
    if (err) {
      setError(err.message);
      return;
    }
    setPending((p) => p.filter((s) => s.id !== sub.id));
  };

  return (
    <div className="bg-canvas px-4 py-3.5 min-h-[50vh]">
      <div className="text-[10px] font-extrabold tracking-[0.1em] text-signal mb-2">
        {pending.length} PENDING SUBMISSION{pending.length !== 1 ? "S" : ""}
      </div>
      {error && (
        <div className="text-[11px] text-signal mb-2" role="alert">
          {error}
        </div>
      )}
      {pending.length === 0 && (
        <div className="text-[11px] text-muted">No pending submissions.</div>
      )}
      {pending.map((sub) => (
        <div
          key={sub.id}
          className="bg-paper border border-line rounded-md p-2.5 mb-1.5"
        >
          <div className="text-[13px] font-semibold text-ink">
            {sub.name}{" "}
            <span className="text-[9px] text-signal">
              [{CAT[sub.category]?.label || sub.category}]
            </span>
          </div>
          <div className="text-[11px] text-muted my-[3px]">{sub.description}</div>
          <div className="text-[10px] text-muted mb-1.5">
            How: {sub.how_to_access} {sub.url ? `· ${sub.url}` : ""} · ages{" "}
            {sub.min_age}–{sub.max_age} · from {sub.submitter_name || "anon"} ·{" "}
            {new Date(sub.created_at).toLocaleDateString()}
          </div>
          <button
            onClick={() => approve(sub)}
            className="bg-accent text-white rounded px-2.5 py-1 text-[10px] mr-1.5"
          >
            APPROVE → ADD
          </button>
          <button
            onClick={() => reject(sub)}
            className="bg-transparent text-signal border border-signal rounded px-2.5 py-1 text-[10px]"
          >
            REJECT
          </button>
        </div>
      ))}
    </div>
  );
}
