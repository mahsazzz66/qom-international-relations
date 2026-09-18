"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { Dept, DEPTS, NEWS } from "@/lib/data";
import { NewsCard } from "./NewsCard";
import { useTheme } from "@/lib/theme";
import { usePageContent } from "@/lib/pageContent/read";
import { getPageSchema } from "@/lib/pageContent/pageSchemas";
import { resolveDept, type DeptOverride } from "@/lib/pageContent/departments";

const DEPARTMENTS_SCHEMA = getPageSchema("departments")!;

export default function DeptDetailView({ dept: staticDept }: { dept: Dept }) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const pageData = usePageContent("departments", DEPARTMENTS_SCHEMA);
  const overrides = pageData?.departments as DeptOverride[] | undefined;
  const index = DEPTS().findIndex((d) => d.id === staticDept.id);
  const dept = resolveDept(staticDept, index, overrides, locale, t);
  const accent = theme === "dark" ? dept.hero : dept.ink;
  const news = NEWS().filter((x) => x.cat === dept.newsCat).sort((a, b) => b.stamp - a.stamp).slice(0, 3);

  return (
    <div>
      <div className="relative overflow-hidden bg-navy dark:bg-dark-navy">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(200,167,93,.055) 25%, transparent 25% 75%, rgba(200,167,93,.055) 75%), linear-gradient(-45deg, rgba(200,167,93,.055) 25%, transparent 25% 75%, rgba(200,167,93,.055) 75%), radial-gradient(circle, rgba(200,167,93,.16) 0 1.1px, transparent 1.7px)",
            backgroundSize: "78px 78px, 78px 78px, 39px 39px",
            backgroundPosition: "center",
            WebkitMaskImage: "linear-gradient(170deg, rgba(0,0,0,.95), rgba(0,0,0,.18))",
            maskImage: "linear-gradient(170deg, rgba(0,0,0,.95), rgba(0,0,0,.18))",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute top-1/2 w-[min(22%,280px)] -translate-y-1/2 opacity-50 end-[2%]">
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke={dept.hero} strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: dept.motif }} />
        </div>
        <div className="relative mx-auto max-w-[1280px] px-6 pt-19.5 pb-18">
          <nav aria-label={t("Breadcrumb")} className="font-mono mb-6 flex min-h-[15px] flex-wrap items-center gap-2.5 text-[10.5px] tracking-[.14em] uppercase">
            <Link href="/" className="text-gold">{t("Home")}</Link>
            <span className="text-[rgba(250,248,244,.30)]">{locale === "en" ? "›" : "‹"}</span>
            <Link href="/departments" className="text-[rgba(250,248,244,.62)]">{t("Municipal Deputy Departments")}</Link>
            <span className="text-[rgba(250,248,244,.30)]">{locale === "en" ? "›" : "‹"}</span>
            <span className="text-[rgba(250,248,244,.92)]">{dept.title}</span>
          </nav>
          <div className="font-mono mb-4 text-[11px] tracking-[.2em] uppercase" style={{ color: dept.hero }}>{t("Deputy department")}&nbsp;·&nbsp;{dept.no}</div>
          <h1 className="m-0 mb-5 max-w-[880px] font-serif font-medium text-bg text-pretty" style={{ fontSize: "clamp(31px, 4.1vw, 54px)", lineHeight: 1.1, letterSpacing: "-.015em" }}>{dept.title}</h1>
          <p className="m-0 max-w-[640px] text-[17px] leading-[1.7] text-[rgba(250,248,244,.78)] text-pretty">{dept.mission}</p>
        </div>
      </div>

      <div data-deptd-layout className="mx-auto grid max-w-[1280px] items-start gap-14 px-6 pt-19 pb-5" style={{ gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 1fr)" }}>
        <div>
          <div className="font-mono mb-3.5 text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Mandate")}</div>
          <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.5vw, 33px)" }}>{t("Department overview")}</h2>
          <div className="mb-15 grid max-w-[720px] gap-5">
            {dept.overview.map((p, i) => (
              <p key={i} className="m-0 leading-[1.8] text-slate dark:text-dark-ink-dim text-pretty" style={{ fontSize: i === 0 ? "16.5px" : "15.5px" }}>{p}</p>
            ))}
          </div>

          <div className="font-mono mb-3.5 text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Remit")}</div>
          <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.5vw, 33px)" }}>{t("International responsibilities")}</h2>
          <div className="grid gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill">
            {dept.interests.map((r, i) => (
              <div key={`${r}-${i}`} className="flex items-baseline gap-4.5 bg-white dark:bg-dark-surface-2 px-6.5 py-6">
                <span className="font-mono shrink-0 text-[11.5px] tracking-[.12em]" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="grid min-w-0 gap-1.5">
                  <span className="font-serif text-lg leading-[1.35] text-navy dark:text-dark-ink">{r}</span>
                  <span className="text-[13.5px] leading-[1.65] text-slate dark:text-dark-ink-dim">{t("[Scope of international cooperation in this area.]")}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-5">
          <div className="grid gap-4 border border-navy/[.14] dark:border-dark-line bg-white dark:bg-dark-surface-2 p-7">
            {[["Department", dept.title], ["Reference", "QOM-DEP-" + dept.no], ["International focal point", "International Relations & Communications"]].map(([k, v]) => (
              <div key={k} className="grid gap-1.5">
                <span className="font-mono text-[9.5px] tracking-[.18em] text-gray dark:text-dark-ink-dimmer uppercase">{t(k)}</span>
                <span className="text-sm leading-[1.55] text-navy dark:text-dark-ink">{t(v)}</span>
              </div>
            ))}
          </div>
          <div className="bg-navy dark:bg-dark-navy p-7 text-bg">
            <div className="font-mono mb-3 text-[10.5px] tracking-[.18em] text-gold uppercase">{t("International contact")}</div>
            <p className="m-0 mb-5 text-sm leading-[1.7] text-[rgba(250,248,244,.78)]">{t("All international enquiries for this department are coordinated by the International Relations & Communications Department.")}</p>
            <Link href="/contact" className="inline-block bg-gold px-6 py-3.5 text-[13px] font-semibold text-navy">{t("Contact Us")}</Link>
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pt-14">
        <div className="font-mono mb-3.5 text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Portfolio")}</div>
        <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.5vw, 33px)" }}>{t("International projects")}</h2>
        <div className="grid gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))" }}>
          {dept.projects.map((p, i) => (
            <article key={`${p}-${i}`} className="grid gap-3 border-t-2 bg-white dark:bg-dark-surface-2 p-7.5" style={{ borderTopColor: dept.hero }}>
              <span className="font-mono text-[10px] tracking-[.16em] uppercase" style={{ color: accent }}>{"QOM-" + dept.no + "-0" + (i + 1)}</span>
              <h3 className="m-0 font-serif text-lg leading-[1.35] font-medium text-navy dark:text-dark-ink">{p}</h3>
              <p className="m-0 text-[13.5px] leading-[1.7] text-slate dark:text-dark-ink-dim">{t("[Scope, partner and stage of the project as recorded by the department.]")}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-13 px-6 pt-16.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))" }}>
        <div>
          <div className="font-mono mb-3.5 text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Counterparts")}</div>
          <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.5vw, 33px)" }}>{t("International partnerships")}</h2>
          <div className="grid gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill">
            {dept.partners.map((p, i) => (
              <div key={`${p}-${i}`} className="flex items-center justify-between gap-4 bg-white dark:bg-dark-surface-2 px-6 py-5.5">
                <span className="text-[15px] text-navy dark:text-dark-ink">{p}</span>
                <span className="font-mono text-[10px] tracking-[.16em] uppercase" style={{ color: accent }}>{t("Active")}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-mono mb-3.5 text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Record")}</div>
          <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.5vw, 33px)" }}>{t("Meetings & delegations")}</h2>
          <div className="grid gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill">
            {dept.meetings.map((m, i) => (
              <div key={`${m}-${i}`} className="grid gap-1.5 bg-white dark:bg-dark-surface-2 px-6 py-5.5">
                <span className="font-mono text-[11px] text-gray dark:text-dark-ink-dimmer">{t("[date]")}</span>
                <span className="text-[15px] text-navy dark:text-dark-ink">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-19 border-t border-navy/10 dark:border-dark-line bg-white dark:bg-dark-surface-2">
        <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-19">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6.5">
            <div>
              <div className="font-mono mb-3 text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Newsroom")}</div>
              <h2 className="m-0 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.5vw, 33px)" }}>{t("Related news")}</h2>
            </div>
            <Link href="/news" className="border border-navy/20 dark:border-dark-line px-5 py-3.5 text-[13.5px] font-semibold transition-colors hover:border-gold hover:bg-gold/10">{t("View All News")}</Link>
          </div>
          <div className="grid items-stretch gap-6.5 [grid-template-columns:repeat(auto-fill,minmax(290px,1fr))]">
            {news.map((it, i) => <NewsCard key={it.id} item={it} index={i} />)}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-24">
        <div className="font-mono mb-3.5 text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Archive")}</div>
        <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.5vw, 33px)" }}>{t("Photo gallery")}</h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="grid aspect-[4/3] place-items-center bg-navy dark:bg-dark-navy p-4 text-center" style={{ backgroundImage: "linear-gradient(45deg, rgba(200,167,93,.07) 25%, transparent 25% 75%, rgba(200,167,93,.07) 75%), linear-gradient(-45deg, rgba(200,167,93,.07) 25%, transparent 25% 75%, rgba(200,167,93,.07) 75%)", backgroundSize: "46px 46px" }}>
              <span className="font-mono text-[10px] tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase">{t("department photograph")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
