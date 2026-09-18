"use client";

import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";
import { pickText, usePageContent } from "@/lib/pageContent/read";
import { getPageSchema } from "@/lib/pageContent/pageSchemas";
import type { BilingualText } from "@/lib/pageContent/schema";

const COOPERATION_SCHEMA = getPageSchema("cooperation")!;
type TitleBodyOverride = { title?: BilingualText; body?: BilingualText };
type AgreementOverride = { counterpart?: BilingualText; instrument?: BilingualText; date?: BilingualText };

const AREAS = [
  { n: "01", title: "Urban management", body: "Municipal services, environment, waste and green space practice.", color: "#C8A75D", icon: <><path d="M3 20h18" /><path d="M6 20V9l6-4 6 4v11" /><path d="M10 14h4v6h-4z" /></> },
  { n: "02", title: "Visitor & pilgrim services", body: "Hospitality, crowd movement, wayfinding and accessibility.", color: "#00A8A8", icon: <><path d="M12 21s7-5.1 7-10.5A7 7 0 0 0 5 10.5C5 15.9 12 21 12 21z" /><circle cx="12" cy="10.3" r="2.6" /></> },
  { n: "03", title: "Heritage & architecture", body: "Conservation, precinct design and historic urban landscapes.", color: "#C8A75D", icon: <><path d="M4 21V10l8-6 8 6v11" /><path d="M9 21v-6a3 3 0 0 1 6 0v6" /><path d="M12 4V2" /></> },
  { n: "04", title: "Mobility & transport", body: "Public transport planning and seasonal visitor-flow management.", color: "#00A8A8", icon: <><rect x="4" y="4" width="16" height="12" rx="3" /><path d="M4 11h16" /><circle cx="8.5" cy="19" r="1.6" /><circle cx="15.5" cy="19" r="1.6" /></> },
  { n: "05", title: "Culture & education", body: "Cultural weeks, scholarly and youth exchange programmes.", color: "#C8A75D", icon: <><path d="M4 6.5h16" /><path d="M6 6.5V20h12V6.5" /><path d="M9.5 11h5M9.5 15h5" /><path d="M8 6.5V4h8v2.5" /></> },
  { n: "06", title: "Economy & investment", body: "Municipal finance cooperation and international project participation.", color: "#00A8A8", icon: <><path d="M3 20V12M8.7 20V7M14.3 20v-9M20 20V4" /><path d="M2 20h20" /></> },
];

const AGREEMENTS = [
  ["[partner municipality]", "Memorandum of Understanding", "[date]"],
  ["[partner municipality]", "Cooperation Agreement", "[date]"],
  ["[international organisation]", "Letter of Intent", "[date]"],
];

const STEPS = [
  { n: "Step 01", title: "Enquiry", body: "A city, institution or investor contacts the department." },
  { n: "Step 02", title: "Assessment", body: "Scope is matched to the relevant deputy department." },
  { n: "Step 03", title: "Instrument", body: "An MoU, agreement or letter of intent is prepared for signature." },
  { n: "Step 04", title: "Delivery", body: "Joint activity is carried out and reported in the annual review." },
];

