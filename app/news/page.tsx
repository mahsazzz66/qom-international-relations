"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ArchiveSection from "@/components/ArchiveSection";
import { NewsCard, MsgCard } from "@/components/NewsCard";
import { NEWS, MSGS, fmtDate, NewsItem } from "@/lib/data";
import { useLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { contentItemToNewsItem } from "@/lib/supabase/adapters";
import type { ContentItem } from "@/lib/supabase/types";

const NEWS_CATEGORIES = [
  { value: "International Meetings", label: "International Meetings" },
  { value: "International Delegations", label: "International Delegations" },
  { value: "Agreements & Cooperation", label: "Agreements & Cooperation" },
  { value: "Pilgrimage Cities", label: "Pilgrimage Cities" },
  { value: "Events & Conferences", label: "Events & Conferences" },
  { value: "Investment", label: "Investment" },
  { value: "Urban Diplomacy", label: "Urban Diplomacy" },
  { value: "Announcements", label: "Announcements" },
];

const MSG_CATEGORIES = [
  { value: "Official Message", label: "Official Messages" },
  { value: "Municipal Statement", label: "Municipal Statements" },
  { value: "Congratulations", label: "Congratulations" },
  { value: "Condolence", label: "Condolences" },
  { value: "Announcement", label: "Announcements" },
  { value: "Official Position", label: "Official Positions" },
];

function FeaturedNews({ item }: { item: NewsItem }) {
  const { t } = useLocale();
  return (
    <Link href={`/news/${item.id}`} className="mb-11.5 grid cursor-pointer border border-navy/[.14] dark:border-dark-line bg-white dark:bg-dark-surface-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))" }}>
      <div className="grid min-h-[330px] place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
        <span className="font-mono text-[10.5px] tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase">{t("featured image")}</span>
      </div>
      <div className="flex flex-col justify-center px-11 py-11.5">
        <div className="mb-4.5 flex flex-wrap items-center gap-3">
          <span className="font-mono bg-gold px-2.5 py-[5px] text-[9.5px] tracking-[.18em] text-navy uppercase">{t("Featured")}</span>
          <span className="font-mono text-[10px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{t(item.cat)}</span>
          <span className="font-mono text-[11.5px] whitespace-nowrap text-gray dark:text-dark-ink-dimmer">{fmtDate(item, t)}</span>
        </div>
        <h3 className="m-0 mb-4 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.6vw, 34px)", lineHeight: 1.22 }}>{t(item.title)}</h3>
        <p className="m-0 mb-7 max-w-[540px] text-[15.5px] leading-[1.75] text-slate dark:text-dark-ink-dim">
          {t("Short excerpt of the featured item. This card is reserved for the department's most significant current announcement and will be populated from the municipality's newsroom.")}
        </p>
        <span className="self-start border border-navy/20 dark:border-dark-line px-5.5 py-3.5 text-[13px] font-semibold whitespace-nowrap text-navy dark:text-dark-ink">{t("Read More →")}</span>
      </div>
    </Link>
  );
}

