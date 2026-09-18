"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import type { ContentItem } from "@/lib/supabase/types";

export default function LiveArticleView({ item }: { item: ContentItem }) {
  const { t, locale, dir } = useLocale();
  const isMsg = item.type === "statement";
  const title = locale === "ar" ? item.title_ar || item.title_en : item.title_en || item.title_ar;
  const body = locale === "ar" ? item.body_ar || item.body_en : item.body_en || item.body_ar;
  const dateSource = item.event_date ? new Date(item.event_date) : new Date(item.created_at);
  const dateLabel = dateSource.toLocaleDateString(locale === "ar" ? "ar" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="relative overflow-hidden bg-navy dark:bg-dark-navy">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(200,167,93,.055) 25%, transparent 25% 75%, rgba(200,167,93,.055) 75%), linear-gradient(-45deg, rgba(200,167,93,.055) 25%, transparent 25% 75%, rgba(200,167,93,.055) 75%), radial-gradient(circle, rgba(200,167,93,.16) 0 1.1px, transparent 1.7px)",
            backgroundSize: "78px 78px, 78px 78px, 39px 39px",
            backgroundPosition: "center",
            WebkitMaskImage: "linear-gradient(170deg, rgba(0,0,0,.95), rgba(0,0,0,.18))",
            maskImage: "linear-gradient(170deg, rgba(0,0,0,.95), rgba(0,0,0,.18))",
          }}
        />
        <div className="relative mx-auto max-w-[900px] px-6 pt-19 pb-16.5">
          <nav aria-label={t("Breadcrumb")} className="font-mono mb-6 flex min-h-[15px] flex-wrap items-center gap-2.5 text-[10.5px] tracking-[.14em] uppercase">
            <Link href="/" className="text-gold">{t("Home")}</Link>
            <span className="text-[rgba(250,248,244,.30)]">{dir === "rtl" ? "‹" : "›"}</span>
            <Link href={`/news#${isMsg ? "statements-block" : "news-block"}`} className="text-[rgba(250,248,244,.62)]">
              {t(isMsg ? "Messages & Statements" : "News")}
            </Link>
            <span className="text-[rgba(250,248,244,.30)]">{dir === "rtl" ? "‹" : "›"}</span>
            <span className="text-[rgba(250,248,244,.92)]">{item.category}</span>
          </nav>
          <h1 className="m-0 max-w-[900px] font-serif font-medium text-bg text-pretty" style={{ fontSize: "clamp(29px, 3.7vw, 50px)", lineHeight: 1.13, letterSpacing: "-.015em" }}>
            {title}
          </h1>
          <div className="font-mono mt-6 flex flex-wrap items-center gap-3 text-[11.5px] tracking-[.12em] uppercase">
            <span className="text-gold">{item.category}</span>
            <span aria-hidden className="text-[rgba(250,248,244,.32)]">&bull;</span>
            <span className="whitespace-nowrap text-[rgba(250,248,244,.74)]">{dateLabel}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[780px] px-6 py-16">
        {item.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt="" className="mb-10 w-full rounded-lg object-cover" />
        )}
        <div className="space-y-5 text-[16px] leading-[1.85] text-slate dark:text-dark-ink-dim">
          {body
            ? body.split(/\n+/).filter(Boolean).map((para, i) => <p key={i}>{para}</p>)
            : <p className="text-gray">{t("No further details have been published for this item yet.")}</p>}
        </div>

        <div className="mt-14 border-t border-navy/10 pt-8">
          <Link href="/news" className="text-[13px] font-semibold text-navy dark:text-dark-ink">
            {dir === "rtl" ? "→" : "←"} {t("Back to News")}
          </Link>
        </div>
      </div>
    </div>
  );
}
