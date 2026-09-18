"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOutAction } from "../actions";
import { adminFont } from "@/lib/adminFont";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: "M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-5H4zM14 10h6V4h-6z" },
  { href: "/admin/pages", label: "صفحات سایت", icon: "M4 4h11l5 5v11H4zM15 4v5h5" },
  { href: "/admin/news", label: "اخبار", icon: "M4 5h16v14H4zM8 9h8M8 13h8M8 17h4" },
  { href: "/admin/statements", label: "بیانیه‌ها و پیام‌ها", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
  { href: "/admin/events", label: "رویدادها", icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { href: "/admin/media", label: "رسانه (عکس/ویدیو/سند)", icon: "M4 4h16v16H4zM4 15l4-4 4 4 4-6 4 5" },
  { href: "/admin/staff", label: "پرسنل و دسترسی‌ها", icon: "M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75", adminOnly: true },
];

export default function AdminShell({
  children,
  userEmail,
  fullName,
  role,
}: {
  children: React.ReactNode;
  userEmail: string;
  fullName: string;
  role: "admin" | "editor";
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = NAV.filter((n) => !n.adminOnly || role === "admin");

  return (
    <div dir="rtl" className={`${adminFont.className} min-h-screen bg-bg`}>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-navy/10 bg-white px-4 py-3 md:hidden">
        <span className="font-serif text-lg font-medium text-navy">پنل مدیریت</span>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg border border-navy/15 p-2"
          aria-label="منو"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0b1f3a" strokeWidth={1.8}>
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="mx-auto flex max-w-[1440px]">
        {/* Sidebar */}
        <aside
          className={`${
            mobileOpen ? "block" : "hidden"
          } w-full shrink-0 border-l border-navy/10 bg-navy md:block md:w-[260px] md:min-h-screen`}
        >
          <div className="hidden items-center gap-3 border-b border-white/10 px-6 py-6 md:flex">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8A75D" strokeWidth={1.5}>
                <path d="M12 2l3.6 7.3 8 1.2-5.8 5.6 1.4 8-7.2-3.8-7.2 3.8 1.4-8L.4 10.5l8-1.2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="truncate font-serif text-[15px] font-medium text-white">روابط بین‌الملل قم</div>
              <div className="text-[11px] text-white/45">پنل مدیریت محتوا</div>
            </div>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13.5px] transition-colors ${
                    active ? "bg-gold text-navy font-semibold" : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-2.5 rounded-lg bg-white/[0.05] px-3 py-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal/20 text-[12px] font-semibold text-dark-teal">
                {(fullName || userEmail).slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12.5px] font-medium text-white">{fullName || userEmail}</div>
                <div className="text-[10.5px] text-white/40">{role === "admin" ? "مدیر ارشد" : "ویرایشگر"}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                target="_blank"
                className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-center text-[12px] text-white/70 hover:bg-white/[0.06]"
              >
                مشاهده سایت
              </Link>
              <form action={signOutAction} className="flex-1">
                <button className="w-full rounded-lg border border-white/15 px-3 py-2 text-[12px] text-white/70 hover:bg-white/[0.06]">
                  خروج
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-5 py-7 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
