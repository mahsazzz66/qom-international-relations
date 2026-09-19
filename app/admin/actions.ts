"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("forbidden");
  }
  return user;
}

export async function inviteStaffAction(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim();
  const fullName = String(formData.get("full_name") || "").trim();
  const role = String(formData.get("role") || "editor");

  if (!email) return { error: "ایمیل الزامی است." };

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qom-international-relations.vercel.app";

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
    // Must point at a page that (a) isn't guarded by the /admin login
    // check, since the visitor has no session yet when they land here, and
    // (b) actually consumes the invite token and lets them set a password —
    // sending it straight to /admin left the token unused and the person
    // stuck at the login screen. See app/admin/set-password/page.tsx.
    redirectTo: `${siteUrl}/admin/set-password`,
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "این ایمیل قبلاً ثبت شده است." };
    }
    if (error.message.toLowerCase().includes("rate limit")) {
      return {
        error:
          "سقف ارسال ایمیل توسط Supabase پر شده (پیش‌فرض خیلی کمه، معمولاً چند ایمیل در ساعت). چند دقیقه صبر کن و دوباره امتحان کن، یا SMTP اختصاصی رو در تنظیمات Supabase وصل کن تا این محدودیت برداشته بشه.",
      };
    }
    return { error: error.message };
  }

  // Set the role (and name) chosen at invite time — the DB trigger already
  // created the profile row with the default 'editor' role.
  if (data.user) {
    await admin
      .from("profiles")
      .update({ role: role === "admin" ? "admin" : "editor", full_name: fullName })
      .eq("id", data.user.id);
  }

  revalidatePath("/admin/staff");
  return { ok: true };
}

export async function updateStaffRoleAction(userId: string, role: "admin" | "editor") {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin/staff");
}

export async function removeStaffAction(userId: string) {
  const currentUser = await requireAdmin();
  if (currentUser.id === userId) {
    return { error: "نمی‌توانید حساب خودتان را حذف کنید." };
  }
  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(userId);
  revalidatePath("/admin/staff");
  return { ok: true };
}
