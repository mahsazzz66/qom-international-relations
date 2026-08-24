"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { NEWS, MSGS, fmtDate } from "@/lib/data";

export function HomeNews() {
  const { t } = useLocale();
  const news = NEWS();
  const feature = news[0];
  const list = news.slice(1, 5);

  return (
    <div data-home-news className="grid items-stretch gap-[30px]" style={{ gridTemplateColumns: "minmax(0, 1.32fr) minmax(300px, 0.88fr)" }}>
      <Link href={`/news/${feature.id}`} data-card className="flex h-full flex-col border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2">
        <div className="grid aspect-video place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
          <span className="font-mono text-[10.5px] tracking-[.14em] uppercase text-[rgba(250,248,244,.42)]">{t("featured news image")}</span>
        </div>
        <div className="flex flex-1 flex-col px-8 pt-[30px] pb-[34px]">
          <div className="mb-3.5 flex flex-wrap items-center gap-3">
            <span className="font-mono inline-block bg-gold px-[9px] py-[5px] text-[9.5px] tracking-[.18em] text-navy uppercase">{t("Featured")}</span>
            <span className="font-mono text-[10px] tracking-[.14em] uppercase text-teal dark:text-dark-teal">{t(feature.cat)}</span>
            <span className="font-mono text-[11.5px] whitespace-nowrap text-gray dark:text-dark-ink-dimmer">{fmtDate(feature, t)}</span>
          </div>
          <h3 data-clamp2 className="m-0 mb-3.5 font-serif font-medium text-pretty" style={{ fontSize: "clamp(22px, 2vw, 29px)", lineHeight: 1.25 }}>
            {t(feature.title)}
          </h3>
          <p data-clamp3 className="m-0 text-[15px] leading-[1.7] text-slate dark:text-dark-ink-dim">{t(feature.excerpt)}</p>
          <span className="mt-auto pt-[22px] text-[13px] font-semibold whitespace-nowrap text-navy dark:text-dark-ink">{t("Read More →")}</span>
        </div>
      </Link>

      <div data-home-list className="grid content-stretch gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill" style={{ gridTemplateRows: "repeat(4, minmax(0, 1fr))" }}>
        {list.map((it, i) => (
          <Link key={it.id} href={`/news/${it.id}`} className="grid items-center gap-4.5 bg-white dark:bg-dark-surface-2 px-5 py-4.5 transition-[background] duration-200" style={{ gridTemplateColumns: "104px minmax(0, 1fr)", borderTop: i ? "0" : undefined }}>
            <div className="grid aspect-[4/3] place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 10px)" }}>
              <span className="font-mono text-[8px] tracking-[.12em] uppercase text-[rgba(250,248,244,.40)]">{t("image")}</span>
            </div>
            <div className="min-w-0">
              <div className="font-mono mb-[7px] text-[10px] tracking-[.12em] uppercase text-teal dark:text-dark-teal">{t(it.cat)}</div>
              <h4 data-clamp2 className="m-0 mb-[7px] font-serif text-[15.5px] leading-[1.4] font-medium text-pretty">{t(it.title)}</h4>
              <div className="font-mono text-[11px] whitespace-nowrap text-gray dark:text-dark-ink-dimmer">{fmtDate(it, t)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function HomeStatements() {
  const { t } = useLocale();
  const msgs = MSGS().slice(0, 4);
  return (
    <div>
      {msgs.map((it, i) => (
        <Link
          key={it.id}
          href={`/news/${it.id}`}
          className={`grid items-center gap-4.5 px-[22px] py-3.5 transition-[background] duration-200${i ? " border-t border-navy/10 dark:border-dark-line" : ""}`}
          style={{ gridTemplateColumns: "76px minmax(0, 1fr) auto" }}
        >
          <div className="grid aspect-[4/3] place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.18) 0 2px, transparent 2px 10px)" }}>
            <span className="font-mono text-[7.5px] tracking-[.1em] uppercase text-[rgba(250,248,244,.42)]">{t("image")}</span>
          </div>
          <span className="grid min-w-0 gap-[5px]">
            <span data-clamp2 className="text-[14.5px] leading-[1.45] text-navy dark:text-dark-ink text-pretty">{t(it.title)}</span>
            <span className="font-mono text-[10px] tracking-[.12em] uppercase text-teal dark:text-dark-teal">{t(it.cat)}</span>
          </span>
          <span className="flex items-center justify-end gap-3.5">
            <span className="font-mono text-[11px] whitespace-nowrap text-gray dark:text-dark-ink-dimmer">{fmtDate(it, t)}</span>
            <span className="font-mono text-[13px] text-gold">→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
