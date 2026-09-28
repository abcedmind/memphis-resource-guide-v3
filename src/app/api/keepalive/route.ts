/**
 * GET /api/keepalive — called by Vercel Cron (vercel.json), three times a day.
 *
 * Reports which store the forms are using, and makes one small read against
 * the Supabase project if one is configured, so a free project keeps showing
 * daily activity and is not paused. Reads public data only (the same
 * resource groups the home page shows), so it needs no secret.
 * 200 = fine or nothing to ping · 503 = Supabase configured but not answering.
 */
import { activeStore, pingSupabase } from "@/lib/store";
import { reply } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await pingSupabase();
  const store = activeStore();
  const healthy = supabase === "ok" || supabase === "not_configured";
  return reply(healthy ? 200 : 503, { store, supabase });
}
