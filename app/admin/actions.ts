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
    redirectTo: `${siteUrl}/admin`,
  });

  if (error) {
    return { error: error.message.includes("already registered") ? "این ایمیل قبلاً ثبت شده است." : error.message };
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
