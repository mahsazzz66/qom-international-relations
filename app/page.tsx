"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import HeroSlideshow from "@/components/HeroSlideshow";
import { HomeNews, HomeStatements } from "@/components/home/HomeNews";
import HomePcwgMap from "@/components/home/HomePcwgMap";
import HomeInvestmentTeaser from "@/components/home/HomeInvestmentTeaser";
import HomeMedia from "@/components/home/HomeMedia";
import { useLocale } from "@/lib/i18n";
import { usePageContent } from "@/lib/pageContent/read";
import { getPageSchema } from "@/lib/pageContent/pageSchemas";
import type { HeroSlideOverride } from "@/components/HeroSlideshow";

const HOME_SCHEMA = getPageSchema("home")!;

const RIBBON = [
  {
    href: "/pcwg", title: "Pilgrimage Cities Working Group", sub: "President: Qom Municipality",
    icon: <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 8.7l5.4-.8z" />, color: "#C8A75D",
  },
  {
    href: "/pcwg", title: "Permanent Secretariat", sub: "Based in Qom, Iran",
    icon: <><path d="M4 20h16" /><path d="M6 20V9l6-4 6 4v11" /><path d="M10 20v-6h4v6" /></>, color: "#C8A75D",
  },
  {
    href: "/memberships", title: "Global Partnerships", sub: "International memberships and city networks",
    icon: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17" /></>, color: "#00A8A8",
  },
  {
    href: "/investment", title: "Investment & Cooperation", sub: "Gateway for international collaboration",
    icon: <><path d="M4 20V10M9.3 20V6M14.7 20v-8M20 20V8" /><path d="M3 20h18" /></>, color: "#00A8A8",
  },
];

const COOPERATION_AREAS = [
  { title: "Urban Diplomacy", desc: "Representing Qom in municipal dialogue with cities, institutions and international bodies." },
  { title: "Pilgrimage City Cooperation", desc: "Leading the Pilgrimage Cities Working Group and its permanent secretariat in Qom." },
  { title: "Delegation Reception & Protocol", desc: "Programme design, protocol and hosting for incoming international guests." },
  { title: "International Memberships", desc: "Participation in international organisations and municipal networks." },
  { title: "Cultural Exchange", desc: "Cultural weeks, festivals and intercultural programmes with partners abroad." },
  { title: "International Communications", desc: "Publications, reports and communication with international media and audiences." },
  { title: "Investment Facilitation", desc: "A municipal point of contact for international investors and project partners." },
  { title: "Knowledge Exchange", desc: "Sharing municipal experience in managing a city that receives pilgrims year-round." },
];

