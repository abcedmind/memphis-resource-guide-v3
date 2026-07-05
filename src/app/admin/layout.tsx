import LoginForm from "@/components/admin/LoginForm";
import AdminNav from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <LoginForm />;

  const { count } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <div>
      <AdminNav pendingCount={count ?? 0} email={user.email ?? "admin"} />
      {children}
    </div>
  );
}
