"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import BrowseView from "@/components/browse/BrowseView";
import type { AdminApi } from "@/components/browse/GroupBlock";
import { createClient } from "@/lib/supabase/client";
import type { Resource, ResourceGroup } from "@/lib/types";

function toDbRow(gid: string, r: Partial<Resource>) {
  const row: Record<string, unknown> = { group_id: gid };
  if (r.name !== undefined) row.name = r.name;
  if (r.cat !== undefined) row.category = r.cat;
  if (r.desc !== undefined) row.description = r.desc;
  if (r.how !== undefined) row.how_to_access = r.how;
  if (r.url !== undefined) row.url = r.url || null;
  if (r.minAge !== undefined) row.min_age = r.minAge;
  if (r.maxAge !== undefined) row.max_age = r.maxAge;
  if (r.flags !== undefined) row.flags = r.flags;
  if (r.serve !== undefined) row.serve = r.serve;
  if (r.basicInfoOnly !== undefined) row.basic_info_only = r.basicInfoOnly;
  return row;
}

export default function AdminResources({
  initialGroups,
}: {
  initialGroups: ResourceGroup[];
}) {
  const [groups, setGroups] = useState(initialGroups);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fail = useCallback((e: unknown) => {
    setError(
      e instanceof Error ? e.message : "Save failed — check your connection."
    );
    router.refresh();
  }, [router]);

  const adminApi: AdminApi = {
    updateResource: async (gid, rid, patch) => {
      setGroups((gs) =>
        gs.map((g) =>
          g.id !== gid
            ? g
            : {
                ...g,
                resources: g.resources.map((r) =>
                  r.id !== rid ? r : { ...r, ...patch }
                ),
              }
        )
      );
      const supabase = createClient();
      const { error: err } = await supabase
        .from("resources")
        .update(toDbRow(gid, patch))
        .eq("id", rid);
      if (err) fail(err);
    },
    deleteResource: async (gid, rid) => {
      setGroups((gs) =>
        gs.map((g) =>
          g.id !== gid
            ? g
            : { ...g, resources: g.resources.filter((r) => r.id !== rid) }
        )
      );
      const supabase = createClient();
      const { error: err } = await supabase
        .from("resources")
        .delete()
        .eq("id", rid);
      if (err) fail(err);
    },
    addResource: async (gid, res) => {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("resources")
        .insert({ ...toDbRow(gid, res), is_approved: true })
        .select("id")
        .single();
      if (err || !data) {
        fail(err ?? new Error("Insert failed"));
        return;
      }
      setGroups((gs) =>
        gs.map((g) =>
          g.id !== gid
            ? g
            : { ...g, resources: [...g.resources, { ...res, id: data.id }] }
        )
      );
    },
  };

  return (
    <div>
      {error && (
        <div
          className="bg-[#fff0f0] border-b border-[#e0a0a0] px-4 py-2 text-[11px] text-cat-identity"
          role="alert"
        >
          {error}{" "}
          <button className="underline" onClick={() => setError(null)}>
            dismiss
          </button>
        </div>
      )}
      <BrowseView initialGroups={groups} fromDb={true} adminApi={adminApi} />
    </div>
  );
}
