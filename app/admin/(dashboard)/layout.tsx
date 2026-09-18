import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "./AdminShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The proxy (middleware) already guards /admin, but this is the
  // authoritative server-side check for anything rendered here.
  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Auth account exists but the profile row hasn't been created yet
    // (should be instant via the DB trigger) — ask them to retry.
    return (
      <div className="grid min-h-screen place-items-center bg-bg px-6 text-center" dir="rtl">
        <div>
          <p className="mb-2 font-serif text-xl text-navy">حساب شما هنوز آماده نیست</p>
          <p className="text-sm text-gray">چند لحظه صبر کنید و صفحه را دوباره بارگذاری کنید.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell userEmail={user.email ?? ""} fullName={profile.full_name} role={profile.role}>
      {children}
    </AdminShell>
  );
}
