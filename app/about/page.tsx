"use client";

import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";
import { pickText, usePageContent } from "@/lib/pageContent/read";
import { getPageSchema } from "@/lib/pageContent/pageSchemas";
import type { BilingualText } from "@/lib/pageContent/schema";

const ABOUT_SCHEMA = getPageSchema("about")!;

type TitleBodyOverride = { title?: BilingualText; body?: BilingualText };

// Uses the admin-edited list when it has entries, falling back item-by-item
// to the page's static copy (so an edited list that's shorter or longer than
// the original still renders correctly, and an unedited page is unaffected).
function mergeTitleBodyList(
  overrides: TitleBodyOverride[] | undefined,
  fallback: { title: string; body: string }[],
  locale: "en" | "ar",
  t: (s: string) => string
) {
  if (!overrides || overrides.length === 0) {
    return fallback.map((f) => ({ title: t(f.title), body: t(f.body) }));
  }
  return overrides.map((o, i) => ({
    title: pickText(o.title, locale, fallback[i] ? t(fallback[i].title) : ""),
    body: pickText(o.body, locale, fallback[i] ? t(fallback[i].body) : ""),
  }));
}

const JUMP_LINKS = [
  { href: "#about-mission", key: "Mission" },
  { href: "#about-vision", key: "Vision" },
  { href: "#about-objectives-detail", key: "Objectives" },
  { href: "#about-structure", key: "Organizational Structure" },
  { href: "#about-strategy", key: "International Strategy" },
];

const OBJECTIVES = [
  { title: "Establish durable partnerships", body: "Formal municipal relationships with cities that share Qom's responsibilities and interests." },
  { title: "Lead the Working Group", body: "Carry the presidency and permanent secretariat of the Pilgrimage Cities Working Group." },
  { title: "Connect the deputy departments", body: "Route international cooperation to the municipal department that can act on it." },
  { title: "Represent Qom abroad", body: "Participate in international fora, conferences and municipal networks on the city's behalf." },
  { title: "Facilitate cooperation & investment", body: "Serve as the single municipal point of contact for international partners and investors." },
  { title: "Communicate internationally", body: "Publish official material and respond to international media and institutional enquiries." },
];

const STRUCTURE = [
  { title: "Office of the Director", body: "Mandate, representation and coordination with the Mayor's office." },
  { title: "Bilateral Relations Unit", body: "Partner cities, agreements and delegation programmes." },
  { title: "Working Group Secretariat", body: "Permanent secretariat functions for the Pilgrimage Cities Working Group." },
  { title: "Communications Unit", body: "Publications, media relations and the international portal." },
];

const PILLARS = [
  { n: "Pillar one", title: "Diplomacy", body: "Municipal representation, dialogue and formal relations with partner cities." },
  { n: "Pillar two", title: "Knowledge", body: "Exchange of municipal practice in pilgrimage-city governance." },
  { n: "Pillar three", title: "Culture", body: "Cultural weeks, festivals and intercultural programming with partners." },
  { n: "Pillar four", title: "Investment", body: "Facilitation of international participation in municipal projects." },
];

