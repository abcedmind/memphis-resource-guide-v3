import FamiliesTable from "@/components/admin/FamiliesTable";
import { createClient } from "@/lib/supabase/server";
import type { DbRegistration } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminFamiliesPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  return <FamiliesTable initialRegs={(data ?? []) as DbRegistration[]} />;
}
