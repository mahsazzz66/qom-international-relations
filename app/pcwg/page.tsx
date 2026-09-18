"use client";

import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import VideoCard from "@/components/VideoCard";
import PcwgNetwork from "@/components/pcwg/PcwgNetwork";
import PcwgConstellation from "@/components/pcwg/PcwgConstellation";
import { useLocale } from "@/lib/i18n";
import { pickText, usePageContent } from "@/lib/pageContent/read";
import { getPageSchema } from "@/lib/pageContent/pageSchemas";
import type { BilingualText } from "@/lib/pageContent/schema";

const PCWG_SCHEMA = getPageSchema("pcwg")!;

type Locale = "en" | "ar";
type Tfn = (s: string) => string;

type CityOverride = { country?: BilingualText; city?: BilingualText; body?: BilingualText };
type TitleBodyOverride = { title?: BilingualText; body?: BilingualText };

function mergeCities(overrides: CityOverride[] | undefined, fallback: string[][], locale: Locale, t: Tfn) {
  if (!overrides || overrides.length === 0) {
    return fallback.map(([country, name, body]) => [t(country), t(name), t(body)] as [string, string, string]);
  }
  return overrides.map((o, i) => [
    pickText(o.country, locale, fallback[i] ? t(fallback[i][0]) : ""),
    pickText(o.city, locale, fallback[i] ? t(fallback[i][1]) : ""),
    pickText(o.body, locale, fallback[i] ? t(fallback[i][2]) : ""),
  ] as [string, string, string]);
}

function mergeTitleBody(overrides: TitleBodyOverride[] | undefined, fallback: string[][], locale: Locale, t: Tfn) {
  if (!overrides || overrides.length === 0) {
    return fallback.map(([title, body]) => [t(title), t(body)] as [string, string]);
  }
  return overrides.map((o, i) => [
    pickText(o.title, locale, fallback[i] ? t(fallback[i][0]) : ""),
    pickText(o.body, locale, fallback[i] ? t(fallback[i][1]) : ""),
  ] as [string, string]);
}

const CURRENT_MEMBERS = [
  ["Iran", "Mashhad", "Shrine city of Imam Reza and the largest pilgrimage destination in Iran."],
  ["Iran", "Shiraz", "Shrine city of Shah Cheragh and a centre of Persian cultural heritage."],
  ["Iraq", "Karbala", "Host city of the Arbaeen pilgrimage, among the largest annual gatherings in the world."],
  ["Iraq", "Najaf", "Shrine city of Imam Ali and a historic seat of religious scholarship."],
  ["Saudi Arabia", "Mecca", "Destination of the Hajj, performed annually by Muslims from every continent."],
  ["Saudi Arabia", "Medina", "City of the Prophet Mosque and a principal station for pilgrims."],
  ["Syria", "Damascus", "Home to the shrine of Sayyidah Ruqayyah and centuries of pilgrimage heritage."],
  ["Palestine", "Hebron", "City of the Sanctuary of Abraham, venerated across the Abrahamic traditions."],
];

const PROPOSED = [
  ["Iraq", "Samarra", "Shrine city of the Askari sanctuary; candidacy under discussion."],
  ["Uzbekistan", "Samarkand", "Historic centre of Islamic scholarship and monumental heritage."],
  ["Uzbekistan", "Bukhara", "City of shrines, madrasas and long-standing pilgrimage routes."],
  ["Turkey", "Konya", "Resting place of Rumi and a destination of cultural pilgrimage."],
  ["Turkey", "Sanliurfa", "Ancient city associated with the prophet Abraham."],
  ["India", "Varanasi", "One of the oldest continuously inhabited pilgrimage cities in the world."],
  ["Pakistan", "Lahore", "City of Sufi shrines and major seasonal pilgrimage gatherings."],
  ["Kazakhstan", "Turkistan", "Site of the mausoleum of Khoja Ahmed Yasawi."],
];

const AREAS = [
  ["Urban Management", "Comparing municipal models for cities whose population multiplies during pilgrimage seasons."],
  ["Pilgrimage Services", "Reception, guidance, accommodation and welfare services for visiting pilgrims."],
  ["Cultural Exchange", "Cultural weeks, exhibitions and joint programmes between member cities."],
  ["Tourism Development", "Religious and cultural tourism planning, routes and visitor information."],
  ["Municipal Diplomacy", "City-to-city agreements, delegations and standing channels of dialogue."],
  ["Knowledge Sharing", "Studies, guidelines and technical documentation prepared with member cities."],
  ["Smart City Solutions", "Digital services for crowd management, wayfinding and visitor support."],
  ["Sustainable Urban Development", "Heritage protection, mobility and environmental management around holy sites."],
];

