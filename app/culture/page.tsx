"use client";

import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";
import { pickText, usePageContent } from "@/lib/pageContent/read";
import { getPageSchema } from "@/lib/pageContent/pageSchemas";
import type { BilingualText } from "@/lib/pageContent/schema";

const FESTIVALS = [
  { status: "Upcoming", statusStyle: "gold", title: "Imam Mahdi Day Festival", theme: "Religious and cultural celebration", body: "A citywide celebration with programming open to international visitors and pilgrims." },
  { status: "Ongoing", statusStyle: "teal", title: "Qom Day", theme: "City identity & civic celebration", body: "The city's own commemorative day, with an international programme for visiting guests.", location: "Citywide, Qom" },
  { status: "Completed", statusStyle: "navy", title: "[Partner city cultural week]", theme: "Intercultural programme with a partner city", body: "A reciprocal cultural week hosted with one of Qom's partner municipalities." },
];

const STATUS_STYLE_BY_STATUS: Record<string, string> = { Upcoming: "gold", Ongoing: "teal", Completed: "navy" };

const CULTURE_SCHEMA = getPageSchema("culture")!;
type FestivalOverride = { status?: BilingualText; title?: BilingualText; theme?: BilingualText; location?: BilingualText; body?: BilingualText };

export default function CulturePage() {
  const { t, locale } = useLocale();
  const pageData = usePageContent("culture", CULTURE_SCHEMA);
  const heroTitle = pickText(pageData?.hero_title as BilingualText | undefined, locale, t("Cultural Weeks & Festivals"));
  const heroDescription = pickText(
    pageData?.hero_description as BilingualText | undefined,
    locale,
    t("Cultural programmes planned in Qom for international and intercultural audiences. Dates are confirmed by the municipality before publication.")
  );
  const festivalOverrides = pageData?.festivals as FestivalOverride[] | undefined;
  const festivals =
    festivalOverrides && festivalOverrides.length > 0
      ? festivalOverrides.map((f, i) => {
          const status = pickText(f.status, locale, FESTIVALS[i] ? t(FESTIVALS[i].status) : t("Upcoming"));
          return {
            status,
            statusStyle: STATUS_STYLE_BY_STATUS[status] ?? "gold",
            title: pickText(f.title, locale, FESTIVALS[i] ? t(FESTIVALS[i].title) : ""),
            theme: pickText(f.theme, locale, FESTIVALS[i] ? t(FESTIVALS[i].theme) : ""),
            location: pickText(f.location, locale, FESTIVALS[i]?.location ? t(FESTIVALS[i].location as string) : t("[venue], Qom")),
            body: pickText(f.body, locale, FESTIVALS[i] ? t(FESTIVALS[i].body) : ""),
          };
        })
      : FESTIVALS.map((f) => ({
          status: t(f.status),
          statusStyle: f.statusStyle,
          title: t(f.title),
          theme: t(f.theme),
          location: t(f.location || "[venue], Qom"),
          body: t(f.body),
        }));
  return (
    <div>
      <PageHero
        page="culture"
        title={heroTitle}
        description={heroDescription}
      />
      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-24">
        <article className="mb-8.5 grid border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          <div className="grid min-h-[320px] place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
            <span className="font-mono text-[10.5px] tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase">{t("festival photograph")}</span>
          </div>
          <div className="flex flex-col justify-center px-10 py-11">
            <span className="font-mono mb-4.5 self-start bg-gold px-2.5 py-[5px] text-[10px] tracking-[.14em] text-navy uppercase">{t("Upcoming")}</span>
            <h2 className="m-0 mb-4 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.3vw, 32px)" }}>{t("Qom Cultural Week")}</h2>
            <div className="mb-4.5 grid gap-1.5 text-[13.5px] text-gray dark:text-dark-ink-dimmer">
              <div>{t("Date:")} {t("[to be confirmed]")}</div>
              <div>{t("Location:")} {t("[venue], Qom")}</div>
              <div>{t("Theme:")} {t("Intercultural exchange & city identity")}</div>
            </div>
            <p className="m-0 max-w-[520px] text-[15.5px] leading-[1.7] text-slate dark:text-dark-ink-dim">{t("A week of cultural programming presenting Qom to international guests and partner cities — exhibitions, performance, craft and scholarly encounter across municipal venues.")}</p>
          </div>
        </article>

        <div className="grid gap-6.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
          {festivals.map((f, i) => (
            <article key={`${f.title}-${i}`} className="border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2">
              <div className="relative grid aspect-[3/2] place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
                <span className="font-mono text-[10px] tracking-[.14em] text-[rgba(250,248,244,.40)] uppercase">{t("festival image")}</span>
                <span
                  className="font-mono absolute top-3.5 left-3.5 px-2.5 py-[5px] text-[10px] tracking-[.14em] uppercase"
                  style={{
                    background: f.statusStyle === "gold" ? "#C8A75D" : f.statusStyle === "teal" ? "rgba(0,168,168,.92)" : "rgba(11,31,58,.85)",
                    color: f.statusStyle === "navy" ? "#FAF8F4" : "#0B1F3A",
                  }}
                >
                  {f.status}
                </span>
              </div>
              <div className="p-6.5">
                <h2 className="m-0 mb-3 font-serif text-[21px] font-medium">{f.title}</h2>
                <div className="mb-3.5 grid gap-1.5 text-[13px] text-gray dark:text-dark-ink-dimmer">
                  <div>{t("Date:")} {t("[to be confirmed]")}</div>
                  <div>{t("Location:")} {f.location}</div>
                  <div>{t("Theme:")} {f.theme}</div>
                </div>
                <p className="m-0 text-sm leading-[1.65] text-slate dark:text-dark-ink-dim">{f.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-11.5 border border-dashed border-navy/25 dark:border-dark-line bg-bg dark:bg-dark-surface p-8.5">
          <span className="font-mono text-[10px] tracking-[.14em] text-gold uppercase">{t("Upcoming Programs")}</span>
          <h2 className="m-0 mt-3.5 mb-2.5 font-serif text-[22px] font-medium text-gray dark:text-dark-ink-dimmer">{t("Further cultural weeks and festivals")}</h2>
          <p className="m-0 max-w-[640px] text-[14.5px] leading-[1.7] text-gray dark:text-dark-ink-dimmer">{t("Additional intercultural programmes will be published here as they are scheduled by the municipality.")}</p>
        </div>
      </div>
    </div>
  );
}
