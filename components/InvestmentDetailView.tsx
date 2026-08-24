"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { InvestmentItem, INVEST, fmtDate } from "@/lib/data";
import InvestmentCard from "./InvestmentCard";

const DOCS = [
  ["Project brief", "[project brief]"],
  ["Site plan", "[site plan]"],
  ["Participation terms", "[participation terms]"],
  ["Due diligence pack", "[due diligence pack]"],
];

function PinIcon() {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8A75D" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export default function InvestmentDetailView({ item }: { item: InvestmentItem }) {
  const { t, locale } = useLocale();
  const mapUrl = `https://www.google.com/maps?q=${item.lat},${item.lng}`;
  const pool = INVEST();
  const same = pool.filter((x) => x.id !== item.id && x.cat === item.cat);
  const rest = pool.filter((x) => x.id !== item.id && x.cat !== item.cat);
  const related = same.concat(rest).slice(0, 3);

  const specs: [string, string][] = [
    ["Opportunity ID", item.ref],
    ["Opportunity status", item.status],
    ["Investment type", item.type],
    ["Investment category", item.cat],
    ["District", item.district],
    ["Land area", "[site area — m²]"],
    ["Estimated investment value", "[estimated value]"],
    ["Term of participation", "[term]"],
    ["Geographic coordinates", `${item.lat}° N, ${item.lng}° E`],
    ["Responsible department", "Financial & Economic Affairs"],
  ];

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
        <div className="relative mx-auto max-w-[1280px] px-6 pt-19 pb-16.5">
          <nav aria-label={t("Breadcrumb")} className="font-mono mb-6 flex min-h-[15px] flex-wrap items-center gap-2.5 text-[10.5px] tracking-[.14em] uppercase">
            <Link href="/" className="text-gold">{t("Home")}</Link>
            <span className="text-[rgba(250,248,244,.30)]">{locale === "en" ? "›" : "‹"}</span>
            <Link href="/investment" className="text-[rgba(250,248,244,.62)]">{t("Investment Opportunities")}</Link>
            <span className="text-[rgba(250,248,244,.30)]">{locale === "en" ? "›" : "‹"}</span>
            <span className="text-[rgba(250,248,244,.92)]">{t(item.cat)}</span>
          </nav>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="font-mono inline-block bg-gold px-2.5 py-1.5 text-[9.5px] tracking-[.18em] text-navy uppercase">{t(item.status)}</span>
            <span className="font-mono inline-block border border-teal/45 px-[9px] py-[5px] text-[9.5px] tracking-[.16em] text-dark-teal uppercase">{t(item.cat)}</span>
            <span className="font-mono text-[11.5px] whitespace-nowrap text-[rgba(250,248,244,.62)]">{item.ref}</span>
          </div>
          <h1 className="m-0 mb-4.5 max-w-[900px] font-serif font-medium text-bg text-pretty" style={{ fontSize: "clamp(28px, 3.5vw, 46px)", lineHeight: 1.14, letterSpacing: "-.015em" }}>{t(item.title)}</h1>
          <div className="flex items-center gap-2.5 text-[15px] text-[rgba(250,248,244,.78)]">
            <PinIcon />
            <span>{t(item.district)} · {t("Qom, Islamic Republic of Iran")}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pt-13 pb-10">
        <div className="grid gap-3">
          <div className="grid aspect-[21/9] place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
            <span className="font-mono text-[10.5px] tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase">{t("hero image — opportunity site")}</span>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="grid aspect-[4/3] place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.12) 0 2px, transparent 2px 11px)" }}>
                <span className="font-mono text-[9px] tracking-[.14em] text-[rgba(250,248,244,.36)] uppercase">{t("gallery 0" + n)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pt-6 pb-22.5">
        <div data-invdetail-body className="grid items-start gap-11" style={{ gridTemplateColumns: "minmax(0, 1fr) 340px" }}>
          <div>
            <h2 className="m-0 mb-4.5 font-serif font-medium" style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}>{t("The opportunity")}</h2>
            <div className="mb-13.5 grid gap-4.5">
              <p className="m-0 font-serif text-navy dark:text-dark-ink text-pretty" style={{ fontSize: "clamp(18px, 1.7vw, 22px)", lineHeight: 1.6 }}>{t(item.summary)}</p>
              {[
                "[Description of the site, its surroundings and the municipal intention for it.]",
                "[Participation model: the form of agreement offered, the term, and the obligations of each party.]",
                "[Municipal commitments: permissions, access, utilities and the department responsible for delivery.]",
              ].map((p) => <p key={p} className="m-0 text-[15.5px] leading-[1.8] text-slate dark:text-dark-ink-dim text-pretty">{t(p)}</p>)}
            </div>

            <h2 className="m-0 mb-5 font-serif font-medium" style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}>{t("Specifications")}</h2>
            <div className="mb-13.5 grid gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
              <div className="grid content-start gap-1.5 bg-white dark:bg-dark-surface-2 p-5.5" style={{ boxShadow: "inset 0 2px 0 #C8A75D" }}>
                <span className="font-mono text-[9.5px] tracking-[.18em] text-gold uppercase">{t("Start date")}</span>
                <span className="text-[15.5px] leading-[1.55] font-semibold text-navy dark:text-dark-ink">{fmtDate(item.start, t)}</span>
              </div>
              <div className="grid content-start gap-1.5 bg-white dark:bg-dark-surface-2 p-5.5" style={{ boxShadow: "inset 0 2px 0 #C8A75D" }}>
                <span className="font-mono text-[9.5px] tracking-[.18em] text-gold uppercase">{t("End date")}</span>
                <span className="text-[15.5px] leading-[1.55] font-semibold text-navy dark:text-dark-ink">{fmtDate(item.end, t)}</span>
              </div>
              {specs.map(([label, val]) => (
                <div key={label} className="grid content-start gap-1.5 bg-white dark:bg-dark-surface-2 p-5.5">
                  <span className="font-mono text-[9.5px] tracking-[.18em] text-gray dark:text-dark-ink-dimmer uppercase">{t(label)}</span>
                  <span className="text-sm leading-[1.55] text-navy dark:text-dark-ink">{t(val)}</span>
                </div>
              ))}
            </div>

            <h2 className="m-0 mb-5 font-serif font-medium" style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}>{t("Documents & attachments")}</h2>
            <div className="mb-13.5 grid gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill">
              {DOCS.map(([cat, title]) => (
                <div key={title} className="flex flex-wrap items-center justify-between gap-4.5 bg-white dark:bg-dark-surface-2 px-6 py-5">
                  <span className="flex min-w-0 items-center gap-3.5">
                    <svg aria-hidden width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C8A75D" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" opacity=".6" /></svg>
                    <span className="grid min-w-0 gap-1">
                      <span className="text-[14.5px] text-navy dark:text-dark-ink">{t(title)}</span>
                      <span className="font-mono text-[9.5px] tracking-[.16em] text-gray dark:text-dark-ink-dimmer uppercase">{t(cat)}</span>
                    </span>
                  </span>
                  <Link href="/media" className="font-mono text-[10.5px] font-medium tracking-[.14em] whitespace-nowrap uppercase">{t("Download PDF →")}</Link>
                </div>
              ))}
            </div>

            <h2 className="m-0 mb-5 font-serif font-medium" style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}>{t("Location")}</h2>
            <a href={mapUrl} target="_blank" rel="noopener" className="relative block aspect-video border border-navy/[.12] dark:border-dark-line bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.10) 0 1px, transparent 1px 14px), linear-gradient(180deg, rgba(0,168,168,.06), transparent)" }}>
              <span className="absolute top-1/2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" style={{ boxShadow: "0 0 0 6px rgba(200,167,93,.25)" }} />
              <span className="font-mono absolute bottom-3.5 left-4 text-[10px] tracking-[.14em] text-[rgba(250,248,244,.55)] uppercase">{t("interactive map — open in google maps")}</span>
            </a>
            <div className="flex flex-wrap items-center justify-between gap-4 border border-t-0 border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 px-5 py-4">
              <span className="font-mono text-xs text-navy dark:text-dark-ink">{item.lat}° N, {item.lng}° E <span className="text-[10px] tracking-[.16em] text-graylight dark:text-dark-ink-dimmest uppercase">{t("indicative")}</span></span>
              <a href={mapUrl} target="_blank" rel="noopener" className="font-mono text-[10.5px] font-medium tracking-[.14em] uppercase">{t("Open in Google Maps →")}</a>
            </div>
          </div>

          <aside data-inv-aside className="grid content-start gap-5">
            <div className="border border-t-3 border-navy/[.14] dark:border-dark-line border-t-gold bg-white dark:bg-dark-surface-2 p-7">
              <div className="font-mono mb-4.5 text-[10.5px] tracking-[.18em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Key facts")}</div>
              <div className="grid gap-3.5">
                {[["Opportunity status", item.status], ["Investment type", item.type], ["Land area", "[site area]"], ["Estimated value", "[estimated value]"], ["Opportunity ID", item.ref]].map(([k, v]) => (
                  <div key={k} className="grid gap-1">
                    <span className="font-mono text-[9.5px] tracking-[.16em] text-gray dark:text-dark-ink-dimmer uppercase">{t(k)}</span>
                    <span className="text-[14.5px] leading-[1.5] text-navy dark:text-dark-ink">{t(v)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-navy dark:bg-dark-navy p-7 text-bg">
              <div className="font-mono mb-3.5 text-[10.5px] tracking-[.18em] text-gold uppercase">{t("Enquiries")}</div>
              <div className="mb-2.5 font-serif text-[19px] leading-[1.35] font-medium">{t("International Relations Office")}</div>
              <p className="m-0 mb-4.5 text-[13.5px] leading-[1.7] text-[rgba(250,248,244,.72)]">{t("Qom Municipality, Central Building")}<br />{t("[official email address]")}<br />{t("[official telephone number]")}</p>
              <Link href="/contact" className="inline-block bg-gold px-5.5 py-3.5 text-[13.5px] font-semibold text-navy hover:bg-bg">{t("Submit an enquiry →")}</Link>
            </div>
          </aside>
        </div>
      </div>

      <div className="border-t border-navy/10 dark:border-dark-line bg-white dark:bg-dark-surface-2">
        <div className="mx-auto max-w-[1280px] px-6 pt-19 pb-22.5">
          <div className="mb-8.5 flex flex-wrap items-end justify-between gap-6.5">
            <div>
              <div className="mb-3.5 flex items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Same category")}</span></div>
              <h2 className="m-0 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.8vw, 38px)" }}>{t("Related Opportunities")}</h2>
            </div>
            <Link href="/investment" className="border border-navy/20 dark:border-dark-line px-5 py-3.5 text-[13.5px] font-semibold transition-colors hover:border-gold hover:bg-gold/10">{t("All opportunities")}</Link>
          </div>
          <div className="grid items-stretch gap-6.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(292px, 1fr))" }}>
            {related.map((r, i) => <InvestmentCard key={r.id} item={r} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
