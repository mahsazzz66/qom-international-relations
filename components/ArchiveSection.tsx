"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/lib/i18n";
import { NewsItem, ARCH_MONTHS, filterList } from "@/lib/data";
import Pagination from "./Pagination";

export interface CategoryOption {
  value: string;
  label: string;
}

export default function ArchiveSection({
  data,
  categories,
  perPage,
  allLabel,
  searchPlaceholder,
  emptyTitle,
  emptyBody,
  unitLabel,
  archiveLabel,
  moreLabel,
  scrollTargetId,
  renderCard,
  gridClassName,
  renderFeatured,
}: {
  data: NewsItem[];
  categories: CategoryOption[];
  perPage: number;
  allLabel: string;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyBody: string;
  unitLabel: string;
  /** "News archive" / "Statements archive" — distinct keys in the dictionary. */
  archiveLabel: string;
  /** "Load More News" / "Load More Statements". */
  moreLabel: string;
  /** Element the pager scrolls back to after a page change. */
  scrollTargetId: string;
  renderCard: (item: NewsItem, index: number) => React.ReactNode;
  gridClassName: string;
  renderFeatured?: (item: NewsItem) => React.ReactNode;
}) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [page, setPage] = useState(1);
  // "Load More" appends another `perPage` items to the page in place; every
  // other control resets it, exactly like the source's `Extra` counter.
  const [extra, setExtra] = useState(0);

  const filtered = useMemo(
    () => filterList(data, { query, category, year, month, sort }),
    [data, query, category, year, month, sort]
  );

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(Math.max(1, page), pages);
  const start = (currentPage - 1) * perPage;
  const end = Math.min(filtered.length, start + perPage * (1 + extra));
  const shown = filtered.slice(start, end);
  const rest = filtered.length - end;

  const years = useMemo(() => {
    const ys: number[] = [];
    data.forEach((it) => { if (!ys.includes(it.y)) ys.push(it.y); });
    return ys.sort((a, b) => b - a);
  }, [data]);

  const monthsForYear = useMemo(() => {
    if (year === "all") return [];
    const yy = parseInt(year, 10);
    const ms: number[] = [];
    for (let m = 12; m >= 1; m--) {
      if (data.some((it) => it.y === yy && it.m === m)) ms.push(m);
    }
    return ms;
  }, [data, year]);

  const resetPage = () => { setPage(1); setExtra(0); };
  const activeChips: string[] = [];
  if (category !== "all") activeChips.push(t(category));
  if (year !== "all") activeChips.push(year);
  if (month !== "all") activeChips.push(t(ARCH_MONTHS[parseInt(month, 10) - 1]));
  if (query.trim()) activeChips.push(`"${query.trim()}"`);

  const clearAll = () => {
    setQuery(""); setCategory("all"); setYear("all"); setMonth("all"); resetPage();
  };

  // Only the year/month archive chips are mono in the source; the category
  // filters use the body face at 12.5px with 9px/15px padding.
  const chipBase = "font-mono cursor-pointer border px-3.5 py-2 text-xs tracking-[.04em] transition-colors";
  const filterBase = "cursor-pointer border font-sans px-[15px] py-[9px] text-[12.5px] transition-colors";
  // Idle chip colours live in classes, not inline styles, so the night palette
  // (and the `[data-chipbtn]:hover` gold) can reach them.
  const chipIdle = " border-navy/[.18] dark:border-dark-line text-slate dark:text-dark-ink-dim";
  const filterIdle = " border-navy/20 dark:border-dark-line text-slate dark:text-dark-ink-dim";
  // The source's clear-filters chip is its own thing: mono 10.5px/.14em
  // uppercase on 8px/13px padding (src 3945), not the archive chip style.
  const clearChip =
    "font-mono cursor-pointer border border-navy/20 dark:border-dark-line px-[13px] py-2 text-[10.5px] tracking-[.14em] text-navy dark:text-dark-ink uppercase transition-colors";

  const goToPage = (n: number) => {
    setPage(n);
    setExtra(0);
    if (typeof document !== "undefined") {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const narrowed = category !== "all" || year !== "all" || query.trim().length > 0;

  return (
    <div>
      {renderFeatured && !narrowed && data.length > 0 && renderFeatured(data[0])}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="flex flex-1 basis-80 items-center gap-2.5 border border-navy/20 dark:border-dark-line bg-white dark:bg-dark-surface-2 px-4">
          <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={1.6} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" /></svg>
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); resetPage(); }}
            placeholder={t(searchPlaceholder)}
            aria-label={t(searchPlaceholder)}
            className="min-w-0 flex-1 border-0 bg-transparent py-3.5 text-sm text-navy dark:text-dark-ink outline-none"
          />
        </div>
        <div className="flex basis-64 items-center gap-3 border border-navy/20 dark:border-dark-line bg-white dark:bg-dark-surface-2 px-4">
          <span className="font-mono text-[10px] tracking-[.16em] whitespace-nowrap text-gray dark:text-dark-ink-dimmer uppercase">{t("Sort")}</span>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as "new" | "old"); resetPage(); }}
            aria-label={t("Sort")}
            className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent py-3.5 text-[13.5px] text-navy dark:text-dark-ink outline-none"
          >
            <option value="new">{t("Newest First")}</option>
            <option value="old">{t("Oldest First")}</option>
          </select>
        </div>
      </div>

      <div className="mb-5.5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setCategory("all"); resetPage(); }}
          data-chipbtn
          data-on={category === "all" ? "1" : undefined}
          className={filterBase + (category === "all" ? "" : filterIdle)}
          style={category === "all" ? { borderColor: "#0B1F3A", background: "#0B1F3A", color: "#FAF8F4" } : { background: "transparent" }}
        >
          {t(allLabel)}
        </button>
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => { setCategory(c.value); resetPage(); }}
            data-chipbtn
            data-on={category === c.value ? "1" : undefined}
            className={filterBase + (category === c.value ? "" : filterIdle)}
            style={category === c.value ? { borderColor: "#0B1F3A", background: "#0B1F3A", color: "#FAF8F4" } : { background: "transparent" }}
          >
            {t(c.label)}
          </button>
        ))}
      </div>

      <div className="mb-6.5 border border-navy/[.14] dark:border-dark-line bg-white dark:bg-dark-surface-2 px-5.5 py-4.5">
        <div className="flex flex-wrap items-center gap-4.5">
          <span className="font-mono text-[10.5px] tracking-[.16em] whitespace-nowrap text-gray dark:text-dark-ink-dimmer uppercase">{t(archiveLabel)}</span>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => { setYear("all"); setMonth("all"); resetPage(); }} data-chipbtn data-on={year === "all" ? "1" : undefined} className={chipBase + (year === "all" ? "" : chipIdle)} style={year === "all" ? { borderColor: "#0B1F3A", background: "#0B1F3A", color: "#FAF8F4" } : { background: "transparent" }}>
              {t("All years")}
            </button>
            {years.map((y) => (
              <button key={y} type="button" onClick={() => { setYear(String(y)); setMonth("all"); resetPage(); }} data-chipbtn data-on={year === String(y) ? "1" : undefined} className={chipBase + (year === String(y) ? "" : chipIdle)} style={year === String(y) ? { borderColor: "#0B1F3A", background: "#0B1F3A", color: "#FAF8F4" } : { background: "transparent" }}>
                {y} <span className="opacity-55">({data.filter((it) => it.y === y).length})</span>
              </button>
            ))}
          </div>
        </div>
        {year !== "all" && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-navy/[.09] dark:border-dark-line pt-4">
            <button type="button" onClick={() => { setMonth("all"); resetPage(); }} data-chipbtn data-on={month === "all" ? "1" : undefined} className={chipBase + (month === "all" ? "" : chipIdle)} style={month === "all" ? { borderColor: "#0B1F3A", background: "#0B1F3A", color: "#FAF8F4" } : { background: "transparent" }}>
              {t("All months")}
            </button>
            {monthsForYear.map((m) => (
              <button key={m} type="button" onClick={() => { setMonth(String(m)); resetPage(); }} data-chipbtn data-on={month === String(m) ? "1" : undefined} className={chipBase + (month === String(m) ? "" : chipIdle)} style={month === String(m) ? { borderColor: "#0B1F3A", background: "#0B1F3A", color: "#FAF8F4" } : { background: "transparent" }}>
                {t(ARCH_MONTHS[m - 1])} <span className="opacity-55">({data.filter((it) => it.y === parseInt(year, 10) && it.m === m).length})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-navy/10 dark:border-dark-line pb-4">
        <span className="font-mono text-xs tracking-[.1em] text-navy dark:text-dark-ink">
          {filtered.length ? `${start + 1}–${end} / ${filtered.length}` : "0 / 0"}{" "}
          <span className="text-[10.5px] tracking-[.16em] text-graylight dark:text-dark-ink-dimmest uppercase">{t(unitLabel)}</span>
        </span>
        <span className="flex flex-wrap items-center gap-3.5">
          {activeChips.length > 0 && (
            <>
              <span className="text-[12.5px] text-slate dark:text-dark-ink-dim">{activeChips.join(" · ")}</span>
              <button type="button" onClick={clearAll} data-chipbtn className={clearChip}>
                {t("Clear filters")}
              </button>
            </>
          )}
        </span>
      </div>

      {shown.length > 0 ? (
        <div className={gridClassName}>{shown.map((it, i) => renderCard(it, i))}</div>
      ) : (
        <div className="border border-dashed border-navy/[.22] dark:border-dark-line px-6 py-16 text-center">
          <p className="m-0 mb-2 font-serif text-xl text-navy dark:text-dark-ink">{t(emptyTitle)}</p>
          <p className="m-0 text-sm text-gray dark:text-dark-ink-dimmer">{t(emptyBody)}</p>
        </div>
      )}

      {rest > 0 && (
        <div className="mt-8.5 flex justify-center">
          <button
            type="button"
            onClick={() => setExtra((e) => e + 1)}
            className="font-mono cursor-pointer border border-navy/[.24] dark:border-dark-line bg-transparent px-7.5 py-4 text-[11.5px] tracking-[.16em] text-navy dark:text-dark-ink uppercase transition-[border-color,background] duration-[250ms] hover:border-gold hover:bg-gold/[.12]"
          >
            {t(moreLabel)} ({rest})
          </button>
        </div>
      )}

      <Pagination page={currentPage} pages={pages} onChange={goToPage} />
    </div>
  );
}