export default function NewsPage() {
  const { t, locale } = useLocale();
  const [liveItems, setLiveItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("content_items")
      .select("*")
      .in("type", ["news", "statement"])
      .eq("published", true)
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setLiveItems(data as ContentItem[]);
      });
  }, []);

  const liveNews = useMemo(
    () => liveItems.filter((i) => i.type === "news").map((i) => contentItemToNewsItem(i, locale === "ar" ? "ar" : "en")),
    [liveItems, locale]
  );
  const liveMsgs = useMemo(
    () => liveItems.filter((i) => i.type === "statement").map((i) => contentItemToNewsItem(i, locale === "ar" ? "ar" : "en")),
    [liveItems, locale]
  );

  // Real content published from the admin panel appears first; the
  // placeholder archive below fills the page until it's replaced.
  const news = [...liveNews, ...NEWS()];
  const msgs = [...liveMsgs, ...MSGS()];

  return (
    <div>
      <PageHero
        page="news"
        icon={
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke="#C8A75D" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <rect x="10" y="26" width="118" height="92" />
            <rect x="22" y="40" width="42" height="30" />
            <path d="M74 44h42M74 56h42M74 68h26M22 84h94M22 96h94M22 108h58" />
            <path d="M138 36h52v76h-52z" opacity=".45" />
            <circle cx="164" cy="24" r="7" strokeWidth=".9" />
          </svg>
        }
        title={t("News & Official Communications")}
        description={t("Two separate records: newsroom reporting on the municipality's international activity, and the formal messages and statements issued in its name.")}
        actions={
          <>
            <a href="#news-block" className="font-mono bg-gold px-4.5 py-3 text-[11px] tracking-[.16em] text-navy uppercase hover:bg-bg">{t("News")}</a>
            <a href="#statements-block" className="font-mono border border-gold/55 px-4.5 py-3 text-[11px] tracking-[.16em] text-gold uppercase hover:bg-gold/[.16]">{t("Messages & Statements")}</a>
          </>
        }
      />

      <div id="news-block" className="mx-auto max-w-[1280px] px-6 pt-[76px] pb-21">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-7">
          <div className="max-w-[700px]">
            <div className="mb-3.5 flex flex-wrap items-center gap-3">
              <span className="h-px w-7 bg-gold" />
              <span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Category A")}</span>
            </div>
            <h2 className="m-0 mb-3 font-serif font-medium" style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>{t("News")}</h2>
            <p className="m-0 text-[15px] leading-[1.75] text-slate dark:text-dark-ink-dim">
              {t("Reporting on meetings, delegations, agreements and programmes — written by the newsroom of the International Relations Department.")}
            </p>
          </div>
          <div className="font-mono text-[11px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">
            {news.length} {t("articles in the archive")}
          </div>
        </div>

        <ArchiveSection
          data={news}
          categories={NEWS_CATEGORIES}
          perPage={12}
          allLabel="All News"
          searchPlaceholder="Search news, keywords or categories"
          emptyTitle="No articles match your search."
          emptyBody="Try another keyword, category or archive period."
          unitLabel="Articles"
          archiveLabel="News archive"
          moreLabel="Load More News"
          scrollTargetId="news-block"
          gridClassName="grid items-stretch gap-6.5 [grid-template-columns:repeat(auto-fill,minmax(290px,1fr))]"
          renderFeatured={(item) => <FeaturedNews item={item} />}
          renderCard={(item, i) => <NewsCard key={item.id} item={item} index={i} />}
        />
      </div>

      <div id="statements-block" className="border-t border-b border-navy/10 dark:border-dark-line bg-white dark:bg-dark-surface-2">
        <div className="mx-auto max-w-[1280px] px-6 pt-[76px] pb-[90px]">
          <div className="mb-8.5 flex flex-wrap items-end justify-between gap-7">
            <div className="max-w-[720px]">
              <div className="mb-3.5 flex flex-wrap items-center gap-3">
                <span className="h-px w-7 bg-gold" />
                <span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Category B")}</span>
              </div>
              <h2 className="m-0 mb-3 font-serif font-medium" style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>{t("Messages & Statements")}</h2>
              <p className="m-0 text-[15px] leading-[1.75] text-slate dark:text-dark-ink-dim">
                {t("Formal communications issued in the name of Qom Municipality. These are not news items: each is an official text with an issuing office and a reference number.")}
              </p>
            </div>
            <div className="font-mono text-[11px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">
              {msgs.length} {t("statements in the archive")}
            </div>
          </div>

          <ArchiveSection
            data={msgs}
            categories={MSG_CATEGORIES}
            perPage={6}
            allLabel="All Statements"
            searchPlaceholder="Search messages and statements"
            emptyTitle="No statements match your search."
            emptyBody="Try another keyword, category or archive period."
            unitLabel="Statements"
            archiveLabel="Statements archive"
            moreLabel="Load More Statements"
            scrollTargetId="statements-block"
            gridClassName="grid gap-5"
            renderCard={(item, i) => <MsgCard key={item.id} item={item} index={i} />}
          />
        </div>
      </div>
    </div>
  );
}
