import AdminResources from "@/components/admin/AdminResources";
import { createClient } from "@/lib/supabase/server";
import { assembleGroups } from "@/lib/data";
import { SEED_GROUPS } from "@/lib/seed-data";
import type { DbGroup, DbResource } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const supabase = createClient();
  const [groupsRes, resourcesRes] = await Promise.all([
    supabase.from("resource_groups").select("*"),
    supabase.from("resources").select("*"), // admins see unapproved too
  ]);

  const dbGroups = (groupsRes.data ?? []) as DbGroup[];
  const dbResources = (resourcesRes.data ?? []) as DbResource[];

  if (dbGroups.length === 0)
    return (
      <div className="px-4 py-8 text-center text-[12px] text-[#888] leading-relaxed">
        The database is empty. Run the schema SQL in the Supabase SQL Editor,
        then <code className="bg-white px-1 rounded">npm run seed</code> to
        load all {SEED_GROUPS.length} groups. See the README.
      </div>
    );

  return (
    <AdminResources initialGroups={assembleGroups(dbGroups, dbResources)} />
  );
}
