"use client";

import Link from "next/link";
import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";
import { pickText, usePageContent } from "@/lib/pageContent/read";
import { getPageSchema } from "@/lib/pageContent/pageSchemas";
import type { BilingualText } from "@/lib/pageContent/schema";

const MEETINGS_SCHEMA = getPageSchema("meetings")!;

type MeetingOverride = {
  title?: BilingualText;
  body?: BilingualText;
  format?: BilingualText;
  location?: BilingualText;
  participants?: BilingualText;
};

type MeetingRowData = { title: string; body: string; format: string; location: string; participants: string };

function mergeMeetings(
  overrides: MeetingOverride[] | undefined,
  fallback: MeetingRowData[],
  locale: "en" | "ar",
  t: (s: string) => string
): MeetingRowData[] {
  if (!overrides || overrides.length === 0) return fallback.map((f) => ({
    title: t(f.title), body: t(f.body), format: t(f.format), location: t(f.location), participants: t(f.participants),
  }));
  return overrides.map((o, i) => ({
    title: pickText(o.title, locale, fallback[i] ? t(fallback[i].title) : ""),
    body: pickText(o.body, locale, fallback[i] ? t(fallback[i].body) : ""),
    format: pickText(o.format, locale, fallback[i] ? t(fallback[i].format) : ""),
    location: pickText(o.location, locale, fallback[i] ? t(fallback[i].location) : ""),
    participants: pickText(o.participants, locale, fallback[i] ? t(fallback[i].participants) : ""),
  }));
}

const HOSTED_DEFAULT: MeetingRowData[] = [
  { title: "[Working Group plenary session]", body: "Agenda, participating delegations and adopted outcomes — to be provided by the department.", format: "In-person", location: "[venue], Qom", participants: "[participating cities]" },
  { title: "[Delegation reception & bilateral talks]", body: "Programme of site visits and technical discussion with the visiting municipality.", format: "In-person", location: "[venue], Qom", participants: "[visiting delegation]" },
];
const ONLINE_DEFAULT: MeetingRowData[] = [
  { title: "[Virtual technical meeting with partner municipalities]", body: "Session convened remotely by the permanent secretariat in Qom.", format: "Online", location: "Convened from Qom", participants: "[participating cities]" },
];
const HYBRID_DEFAULT: MeetingRowData[] = [
  { title: "[Dialogue between partner municipalities]", body: "Delegations attending in person in Qom, with further members joining remotely.", format: "Hybrid", location: "[venue], Qom + online", participants: "[participating cities]" },
];

function MeetingRow({ tag, tagStyle, title, body, format, location, participants }: {
  tag: string; tagStyle: "gold" | "teal"; title: string; body: string; format: string; location: string; participants: string;
}) {
  const { t } = useLocale();
  return (
    <article className="grid gap-7.5 bg-white dark:bg-dark-surface-2 p-7.5" style={{ gridTemplateColumns: "minmax(0,2.2fr) minmax(200px,1fr)" }}>
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          {tagStyle === "gold" ? (
            <span className="font-mono bg-gold/30 px-2.5 py-[5px] text-[10px] tracking-[.14em] text-navy dark:text-dark-ink uppercase">{t(tag)}</span>
          ) : (
            <span className="font-mono border border-teal/45 px-2 py-1 text-[10px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{t(tag)}</span>
          )}
          <span className="font-mono text-[11.5px] text-gray dark:text-dark-ink-dimmer">{t("[date]")}</span>
        </div>
        <h3 className="m-0 mb-2.5 font-serif text-[21px] font-medium">{t(title)}</h3>
        <p className="m-0 mb-3.5 max-w-[620px] text-[14.5px] leading-[1.65] text-slate dark:text-dark-ink-dim">{t(body)}</p>
        <Link href="/meetings" className="text-[13px] font-semibold">{t("View Details →")}</Link>
      </div>
      <div className="grid content-start gap-3 text-[13px]">
        <div><div className="mb-1 text-[10.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Format")}</div>{t(format)}</div>
        <div><div className="mb-1 text-[10.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Location")}</div>{t(location)}</div>
        <div><div className="mb-1 text-[10.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Participants")}</div>{t(participants)}</div>
      </div>
    </article>
  );
}

export default function MeetingsPage() {
  const { t, locale } = useLocale();
  const pageData = usePageContent("meetings", MEETINGS_SCHEMA);
  const heroTitle = pickText(pageData?.hero_title as BilingualText | undefined, locale, t("International Meetings in Qom"));
  const heroDescription = pickText(
    pageData?.hero_description as BilingualText | undefined,
    locale,
    t("Meetings, sessions and dialogues convened by Qom Municipality — in person in the city, online from Qom, or in hybrid format.")
  );
  const hosted = mergeMeetings(pageData?.hosted as MeetingOverride[] | undefined, HOSTED_DEFAULT, locale, t);
  const online = mergeMeetings(pageData?.online as MeetingOverride[] | undefined, ONLINE_DEFAULT, locale, t);
  const hybrid = mergeMeetings(pageData?.hybrid as MeetingOverride[] | undefined, HYBRID_DEFAULT, locale, t);
  return (
    <div>
      <PageHero
        page="meetings"
        title={heroTitle}
        description={heroDescription}
        icon={
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke="#C8A75D" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="100" cy="76" rx="64" ry="29" />
            <ellipse cx="100" cy="76" rx="38" ry="16" opacity=".5" />
            <circle cx="100" cy="36" r="7" />
            <circle cx="46" cy="52" r="7" />
            <circle cx="154" cy="52" r="7" />
            <circle cx="46" cy="104" r="7" />
            <circle cx="154" cy="104" r="7" />
            <circle cx="100" cy="118" r="7" />
          </svg>
        }
      />
      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-24">
        <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.3vw, 32px)" }}>{t("Hosted in Qom")}</h2>
        <div className="mb-15.5 grid gap-px bg-navy/[.12] dark:bg-dark-fill">
          {hosted.map((m, i) => (
            <MeetingRow key={i} tag="Hosted in Qom" tagStyle="gold" title={m.title} body={m.body} format={m.format} location={m.location} participants={m.participants} />
          ))}
        </div>

        <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.3vw, 32px)" }}>{t("Online from Qom")}</h2>
        <div className="mb-15.5 grid gap-px bg-navy/[.12] dark:bg-dark-fill">
          {online.map((m, i) => (
            <MeetingRow key={i} tag="Online from Qom" tagStyle="teal" title={m.title} body={m.body} format={m.format} location={m.location} participants={m.participants} />
          ))}
        </div>

        <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.3vw, 32px)" }}>{t("Hybrid")}</h2>
        <div className="grid gap-px bg-navy/[.12] dark:bg-dark-fill">
          {hybrid.map((m, i) => (
            <MeetingRow key={i} tag="Hosted in Qom" tagStyle="gold" title={m.title} body={m.body} format={m.format} location={m.location} participants={m.participants} />
          ))}
        </div>
      </div>
    </div>
  );
}
