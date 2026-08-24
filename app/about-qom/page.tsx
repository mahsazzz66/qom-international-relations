"use client";

import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useLocale } from "@/lib/i18n";

const GLANCE = [
  { label: "Population", value: "[official figure]", body: "City and metropolitan population, per the municipal statistical record.",
    icon: <><circle cx="9" cy="8" r="3.3" /><path d="M3 20c0-3.3 2.7-5.4 6-5.4s6 2.1 6 5.4" /><path d="M16.5 6.6a3 3 0 0 1 0 5.8M18 20c0-2.4-.9-4.1-2.4-5.1" /></> },
  { label: "Area", value: "[official figure]", body: "Municipal area in square kilometres.",
    icon: <><path d="M4 4h16v16H4z" /><path d="M4 9h16M9 4v16" opacity=".5" /></> },
  { label: "Province Capital", value: "Qom Province", body: "Qom is the capital of Qom Province, Islamic Republic of Iran.",
    icon: <path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.2l5.9-.8z" /> },
  { label: "Pilgrims per Year", value: "[official figure]", body: "Domestic and international pilgrims received annually.",
    icon: <><path d="M5 21V11a7 7 0 0 1 14 0v10" /><path d="M3 21h18M12 21v-5a2.5 2.5 0 0 1 5 0v5" opacity=".55" /><path d="M12 4V2" /></> },
  { label: "Major Languages", value: "Persian (Farsi)", body: "Arabic and English are widely used in pilgrimage and academic settings.",
    icon: <><path d="M3 5h18v11H12l-5 4v-4H3z" /><path d="M7 9h10M7 12.5h6" opacity=".6" /></> },
  { label: "Climate", value: "Arid, semi-desert", body: "Hot dry summers and cool winters; [official climate data].",
    icon: <><circle cx="12" cy="12" r="4.2" /><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" /></> },
  { label: "Distance from Tehran", value: "[official figure]", body: "Connected to the capital by motorway and rail.",
    icon: <><circle cx="6" cy="6" r="2.6" /><circle cx="18" cy="18" r="2.6" /><path d="M8.6 6H14a3.4 3.4 0 0 1 0 6.8h-4a3.4 3.4 0 0 0 0 6.8h5.4" /></> },
];

const ATTRACTIONS = [
  { cat: "Historic commerce", title: "The Old Bazaar", body: "A covered bazaar of caravanserais and craft workshops in the historic core of the city.", img: "Old Bazaar of Qom" },
  { cat: "Architecture", title: "Historical Houses", body: "Qajar and earlier courtyard residences with tilework, wind catchers and private gardens.", img: "Historical courtyard house" },
  { cat: "Collections", title: "Museums of Qom", body: "Collections of manuscripts, calligraphy, ceramics and the material history of the city.", img: "Museum interior" },
  { cat: "Natural attraction", title: "Namak Salt Lake", body: "The great salt lake north-east of the city — a landscape of white crust and shifting light.", img: "Salt lake landscape near Qom" },
  { cat: "Silk-road heritage", title: "Desert Caravanserais", body: "Way stations on the historic routes crossing the plateau, within reach of the city.", img: "Historic caravanserai on the desert route" },
  { cat: "Landscape", title: "Villages & Highlands", body: "Traditional settlements and highland scenery in the districts around Qom.", img: "Mountain village near Qom" },
];

const VISIT_CARDS = [
  { eyebrow: "Why visit", title: "A city built around welcome", body: "Qom's hospitality infrastructure exists for pilgrims: accommodation, transport and services are organised around receiving guests from abroad." },
  { eyebrow: "Cultural importance", title: "Craft, manuscript and music", body: "Workshops, libraries and museums are open to visiting delegations by arrangement with the municipality." },
  { eyebrow: "Religious importance", title: "Two centres of pilgrimage", body: "The holy shrine and Jamkaran together make Qom one of the most visited devotional destinations in the Shia world." },
];

const VISIT_INFO = [
  ["Best time to visit", "[to be supplied]"],
  ["Getting here", "Motorway and rail from Tehran"],
  ["Visitor etiquette", "[dress and conduct guidance]"],
  ["Delegation visits", "Arranged by the International Office"],
];

function ImgPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  const { t } = useLocale();
  return (
    <div className={`grid place-items-center border border-gold/35 bg-navy dark:bg-dark-navy p-3.5 text-center ${className}`} style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
      <span className="font-mono text-[10px] tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase">{t(label)}</span>
    </div>
  );
}

export default function AboutQomPage() {
  const { t } = useLocale();
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
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 px-6 pt-20 pb-21" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          <div>
            <Breadcrumbs page="about-qom" />
            <div className="mb-5 flex flex-wrap items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gold uppercase">{t("The City")}</span></div>
            <h1 className="m-0 mb-4.5 font-serif font-medium text-bg" style={{ fontSize: "clamp(40px, 5.4vw, 72px)", lineHeight: 1.04, letterSpacing: "-.02em" }}>{t("About Qom")}</h1>
            <p className="m-0 mb-6 font-serif text-gold" style={{ fontSize: "clamp(19px, 2vw, 26px)", lineHeight: 1.4 }}>{t("The Spiritual and Cultural Heart of Iran")}</p>
            <p className="m-0 mb-8 max-w-[560px] text-[16.5px] leading-[1.8] text-[rgba(250,248,244,.76)]">
              {t("A city of pilgrimage, scholarship and craft. Qom receives visitors from across the Islamic world and beyond — to the shrine of Hazrat Fatima Masumeh (SA), to the seminaries that have shaped Shia learning for centuries, and to a living urban culture at the edge of the Iranian plateau.")}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#qom-glance" className="bg-gold px-6 py-3.5 text-[13.5px] font-semibold text-navy transition-colors hover:bg-bg">{t("Qom at a Glance")}</a>
              <Link href="/contact" className="border border-bg/[.32] px-6 py-3.5 text-[13.5px] font-medium text-bg transition-colors hover:border-gold hover:bg-gold/[.14]">{t("Plan a delegation visit")}</Link>
            </div>
          </div>
          <div className="grid gap-3.5" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
            <ImgPlaceholder label="Holy Shrine of Hazrat Fatima Masumeh (SA)" className="aspect-[16/10] [grid-column:1/-1]" />
            <ImgPlaceholder label="Jamkaran Mosque" className="aspect-[4/3]" />
            <ImgPlaceholder label="Qom city skyline" className="aspect-[4/3]" />
          </div>
        </div>
      </div>

      <div id="qom-glance" className="border-b border-navy/[.08] dark:border-dark-line bg-bg dark:bg-dark-surface">
        <div className="mx-auto max-w-[1280px] px-6 py-22.5">
          <div className="mb-4 flex flex-wrap items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Overview")}</span></div>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-7.5">
            <h2 className="m-0 font-serif font-medium" style={{ fontSize: "clamp(30px, 3.2vw, 44px)", lineHeight: 1.15, letterSpacing: "-.015em" }}>{t("Qom at a Glance")}</h2>
            <span className="font-mono border border-gold/60 px-2 py-1 text-[9.5px] tracking-[.14em] text-gold uppercase">{t("Awaiting official data")}</span>
          </div>
          <p className="m-0 mb-10 max-w-[680px] text-[15px] leading-[1.75] text-slate dark:text-dark-ink-dim">{t("A quick reference for visitors, pilgrims, delegations and investors. Figures marked in brackets are replaced with official municipal data before publication.")}</p>
          <div className="grid gap-5.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(238px, 1fr))" }}>
            {GLANCE.map((g) => (
              <article key={g.label} className="grid content-start gap-3.5 border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 px-6.5 py-7.5 transition-transform hover:-translate-y-1.5">
                <div className="grid h-11.5 w-11.5 place-items-center border border-gold/60 bg-gold/10">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8A75D" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">{g.icon}</svg>
                </div>
                <div className="font-mono text-[10.5px] tracking-[.16em] text-gray dark:text-dark-ink-dimmer uppercase">{t(g.label)}</div>
                <div className="font-serif text-[22px] leading-[1.3] text-navy dark:text-dark-ink">{t(g.value)}</div>
                <div className="text-[12.5px] leading-[1.6] text-gray dark:text-dark-ink-dimmer">{t(g.body)}</div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-navy/[.08] dark:border-dark-line bg-white dark:bg-dark-surface-2">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="grid items-center gap-15" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <ImgPlaceholder label="Holy Shrine of Hazrat Fatima Masumeh (SA) — interior courtyard" className="aspect-[4/5]" />
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Pilgrimage")}</span></div>
              <h2 className="m-0 mb-5 font-serif font-medium" style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.15 }}>{t("Holy Shrine of Hazrat Fatima Masumeh (SA)")}</h2>
              <p className="m-0 mb-5 text-base leading-[1.8] text-slate dark:text-dark-ink-dim">{t("The shrine of Hazrat Fatima Masumeh (SA), sister of Imam Reza (AS), stands at the centre of Qom and at the centre of its identity. Its golden dome, courtyards and porticoes have been extended by successive generations, and the sanctuary remains the reason most visitors come to the city.")}</p>
              <p className="m-0 mb-7 text-base leading-[1.8] text-slate dark:text-dark-ink-dim">{t("For the municipality, the shrine defines the priorities of urban service: reception of pilgrims, accessibility, hospitality infrastructure and the care of the historic quarter that surrounds it.")}</p>
              <div className="grid gap-px bg-navy/[.12] dark:bg-dark-fill">
                {[
                  ["Religious significance", "One of the most venerated sanctuaries in the Shia world."],
                  ["Pilgrimage", "Received by pilgrims from Iran and across the Islamic world throughout the year."],
                  ["Visiting", "[Opening hours, dress guidance and visitor services — to be supplied.]"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-white dark:bg-dark-surface-2 px-5.5 py-5">
                    <div className="font-mono mb-1.5 text-[10px] tracking-[.16em] text-gold uppercase">{t(k)}</div>
                    <div className="text-[14.5px] leading-[1.7] text-slate dark:text-dark-ink-dim">{t(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-navy/[.08] dark:border-dark-line bg-bg dark:bg-dark-surface">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="grid items-center gap-15" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Spiritual landmark")}</span></div>
              <h2 className="m-0 mb-5 font-serif font-medium" style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.15 }}>{t("Jamkaran Mosque")}</h2>
              <p className="m-0 mb-5 text-base leading-[1.8] text-slate dark:text-dark-ink-dim">{t("A short distance from the city centre, Jamkaran is among the most visited devotional sites in Iran. Its courtyards fill on Tuesday evenings and on the nights of religious occasions, when pilgrims gather in numbers that shape the rhythm of the whole city.")}</p>
              <p className="m-0 mb-7 text-base leading-[1.8] text-slate dark:text-dark-ink-dim">{t("The mosque is closely associated with devotion to Imam Mahdi (AJ), and its expansion over recent decades has made it a second pole of pilgrimage alongside the holy shrine.")}</p>
              <div className="flex flex-wrap gap-3">
                <span className="font-mono bg-gold/[.28] px-3 py-2 text-[10.5px] tracking-[.14em] text-navy dark:text-dark-ink uppercase">{t("Devotional site")}</span>
                <span className="font-mono border border-teal/45 px-3 py-2 text-[10.5px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{t("Open to visitors")}</span>
              </div>
            </div>
            <div className="grid gap-3.5">
              <ImgPlaceholder label="Jamkaran Mosque — main courtyard" className="aspect-[16/10]" />
              <div className="grid gap-3.5" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
                <ImgPlaceholder label="Jamkaran at night" className="aspect-square" />
                <ImgPlaceholder label="Pilgrims at Jamkaran" className="aspect-square" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-navy dark:bg-dark-navy text-bg">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="mb-12 max-w-[720px]">
            <div className="mb-4 flex flex-wrap items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gold uppercase">{t("Scholarship")}</span></div>
            <h2 className="m-0 mb-5 font-serif font-medium text-bg" style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.15 }}>{t("Religious Authorities & the Hawza")}</h2>
            <p className="m-0 text-base leading-[1.8] text-[rgba(250,248,244,.74)]">{t("Qom is the principal centre of Shia religious learning. Its seminaries draw students from dozens of countries, and the scholarly institutions of the city give it an intellectual reach far beyond its size.")}</p>
          </div>
          <div className="grid gap-px bg-bg/[.16]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {[
              ["Religious seminaries", "The Hawza Ilmiyya of Qom comprises schools, research institutes and libraries teaching jurisprudence, philosophy, exegesis and Islamic sciences."],
              ["Maraji & religious authorities", "Leading religious authorities reside and teach in the city. Their offices receive visitors and correspondence from communities worldwide."],
              ["International students", "Students from across Asia, Africa and Europe study in Qom, making the city one of Iran's most internationally connected academic communities."],
            ].map(([title, body], i) => (
              <div key={title} className="bg-navy dark:bg-dark-navy px-8 py-9">
                <div className="font-mono mb-4 text-[10px] tracking-[.18em] text-gold uppercase">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="m-0 mb-3.5 font-serif text-[22px] font-medium text-bg">{t(title)}</h3>
                <p className="m-0 text-[14.5px] leading-[1.75] text-[rgba(250,248,244,.70)]">{t(body)}</p>
              </div>
            ))}
          </div>
          <p className="m-0 mt-6.5 max-w-[720px] text-[13px] leading-[1.7] text-[rgba(250,248,244,.5)]">{t("Institutional names, enrolment figures and programme details are published only as confirmed by the relevant seminaries and the municipality.")}</p>
        </div>
      </div>

      <div className="border-b border-navy/[.08] dark:border-dark-line bg-white dark:bg-dark-surface-2">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="mb-4 flex flex-wrap items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Heritage & leisure")}</span></div>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-7.5">
            <h2 className="m-0 max-w-[620px] font-serif font-medium" style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.15 }}>{t("Historical & Tourist Attractions")}</h2>
            <p className="m-0 max-w-[420px] text-[15px] leading-[1.75] text-slate dark:text-dark-ink-dim">{t("Beyond the sanctuaries, Qom holds a historic bazaar, courtyard houses, museums and a desert landscape of salt lakes and mountain villages.")}</p>
          </div>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {ATTRACTIONS.map((a) => (
              <article key={a.title} className="border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 transition-transform hover:-translate-y-1.5">
                <ImgPlaceholder label={a.img} className="aspect-[4/3]" />
                <div className="p-6">
                  <div className="font-mono mb-2.5 text-[10px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{t(a.cat)}</div>
                  <h3 className="m-0 mb-2.5 font-serif text-xl font-medium">{t(a.title)}</h3>
                  <p className="m-0 text-sm leading-[1.65] text-slate dark:text-dark-ink-dim">{t(a.body)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-navy/[.08] dark:border-dark-line bg-bg dark:bg-dark-surface">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="grid items-start gap-14" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Making")}</span></div>
              <h2 className="m-0 mb-5 font-serif font-medium" style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.15 }}>{t("Handicrafts & Local Culture")}</h2>
              <p className="m-0 mb-5 text-base leading-[1.8] text-slate dark:text-dark-ink-dim">{t("Qom is known above all for its silk carpets — among the finest woven anywhere — and for a wider culture of making: ceramics, glasswork, calligraphy, illumination and the confectionery the city is famous for across Iran.")}</p>
              <p className="m-0 mb-7 text-base leading-[1.8] text-slate dark:text-dark-ink-dim">{t("These crafts are part of the municipality's cultural diplomacy: they travel to partner cities in exhibitions, and they welcome visiting delegations into the workshops where they are made.")}</p>
              <div className="grid gap-3">
                {["Silk carpet weaving", "Calligraphy & manuscript illumination", "Ceramics, glass & metalwork", "Sohan & the confectionery tradition"].map((c, i) => (
                  <div key={c} className="flex items-baseline gap-3.5"><span className="font-mono text-[11px] text-gold">{String(i + 1).padStart(2, "0")}</span><span className="text-[15px] text-navy dark:text-dark-ink">{t(c)}</span></div>
                ))}
              </div>
            </div>
            <div className="grid gap-3.5" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
              <ImgPlaceholder label="Silk carpet weaving workshop" className="aspect-video [grid-column:1/-1]" />
              <ImgPlaceholder label="Calligraphy & illumination" className="aspect-[3/4]" />
              <div className="grid gap-3.5">
                <ImgPlaceholder label="Ceramics" className="aspect-square" />
                <ImgPlaceholder label="Sohan confectionery" className="aspect-square" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-navy dark:bg-dark-navy text-bg">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="grid items-center gap-15" style={{ gridTemplateColumns: "minmax(240px, 320px) minmax(0, 1fr)" }}>
            <div className="border border-gold/45 bg-bg/[.04] p-4.5">
              <ImgPlaceholder label="Book cover — Qom, Negine Iran Zamin" className="aspect-[3/4]" />
            </div>
            <div>
              <div className="mb-4.5 flex flex-wrap items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gold uppercase">{t("Publication")}</span></div>
              <h2 className="m-0 mb-2.5 font-serif font-medium text-bg" style={{ fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.14 }}>{t("Qom, Negine Iran Zamin")}</h2>
              <p dir="rtl" className="font-vazir m-0 mb-6 text-2xl text-gold">قم، نگین ایران زمین</p>
              <p className="m-0 mb-5 max-w-[620px] text-base leading-[1.8] text-[rgba(250,248,244,.76)]">{t("An illustrated introduction to Qom — its sanctuaries, history, scholarship, craft and urban life — published as the city's presentation volume for visitors, guests and partner municipalities.")}</p>
              <p className="m-0 mb-7.5 max-w-[620px] text-[14.5px] leading-[1.75] text-[rgba(250,248,244,.55)]">{t("[Publisher, edition, year, languages and page count — to be supplied by Qom Municipality.]")}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/media" className="bg-gold px-6 py-3.5 text-[13.5px] font-semibold text-navy transition-colors hover:bg-bg">{t("Download the book")}</Link>
                <Link href="/media" className="border border-bg/[.32] px-6 py-3.5 text-[13.5px] font-medium text-bg transition-colors hover:border-gold hover:bg-gold/[.14]">{t("Learn more")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-surface-2">
        <div className="mx-auto max-w-[1280px] px-6 pt-24 pb-26">
          <div className="mb-4 flex flex-wrap items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("For visitors")}</span></div>
          <div className="mb-10.5 flex flex-wrap items-end justify-between gap-7.5">
            <h2 className="m-0 font-serif font-medium" style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.15 }}>{t("Visiting Qom")}</h2>
            <Link href="/contact" className="border border-navy/20 dark:border-dark-line px-5 py-3.5 text-[13.5px] font-semibold transition-colors hover:border-gold hover:bg-gold/10">{t("Contact the International Office")}</Link>
          </div>
          <div className="mb-8.5 grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
            {VISIT_CARDS.map((c) => (
              <article key={c.title} className="border border-navy/[.12] dark:border-dark-line bg-bg dark:bg-dark-surface px-7.5 py-8.5 transition-transform hover:-translate-y-1.5">
                <div className="font-mono mb-4 text-[10px] tracking-[.18em] text-gold uppercase">{t(c.eyebrow)}</div>
                <h3 className="m-0 mb-3.5 font-serif text-[22px] font-medium">{t(c.title)}</h3>
                <p className="m-0 text-[14.5px] leading-[1.75] text-slate dark:text-dark-ink-dim">{t(c.body)}</p>
              </article>
            ))}
          </div>
          <div className="grid gap-px bg-navy/[.12] dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {VISIT_INFO.map(([k, v]) => (
              <div key={k} className="bg-white dark:bg-dark-surface-2 p-6.5">
                <div className="font-mono mb-2 text-[10px] tracking-[.16em] text-gray dark:text-dark-ink-dimmer uppercase">{t(k)}</div>
                <div className="text-[15px] text-navy dark:text-dark-ink">{t(v)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