const ACTIVITY_TYPES = [
  ["Meetings", "Plenary and coordination meetings of the member cities, convened by the secretariat."],
  ["Conferences", "Thematic conferences on pilgrimage city management, hosted by members in turn."],
  ["Dialogues", "Mayor-level and technical dialogues on shared urban challenges."],
  ["Workshops", "Practical sessions for municipal staff on services, crowd management and heritage."],
  ["Joint Programmes", "Cultural weeks, exchange visits and joint publications between member cities."],
];

const SESSIONS = [
  ["[Plenary session title]", "Hosted in Qom"],
  ["[Technical committee session]", "Online from Qom"],
  ["[Members coordination meeting]", "Hybrid"],
];

const DOCS = [
  ["Founding document", "[Statute of the Working Group]", "/media"],
  ["Session record", "[Minutes of the latest plenary]", "/media"],
  ["Membership", "[Application guidance for cities]", "/contact"],
];

// `label` is the placeholder line printed inside the tile; the source writes
// each of the six as one literal string (src 1908/1915/1920/1927/1931/1936),
// not as a phrase composed from the caption.
const GALLERY = [
  { video: true, label: "video placeholder — plenary session", caption: "Plenary session of the Working Group" },
  { video: false, label: "photo placeholder — delegation visit", caption: "Visiting delegation of member cities" },
  { video: true, label: "video placeholder — cultural week", caption: "Cultural week of a member city in Qom" },
  { video: false, label: "photo placeholder — technical workshop", caption: "Technical workshop on pilgrimage services" },
  { video: false, label: "photo placeholder — document signing", caption: "Signing of a cooperation document" },
  { video: true, label: "video placeholder — seasonal activities", caption: "Pilgrimage city activities during the season" },
];

function CityCard({ country, name, body }: { country: string; name: string; body: string }) {
  const { t } = useLocale();
  return (
    <article className="flex flex-col border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2">
      <div className="relative grid aspect-[4/3] place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
        <span className="font-mono px-3 text-center text-[9.5px] tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase">{t("landmark image — " + name)}</span>
        <span className="font-mono absolute top-3 bg-gold px-2.5 py-[5px] text-[9px] tracking-[.14em] text-navy uppercase start-3">{t("Current member")}</span>
      </div>
      <div className="grid content-start gap-2 p-6">
        <div className="font-mono text-[10px] tracking-[.16em] text-gray dark:text-dark-ink-dimmer uppercase">{country}</div>
        <h3 className="m-0 font-serif text-[21px] font-medium">{name}</h3>
        <p className="m-0 text-sm leading-[1.65] text-slate dark:text-dark-ink-dim text-pretty">{body}</p>
      </div>
    </article>
  );
}

function ProposedCard({ country, name, body }: { country: string; name: string; body: string }) {
  const { t } = useLocale();
  return (
    <article className="grid content-start gap-2 border border-dashed border-teal/50 bg-bg dark:bg-dark-surface p-6">
      <div className="flex items-center gap-2.5"><span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-teal" /><span className="font-mono text-[10px] tracking-[.16em] text-teal dark:text-dark-teal uppercase">{t("Proposed city")}</span></div>
      <h3 className="m-0 font-serif text-[19px] font-medium">{name}</h3>
      <div className="font-mono text-[10.5px] tracking-[.12em] text-gray dark:text-dark-ink-dimmer uppercase">{country}</div>
      <p className="m-0 text-[13.5px] leading-[1.65] text-slate dark:text-dark-ink-dim text-pretty">{body}</p>
    </article>
  );
}

