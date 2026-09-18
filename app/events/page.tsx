"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import type { ContentItem } from "@/lib/supabase/types";

export default function EventsPage() {
  const { t, locale } = useLocale();
  const [events, setEvents] = useState<ContentItem[] | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("content_items")
      .select("*")
      .eq("type", "event")
      .eq("published", true)
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => setEvents((data as ContentItem[]) ?? []));
  }, []);

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
        {events === null ? (
          <div className="py-16 text-center text-sm text-gray">{t("Loading…")}</div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-navy/15 py-20 text-center">
            <p className="mb-1 text-slate dark:text-dark-ink-dim">{t("No items have been published yet.")}</p>
            <p className="text-sm text-gray">{t("Please check back soon.")}</p>
          </div>
        ) : (
          <div className="grid gap-6.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {events.map((e) => {
              const title = locale === "ar" ? e.title_ar || e.title_en : e.title_en || e.title_ar;
              const excerpt = locale === "ar" ? e.excerpt_ar || e.excerpt_en : e.excerpt_en || e.excerpt_ar;
              const dateLabel = e.event_date
                ? new Date(e.event_date).toLocaleDateString(locale === "ar" ? "ar" : "en-GB", { year: "numeric", month: "long", day: "numeric" })
                : null;
              return (
                <article key={e.id} className="border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2">
                  {e.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.image_url} alt="" className="aspect-video w-full object-cover" />
                  ) : (
                    <div className="grid aspect-video place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
                      <span className="font-mono text-[10px] tracking-[.14em] text-[rgba(250,248,244,.40)] uppercase">{t("event image")}</span>
                    </div>
                  )}
                  <div className="p-6.5">
                    <div className="mb-3 flex flex-wrap items-center gap-2.5">
                      <span className="font-mono border border-teal/40 px-2 py-1 text-[10px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{e.category}</span>
                      {dateLabel && <span className="font-mono text-[11.5px] text-gray dark:text-dark-ink-dimmer">{dateLabel}</span>}
                    </div>
                    <h2 className="m-0 mb-2.5 font-serif text-[19px] leading-[1.35] font-medium">{title}</h2>
                    {e.location && <div className="mb-2.5 text-[13px] text-gray dark:text-dark-ink-dimmer">{e.location}</div>}
                    {excerpt && <p className="m-0 mb-4 text-sm leading-[1.65] text-slate dark:text-dark-ink-dim">{excerpt}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
