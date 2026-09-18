"use client";

import Link from "next/link";
import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";
import { DEPTS } from "@/lib/data";
import { usePageContent } from "@/lib/pageContent/read";
import { getPageSchema } from "@/lib/pageContent/pageSchemas";
import { resolveDept, type DeptOverride } from "@/lib/pageContent/departments";

const DEPARTMENTS_SCHEMA = getPageSchema("departments")!;

export default function DepartmentsPage() {
  const { t, locale } = useLocale();
  const staticDepts = DEPTS();
  const pageData = usePageContent("departments", DEPARTMENTS_SCHEMA);
  const overrides = pageData?.departments as DeptOverride[] | undefined;
  const depts = staticDepts.map((d, i) => resolveDept(d, i, overrides, locale, t));
  return (
    <div>
      <PageHero
        page="departments"
        ledeWidth={660}
        icon={
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke="#C8A75D" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 120h180" />
            <rect x="18" y="72" width="32" height="48" />
            <rect x="58" y="52" width="32" height="68" />
            <rect x="98" y="66" width="32" height="54" />
            <rect x="138" y="40" width="32" height="80" />
            <path d="M18 62h32M58 42h32M98 56h32M138 30h32" />
            <path d="M26 86h14M66 66h14M106 80h14M146 54h14" opacity=".55" />
          </svg>
        }
        title={t("Municipal Deputy Departments")}
        description={t("Six specialised deputy departments carry out the technical work of the city. The International Relations Department connects each of them to counterparts abroad.")}
      />
      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-24">
        <div className="grid gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill">
        {depts.map((d) => (
          <article key={d.id} className="grid gap-10 bg-white dark:bg-dark-surface-2 p-9.5" style={{ gridTemplateColumns: "minmax(0, 1.7fr) minmax(220px, 1fr)" }}>
            <div>
              <div className="font-mono mb-4 text-xs tracking-[.12em] text-gold">{d.no}</div>
              <h2 className="m-0 mb-3.5 font-serif text-[25px] font-medium">{d.title}</h2>
              <p className="m-0 mb-4.5 max-w-[620px] text-[15px] leading-[1.7] text-slate dark:text-dark-ink-dim">{d.listing}</p>
              <Link href={`/departments/${d.id}`} className="text-[13px] font-semibold">{t("Explore Activities →")}</Link>
            </div>
            <div className="border-navy/[.12] dark:border-dark-line pl-7.5 border-l">
              <div className="font-mono mb-3 text-[10.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Cooperation interests")}</div>
              <div className="text-[13.5px] leading-[1.9] text-slate dark:text-dark-ink-dim">
                {d.interests.map((it, i) => (
                  <span key={`${it}-${i}`}>
                    {it}
                    {i < d.interests.length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
        </div>
      </div>
    </div>
  );
}
