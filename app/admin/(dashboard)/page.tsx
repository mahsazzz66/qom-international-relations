import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ContentType } from "@/lib/supabase/types";

const CARDS: { type: ContentType; label: string; href: string; icon: string }[] = [
  { type: "news", label: "خبر", href: "/admin/news", icon: "M4 5h16v14H4zM8 9h8M8 13h8M8 17h4" },
  { type: "statement", label: "بیانیه / پیام", href: "/admin/statements", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
  { type: "event", label: "رویداد", href: "/admin/events", icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { type: "photo", label: "عکس", href: "/admin/media", icon: "M4 4h16v16H4zM4 15l4-4 4 4 4-6 4 5" },
  { type: "video", label: "ویدیو", href: "/admin/media", icon: "M15 10l5-3v10l-5-3M3 6h11v12H3z" },
  { type: "document", label: "سند", href: "/admin/media", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6" },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const counts = await Promise.all(
    CARDS.map(async (c) => {
      const { count } = await supabase
        .from("content_items")
        .select("id", { count: "exact", head: true })
        .eq("type", c.type);
      return count ?? 0;
    })
  );

  const { data: recent } = await supabase
    .from("content_items")
    .select("id, type, title_ar, title_en, published, updated_at")
    .order("updated_at", { ascending: false })
    .limit(6);

  return (
    <div dir="rtl">
      <h1 className="mb-1 font-serif text-2xl font-medium text-navy">داشبورد</h1>
      <p className="mb-8 text-sm text-gray">خلاصه‌ای از محتوای فعلی سایت</p>

      <div className="mb-10 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
        {CARDS.map((c, i) => (
          <Link
            key={c.type}
            href={c.href}
            className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gold/12">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8A75D" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d={c.icon} />
              </svg>
            </div>
            <div className="text-2xl font-semibold text-navy">{counts[i]}</div>
            <div className="mt-0.5 text-[13px] text-gray">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-lg font-medium text-navy">آخرین ویرایش‌ها</h2>
        {!recent || recent.length === 0 ? (
          <p className="text-sm text-gray">هنوز محتوایی ثبت نشده — از منوی سمت راست شروع کنید.</p>
        ) : (
          <div className="divide-y divide-navy/8">
            {recent.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium text-navy">{item.title_ar || item.title_en || "(بدون عنوان)"}</div>
                  <div className="text-[12px] text-gray">{new Date(item.updated_at).toLocaleString("fa-IR")}</div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    item.published ? "bg-teal/10 text-teal" : "bg-gray/10 text-gray"
                  }`}
                >
                  {item.published ? "منتشرشده" : "پیش‌نویس"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
