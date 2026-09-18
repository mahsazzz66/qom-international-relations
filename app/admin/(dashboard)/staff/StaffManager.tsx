"use client";

import { useState, useTransition } from "react";
import { inviteStaffAction, updateStaffRoleAction, removeStaffAction } from "../../actions";
import type { Profile } from "@/lib/supabase/types";

export default function StaffManager({
  staff,
  currentUserId,
}: {
  staff: Profile[];
  currentUserId: string;
}) {
  const [pending, startTransition] = useTransition();
  const [showInvite, setShowInvite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleInvite(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await inviteStaffAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("دعوت‌نامه با موفقیت ارسال شد.");
        setShowInvite(false);
      }
    });
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-medium text-navy">پرسنل و دسترسی‌ها</h1>
          <p className="mt-1 text-sm text-gray">{staff.length} نفر</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
        >
          + دعوت پرسنل جدید
        </button>
      </div>

      {success && (
        <div className="mb-4 rounded-lg border border-teal/30 bg-teal/10 px-3.5 py-2.5 text-[13px] text-teal">
          {success}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy/10 bg-navy/[0.03] text-[12px] text-gray">
              <th className="px-4 py-3 text-right font-medium">نام</th>
              <th className="px-4 py-3 text-right font-medium">ایمیل</th>
              <th className="px-4 py-3 text-right font-medium">نقش</th>
              <th className="px-4 py-3 text-right font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/8">
            {staff.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-navy">{p.full_name || "—"}</td>
                <td dir="ltr" className="px-4 py-3 text-left text-gray">{p.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={p.role}
                    disabled={pending || p.id === currentUserId}
                    onChange={(e) =>
                      startTransition(() => updateStaffRoleAction(p.id, e.target.value as "admin" | "editor"))
                    }
                    className="rounded-lg border border-navy/15 px-2.5 py-1.5 text-[12px] disabled:opacity-50"
                  >
                    <option value="editor">ویرایشگر</option>
                    <option value="admin">مدیر ارشد</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  {p.id !== currentUserId && (
                    <button
                      disabled={pending}
                      onClick={() => {
                        if (confirm(`دسترسی ${p.full_name || p.email} حذف شود؟`)) {
                          startTransition(async () => {
                            await removeStaffAction(p.id);
                          });
                        }
                      }}
                      className="rounded-lg border border-red/30 px-3 py-1.5 text-[12px] text-red hover:bg-red/10 disabled:opacity-50"
                    >
                      حذف دسترسی
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4" onClick={() => setShowInvite(false)}>
          <form
            action={handleInvite}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-2xl bg-white p-7 shadow-2xl"
          >
            <h2 className="mb-5 font-serif text-xl font-medium text-navy">دعوت پرسنل جدید</h2>

            {error && (
              <div className="mb-4 rounded-lg border border-red/30 bg-red/10 px-3.5 py-2.5 text-[13px] text-red">
                {error}
              </div>
            )}

            <label className="mb-1.5 block text-[13px] font-medium text-navy">نام کامل</label>
            <input
              name="full_name"
              required
              className="mb-4 w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
            />

            <label className="mb-1.5 block text-[13px] font-medium text-navy">ایمیل</label>
            <input
              name="email"
              type="email"
              dir="ltr"
              required
              className="mb-4 w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
            />

            <label className="mb-1.5 block text-[13px] font-medium text-navy">نقش</label>
            <select
              name="role"
              defaultValue="editor"
              className="mb-6 w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
            >
              <option value="editor">ویرایشگر (فقط مدیریت محتوا)</option>
              <option value="admin">مدیر ارشد (دسترسی کامل + مدیریت پرسنل)</option>
            </select>

            <p className="mb-5 text-[12px] leading-relaxed text-gray">
              یک ایمیل دعوت برای تنظیم رمز عبور برای این فرد ارسال می‌شود.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="rounded-lg border border-navy/15 px-4 py-2.5 text-[13px] text-navy"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-gold px-5 py-2.5 text-[13px] font-semibold text-navy disabled:opacity-50"
              >
                {pending ? "در حال ارسال..." : "ارسال دعوت‌نامه"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
