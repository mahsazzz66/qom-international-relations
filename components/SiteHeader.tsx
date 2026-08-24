"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import SearchBox from "./SearchBox";

const NAV_LINKS = [
  { href: "/", key: "Home" },
  { href: "/news", key: "News" },
  { href: "/about", key: "About Us" },
  { href: "/about-qom", key: "About Qom" },
];

const ACTIVITIES_LINKS = [
  { href: "/cooperation", title: "International Cooperation", sub: "Sister cities, agreements and bilateral programmes." },
  { href: "/memberships", title: "Memberships & Networks", sub: "Organisations and municipal networks Qom belongs to." },
  { href: "/events", title: "International Events & Participation", sub: "Conferences, summits and forums attended abroad." },
  { href: "/meetings", title: "International Meetings in Qom", sub: "Sessions convened in the city, online and hybrid." },
  { href: "/culture", title: "Cultural Weeks & Festivals", sub: "Intercultural programmes hosted for international guests." },
];

const DRAWER_GROUPS: { label?: string; links: { href: string; key: string }[] }[] = [
  { links: [
    { href: "/", key: "Home" },
    { href: "/news", key: "News" },
    { href: "/about", key: "About Us" },
    { href: "/about-qom", key: "About Qom" },
    { href: "/pcwg", key: "Pilgrimage Cities Working Group" },
  ] },
  { label: "International Activities", links: [
    { href: "/cooperation", key: "International Cooperation" },
    { href: "/events", key: "International Events & Participation" },
    { href: "/meetings", key: "International Meetings in Qom" },
    { href: "/culture", key: "Cultural Weeks & Festivals" },
    { href: "/memberships", key: "Memberships & Networks" },
  ] },
  { label: "Municipality", links: [
    { href: "/departments", key: "Municipal Deputy Departments" },
    { href: "/investment", key: "Investment Opportunities" },
    { href: "/feedback", key: "Visitor Feedback" },
  ] },
  { label: "Media & contact", links: [
    { href: "/media", key: "Media & Publications" },
    { href: "/contact", key: "Contact" },
  ] },
];

/**
 * The source's `NAVGROUP` map (script line 2794): which mega-menu group each
 * page belongs to, so that group's trigger keeps a gold underline while the
 * reader is on one of its pages.
 */
const NAV_GROUP_ROUTES: Record<string, "activities" | "municipality"> = {
  "/cooperation": "activities",
  "/events": "activities",
  "/meetings": "activities",
  "/culture": "activities",
  "/memberships": "activities",
  "/departments": "municipality",
  "/investment": "municipality",
  "/feedback": "municipality",
  "/media": "municipality",
};

function NAV_GROUP_FOR(pathname: string): "activities" | "municipality" | null {
  if (NAV_GROUP_ROUTES[pathname]) return NAV_GROUP_ROUTES[pathname];
  // `deptdetail` is in the source map, `invdetail` and `article` are not.
  if (pathname.startsWith("/departments/")) return "municipality";
  return null;
}

