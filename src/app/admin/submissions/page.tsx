import SubmissionsQueue from "@/components/admin/SubmissionsQueue";
import { createClient } from "@/lib/supabase/server";
import type { DbSubmission } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <SubmissionsQueue initialSubmissions={(data ?? []) as DbSubmission[]} />
  );
}
