"use client";

import { useLocale } from "@/lib/i18n";
import { pageList } from "@/lib/data";

export default function Pagination({
  page,
  pages,
  onChange,
  /** Source uses 36px on /news and 42px on /investment. */
  marginTop = 36,
}: {
  page: number;
  pages: number;
  onChange: (n: number) => void;
  marginTop?: number;
}) {
  const { t, locale } = useLocale();
  if (pages <= 1) return null;
  const rtl = locale === "ar";
  const base =
    "font-mono min-w-[44px] cursor-pointer border border-navy/[.18] dark:border-dark-line bg-transparent px-[15px] py-3 text-xs tracking-[.06em] text-navy dark:text-dark-ink transition-colors";
  const active = "font-mono min-w-[44px] cursor-default border border-navy bg-navy dark:bg-dark-navy px-[15px] py-3 text-xs tracking-[.06em] text-bg";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 border-t border-navy/10 dark:border-dark-line pt-[30px]"
      style={{ marginTop }}
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(Math.max(1, page - 1))}
        data-arch-page={Math.max(1, page - 1)}
        {...(page === 1 ? {} : { "data-chipbtn": "" })}
        className={base}
        style={page === 1 ? { opacity: 0.3, cursor: "default" } : undefined}
      >
        {rtl ? "→ " : "← "}{t("Previous")}
      </button>
      {pageList(page, pages).map((v, i) =>
        v === "gap" ? (
          <span key={"gap" + i} className="font-mono px-0.5 text-xs text-graylight dark:text-dark-ink-dimmest">&hellip;</span>
        ) : (
          <button
            key={v}
            type="button"
            onClick={() => { if (v !== page) onChange(v); }}
            data-arch-page={v}
            data-chipbtn=""
            data-on={v === page ? "1" : undefined}
            className={v === page ? active : base}
          >
            {v}
          </button>
        )
      )}
      <button
        type="button"
        disabled={page === pages}
        onClick={() => onChange(Math.min(pages, page + 1))}
        data-arch-page={Math.min(pages, page + 1)}
        {...(page === pages ? {} : { "data-chipbtn": "" })}
        className={base}
        style={page === pages ? { opacity: 0.3, cursor: "default" } : undefined}
      >
        {t("Next")}{rtl ? " ←" : " →"}
      </button>
    </nav>
  );
}
