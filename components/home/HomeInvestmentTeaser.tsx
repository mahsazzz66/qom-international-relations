"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";

const TEASERS = [
  { id: "i1", tag: "Urban Development", title: "[Urban development project]", desc: "Brief description of the opportunity, provided by the Financial & Economic Affairs department." },
  { id: "i2", tag: "Smart City Projects", title: "[Smart city project]", desc: "Brief description of the opportunity, provided by the municipality." },
  { id: "i3", tag: "Transportation", title: "[Transportation project]", desc: "Brief description of the opportunity, provided by the municipality." },
  { id: "i4", tag: "Tourism Infrastructure", title: "[Tourism infrastructure project]", desc: "Brief description of the opportunity, provided by the municipality." },
  { id: "i5", tag: "Cultural Projects", title: "[Cultural project]", desc: "Brief description of the opportunity, provided by the municipality." },
  { id: "i6", tag: "Technology & Innovation", title: "[Technology & innovation project]", desc: "Brief description of the opportunity, provided by the municipality." },
];

export default function HomeInvestmentTeaser() {
  const { t } = useLocale();
  return (
    <div className="grid items-stretch gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))" }}>
      {TEASERS.map((it) => (
        <Link
          key={it.id}
          href={`/investment/${it.id}`}
          data-invcard
          className="relative flex flex-col gap-3.5 overflow-hidden border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 p-[30px] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-gold"
        >
          <div
            data-invpreview
            aria-hidden
            className="absolute inset-0 grid items-end justify-items-start bg-navy dark:bg-dark-navy p-3.5"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.20) 0 2px, transparent 2px 11px), linear-gradient(180deg, rgba(11,31,58,.35), rgba(11,31,58,.86))" }}
          >
            <span className="font-mono text-[9px] tracking-[.16em] text-[rgba(250,248,244,.42)] uppercase">{t("project image")}</span>
          </div>
          <span data-invtag className="font-mono relative self-start border border-teal/40 px-[9px] py-[5px] text-[10.5px] tracking-[.14em] text-teal dark:text-dark-teal uppercase transition-colors">
            {t(it.tag)}
          </span>
          <h3 data-invtitle className="relative m-0 font-serif text-[21px] font-medium transition-colors">{t(it.title)}</h3>
          <p data-invbody className="relative m-0 text-[14.5px] leading-[1.65] text-slate dark:text-dark-ink-dim transition-colors">{t(it.desc)}</p>
          <span data-invlink className="relative mt-auto text-[13px] font-semibold whitespace-nowrap text-navy dark:text-dark-ink transition-colors">{t("View Details →")}</span>
        </Link>
      ))}
    </div>
  );
}