export default function PcwgPage() {
  const { t, locale } = useLocale();
  const pageData = usePageContent("pcwg", PCWG_SCHEMA);

  const heroTitle = pickText(pageData?.hero_title as BilingualText | undefined, locale, t("Pilgrimage Cities Working Group"));
  const heroDescription = pickText(
    pageData?.hero_description as BilingualText | undefined,
    locale,
    t("An international platform for cooperation, dialogue and knowledge exchange among pilgrimage cities.")
  );
  const currentMembers = mergeCities(pageData?.currentMembers as CityOverride[] | undefined, CURRENT_MEMBERS, locale, t);
  const proposedMembers = mergeCities(pageData?.proposedMembers as CityOverride[] | undefined, PROPOSED, locale, t);
  const areas = mergeTitleBody(pageData?.areas as TitleBodyOverride[] | undefined, AREAS, locale, t);
  const activityTypes = mergeTitleBody(pageData?.activityTypes as TitleBodyOverride[] | undefined, ACTIVITY_TYPES, locale, t);

  const sessionOverrides = pageData?.sessions as { title?: BilingualText; format?: BilingualText }[] | undefined;
  const sessions =
    sessionOverrides && sessionOverrides.length > 0
      ? sessionOverrides.map((o, i) => [
          pickText(o.title, locale, SESSIONS[i] ? t(SESSIONS[i][0]) : ""),
          pickText(o.format, locale, SESSIONS[i] ? t(SESSIONS[i][1]) : ""),
        ] as [string, string])
      : SESSIONS.map(([title, fmt]) => [t(title), t(fmt)] as [string, string]);

  const docOverrides = pageData?.docs as { category?: BilingualText; title?: BilingualText }[] | undefined;
  const docs =
    docOverrides && docOverrides.length > 0
      ? docOverrides.map((o, i) => ({
          cat: pickText(o.category, locale, DOCS[i] ? t(DOCS[i][0]) : ""),
          title: pickText(o.title, locale, DOCS[i] ? t(DOCS[i][1]) : ""),
          href: DOCS[i]?.[2] ?? "/media",
        }))
      : DOCS.map(([cat, title, href]) => ({ cat: t(cat), title: t(title), href }));

  return (
    <div>
      <div className="relative overflow-hidden bg-navy dark:bg-dark-navy">
        <PcwgConstellation />
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 45%, rgba(200,167,93,.14), transparent 62%)" }} />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,31,58,.86) 0%, rgba(11,31,58,.52) 42%, rgba(11,31,58,.94) 100%)" }} />
        <div className="relative mx-auto max-w-[1280px] px-6 pt-22 pb-26">
          <Breadcrumbs page="pcwg" />
          <div className="font-mono mb-4 text-[11px] tracking-[.2em] text-gold uppercase">{t("International Platform")}</div>
          <h1 className="m-0 mb-6 max-w-[900px] font-serif font-medium text-bg text-pretty" style={{ fontSize: "clamp(38px, 5.4vw, 74px)", lineHeight: 1.04, letterSpacing: "-.02em" }}>{heroTitle}</h1>
          <p className="m-0 mb-11 max-w-[660px] text-[rgba(250,248,244,.82)] text-pretty" style={{ fontSize: "clamp(16px, 1.4vw, 20px)", lineHeight: 1.65 }}>{heroDescription}</p>
          <div className="mb-10 grid max-w-[820px] gap-px bg-bg/[.22]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <div className="bg-gold p-7.5 text-navy">
              <div className="font-mono mb-3 text-[10.5px] tracking-[.2em] uppercase">{t("President")}</div>
              <div className="font-serif" style={{ fontSize: "clamp(22px, 2.2vw, 28px)", lineHeight: 1.2 }}>{t("Qom Municipality")}</div>
            </div>
            <div className="bg-[rgba(11,31,58,.72)] dark:bg-dark-fill p-7.5">
              <div className="font-mono mb-3 text-[10.5px] tracking-[.2em] text-gold uppercase">{t("Permanent Secretariat")}</div>
              <div className="font-serif text-bg" style={{ fontSize: "clamp(22px, 2.2vw, 28px)", lineHeight: 1.2 }}>{t("Qom, Iran")}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <a href="#pcwg-network" className="border border-gold bg-gold px-6 py-3.5 text-[13.5px] font-medium text-navy transition-colors hover:bg-transparent hover:text-gold">{t("Explore the network")}</a>
            <Link href="/contact" className="border border-bg/40 px-6 py-3.5 text-[13.5px] font-medium text-bg transition-colors hover:border-gold hover:text-gold">{t("Write to the secretariat")}</Link>
          </div>
        </div>
      </div>

      <div id="pcwg-network" className="bg-navy dark:bg-dark-navy pt-23 pb-25">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="font-mono mb-4 text-[11px] tracking-[.2em] text-gold uppercase">{t("Network")}</div>
          <h2 className="m-0 mb-4 max-w-[760px] font-serif font-medium text-bg" style={{ fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.12 }}>{t("Global Network of Pilgrimage Cities")}</h2>
          <p className="m-0 mb-13 max-w-[620px] text-[16.5px] leading-[1.7] text-[rgba(250,248,244,.7)]">{t("Qom sits at the centre of the network. Hover a city to see its role.")}</p>
          <PcwgNetwork />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pt-24 pb-10">
        <div className="font-mono mb-4 text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Membership")}</div>
        <h2 className="m-0 mb-4 font-serif font-medium" style={{ fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.12 }}>{t("Current Members")}</h2>
        <p className="m-0 mb-10 max-w-[640px] text-[16.5px] leading-[1.7] text-slate dark:text-dark-ink-dim">{t("Cities whose municipalities have joined the Working Group and take part in its sessions and programmes.")}</p>
        <div className="grid gap-6.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {currentMembers.map(([country, name, body], i) => <CityCard key={`${name}-${i}`} country={country} name={name} body={body} />)}
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-10">
        <h2 className="m-0 mb-3.5 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.8vw, 38px)", lineHeight: 1.15 }}>{t("Proposed & Upcoming Cities")}</h2>
        <p className="m-0 mb-9 max-w-[660px] text-[15.5px] leading-[1.7] text-gray dark:text-dark-ink-dimmer">{t("Candidates under discussion with the secretariat. Proposed cities are not yet official members of the Working Group.")}</p>
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
          {proposedMembers.map(([country, name, body], i) => <ProposedCard key={`${name}-${i}`} country={country} name={name} body={body} />)}
        </div>
      </div>

      <div className="border-t border-b border-navy/10 dark:border-dark-line bg-white dark:bg-dark-surface-2">
        <div className="mx-auto max-w-[1280px] px-6 py-23">
          <div className="font-mono mb-4 text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Institutional")}</div>
          <h2 className="m-0 mb-11 font-serif font-medium" style={{ fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.12 }}>{t("Leadership & Governance")}</h2>
          <div className="grid gap-6.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div className="grid content-start gap-3 border border-gold bg-gold/10 p-8">
              <div className="font-mono text-[10.5px] tracking-[.18em] text-[#8a6d2a] uppercase">{t("President")}</div>
              <h3 className="m-0 font-serif text-[23px] font-medium">{t("Qom Municipality")}</h3>
              <p className="m-0 text-sm leading-[1.7] text-slate dark:text-dark-ink-dim">{t("Presides over the Working Group, chairs its sessions and sets the agenda together with the member cities.")}</p>
            </div>
            <div className="grid content-start gap-3 border border-navy/[.14] dark:border-dark-line p-8">
              <div className="font-mono text-[10.5px] tracking-[.18em] text-teal dark:text-dark-teal uppercase">{t("Permanent Secretariat")}</div>
              <h3 className="m-0 font-serif text-[23px] font-medium">{t("Qom, Iran")}</h3>
              <p className="m-0 text-sm leading-[1.7] text-slate dark:text-dark-ink-dim">{t("Based in Qom and operated by the International Relations & Communications Department: membership, records, correspondence and joint programmes.")}</p>
            </div>
            <div className="grid content-start gap-3 border border-navy/[.14] dark:border-dark-line p-8">
              <div className="font-mono text-[10.5px] tracking-[.18em] text-teal dark:text-dark-teal uppercase">{t("Governance Structure")}</div>
              <div className="grid gap-2.5 text-sm leading-[1.6] text-slate dark:text-dark-ink-dim">
                {["Plenary of member cities", "Presidency held by Qom Municipality", "Permanent secretariat in Qom", "Technical committees per area of cooperation"].map((g, i) => (
                  <div key={g} className="flex gap-2.5"><span className="text-gold">{String(i + 1).padStart(2, "0")}</span>{t(g)}</div>
                ))}
              </div>
            </div>
            <div className="grid content-start gap-3 border border-navy/[.14] dark:border-dark-line p-8">
              <div className="font-mono text-[10.5px] tracking-[.18em] text-teal dark:text-dark-teal uppercase">{t("Objectives")}</div>
              <div className="grid gap-2.5 text-sm leading-[1.6] text-slate dark:text-dark-ink-dim">
                {["Shared standards for the management of pilgrimage cities", "Exchange of municipal experience and technical knowledge", "Better services and hospitality for visiting pilgrims", "Protection of religious and urban heritage", "Permanent channels of dialogue between member cities"].map((g) => (
                  <div key={g}>{t(g)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-navy dark:bg-dark-navy">
        <div className="mx-auto max-w-[1280px] px-6 py-23">
          <div className="font-mono mb-4 text-[11px] tracking-[.2em] text-gold uppercase">{t("Cooperation")}</div>
          <h2 className="m-0 mb-11 font-serif font-medium text-bg" style={{ fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.12 }}>{t("Areas of Cooperation")}</h2>
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {areas.map(([title, body], i) => (
              <div key={`${title}-${i}`} className="grid content-start gap-3 border border-bg/[.16] bg-bg/[.04] p-7.5 transition-colors hover:border-gold hover:bg-gold/[.08]">
                <div className="font-mono text-[11px] tracking-[.18em] text-gold">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="m-0 font-serif text-[19px] font-medium text-bg">{title}</h3>
                <p className="m-0 text-[13.5px] leading-[1.7] text-[rgba(250,248,244,.68)] text-pretty">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pt-24 pb-10">
        <div className="font-mono mb-4 text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Programme")}</div>
        <h2 className="m-0 mb-10 font-serif font-medium" style={{ fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.12 }}>{t("Meetings & Activities")}</h2>
        <div className="mb-13 grid gap-5.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
          {activityTypes.map(([title, body], i) => (
            <div key={`${title}-${i}`} className="grid content-start gap-2.5 border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 p-7.5">
              <h3 className="m-0 font-serif text-[19px] font-medium">{title}</h3>
              <p className="m-0 text-[13.5px] leading-[1.7] text-slate dark:text-dark-ink-dim text-pretty">{body}</p>
            </div>
          ))}
        </div>
        <div className="mb-11 grid gap-px bg-navy/[.12] dark:bg-dark-fill">
          {sessions.map(([title, fmt], i) => (
            <div key={`${title}-${i}`} className="grid items-center gap-5 bg-white dark:bg-dark-surface-2 px-7.5 py-6.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
              <h3 className="m-0 font-serif text-lg font-medium">{title}</h3>
              <div className="text-[13.5px] text-slate dark:text-dark-ink-dim">{fmt}</div>
              <div className="font-mono text-[12.5px] text-gray dark:text-dark-ink-dimmer">{t("[date]")}</div>
            </div>
          ))}
        </div>
        <h3 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}>{t("Documents")}</h3>
        <div className="grid gap-5.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {docs.map((d, i) => (
            <div key={`${d.title}-${i}`} className="border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 p-7">
              <div className="font-mono mb-3 text-[10.5px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{d.cat}</div>
              <h4 className="m-0 mb-3 font-serif text-lg font-medium">{d.title}</h4>
              <Link href={d.href} className="text-[13px] font-semibold">{t("Download PDF →")}</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-bg/10 bg-navy dark:bg-dark-navy">
        <div className="mx-auto max-w-[1280px] px-6 py-23">
          <div className="font-mono mb-4 text-[11px] tracking-[.2em] text-gold uppercase">{t("Gallery")}</div>
          <h2 className="m-0 mb-10 font-serif font-medium text-bg" style={{ fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.12 }}>{t("Photo & Video Showcase")}</h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {GALLERY.map((g, i) =>
              g.video ? (
                <VideoCard key={i} caption={g.caption} thumbLabel={g.label} hintPosition="logical" variant="figure" />
              ) : (
                <figure key={i} className="m-0 border border-bg/[.16] bg-bg/[.04]">
                  <div className="grid aspect-video place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
                    <span className="font-mono text-[9.5px] tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase">{t(g.label)}</span>
                  </div>
                  <figcaption className="px-4.5 py-4 text-[13.5px] leading-[1.6] text-[rgba(250,248,244,.72)]">{t(g.caption)}</figcaption>
                </figure>
              )
            )}
          </div>
        </div>
      </div>

      <div className="bg-gold text-navy">
        <div className="mx-auto grid max-w-[1280px] items-center gap-8.5 px-6 py-19" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div>
            <h2 className="m-0 mb-3 font-serif font-medium" style={{ fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 1.14 }}>{t("Join the Working Group")}</h2>
            <p className="m-0 max-w-[520px] text-base leading-[1.7]">{t("Cities interested in membership can write to the permanent secretariat in Qom.")}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-3.5">
            <Link href="/contact" className="border border-navy bg-navy dark:bg-dark-navy px-6.5 py-4 text-[13.5px] font-medium text-bg transition-colors hover:bg-transparent hover:text-navy">{t("Write to the secretariat")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
