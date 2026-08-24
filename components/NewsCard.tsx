"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { NewsItem, fmtDate } from "@/lib/data";

export function NewsCard({ item, index = 0 }: { item: NewsItem; index?: number }) {
  const { t } = useLocale();
  return (
    <Link
      href={`/news/${item.id}`}
      data-card
      style={{ animation: "qomReveal .5s cubic-bezier(.22,.61,.36,1) both", animationDelay: `${Math.min(index, 11) * 35}ms` }}
      className="flex h-full flex-col border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2"
    >
      <div className="grid aspect-video place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
        <span className="font-mono text-[10px] tracking-[.14em] uppercase text-[rgba(250,248,244,.40)]">
          {t(item.kind === "msg" ? "statement image" : "news image")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 pt-[22px]">
        <div className="mb-[11px] flex min-h-[15px] flex-wrap items-center gap-2.5">
          <span className="font-mono text-[10px] tracking-[.14em] uppercase text-teal dark:text-dark-teal">{t(item.cat)}</span>
          <span className="font-mono text-[11.5px] whitespace-nowrap text-gray dark:text-dark-ink-dimmer">{fmtDate(item, t)}</span>
        </div>
        <h3 data-clamp2 className="m-0 mb-2.5 min-h-[52px] font-serif text-[19px] leading-[1.35] font-medium text-navy dark:text-dark-ink text-pretty">
          {t(item.title)}
        </h3>
        <p data-clamp3 className="m-0 min-h-[70px] text-sm leading-[1.65] text-slate dark:text-dark-ink-dim">
          {t(item.excerpt)}
        </p>
        <span className="mt-auto pt-[18px] text-[13px] font-semibold whitespace-nowrap text-navy dark:text-dark-ink">
          {t("Read More →")}
        </span>
      </div>
    </Link>
  );
}

export function MsgCard({ item, index = 0 }: { item: NewsItem; index?: number }) {
  const { t } = useLocale();
  return (
    <Link
      href={`/news/${item.id}`}
      data-msgcard
      style={{ animation: "qomReveal .5s cubic-bezier(.22,.61,.36,1) both", animationDelay: `${Math.min(index, 8) * 40}ms` }}
      className="border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 border-s-[3px] border-s-gold"
    >
      <div data-msgimg className="grid place-items-center p-4" style={{ background: "#0B1F3A", backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
        <span className="font-mono text-center text-[9.5px] tracking-[.14em] uppercase text-[rgba(250,248,244,.40)]">{t("statement image")}</span>
      </div>
      <div className="min-w-0 px-[30px] py-7">
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <span className="font-mono bg-gold/30 px-[9px] py-[5px] text-[9.5px] tracking-[.16em] text-navy dark:text-dark-ink uppercase">{t(item.cat)}</span>
          <span className="font-mono text-[11.5px] text-gray dark:text-dark-ink-dimmer">{fmtDate(item, t)}</span>
        </div>
        <h3 data-clamp2 className="m-0 mb-3 min-h-[57px] font-serif text-[21px] leading-[1.35] font-normal text-pretty">{t(item.title)}</h3>
        <p data-clamp3 className="m-0 mb-4 max-w-[680px] text-[14.5px] leading-[1.7] text-slate dark:text-dark-ink-dim">{t(item.excerpt)}</p>
        <span className="font-mono text-[11.5px] font-medium tracking-[.14em] text-navy dark:text-dark-ink uppercase">{t("Read Statement →")}</span>
      </div>
      <div data-msgmeta className="font-mono grid min-w-0 content-start gap-3 border-s border-navy/10 dark:border-dark-line px-[26px] py-7 text-[11px] tracking-[.1em] text-gray dark:text-dark-ink-dimmer uppercase">
        <div>
          {t("Issued by")}
          <br />
          <span className="text-[12.5px] text-navy dark:text-dark-ink tracking-[.04em] normal-case">{t("[issuing office]")}</span>
        </div>
        <div>
          {t("Reference")}
          <br />
          <span className="text-[12.5px] text-navy dark:text-dark-ink tracking-[.04em] normal-case">{t("[no.]")}</span>
        </div>
      </div>
    </Link>
  );
}
