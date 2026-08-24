"use client";

import Link from "next/link";
import { useState } from "react";
import { NewsCard } from "./NewsCard";
import { useLocale } from "@/lib/i18n";
import { NewsItem, articleParas, relatedFor, fmtDate } from "@/lib/data";

const SHARE_BUTTONS = [
  { kind: "x", d: "M17.53 3h3.02l-6.6 7.54L21.75 21h-5.9l-4.62-6.04L5.94 21H2.9l7.06-8.07L2.4 3h6.05l4.18 5.52zM16.47 19.2h1.67L7.63 4.7H5.84z", label: "Share on X" },
  { kind: "telegram", d: "M21.9 5.2 18.9 19.3c-.22 1-.82 1.25-1.66.78l-4.6-3.39-2.22 2.14c-.25.25-.45.45-.92.45l.33-4.68 8.5-7.68c.37-.33-.08-.51-.57-.18l-10.5 6.61-4.53-1.42c-.98-.31-1-.98.21-1.45l17.7-6.82c.82-.3 1.54.18 1.26 1.44z", label: "Share on Telegram" },
  { kind: "linkedin", d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3.2 9.2h3.6V21H3.2zM9.3 9.2h3.45v1.62h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.33 2.4 4.33 5.53V21h-3.6v-5.77c0-1.38-.03-3.15-1.93-3.15-1.93 0-2.22 1.5-2.22 3.05V21H9.3z", label: "Share on LinkedIn" },
  { kind: "facebook", d: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94z", label: "Share on Facebook" },
];

export default function ArticleView({ item }: { item: NewsItem }) {
  const { t, locale } = useLocale();
  const [shareStatus, setShareStatus] = useState("");
  const msg = item.kind === "msg";
  const paras = articleParas(item);
  const related = relatedFor(item);

  const doShare = (kind: string) => {
    if (kind === "copy" && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setShareStatus(t(kind === "copy" ? "Link copied" : "Sharing opens once the portal is published."));
    setTimeout(() => setShareStatus(""), 2800);
  };

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
        <div className="relative mx-auto max-w-[1080px] px-6 pt-19 pb-16.5">
          <nav aria-label={t("Breadcrumb")} className="font-mono mb-6 flex min-h-[15px] flex-wrap items-center gap-2.5 text-[10.5px] tracking-[.14em] uppercase">
            <Link href="/" className="text-gold">{t("Home")}</Link>
            <span className="text-[rgba(250,248,244,.30)]">{locale === "en" ? "›" : "‹"}</span>
            <Link href={`/news#${msg ? "statements-block" : "news-block"}`} className="text-[rgba(250,248,244,.62)]">{t(msg ? "Messages & Statements" : "News")}</Link>
            <span className="text-[rgba(250,248,244,.30)]">{locale === "en" ? "›" : "‹"}</span>
            <span className="text-[rgba(250,248,244,.92)]">{t(item.cat)}</span>
          </nav>
          <h1 className="m-0 max-w-[900px] font-serif font-medium text-bg text-pretty" style={{ fontSize: "clamp(29px, 3.7vw, 50px)", lineHeight: 1.13, letterSpacing: "-.015em" }}>
            {t(item.title)}
          </h1>
          <div className="font-mono mt-6 flex flex-wrap items-center gap-3 text-[11.5px] tracking-[.12em] uppercase">
            <span className="text-gold">{t(item.cat)}</span>
            <span aria-hidden className="text-[rgba(250,248,244,.32)]">&bull;</span>
            <span className="whitespace-nowrap text-[rgba(250,248,244,.74)]">{fmtDate(item, t)}</span>
            <span aria-hidden className="text-[rgba(250,248,244,.32)]">&bull;</span>
            <span className="text-[rgba(250,248,244,.60)]">{t(msg ? "[issuing office]" : "International Relations & Communications")}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1080px] px-6 pt-13.5 pb-22">
        <div className="grid aspect-video place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
          <span className="font-mono text-[10.5px] tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase">{t(msg ? "statement image" : "featured image")}</span>
        </div>
        <div className="font-mono my-3 mb-10 text-[10.5px] tracking-[.1em] text-graylight dark:text-dark-ink-dimmest">{t("[caption and photo credit]")}</div>

        <div className="grid max-w-[780px] gap-5.5">
          {paras.map((p, i) => (
            <p key={i} className={i === 0 ? "m-0 font-serif text-navy dark:text-dark-ink text-pretty" : "m-0 text-base leading-[1.8] text-slate dark:text-dark-ink-dim text-pretty"} style={i === 0 ? { fontSize: "clamp(19px, 1.8vw, 23px)", lineHeight: 1.6 } : undefined}>
              {t(p)}
            </p>
          ))}
        </div>

        <div className="mt-11.5 flex flex-wrap items-center gap-4.5 border-t border-navy/[.14] dark:border-dark-line pt-6.5">
          <span className="font-mono text-[10.5px] tracking-[.18em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Share")}</span>
          <div className="flex flex-wrap gap-2.5">
            {SHARE_BUTTONS.map((s) => (
              <button
                key={s.kind}
                type="button"
                aria-label={s.label}
                onClick={() => doShare(s.kind)}
                className="grid h-10.5 w-10.5 place-items-center border border-navy/20 dark:border-dark-line bg-transparent text-slate dark:text-dark-ink-dim transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
              >
                <svg aria-hidden width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d={s.d} /></svg>
              </button>
            ))}
            <button
              type="button"
              onClick={() => doShare("copy")}
              className="font-mono h-10.5 border border-navy/20 dark:border-dark-line bg-transparent px-4 text-[10.5px] tracking-[.14em] text-slate dark:text-dark-ink-dim uppercase transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              {t("Copy link")}
            </button>
          </div>
          <span className="font-mono min-h-[14px] text-[11px] tracking-[.08em] text-teal dark:text-dark-teal">{shareStatus}</span>
        </div>
      </div>

      <div className="border-t border-navy/10 dark:border-dark-line bg-white dark:bg-dark-surface-2">
        <div className="mx-auto max-w-[1280px] px-6 pt-19 pb-22.5">
          <div className="mb-8.5 flex flex-wrap items-end justify-between gap-6.5">
            <div>
              <div className="mb-3.5 flex items-center gap-3">
                <span className="h-px w-7 bg-gold" />
                <span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("More on this subject")}</span>
              </div>
              <h2 className="m-0 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.8vw, 38px)" }}>
                {t(msg ? "Related Messages & Statements" : "Related News")}
              </h2>
            </div>
            <Link href={`/news#${msg ? "statements-block" : "news-block"}`} className="border border-navy/20 dark:border-dark-line px-5 py-3.5 text-[13.5px] font-semibold transition-colors hover:border-gold hover:bg-gold/10">
              {t(msg ? "All Messages & Statements" : "All News")}
            </Link>
          </div>
          <div className="grid items-stretch gap-6.5 [grid-template-columns:repeat(auto-fill,minmax(290px,1fr))]">
            {related.map((r, i) => <NewsCard key={r.id} item={r} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
