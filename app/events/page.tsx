"use client";

import Link from "next/link";
import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";

const EVENTS = [
  { tag: "Conference", title: "[International conference title]", role: "[participation / speaker / delegation member]" },
  { tag: "Summit", title: "[Mayors' summit title]", role: "[to be provided by the municipality]" },
  { tag: "Forum", title: "[Urban forum title]", role: "[to be provided by the municipality]" },
  { tag: "Meeting", title: "[Bilateral municipal meeting title]", role: "[to be provided by the municipality]" },
  { tag: "Festival", title: "[International festival title]", role: "[to be provided by the municipality]" },
  { tag: "International Program", title: "[International programme title]", role: "[to be provided by the municipality]" },
];

export default function EventsPage() {
  const { t } = useLocale();
  return (
    <div>
      <PageHero
        page="events"
        title={t("International Events & Participation")}
        description={t("Conferences, summits, forums, festivals and international programmes in which Qom Municipality takes part abroad.")}
        icon={
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke="#C8A75D" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 120h180" />
            <rect x="70" y="70" width="58" height="50" />
            <rect x="30" y="90" width="32" height="30" />
            <rect x="136" y="90" width="32" height="30" />
            <path d="M99 70V44M99 44l30-10-30-10" />
            <path d="M38 62c8-6 18-6 26 0M134 62c8-6 18-6 26 0" opacity=".5" />
            <circle cx="99" cy="22" r="4" fill="#C8A75D" stroke="none" />
          </svg>
        }
      />
      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-24">
        <div className="grid gap-6.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {EVENTS.map((e) => (
            <article key={e.title} className="border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2">
              <div className="grid aspect-video place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
                <span className="font-mono text-[10px] tracking-[.14em] text-[rgba(250,248,244,.40)] uppercase">{t("event image")}</span>
              </div>
              <div className="p-6.5">
                <div className="mb-3 flex flex-wrap items-center gap-2.5">
                  <span className="font-mono border border-teal/40 px-2 py-1 text-[10px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{t(e.tag)}</span>
                  <span className="font-mono text-[11.5px] text-gray dark:text-dark-ink-dimmer">{t("[date]")}</span>
                </div>
                <h2 className="m-0 mb-2.5 font-serif text-[19px] leading-[1.35] font-medium">{t(e.title)}</h2>
                <div className="mb-2.5 text-[13px] text-gray dark:text-dark-ink-dimmer">{t("Location: [city, country]")}</div>
                <p className="m-0 mb-4 text-sm leading-[1.65] text-slate dark:text-dark-ink-dim">{t("Qom's role:")} {t(e.role)}.</p>
                <Link href="/events" className="text-[13px] font-semibold">{t("View Details →")}</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
