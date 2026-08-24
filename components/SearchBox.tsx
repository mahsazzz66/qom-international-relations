"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n";
import { searchIndex } from "@/lib/data";

export default function SearchBox() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(() => searchIndex(), []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const q = query.trim().toLowerCase();
  const hits = q
    ? index
        .filter((it) => {
          const en = it.title.toLowerCase();
          const loc = t(it.title).toLowerCase();
          const kind = t(it.kind).toLowerCase();
          return en.indexOf(q) > -1 || loc.indexOf(q) > -1 || kind.indexOf(q) > -1;
        })
        .slice(0, 12)
    : [];

  return (
    <div ref={wrapRef} data-search className="relative flex-1 min-w-[180px] max-w-[330px] basis-[240px]">
      <div className="flex items-center gap-[9px] border border-navy/20 dark:border-dark-line bg-white dark:bg-dark-surface-2 px-3 focus-within:border-gold">
        <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={1.8} strokeLinecap="round" className="shrink-0">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.6 15.6 21 21" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={(e) => { if (e.key === "Escape") { setQuery(""); setOpen(false); (e.target as HTMLInputElement).blur(); } }}
          placeholder={t("Search the portal")}
          aria-label={t("Search the portal")}
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent py-3 text-[13.5px] text-navy dark:text-dark-ink outline-none placeholder:text-graylight"
        />
        {query && (
          <button
            type="button"
            aria-label={t("Clear search")}
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="border-0 bg-transparent px-0.5 text-base leading-none text-gray dark:text-dark-ink-dimmer cursor-pointer"
          >
            ×
          </button>
        )}
      </div>
      {open && q && (
        <div className="absolute top-[calc(100%+8px)] z-[140] max-h-[62vh] w-[min(440px,86vw)] overflow-y-auto border border-navy/[.14] dark:border-dark-line bg-white dark:bg-dark-surface-2 shadow-[0_34px_60px_-30px_rgba(11,31,58,.45)] start-0">
          {hits.length === 0 ? (
            <div className="px-5 py-6 text-[13.5px] text-gray dark:text-dark-ink-dimmer">{t("No results found")}</div>
          ) : (
            <>
              {hits.map((h, i) => (
                <Link
                  key={i}
                  href={h.page ? `/${h.page}` : "/"}
                  onClick={() => { setQuery(""); setOpen(false); }}
                  className="flex items-center justify-between gap-3.5 border-b border-navy/[.08] dark:border-dark-line px-[18px] py-3.5"
                >
                  <span className="grid min-w-0 gap-1">
                    <span className="text-sm font-medium text-navy dark:text-dark-ink">{t(h.title)}</span>
                    <span className="font-mono text-[9.5px] tracking-[.14em] uppercase text-teal dark:text-dark-teal">{t(h.kind)}</span>
                  </span>
                  <span className="font-mono text-xs text-gold">&rarr;</span>
                </Link>
              ))}
              <div className="font-mono px-[18px] py-3 text-[10.5px] tracking-[.14em] uppercase text-gray dark:text-dark-ink-dimmer">
                {hits.length} {t("results")}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