export default function CooperationPage() {
  const { t, locale } = useLocale();
  const pageData = usePageContent("cooperation", COOPERATION_SCHEMA);
  const heroTitle = pickText(pageData?.hero_title as BilingualText | undefined, locale, t("International Cooperation"));
  const heroDescription = pickText(
    pageData?.hero_description as BilingualText | undefined,
    locale,
    t("How Qom Municipality enters into, structures and maintains cooperation with cities and institutions abroad.")
  );
  const areaOverrides = pageData?.areas as TitleBodyOverride[] | undefined;
  const areas =
    areaOverrides && areaOverrides.length > 0
      ? areaOverrides.map((o, i) => ({
          title: pickText(o.title, locale, AREAS[i] ? t(AREAS[i].title) : ""),
          body: pickText(o.body, locale, AREAS[i] ? t(AREAS[i].body) : ""),
          color: AREAS[i]?.color ?? AREAS[0].color,
          icon: AREAS[i]?.icon ?? AREAS[0].icon,
          n: AREAS[i]?.n ?? String(i + 1).padStart(2, "0"),
        }))
      : AREAS.map((a) => ({ title: t(a.title), body: t(a.body), color: a.color, icon: a.icon, n: a.n }));
  const agreementOverrides = pageData?.agreements as AgreementOverride[] | undefined;
  const agreements =
    agreementOverrides && agreementOverrides.length > 0
      ? agreementOverrides.map((o, i) => [
          pickText(o.counterpart, locale, AGREEMENTS[i] ? t(AGREEMENTS[i][0]) : ""),
          pickText(o.instrument, locale, AGREEMENTS[i] ? t(AGREEMENTS[i][1]) : ""),
          pickText(o.date, locale, AGREEMENTS[i] ? t(AGREEMENTS[i][2]) : ""),
        ] as [string, string, string])
      : AGREEMENTS.map(([a, b, c]) => [t(a), t(b), t(c)] as [string, string, string]);
  return (
    <div>
      <PageHero
        page="cooperation"
        title={heroTitle}
        description={heroDescription}
        icon={
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke="#C8A75D" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="92" cy="70" r="50" />
            <ellipse cx="92" cy="70" rx="50" ry="18" />
            <path d="M92 20c-15 15-15 85 0 100M92 20c15 15 15 85 0 100" />
            <circle cx="58" cy="52" r="4" fill="#C8A75D" stroke="none" />
            <circle cx="114" cy="44" r="4" fill="#C8A75D" stroke="none" />
            <circle cx="100" cy="98" r="4" fill="#C8A75D" stroke="none" />
            <path d="M58 52 114 44M114 44 100 98M58 52 100 98" strokeDasharray="3 4" />
            <path d="M158 42v56M172 32v76M186 54v32" opacity=".5" />
          </svg>
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-24">
        <div className="font-mono mb-3.5 text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Where we work together")}</div>
        <h2 className="m-0 mb-8 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.6vw, 36px)" }}>{t("Cooperation Areas")}</h2>
        <div data-coop-grid className="mb-18 grid items-stretch gap-5.5" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          {areas.map((a, i) => (
            <article key={`${a.title}-${i}`} className="grid content-start gap-3.5 border border-navy/10 dark:border-dark-line bg-white dark:bg-dark-surface-2 px-7 pt-7.5 pb-8 shadow-[0_1px_2px_rgba(11,31,58,.04)] transition-all hover:-translate-y-0.5 hover:border-gold/55 hover:shadow-[0_20px_40px_-26px_rgba(11,31,58,.34)]">
              <span className="block h-5.5" style={{ color: a.color }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">{a.icon}</svg></span>
              <div className="font-mono text-[9.5px] tracking-[.18em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Area " + a.n)}</div>
              <h3 className="m-0 font-serif text-xl leading-[1.3] font-medium text-navy dark:text-dark-ink">{a.title}</h3>
              <p className="m-0 text-sm leading-[1.7] text-slate dark:text-dark-ink-dim text-pretty">{a.body}</p>
            </article>
          ))}
        </div>

        <h2 className="m-0 mb-3 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.6vw, 36px)" }}>{t("Agreements")}</h2>
        <p className="m-0 mb-6.5 max-w-[640px] text-base leading-[1.7] text-slate dark:text-dark-ink-dim">{t("Signed instruments are listed here once confirmed by the municipality. Each entry records the counterpart, the date and the scope of cooperation.")}</p>
        <div className="mb-18 border border-navy/[.12] dark:border-dark-line">
          <div className="font-mono grid gap-5 bg-navy dark:bg-dark-navy px-6.5 py-4.5 text-[10.5px] tracking-[.14em] text-gold uppercase" style={{ gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr)" }}>
            <div>{t("Counterpart")}</div><div>{t("Instrument")}</div><div>{t("Date")}</div>
          </div>
          {agreements.map((row, i) => (
            <div key={i} className="grid gap-5 border-b border-navy/10 dark:border-dark-line bg-white dark:bg-dark-surface-2 px-6.5 py-5.5 text-sm last:border-b-0" style={{ gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr)" }}>
              <div>{row[0]}</div><div>{row[1]}</div><div className="text-gray dark:text-dark-ink-dimmer">{row[2]}</div>
            </div>
          ))}
        </div>

        <h2 className="m-0 mb-7.5 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.6vw, 36px)" }}>{t("International Relations Framework")}</h2>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          {STEPS.map((s) => (
            <div key={s.n} className="border-t-2 border-gold pt-5.5">
              <div className="font-mono mb-2.5 text-xs text-gold">{t(s.n)}</div>
              <h3 className="m-0 mb-2 font-serif text-lg font-medium">{t(s.title)}</h3>
              <p className="m-0 text-[13.5px] leading-[1.65] text-slate dark:text-dark-ink-dim">{t(s.body)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