export default function SiteHeader() {
  const { t, locale, setLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mega, setMega] = useState<"activities" | "municipality" | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close the drawer/mega menu on navigation — a legitimate external-event
    // (route change) response, not a derived-state sync loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
    setMega(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setDrawerOpen(false); setMega(null); }
    };
    const onClick = (e: MouseEvent) => {
      if (mega && navRef.current && !navRef.current.contains(e.target as Node)) setMega(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [mega]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));
  const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
  // Which top-level nav group the current route belongs to — the source's
  // NAVGROUP map. The matching trigger keeps its gold underline even when its
  // panel is closed.
  const navGroup = NAV_GROUP_FOR(pathname);
  const triggerBorder = (key: "activities" | "municipality") =>
    mega === key || navGroup === key ? "#C8A75D" : "transparent";

  return (
    <>
      <header
        className="sticky top-0 z-100 border-b backdrop-saturate-150 backdrop-blur-[6px] transition-[background,border-color,box-shadow] duration-300"
        style={{
          background:
            theme === "dark"
              ? compact ? "rgba(13,19,31,.97)" : "rgba(13,19,31,.93)"
              : compact ? "rgba(250,248,244,.97)" : "rgba(250,248,244,.94)",
          borderBottomColor:
            theme === "dark"
              ? "rgba(250,248,244,.16)"
              : compact ? "rgba(11,31,58,.16)" : "rgba(11,31,58,.10)",
          boxShadow: compact ? "0 18px 38px -30px rgba(11,31,58,.62)" : "none",
        }}
      >
        <div
          data-header-top
          className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-6 px-4 transition-[padding] duration-200 sm:px-6"
          style={{ paddingTop: compact ? 7 : 14, paddingBottom: compact ? 7 : 14 }}
        >
          <button
            type="button"
            aria-label={t("Menu")}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
            className="grid h-[46px] w-[46px] shrink-0 place-items-center gap-[5px] border border-navy/20 dark:border-dark-line bg-transparent transition-colors hover:border-gold hover:bg-gold/10 lg:hidden [display:grid]"
            data-burger
          >
            <span className="block h-[1.5px] w-5 bg-navy dark:bg-dark-navy" />
            <span className="block h-[1.5px] w-5 bg-navy dark:bg-dark-navy" />
            <span className="block h-[1.5px] w-5 bg-navy dark:bg-dark-navy" />
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div
              className="grid place-items-center border-[1.5px] border-gold bg-navy dark:bg-dark-navy font-serif text-[19px] tracking-[.02em] text-gold transition-all"
              style={{ width: compact ? 36 : 44, height: compact ? 36 : 44, fontSize: compact ? 16 : 19 }}
            >
              Q
            </div>
            <div className="leading-[1.15]">
              <div className="font-serif text-base font-semibold tracking-[.01em] text-navy dark:text-dark-ink">{t("Qom Municipality")}</div>
              <div
                className="overflow-hidden text-[10.5px] tracking-[.16em] text-gray dark:text-dark-ink-dimmer uppercase transition-all"
                style={{ maxHeight: compact ? 0 : 20, opacity: compact ? 0 : 1 }}
              >
                {t("International Relations")}
              </div>
            </div>
          </Link>

          <div className="flex-1" />

          <SearchBox />

          <div className="flex shrink-0 items-center gap-4">
            <div className="flex items-center gap-0.5 border border-navy/[.16] dark:border-dark-line p-[3px]">
              <button
                type="button"
                onClick={() => setLocale("en")}
                data-on={locale === "en" ? "1" : undefined}
                className={`border-0 font-sans text-[11.5px] tracking-[.1em] cursor-pointer px-[11px] py-1.5${locale === "en" ? "" : " text-gray dark:text-dark-ink-dimmer"}`}
                style={{ background: locale === "en" ? "#0B1F3A" : "transparent", color: locale === "en" ? "#FAF8F4" : undefined }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("ar")}
                data-on={locale === "ar" ? "1" : undefined}
                className={`border-0 font-sans text-[11.5px] tracking-[.1em] cursor-pointer px-[11px] py-1.5${locale === "ar" ? "" : " text-gray dark:text-dark-ink-dimmer"}`}
                style={{ background: locale === "ar" ? "#0B1F3A" : "transparent", color: locale === "ar" ? "#FAF8F4" : undefined }}
              >
                AR
              </button>
            </div>
            <button
              type="button"
              aria-label={t("Switch theme")}
              title={t("Switch theme")}
              onClick={toggleTheme}
              className="grid h-10 w-10 shrink-0 place-items-center border border-navy/[.16] dark:border-dark-line bg-transparent text-slate dark:text-dark-ink-dim transition-colors hover:border-gold hover:text-gold"
            >
              {theme === "dark" ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4.2" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M21 13.2A9 9 0 1 1 10.8 3a7 7 0 0 0 10.2 10.2z" /></svg>
              )}
            </button>
            <Link
              href="/contact"
              data-cta
              className="border border-navy bg-navy dark:bg-dark-navy text-[13px] font-medium text-bg transition-colors hover:border-gold hover:bg-gold hover:text-navy whitespace-nowrap"
              style={{ paddingTop: compact ? 10 : 13, paddingBottom: compact ? 10 : 13, paddingLeft: 20, paddingRight: 20 }}
            >
              {t("Contact Us")}
            </Link>
          </div>
        </div>

        <div
          ref={navRef}
          data-navbar
          onMouseLeave={() => canHover() && setMega(null)}
          className="relative hidden border-t border-navy/10 dark:border-dark-line lg:block"
          style={{ paddingTop: compact ? 3 : 7, paddingBottom: compact ? 3 : 7 }}
        >
          <div className="mx-auto max-w-[1280px] px-6">
            <nav aria-label={t("Primary")} className="flex flex-wrap items-center gap-[26px]">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="whitespace-nowrap border-b-2 py-[15px] text-[12.5px] font-medium transition-colors"
                  style={{ borderBottomColor: isActive(l.href) ? "#C8A75D" : "transparent" }}
                >
                  {t(l.key)}
                </Link>
              ))}
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={mega === "activities"}
                onClick={() => setMega((m) => (m === "activities" ? null : "activities"))}
                onMouseEnter={() => canHover() && setMega("activities")}
                onFocus={() => setMega("activities")}
                className="inline-flex items-center gap-[7px] whitespace-nowrap border-0 border-b-2 bg-transparent py-[15px] font-sans text-[12.5px] font-medium text-navy dark:text-dark-ink cursor-pointer transition-colors"
                style={{ borderBottomColor: triggerBorder("activities") }}
              >
                {t("International Activities")}
                <span className="inline-block text-[8px] text-gold transition-transform" style={{ transform: mega === "activities" ? "rotate(180deg)" : "none" }}>&#9660;</span>
              </button>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={mega === "municipality"}
                onClick={() => setMega((m) => (m === "municipality" ? null : "municipality"))}
                onMouseEnter={() => canHover() && setMega("municipality")}
                onFocus={() => setMega("municipality")}
                className="inline-flex items-center gap-[7px] whitespace-nowrap border-0 border-b-2 bg-transparent py-[15px] font-sans text-[12.5px] font-medium text-navy dark:text-dark-ink cursor-pointer transition-colors"
                style={{ borderBottomColor: triggerBorder("municipality") }}
              >
                {t("Municipality")}
                <span className="inline-block text-[8px] text-gold transition-transform" style={{ transform: mega === "municipality" ? "rotate(180deg)" : "none" }}>&#9660;</span>
              </button>
              <Link
                href="/pcwg"
                className="whitespace-nowrap border-b-2 py-[15px] text-[12.5px] font-medium transition-colors"
                style={{ borderBottomColor: isActive("/pcwg") ? "#C8A75D" : "transparent" }}
              >
                {t("Pilgrimage Cities Working Group")}
              </Link>
            </nav>
          </div>

          {mega === "activities" && (
            <div className="absolute inset-x-0 top-full z-130 border-b border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 shadow-[0_44px_70px_-46px_rgba(11,31,58,.55)]">
              <div className="mx-auto grid max-w-[1280px] gap-7 px-6 py-[34px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(238px, 1fr))" }}>
                <div className="grid content-start gap-0.5">
                  <div className="font-mono pb-3 text-[10px] tracking-[.18em] uppercase text-gold">{t("Cooperation")}</div>
                  {ACTIVITIES_LINKS.slice(0, 2).map((l) => (
                    <Link key={l.href} href={l.href} className="grid gap-1 px-3.5 py-2.5 transition-colors hover:bg-gold/10">
                      <span className="text-sm font-semibold text-navy dark:text-dark-ink">{t(l.title)}</span>
                      <span className="text-[12.5px] leading-relaxed text-gray dark:text-dark-ink-dimmer">{t(l.sub)}</span>
                    </Link>
                  ))}
                </div>
                <div className="grid content-start gap-0.5">
                  <div className="font-mono pb-3 text-[10px] tracking-[.18em] uppercase text-gold">{t("Participation")}</div>
                  {ACTIVITIES_LINKS.slice(2, 4).map((l) => (
                    <Link key={l.href} href={l.href} className="grid gap-1 px-3.5 py-2.5 transition-colors hover:bg-gold/10">
                      <span className="text-sm font-semibold text-navy dark:text-dark-ink">{t(l.title)}</span>
                      <span className="text-[12.5px] leading-relaxed text-gray dark:text-dark-ink-dimmer">{t(l.sub)}</span>
                    </Link>
                  ))}
                </div>
                <div className="grid content-start gap-0.5">
                  <div className="font-mono pb-3 text-[10px] tracking-[.18em] uppercase text-gold">{t("Culture")}</div>
                  {ACTIVITIES_LINKS.slice(4, 5).map((l) => (
                    <Link key={l.href} href={l.href} className="grid gap-1 px-3.5 py-2.5 transition-colors hover:bg-gold/10">
                      <span className="text-sm font-semibold text-navy dark:text-dark-ink">{t(l.title)}</span>
                      <span className="text-[12.5px] leading-relaxed text-gray dark:text-dark-ink-dimmer">{t(l.sub)}</span>
                    </Link>
                  ))}
                </div>
                <div className="grid gap-3 border border-navy/[.14] dark:border-dark-line bg-navy dark:bg-dark-navy p-6 text-bg content-start">
                  <div className="font-mono text-[10px] tracking-[.18em] uppercase text-gold">{t("Presidency")}</div>
                  <div className="font-serif text-[19px] leading-tight">{t("Pilgrimage Cities Working Group")}</div>
                  <p className="m-0 text-[13px] leading-relaxed text-[rgba(250,248,244,.72)]">{t("Qom Municipality holds the presidency and the permanent secretariat of the network.")}</p>
                  <Link href="/pcwg" className="mt-1 justify-self-start border-b border-gold/50 pb-[3px] text-[12.5px] font-semibold text-gold hover:text-bg">{t("Open the network →")}</Link>
                </div>
              </div>
            </div>
          )}

          {mega === "municipality" && (
            <div className="absolute inset-x-0 top-full z-130 border-b border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 shadow-[0_44px_70px_-46px_rgba(11,31,58,.55)]">
              <div className="mx-auto grid max-w-[1280px] gap-7 px-6 py-[34px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(238px, 1fr))" }}>
                <div className="grid content-start gap-0.5">
                  <div className="font-mono pb-3 text-[10px] tracking-[.18em] uppercase text-gold">{t("Administration")}</div>
                  <Link href="/departments" className="grid gap-1 px-3.5 py-2.5 transition-colors hover:bg-gold/10">
                    <span className="text-sm font-semibold text-navy dark:text-dark-ink">{t("Municipal Deputy Departments")}</span>
                    <span className="text-[12.5px] leading-relaxed text-gray dark:text-dark-ink-dimmer">{t("The deputy departments and their international remit.")}</span>
                  </Link>
                </div>
                <div className="grid content-start gap-0.5">
                  <div className="font-mono pb-3 text-[10px] tracking-[.18em] uppercase text-gold">{t("Economy")}</div>
                  <Link href="/investment" className="grid gap-1 px-3.5 py-2.5 transition-colors hover:bg-gold/10">
                    <span className="text-sm font-semibold text-navy dark:text-dark-ink">{t("Investment Opportunities")}</span>
                    <span className="text-[12.5px] leading-relaxed text-gray dark:text-dark-ink-dimmer">{t("Municipal projects open to international participation.")}</span>
                  </Link>
                </div>
                <div className="grid content-start gap-0.5">
                  <div className="font-mono pb-3 text-[10px] tracking-[.18em] uppercase text-gold">{t("Engagement")}</div>
                  <Link href="/feedback" className="grid gap-1 px-3.5 py-2.5 transition-colors hover:bg-gold/10">
                    <span className="text-sm font-semibold text-navy dark:text-dark-ink">{t("Visitor Feedback")}</span>
                    <span className="text-[12.5px] leading-relaxed text-gray dark:text-dark-ink-dimmer">{t("Share your experience of visiting Qom.")}</span>
                  </Link>
                  <Link href="/media" className="grid gap-1 px-3.5 py-2.5 transition-colors hover:bg-gold/10">
                    <span className="text-sm font-semibold text-navy dark:text-dark-ink">{t("Media & Publications")}</span>
                    <span className="text-[12.5px] leading-relaxed text-gray dark:text-dark-ink-dimmer">{t("Photography, video, reports and the press kit.")}</span>
                  </Link>
                </div>
                <div className="grid gap-3 border border-navy/[.14] dark:border-dark-line bg-navy dark:bg-dark-navy p-6 text-bg content-start">
                  <div className="font-mono text-[10px] tracking-[.18em] uppercase text-gold">{t("Single point of contact")}</div>
                  <div className="font-serif text-[19px] leading-tight">{t("International Relations Office")}</div>
                  <p className="m-0 text-[13px] leading-relaxed text-[rgba(250,248,244,.72)]">{t("Enquiries from municipalities, institutions, delegations and investors are handled by one department.")}</p>
                  <Link href="/contact" className="mt-1 justify-self-start border-b border-gold/50 pb-[3px] text-[12.5px] font-semibold text-gold hover:text-bg">{t("Contact the office →")}</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile drawer + overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 z-200 bg-navy/55 dark:bg-dark-fill transition-opacity duration-[350ms]"
        style={{ opacity: drawerOpen ? 1 : 0, pointerEvents: drawerOpen ? "auto" : "none" }}
      />
      <aside
        className="fixed top-0 z-201 flex h-full w-[min(420px,88vw)] flex-col bg-navy dark:bg-dark-navy text-bg shadow-[30px_0_60px_-30px_rgba(11,31,58,.7)] transition-transform duration-[420ms] ease-[cubic-bezier(.22,.61,.36,1)] left-0 rtl:left-auto rtl:right-0"
        style={{ transform: drawerOpen ? "translateX(0)" : locale === "ar" ? "translateX(100%)" : "translateX(-100%)" }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-bg/[.16] px-[26px] py-[22px]">
          <div>
            <div className="font-mono text-[10.5px] tracking-[.2em] uppercase text-gold">{t("Menu")}</div>
            <div className="mt-[5px] text-[12.5px] text-[rgba(250,248,244,.62)]">{t("Browse dedicated pages")}</div>
          </div>
          <button
            type="button"
            aria-label={t("Close")}
            onClick={() => setDrawerOpen(false)}
            className="h-10 w-10 border border-bg/25 bg-transparent text-[17px] text-bg transition-colors hover:border-gold hover:text-gold"
          >
            ×
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2.5">
          {DRAWER_GROUPS.map((group, gi) => (
            <React.Fragment key={gi}>
              {group.label && (
                <div className="font-mono px-[26px] pt-[22px] pb-2 text-[10px] tracking-[.2em] uppercase text-gold">{t(group.label)}</div>
              )}
              {group.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center justify-between gap-3.5 border-l-2 px-[26px] py-[13px] text-[14.5px] transition-colors"
                  style={{
                    borderLeftColor: isActive(l.href) ? "#C8A75D" : "transparent",
                    background: isActive(l.href) ? "rgba(250,248,244,.08)" : "transparent",
                    color: isActive(l.href) ? "#FAF8F4" : "rgba(250,248,244,.88)",
                  }}
                >
                  {t(l.key)}
                  <span className="font-mono text-xs text-gold">&rarr;</span>
                </Link>
              ))}
            </React.Fragment>
          ))}
        </nav>
        <div className="border-t border-bg/[.16] px-[26px] py-5 text-xs leading-[1.7] text-[rgba(250,248,244,.55)]">
          {t("Qom Municipality")}
          <br />
          {t("International Relations & Communications Department")}
        </div>
      </aside>
    </>
  );
}