export default function AboutPage() {
  const { t, locale } = useLocale();
  const pageData = usePageContent("about", ABOUT_SCHEMA);

  const heroTitle = pickText(
    pageData?.hero_title as BilingualText | undefined,
    locale,
    t("About the International Relations & Communications Department")
  );
  const heroDescription = pickText(
    pageData?.hero_description as BilingualText | undefined,
    locale,
    t("The official channel between Qom Municipality and the international community.")
  );
  const objectives = mergeTitleBodyList(pageData?.objectives as TitleBodyOverride[] | undefined, OBJECTIVES, locale, t);
  const structure = mergeTitleBodyList(pageData?.structure as TitleBodyOverride[] | undefined, STRUCTURE, locale, t);
  const pillars = mergeTitleBodyList(
    pageData?.pillars as TitleBodyOverride[] | undefined,
    PILLARS,
    locale,
    t
  ).map((p, i) => ({ ...p, n: PILLARS[i] ? t(PILLARS[i].n) : "" }));

  return (
    <div>
      <PageHero
        page="about"
        title={heroTitle}
        description={heroDescription}
        icon={
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke="#C8A75D" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 120h124M26 120V62M50 120V62M74 120V62M98 120V62M122 120V62M16 56h116L74 24 16 56z" />
            <path d="M74 24v-9" />
            <circle cx="166" cy="78" r="24" />
            <path d="M142 78h48M166 54c11 11 11 37 0 48M166 54c-11 11-11 37 0 48" />
          </svg>
        }
        wide
      />

      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-24">
        <div className="mb-13 flex flex-wrap gap-2.5 border-b border-navy/[.12] dark:border-dark-line pb-5.5">
          {JUMP_LINKS.map((j) => (
            <a key={j.href} href={j.href} className="border border-navy/[.18] dark:border-dark-line px-4 py-2.5 text-[13px] font-medium hover:border-gold">{t(j.key)}</a>
          ))}
        </div>

        <div className="mb-13.5 grid items-end gap-14" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-7 bg-gold" />
              <span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("About us")}</span>
            </div>
            <h2 className="m-0 max-w-[620px] font-serif font-medium text-pretty" style={{ fontSize: "clamp(30px, 3.4vw, 46px)", lineHeight: 1.12, letterSpacing: "-.015em" }}>
              {t("The municipality's official channel to the international community")}
            </h2>
          </div>
          <p className="m-0 max-w-[520px] text-[17px] leading-[1.75] text-slate dark:text-dark-ink-dim text-pretty">
            {t("The department establishes and maintains relations with partner municipalities, international organisations and networks, receives foreign delegations, and connects Qom's six specialised deputy departments with their counterparts abroad.")}
          </p>
        </div>

        <div className="mb-16 grid border-t border-navy/[.14] dark:border-dark-line" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <div id="about-mission" className="border-navy/10 dark:border-dark-line py-10 pr-11 border-r">
            <div className="mb-4.5 flex items-baseline gap-3.5"><span className="font-mono text-xs text-gold">01</span><h3 className="m-0 font-serif text-2xl font-medium">{t("Mission")}</h3></div>
            <p className="m-0 text-[15.5px] leading-[1.75] text-slate dark:text-dark-ink-dim">{t("To open and sustain municipal channels with cities and institutions abroad, and to make Qom's experience as a pilgrimage city available to international partners.")}</p>
          </div>
          <div id="about-vision" className="border-navy/10 dark:border-dark-line px-11 py-10 border-r">
            <div className="mb-4.5 flex items-baseline gap-3.5"><span className="font-mono text-xs text-gold">02</span><h3 className="m-0 font-serif text-2xl font-medium">{t("Vision")}</h3></div>
            <p className="m-0 text-[15.5px] leading-[1.75] text-slate dark:text-dark-ink-dim">{t("An internationally connected Qom, recognised as a reference city for cooperation among the world's pilgrimage destinations.")}</p>
          </div>
          <div className="py-10 pl-11">
            <div className="mb-4.5 flex items-baseline gap-3.5"><span className="font-mono text-xs text-gold">03</span><h3 className="m-0 font-serif text-2xl font-medium">{t("Objectives")}</h3></div>
            <div className="grid gap-3 text-[15px] leading-[1.6] text-slate dark:text-dark-ink-dim">
              {["Durable municipal partnerships", "Leadership of the Working Group", "Cooperation routed to the right department", "Facilitation of investment and exchange"].map((o) => (
                <div key={o} className="flex gap-3"><span className="shrink-0 text-gold">—</span>{t(o)}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-18 grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <div className="grid min-h-[380px] place-items-center bg-navy dark:bg-dark-navy p-6 text-center" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
            <span className="font-mono text-[10.5px] tracking-[.16em] text-[rgba(250,248,244,.42)] uppercase">image placeholder — qom municipality<br />headquarters</span>
          </div>
          <div className="flex flex-col justify-center bg-gold p-10 text-navy sm:p-14">
            <div className="font-mono mb-[22px] text-[11px] tracking-[.2em] uppercase">{t("International Strategy")}</div>
            <p className="m-0 mb-7 font-serif text-pretty" style={{ fontSize: "clamp(21px, 2.1vw, 28px)", lineHeight: 1.5 }}>{t("Four pillars carry the department's work abroad: diplomacy, knowledge, culture and investment.")}</p>
            <a href="#about-strategy" className="self-start border-b border-navy pb-[5px] text-[13.5px] font-semibold text-navy dark:text-dark-ink">{t("See the four pillars →")}</a>
          </div>
        </div>

        <div id="about-objectives-detail" className="mb-18">
          <h2 className="m-0 mb-7.5 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.6vw, 36px)" }}>{t("Objectives in detail")}</h2>
          <div className="grid gap-px bg-navy/[.12] dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {objectives.map((o, i) => (
              <div key={`${o.title}-${i}`} className="bg-white dark:bg-dark-surface-2 p-7.5">
                <div className="font-mono mb-4.5 text-xs text-gold">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="m-0 mb-2.5 font-serif text-lg font-medium">{o.title}</h3>
                <p className="m-0 text-sm leading-[1.65] text-slate dark:text-dark-ink-dim">{o.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="about-structure" className="mb-18">
          <h2 className="m-0 mb-3 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.6vw, 36px)" }}>{t("Organizational Structure")}</h2>
          <p className="m-0 mb-7.5 max-w-[640px] text-base leading-[1.7] text-slate dark:text-dark-ink-dim">{t("The department reports to the Mayor of Qom and operates through four functional units. Named appointments are published once confirmed by the municipality.")}</p>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {structure.map((s, i) => (
              <div key={`${s.title}-${i}`} className="border border-t-3 border-navy/[.12] dark:border-dark-line border-t-gold bg-white dark:bg-dark-surface-2 p-6.5">
                <h3 className="m-0 mb-2 font-serif text-lg font-medium">{s.title}</h3>
                <p className="m-0 text-[13.5px] leading-[1.65] text-slate dark:text-dark-ink-dim">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="about-strategy" className="bg-navy dark:bg-dark-navy p-9 text-bg sm:p-16">
          <h2 className="m-0 mb-7.5 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.6vw, 36px)" }}>{t("International Strategy")}</h2>
          <div className="grid gap-8.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
            {pillars.map((p, i) => (
              <div key={`${p.title}-${i}`}>
                <div className="font-mono mb-3 text-[11px] tracking-[.18em] text-gold uppercase">{p.n}</div>
                <h3 className="m-0 mb-2.5 font-serif text-[19px] font-medium">{p.title}</h3>
                <p className="m-0 text-sm leading-[1.7] text-[rgba(250,248,244,.75)]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
