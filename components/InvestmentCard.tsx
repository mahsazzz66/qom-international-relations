"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { InvestmentItem } from "@/lib/data";

function PinIcon({ color = "#C8A75D" }: { color?: string }) {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export default function InvestmentCard({ item, index = 0 }: { item: InvestmentItem; index?: number }) {
  const { t } = useLocale();
  return (
    <Link
      href={`/investment/${item.id}`}
      data-card
      style={{ animation: "qomReveal .5s cubic-bezier(.22,.61,.36,1) both", animationDelay: `${Math.min(index, 11) * 32}ms` }}
      className="flex h-full flex-col border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2"
    >
      <div className="relative grid aspect-video place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
        <span className="font-mono text-[10px] tracking-[.14em] uppercase text-[rgba(250,248,244,.40)]">{t("project image")}</span>
        <span className="font-mono absolute top-3 bg-[rgba(250,248,244,.92)] px-2 py-[5px] text-[9px] tracking-[.14em] text-navy dark:text-dark-ink uppercase start-3">
          {t(item.status)}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-[22px] pt-5 pb-[22px]">
        <div className="font-mono mb-2.5 text-[10px] tracking-[.14em] uppercase text-teal dark:text-dark-teal">{t(item.cat)}</div>
        <h3 data-clamp2 className="m-0 mb-3 min-h-[50px] font-serif text-[18.5px] leading-[1.35] font-medium text-pretty">{t(item.title)}</h3>
        <div className="mb-3 flex items-center gap-[7px] text-[12.5px] text-gray dark:text-dark-ink-dimmer">
          <PinIcon />
          {t(item.district)}
        </div>
        <p data-clamp2 className="m-0 min-h-[43px] text-[13.5px] leading-[1.6] text-slate dark:text-dark-ink-dim">{t(item.summary)}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-[18px]">
          <span className="font-mono text-[10.5px] text-graylight dark:text-dark-ink-dimmest">{item.ref}</span>
          <span className="text-[12.5px] font-semibold whitespace-nowrap text-navy dark:text-dark-ink">{t("View Details →")}</span>
        </div>
      </div>
    </Link>
  );
}
