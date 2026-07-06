import { createClient } from "@/lib/supabase/server";
import Dashboard, {
  type DashboardData,
  type WeekBin,
} from "@/components/admin/Dashboard";
import { CAT } from "@/lib/constants";
import type { CategoryId } from "@/lib/types";

export const dynamic = "force-dynamic";

const WEEKS = 8;

function weekStart(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  out.setDate(out.getDate() - out.getDay()); // Sunday-start weeks
  return out;
}

function binByWeek(dates: string[]): WeekBin[] {
  const now = new Date();
  const bins: { start: Date; label: string; count: number }[] = [];
  for (let i = WEEKS - 1; i >= 0; i--) {
    const start = weekStart(new Date(now.getTime() - i * 7 * 86400000));
    bins.push({
      start,
      label: start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: 0,
    });
  }
  for (const iso of dates) {
    const t = new Date(iso).getTime();
    for (let i = bins.length - 1; i >= 0; i--) {
      if (t >= bins[i].start.getTime()) {
        bins[i].count++;
        break;
      }
    }
  }
  return bins.map(({ label, count }) => ({ label, count }));
}

async function loadDashboardData(): Promise<DashboardData> {
  const empty: DashboardData = {
    dbReady: false,
    pending: 0,
    approved: 0,
    rejected: 0,
    registrationsTotal: 0,
    resourcesTotal: 0,
    submissionsByWeek: binByWeek([]),
    registrationsByWeek: binByWeek([]),
    resourcesByCategory: (Object.keys(CAT) as CategoryId[]).map((cat) => ({
      cat,
      count: 0,
    })),
  };

  try {
    const supabase = createClient();
    const [subs, regs, res] = await Promise.all([
      supabase.from("submissions").select("created_at,status"),
      supabase.from("registrations").select("created_at"),
      supabase.from("resources").select("category"),
    ]);
    if (subs.error || regs.error || res.error) return empty;

    const submissions = subs.data ?? [];
    const registrations = regs.data ?? [];
    const resources = res.data ?? [];

    const byCat = new Map<string, number>();
    for (const r of resources)
      byCat.set(r.category, (byCat.get(r.category) ?? 0) + 1);

    return {
      dbReady: true,
      pending: submissions.filter((s) => s.status === "pending").length,
      approved: submissions.filter((s) => s.status === "approved").length,
      rejected: submissions.filter((s) => s.status === "rejected").length,
      registrationsTotal: registrations.length,
      resourcesTotal: resources.length,
      submissionsByWeek: binByWeek(submissions.map((s) => s.created_at)),
      registrationsByWeek: binByWeek(registrations.map((r) => r.created_at)),
      resourcesByCategory: (Object.keys(CAT) as CategoryId[])
        .map((cat) => ({ cat, count: byCat.get(cat) ?? 0 }))
        .sort((a, b) => b.count - a.count),
    };
  } catch {
    return empty;
  }
}

export default async function AdminIndex() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null; // admin layout renders the login form

  const data = await loadDashboardData();
  return <Dashboard data={data} />;
}
