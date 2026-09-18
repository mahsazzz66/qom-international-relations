"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PageHero from "@/components/PageHero";
import Pagination from "@/components/Pagination";
import InvestmentCard from "@/components/InvestmentCard";
import { useLocale } from "@/lib/i18n";
import { INVEST, invFilter, InvestFilters, InvestmentItem } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { contentItemToInvestmentItem } from "@/lib/supabase/adapters";
import type { ContentItem } from "@/lib/supabase/types";
import { pickText, usePageContent } from "@/lib/pageContent/read";
import { getPageSchema } from "@/lib/pageContent/pageSchemas";
import type { BilingualText } from "@/lib/pageContent/schema";

const INVESTMENT_SCHEMA = getPageSchema("investment")!;

type ResourceOverride = { category?: BilingualText; title?: BilingualText; href?: BilingualText };

function FilterGroup({
  title, options, active, onSelect,
}: {
  title: string;
  options: { label: string; value: string; count: number }[];
  active: string;
  onSelect: (v: string) => void;
}) {
  const { t } = useLocale();
  return (
    <div className="border border-navy/10 dark:border-dark-line bg-white dark:bg-dark-surface-2 px-4 pt-4.5 pb-3">
      <div className="font-mono mb-3 px-1 text-[9.5px] tracking-[.18em] text-gray dark:text-dark-ink-dimmer uppercase">{t(title)}</div>
      <div className="grid gap-px">
        {options.map((o) => {
          const on = active === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onSelect(o.value)}
              data-invopt
              aria-pressed={on}
              className="flex w-full cursor-pointer items-center gap-2.5 border-0 px-2 py-2.5 text-start font-sans transition-colors"
              style={{ background: on ? "rgba(200,167,93,.14)" : "transparent" }}
            >
              {on ? (
                <span className="grid h-4 w-4 shrink-0 place-items-center border border-navy bg-navy dark:bg-dark-navy">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FAF8F4" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 6.5" /></svg>
                </span>
              ) : (
                <span className="h-4 w-4 shrink-0 border border-navy/25 dark:border-dark-line" />
              )}
              <span className="min-w-0 flex-1 text-[13.5px] leading-[1.4] text-navy dark:text-dark-ink" style={{ fontWeight: on ? 600 : 400 }}>{t(o.label)}</span>
              <span className="font-mono text-[10.5px] tracking-[.06em] text-gray dark:text-dark-ink-dimmer">{o.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const RESOURCES_DEFAULT: { category: string; title: string; href: string }[] = [
  { category: "Portfolio", title: "[Investment portfolio brochure]", href: "/media" },
  { category: "Procedure", title: "[Guide for international investors]", href: "/media" },
  { category: "Legal", title: "[Municipal participation framework]", href: "/media" },
];

export default function InvestmentPage() {
  const { t, locale } = useLocale();
  const [liveItems, setLiveItems] = useState<ContentItem[]>([]);
  const pageData = usePageContent("investment", INVESTMENT_SCHEMA);
  const resourceOverrides = pageData?.resources as ResourceOverride[] | undefined;
  const resources =
    resourceOverrides && resourceOverrides.length > 0
      ? resourceOverrides.map((o, i) => ({
          category: pickText(o.category, locale, RESOURCES_DEFAULT[i] ? t(RESOURCES_DEFAULT[i].category) : ""),
          title: pickText(o.title, locale, RESOURCES_DEFAULT[i] ? t(RESOURCES_DEFAULT[i].title) : ""),
          href: pickText(o.href, locale, "") || RESOURCES_DEFAULT[i]?.href || "/media",
        }))
      : RESOURCES_DEFAULT.map((r) => ({ category: t(r.category), title: t(r.title), href: r.href }));

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("content_items")
      .select("*")
      .eq("type", "investment")
      .eq("published", true)
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data: rows }) => {
        if (!cancelled && rows) setLiveItems(rows as ContentItem[]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo<InvestmentItem[]>(
    () => [...liveItems.map((it) => contentItemToInvestmentItem(it, locale)), ...INVEST()],
    [liveItems, locale]
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [district, setDistrict] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<InvestFilters["sort"]>("new");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => invFilter(data, { query, category, district, status, sort }), [data, query, category, district, status, sort]);
  const perPage = 9;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(Math.max(1, page), pages);
  const from = (currentPage - 1) * perPage;
  const shown = filtered.slice(from, from + perPage);

  const cats = useMemo(() => {
    const list: string[] = [];
    data.forEach((it) => { if (!list.includes(it.cat)) list.push(it.cat); });
    return list;
  }, [data]);
  const districts = useMemo(() => {
    const list: string[] = [];
    data.forEach((it) => { if (!list.includes(it.district)) list.push(it.district); });
    return list;
  }, [data]);
  const statuses = useMemo(() => {
    const list: string[] = [];
    data.forEach((it) => { if (!list.includes(it.status)) list.push(it.status); });
    return list;
  }, [data]);

  const resetPage = () => setPage(1);
  const goToPage = (n: number) => {
    setPage(n);
    if (typeof document !== "undefined") {
      document.getElementById("inv-meta")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const clearAll = () => { setCategory("all"); setDistrict("all"); setStatus("all"); setQuery(""); resetPage(); };
  const chips: string[] = [];
  if (category !== "all") chips.push(t(category));
  if (district !== "all") chips.push(t(district));
  if (status !== "all") chips.push(t(status));
  if (query.trim()) chips.push(`"${query.trim()}"`);

  return (
    <div>
      <PageHero
        page="investment"
        ledeWidth={660}
        icon={
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke="#C8A75D" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 122h160" />
            <rect x="33" y="88" width="26" height="34" />
            <rect x="69" y="70" width="26" height="52" />
            <rect x="105" y="52" width="26" height="70" />
            <rect x="141" y="30" width="26" height="92" />
            <path d="M46 74 82 60 118 44 154 26" />
            <circle cx="46" cy="74" r="3.2" fill="#C8A75D" stroke="none" />
            <circle cx="82" cy="60" r="3.2" fill="#C8A75D" stroke="none" />
            <circle cx="118" cy="44" r="3.2" fill="#C8A75D" stroke="none" />
            <circle cx="154" cy="26" r="5.5" fill="#C8A75D" stroke="none" />
          </svg>
        }
        title={t("Investment Opportunities")}
        description={t("Municipal projects open to international participation. The department is the single point of contact for enquiries, due diligence and introductions to the responsible deputy department.")}
      />
      <div className="mx-auto max-w-[1280px] px-6 pt-14.5 pb-24">
        <div className="mb-7.5 flex flex-wrap gap-3">
          <div className="flex flex-1 basis-75 items-center gap-2.5 border border-navy/20 dark:border-dark-line bg-white dark:bg-dark-surface-2 px-4">
            <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={1.6} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" /></svg>
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); resetPage(); }}
              placeholder={t("Search opportunities, categories or districts")}
              aria-label={t("Search opportunities")}
              className="min-w-0 flex-1 border-0 bg-transparent py-3.5 text-sm text-navy dark:text-dark-ink outline-none"
            />
          </div>
          <div className="flex basis-64 items-center gap-3 border border-navy/20 dark:border-dark-line bg-white dark:bg-dark-surface-2 px-4">
            <span className="font-mono text-[10px] tracking-[.16em] whitespace-nowrap text-gray dark:text-dark-ink-dimmer uppercase">{t("Sort")}</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as InvestFilters["sort"]); resetPage(); }}
              aria-label="Sort opportunities"
              className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent py-3.5 text-[13.5px] text-navy dark:text-dark-ink outline-none"
            >
              <option value="new">{t("Newest reference")}</option>
              <option value="az">{t("Title A–Z")}</option>
              <option value="cat">{t("By category")}</option>
              <option value="district">{t("By district")}</option>
            </select>
          </div>
        </div>

        <div data-inv-layout className="grid items-start gap-9" style={{ gridTemplateColumns: "268px minmax(0, 1fr)" }}>
          <aside className="grid content-start gap-4">
            <div className="flex items-center justify-between gap-3 pb-0.5">
              <span className="font-mono text-[10.5px] tracking-[.2em] text-navy dark:text-dark-ink uppercase">{t("Refine")}</span>
              <button type="button" onClick={clearAll} className="font-mono cursor-pointer border-0 bg-transparent py-0.5 text-[10px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase hover:text-gold">{t("Reset all")}</button>
            </div>
            <FilterGroup title="Category" active={category} onSelect={(v) => { setCategory(v); resetPage(); }} options={[{ label: "All categories", value: "all", count: data.length }, ...cats.map((c) => ({ label: c, value: c, count: data.filter((x) => x.cat === c).length }))]} />
            <FilterGroup title="District" active={district} onSelect={(v) => { setDistrict(v); resetPage(); }} options={[{ label: "All districts", value: "all", count: data.length }, ...districts.map((d) => ({ label: d, value: d, count: data.filter((x) => x.district === d).length }))]} />
            <FilterGroup title="Status" active={status} onSelect={(v) => { setStatus(v); resetPage(); }} options={[{ label: "Any status", value: "all", count: data.length }, ...statuses.map((s) => ({ label: s, value: s, count: data.filter((x) => x.status === s).length }))]} />
            <div className="border border-navy/10 dark:border-dark-line bg-white dark:bg-dark-surface-2 p-6">
              <div className="font-mono mb-3 text-[10.5px] tracking-[.18em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Investor desk")}</div>
              <p className="m-0 mb-4 text-[13.5px] leading-[1.7] text-slate dark:text-dark-ink-dim">{t("One municipal point of contact for due diligence, site visits and introductions to the responsible deputy department.")}</p>
              <Link href="/contact" className="text-[13px] font-semibold">{t("Contact the desk →")}</Link>
            </div>
          </aside>

          <div>
            <div data-inv-meta id="inv-meta" className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-navy/10 dark:border-dark-line pb-4">
              <span className="font-mono text-xs tracking-[.1em] text-navy dark:text-dark-ink">
                {filtered.length ? `${from + 1}–${Math.min(from + perPage, filtered.length)} / ${filtered.length}` : `0 / ${data.length}`}{" "}
                <span className="text-[10.5px] tracking-[.16em] text-graylight dark:text-dark-ink-dimmest uppercase">{t("Opportunities")}</span>
              </span>
              {chips.length > 0 && (
                <span className="flex flex-wrap items-center gap-3.5">
                  <span className="text-[12.5px] text-slate dark:text-dark-ink-dim">{chips.join(" · ")}</span>
                  <button type="button" onClick={clearAll} className="font-mono border border-navy/20 dark:border-dark-line px-3.5 py-2 text-[10.5px] tracking-[.14em] text-navy dark:text-dark-ink uppercase">{t("Clear filters")}</button>
                </span>
              )}
            </div>
            {shown.length > 0 ? (
              <div className="grid items-stretch gap-6.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(292px, 1fr))" }}>
                {shown.map((it, i) => <InvestmentCard key={it.id} item={it} index={i} />)}
              </div>
            ) : (
              <div className="border border-dashed border-navy/[.22] dark:border-dark-line px-6 py-16 text-center">
                <p className="m-0 mb-2 font-serif text-xl text-navy dark:text-dark-ink">{t("No opportunities match your filters.")}</p>
                <p className="m-0 text-sm text-gray dark:text-dark-ink-dimmer">{t("Try another category, district or keyword.")}</p>
              </div>
            )}
            <Pagination page={currentPage} pages={pages} marginTop={42} onChange={goToPage} />
          </div>
        </div>

        <div className="mt-21.5 border-t border-navy/10 dark:border-dark-line pt-19">
          <h2 className="m-0 mb-6.5 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.6vw, 36px)" }}>{t("Investor resources")}</h2>
          <div className="grid gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {resources.map((r, i) => (
              <div key={`${r.title}-${i}`} className="bg-white dark:bg-dark-surface-2 p-7">
                <div className="mb-3 text-[11.5px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{r.category}</div>
                <h3 className="m-0 mb-2.5 font-serif text-lg font-medium">{r.title}</h3>
                <Link href={r.href} className="text-[13px] font-semibold">{t("Download PDF →")}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
