import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import StaffManager from "./StaffManager";

export default async function AdminStaffPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: myProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (myProfile?.role !== "admin") {
    return (
      <div dir="rtl" className="rounded-2xl border border-navy/10 bg-white p-8 text-center">
        <p className="text-sm text-gray">این بخش فقط برای مدیر ارشد قابل‌دسترسی است.</p>
      </div>
    );
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: true });

  const admin = createAdminClient();
  const { data: authList } = await admin.auth.admin.listUsers({ perPage: 200 });
  const emailById = new Map(authList?.users.map((u) => [u.id, u.email ?? ""]));

  const staff = (profiles ?? []).map((p) => ({ ...p, email: emailById.get(p.id) ?? "" }));

  return <StaffManager staff={staff} currentUserId={user.id} />;
}
