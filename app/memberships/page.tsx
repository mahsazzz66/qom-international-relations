"use client";

import Link from "next/link";
import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";

const ORGS = [
  { name: "UNESCO", body: "Participation as indicated by the municipality, in areas relating to heritage, culture and education. The precise scope, programme and date of participation are confirmed by the International Relations Department before publication." },
  { name: "AMF", body: "Membership confirmed by Qom Municipality. The description of the organisation's mandate and Qom's role within it will be supplied by the department." },
  { name: "BRICS Plus", body: "Participation in municipal-level activity as indicated by the municipality. Details of the format and the city's involvement remain to be confirmed." },
];

export default function MembershipsPage() {
  const { t } = useLocale();
  return (
    <div>
      <PageHero
        page="memberships"
        title={t("International Memberships & Networks")}
        description={t("Organisations and networks in which Qom Municipality holds membership or participates. Entries are published only once officially confirmed.")}
        icon={
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke="#C8A75D" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="70" cy="74" r="32" />
            <circle cx="108" cy="74" r="32" />
            <circle cx="89" cy="44" r="32" />
            <circle cx="89" cy="66" r="5" fill="#C8A75D" stroke="none" />
            <path d="M150 46h36M150 64h36M150 82h22" opacity=".55" />
            <circle cx="160" cy="106" r="6" />
          </svg>
        }
      />
      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-24">
        <div className="grid gap-6.5">
          {ORGS.map((o) => (
            <article key={o.name} className="grid border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2" style={{ gridTemplateColumns: "minmax(200px, 260px) minmax(0, 1fr)" }}>
              <div className="grid min-h-[180px] place-items-center bg-bg dark:bg-dark-surface p-6 border-r border-navy/[.12] dark:border-dark-line">
                <span className="font-mono text-[10px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("organisation logo")}</span>
              </div>
              <div className="p-8.5">
                <h2 className="m-0 mb-3 font-serif text-2xl font-medium">{o.name}</h2>
                <p className="m-0 mb-4 max-w-[640px] text-[15px] leading-[1.7] text-slate dark:text-dark-ink-dim">{t(o.body)}</p>
                <Link href="/contact" className="text-[13px] font-semibold">{t("Learn More →")}</Link>
              </div>
            </article>
          ))}
          <article className="border border-dashed border-navy/25 dark:border-dark-line bg-bg dark:bg-dark-surface p-8.5">
            <span className="font-mono text-[10px] tracking-[.14em] text-gold uppercase">{t("Reserved slot")}</span>
            <h2 className="m-0 mt-3.5 mb-2.5 font-serif text-[22px] font-medium text-gray dark:text-dark-ink-dimmer">{t("Other official memberships")}</h2>
            <p className="m-0 max-w-[640px] text-[14.5px] leading-[1.7] text-gray dark:text-dark-ink-dimmer">{t("Further municipal networks and international associations will be listed here once membership or participation has been officially confirmed by Qom Municipality.")}</p>
          </article>
        </div>
      </div>
    </div>
  );
}