export default function HomePage() {
  const { t } = useLocale();
  const pageData = usePageContent("home", HOME_SCHEMA);
  const slideOverrides = pageData?.slides as HeroSlideOverride[] | undefined;

  return (
    <div>
      <div id="top">
        <HeroSlideshow overrides={slideOverrides} />
      </div>

      {/* Ribbon */}
      <section className="border-b border-navy/10 dark:border-dark-line bg-bg dark:bg-dark-surface">
        <div className="mx-auto max-w-[1280px] px-6">
          <div data-ribbon className="grid gap-px bg-navy/10 dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {RIBBON.map((r) => (
              <Link key={r.title} href={r.href} className="flex min-w-0 items-center gap-[13px] bg-bg dark:bg-dark-surface px-5 py-3.5 transition-colors hover:bg-gold/[.09]">
                <span aria-hidden className="block h-[22px] shrink-0" style={{ color: r.color }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">{r.icon}</svg>
                </span>
                <span className="grid min-w-0 gap-0.5">
                  <span className="text-[13.5px] leading-[1.3] font-semibold text-navy dark:text-dark-ink">{t(r.title)}</span>
                  <span className="font-mono text-[11px] leading-[1.45] tracking-[.04em] text-gray dark:text-dark-ink-dimmer">{t(r.sub)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="mx-auto max-w-[1280px] px-6 pt-24 pb-11">
        <Reveal className="mb-[38px] flex flex-wrap items-end justify-between gap-7">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="h-px w-7 bg-gold" />
              <span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Newsroom")}</span>
              <span className="font-mono border border-gold/60 px-[7px] py-[3px] text-[9.5px] tracking-[.14em] text-gold uppercase">{t("Placeholder content")}</span>
            </div>
            <h2 className="m-0 font-serif font-medium" style={{ fontSize: "clamp(30px, 3.2vw, 44px)", lineHeight: 1.15, letterSpacing: "-.015em" }}>
              {t("Latest International News")}
            </h2>
          </div>
          <Link href="/news" className="border border-navy/20 dark:border-dark-line px-5 py-3.5 text-[13.5px] font-semibold transition-colors hover:border-gold hover:bg-gold/10">
            {t("View All News")}
          </Link>
        </Reveal>
        <Reveal>
          <HomeNews />
        </Reveal>
      </section>

      {/* Statements */}
      <section id="statements" className="mx-auto max-w-[1280px] px-6 pb-[92px]">
        <Reveal className="border border-navy/[.14] dark:border-dark-line bg-white dark:bg-dark-surface-2">
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-navy/[.14] dark:border-dark-line bg-bg dark:bg-dark-surface px-[26px] py-[22px]">
            <div className="flex items-center gap-3.5">
              <span className="h-[26px] w-[3px] bg-gold" />
              <div>
                <div className="font-mono mb-1 text-[9.5px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Official notices")}</div>
                <h2 className="m-0 font-serif text-xl font-medium">{t("Messages & Statements")}</h2>
              </div>
            </div>
            <Link href="/news#statements-block" className="font-mono border-b border-gold/60 pb-[3px] text-[10.5px] font-medium tracking-[.14em] uppercase hover:text-gold">
              {t("View All Messages & Statements")}
            </Link>
          </div>
          <HomeStatements />
        </Reveal>
      </section>

      {/* About */}
      <section id="about" className="border-t border-navy/[.08] dark:border-dark-line bg-white dark:bg-dark-surface-2">
        <div className="mx-auto max-w-[1280px] px-6 py-[100px]">
          <Reveal className="mb-[54px] grid items-end gap-14" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-7 bg-gold" />
                <span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("About us")}</span>
              </div>
              <h2 className="m-0 max-w-[620px] font-serif font-medium text-pretty" style={{ fontSize: "clamp(30px, 3.4vw, 46px)", lineHeight: 1.12, letterSpacing: "-.015em" }}>
                {t("The municipality's official channel to the international community")}
              </h2>
            </div>
            <div>
              <p className="m-0 mb-6.5 max-w-[520px] text-[17px] leading-[1.75] text-slate dark:text-dark-ink-dim text-pretty">
                {t("The department establishes and maintains relations with partner municipalities, international organisations and networks, receives foreign delegations, and connects Qom's six specialised deputy departments with their counterparts abroad.")}
              </p>
              <Link href="/about" className="border-b border-gold pb-1.5 text-[13.5px] font-semibold">{t("Read the full profile →")}</Link>
            </div>
          </Reveal>

          <Reveal className="mb-16 grid border-t border-navy/[.14] dark:border-dark-line" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {[
              { n: "01", title: "Mission", body: "To open and sustain municipal channels with cities and institutions abroad, and to make Qom's experience as a pilgrimage city available to international partners." },
              { n: "02", title: "Vision", body: "An internationally connected Qom, recognised as a reference city for cooperation among the world's pilgrimage destinations." },
            ].map((b, i) => (
              <div key={b.n} className={`py-10 ${i === 0 ? "pr-11 border-r border-navy/10 dark:border-dark-line" : "px-11 border-r border-navy/10 dark:border-dark-line"}`}>
                <div className="mb-[18px] flex items-baseline gap-3.5">
                  <span className="font-mono text-xs text-gold">{b.n}</span>
                  <h3 className="m-0 font-serif text-2xl font-medium">{t(b.title)}</h3>
                </div>
                <p className="m-0 text-[15.5px] leading-[1.75] text-slate dark:text-dark-ink-dim">{t(b.body)}</p>
              </div>
            ))}
            <div className="py-10 pl-11">
              <div className="mb-[18px] flex items-baseline gap-3.5">
                <span className="font-mono text-xs text-gold">03</span>
                <h3 className="m-0 font-serif text-2xl font-medium">{t("Objectives")}</h3>
              </div>
              <div className="grid gap-3 text-[15px] leading-[1.6] text-slate dark:text-dark-ink-dim">
                {["Durable municipal partnerships", "Leadership of the Working Group", "Cooperation routed to the right department", "Facilitation of investment and exchange"].map((o) => (
                  <div key={o} className="flex gap-3"><span className="shrink-0 text-gold">—</span>{t(o)}</div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <div className="grid min-h-[380px] place-items-center bg-navy dark:bg-dark-navy p-6 text-center" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
              <span className="font-mono text-[10.5px] tracking-[.16em] text-[rgba(250,248,244,.42)] uppercase">
                {t("image placeholder — qom municipality")}<br />{t("headquarters")}
              </span>
            </div>
            <div className="flex flex-col justify-center bg-gold p-10 text-navy sm:p-14">
              <div className="font-mono mb-[22px] text-[11px] tracking-[.2em] uppercase">{t("International Strategy")}</div>
              <p className="m-0 mb-7 font-serif text-pretty" style={{ fontSize: "clamp(21px, 2.1vw, 28px)", lineHeight: 1.5 }}>
                {t("Four pillars carry the department's work abroad: diplomacy, knowledge, culture and investment.")}
              </p>
              <Link href="/about" className="self-start border-b border-navy pb-[5px] text-[13.5px] font-semibold text-navy dark:text-dark-ink">{t("See the strategy →")}</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cooperation */}
      <section id="cooperation" className="border-t border-b border-navy/[.08] dark:border-dark-line bg-white dark:bg-dark-surface-2">
        <span id="activities" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-6 py-[100px]">
          <Reveal className="mb-[58px] grid items-start gap-14" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <div>
              <div className="mb-4.5 flex items-center gap-3">
                <span className="h-px w-7 bg-gold" />
                <span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("International activities")}</span>
              </div>
              <h2 className="m-0 font-serif font-medium text-pretty" style={{ fontSize: "clamp(30px, 3.2vw, 44px)", lineHeight: 1.15, letterSpacing: "-.015em" }}>
                {t("Key areas of international work")}
              </h2>
            </div>
            <div>
              <p className="m-0 mb-4.5 text-[16.5px] leading-[1.75] text-slate dark:text-dark-ink-dim text-pretty">
                {t("The International Relations & Communications Department is the municipality's channel to the world: it opens and maintains municipal relationships, receives international guests, and connects Qom's specialised deputy departments with partner cities and organisations abroad.")}
              </p>
              <p className="m-0 text-[16.5px] leading-[1.75] text-slate dark:text-dark-ink-dim text-pretty">{t("It also holds the presidency and the permanent secretariat of the Pilgrimage Cities Working Group.")}</p>
            </div>
          </Reveal>

          <div className="grid gap-px bg-navy/[.12] dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {COOPERATION_AREAS.map((c, i) => (
              <div key={c.title} data-card className="bg-white dark:bg-dark-surface-2 px-[30px] py-[34px] transition-colors hover:bg-navy">
                <div data-cardnum className="font-mono mb-6.5 text-xs tracking-[.12em] text-gold">{String(i + 1).padStart(2, "0")}</div>
                <h3 data-cardtitle className="m-0 mb-3 font-serif text-xl font-medium transition-colors">{t(c.title)}</h3>
                <p data-cardbody className="m-0 text-[14.5px] leading-[1.65] text-slate dark:text-dark-ink-dim transition-colors">{t(c.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PCWG */}
      <section id="pcwg" className="bg-navy dark:bg-dark-navy text-bg">
        <div className="mx-auto max-w-[1280px] px-6 py-[100px]">
          <Reveal className="mb-[46px]">
            <div className="mb-[22px] flex items-center gap-3">
              <span className="h-px w-7 bg-gold" />
              <span className="font-mono text-[11px] tracking-[.2em] text-gold uppercase">{t("Pilgrimage Cities Working Group")}</span>
            </div>
            <h2 className="m-0 mb-[34px] max-w-[900px] font-serif font-medium text-pretty" style={{ fontSize: "clamp(32px, 3.8vw, 52px)", lineHeight: 1.1, letterSpacing: "-.015em" }}>
              {t("Qom Municipality is the President of the Pilgrimage Cities Working Group")}
            </h2>
            <div className="grid gap-px bg-bg/[.16]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              <div className="bg-gold p-7.5 text-navy">
                <div className="font-mono mb-3 text-[11px] tracking-[.18em] uppercase">{t("President")}</div>
                <div className="font-serif text-[26px] leading-tight">{t("Qom Municipality")}</div>
              </div>
              <div className="bg-bg/[.06] p-7.5">
                <div className="font-mono mb-3 text-[11px] tracking-[.18em] text-gold uppercase">{t("Permanent Secretariat")}</div>
                <div className="font-serif text-[26px] leading-tight text-bg">{t("Qom, Iran")}</div>
              </div>
              <div className="bg-bg/[.03] p-7.5">
                <div className="font-mono mb-3 text-[11px] tracking-[.18em] text-gold uppercase">{t("Mandate")}</div>
                <p className="m-0 text-[14.5px] leading-[1.7] text-[rgba(250,248,244,.78)]">
                  {t("A standing platform for cities whose urban life is shaped by pilgrimage — coordinating dialogue, shared practice and joint programmes among member municipalities.")}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="grid gap-px bg-bg/[.16]" style={{ gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 1fr)" }}>
            <div className="bg-navy dark:bg-dark-navy p-6.5">
              <div className="mb-4.5 flex flex-wrap items-center justify-between gap-4">
                <div className="font-mono text-[11px] tracking-[.18em] text-gold uppercase">{t("Member cities — regional view")}</div>
                <div className="flex items-center gap-5 text-xs">
                  <span className="flex items-center gap-2 text-[rgba(250,248,244,.82)]"><span className="h-2.5 w-2.5 rounded-full bg-gold" />{t("Current Member")}</span>
                  <span className="flex items-center gap-2 text-[rgba(250,248,244,.82)]"><span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-teal" />{t("Proposed / Upcoming")}</span>
                </div>
              </div>
              <HomePcwgMap />
            </div>
            <div className="max-h-[540px] overflow-y-auto bg-navy dark:bg-dark-navy p-6.5">
              <div className="mb-3.5 flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                <span className="font-mono text-[11px] tracking-[.16em] text-gold uppercase">{t("Current members")}</span>
              </div>
              <div className="mb-[30px] grid gap-3.5">
                {[
                  ["Iran", "Qom · Mashhad · Shiraz (Shah Cheragh) · Ray (Hazrat Abdol-Azim) · Kashan (Mashhad-e Ardehal) · Astaneh-ye Ashrafiyeh · Shush"],
                  ["Iraq", "Karbala · Najaf"],
                  ["Saudi Arabia", "Mecca · Medina"],
                  ["Syria · Georgia · Armenia", "Damascus · Tbilisi · Yerevan"],
                  ["Palestine · Turkey", "Hebron · Antakya"],
                ].map(([label, cities]) => (
                  <div key={label}>
                    <div className="mb-1.5 text-[11px] tracking-[.14em] text-[rgba(250,248,244,.45)] uppercase">{t(label)}</div>
                    <div className="text-[13.5px] leading-[1.75] text-[rgba(250,248,244,.85)]">{t(cities)}</div>
                  </div>
                ))}
              </div>
              <div className="mb-3.5 flex items-center gap-2.5 border-t border-bg/[.16] pt-5.5">
                <span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-teal" />
                <span className="font-mono text-[11px] tracking-[.16em] text-teal dark:text-dark-teal uppercase">{t("Proposed / upcoming")}</span>
              </div>
              <div className="grid gap-3.5">
                {[
                  ["Iran · Iraq", "Semnan (Bastam) · Khoy (Shams Tabrizi) · Kadhimiya · Samarra"],
                  ["Uzbekistan · Kazakhstan", "Samarkand · Bukhara · Turkistan"],
                  ["India · Nepal", "Varanasi · Ajmer · Bodh Gaya · Lumbini"],
                  ["Pakistan · Turkey", "Lahore · Multan · Konya · Şanlıurfa"],
                ].map(([label, cities]) => (
                  <div key={label}>
                    <div className="mb-1.5 text-[11px] tracking-[.14em] text-[rgba(250,248,244,.45)] uppercase">{t(label)}</div>
                    <div className="text-[13.5px] leading-[1.75] text-[rgba(250,248,244,.72)]">{t(cities)}</div>
                  </div>
                ))}
                <p className="m-0 mt-2 text-xs leading-[1.65] text-[rgba(250,248,244,.50)]">
                  {t("Proposed and upcoming cities are candidates under discussion and are not yet official members of the Working Group.")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Investment */}
      <section id="investment" className="mx-auto max-w-[1280px] px-6 py-[100px]">
        <Reveal className="mb-11 flex flex-wrap items-end justify-between gap-7.5">
          <div className="max-w-[700px]">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="h-px w-7 bg-gold" />
              <span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Investment")}</span>
              <span className="font-mono border border-gold/60 px-[7px] py-[3px] text-[9.5px] tracking-[.14em] text-gold uppercase">{t("Placeholder content")}</span>
            </div>
            <h2 className="m-0 mb-4 font-serif font-medium" style={{ fontSize: "clamp(30px, 3.2vw, 44px)", lineHeight: 1.15, letterSpacing: "-.015em" }}>
              {t("Investment Opportunities")}
            </h2>
            <p className="m-0 text-base leading-[1.7] text-slate dark:text-dark-ink-dim">
              {t("Categories of municipal projects open to international participation. Individual projects are published once approved by the municipality.")}
            </p>
          </div>
          <Link href="/investment" className="shrink-0 border border-navy/20 dark:border-dark-line px-6.5 py-4 text-[13px] font-semibold whitespace-nowrap text-navy dark:text-dark-ink transition-colors hover:border-gold hover:bg-gold hover:text-navy">
            {t("View All Opportunities →")}
          </Link>
        </Reveal>
        <HomeInvestmentTeaser />
      </section>

      {/* Media */}
      <section id="media" className="mx-auto max-w-[1280px] px-6 py-[100px]">
        <HomeMedia />
      </section>
    </div>
  );
}
