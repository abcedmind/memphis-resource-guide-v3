import { createClient } from "@supabase/supabase-js";
import { SEED_GROUPS } from "./seed-data";
import type { DbGroup, DbResource, Resource, ResourceGroup } from "./types";

export function dbResourceToApp(r: DbResource): Resource {
  return {
    id: r.id,
    name: r.name,
    cat: r.category,
    desc: r.description,
    how: r.how_to_access,
    url: r.url ?? "",
    minAge: r.min_age,
    maxAge: r.max_age,
    flags: r.flags ?? [],
    serve: r.serve,
    basicInfoOnly: r.basic_info_only,
  };
}

export function assembleGroups(
  groups: DbGroup[],
  resources: DbResource[]
): ResourceGroup[] {
  return groups
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((g) => ({
      id: g.id,
      label: g.label,
      kind: g.kind,
      charStage: g.char_stage,
      color: g.color,
      note: g.note ?? undefined,
      sortOrder: g.sort_order,
      resources: resources
        .filter((r) => r.group_id === g.id)
        .map(dbResourceToApp),
    }));
}

/**
 * Fetch all groups + approved resources from Supabase.
 * Falls back to the bundled seed data if the database is unreachable
 * or empty (e.g. before the seed script has run) — the guide must
 * never show a blank page to a family.
 */
export async function fetchGroups(): Promise<{
  groups: ResourceGroup[];
  fromDb: boolean;
}> {
  try {
    // Anonymous, cookie-free client: public data only, so browse/family
    // pages stay statically cacheable (ISR) — fast on limited bandwidth.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const [groupsRes, resourcesRes] = await Promise.all([
      supabase.from("resource_groups").select("*"),
      supabase
        .from("resources")
        .select("*")
        .eq("is_approved", true)
        .order("sort_order", { ascending: true }),
    ]);
    if (groupsRes.error || resourcesRes.error) throw (groupsRes.error || resourcesRes.error);
    const groups = (groupsRes.data ?? []) as DbGroup[];
    const resources = (resourcesRes.data ?? []) as DbResource[];
    if (groups.length === 0) return { groups: SEED_GROUPS, fromDb: false };
    return { groups: assembleGroups(groups, resources), fromDb: true };
  } catch {
    return { groups: SEED_GROUPS, fromDb: false };
  }
}
