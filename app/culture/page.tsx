"use client";

import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";

const FESTIVALS = [
  { status: "Upcoming", statusStyle: "gold", title: "Imam Mahdi Day Festival", theme: "Religious and cultural celebration", body: "A citywide celebration with programming open to international visitors and pilgrims." },
  { status: "Ongoing", statusStyle: "teal", title: "Qom Day", theme: "City identity & civic celebration", body: "The city's own commemorative day, with an international programme for visiting guests.", location: "Citywide, Qom" },
  { status: "Completed", statusStyle: "navy", title: "[Partner city cultural week]", theme: "Intercultural programme with a partner city", body: "A reciprocal cultural week hosted with one of Qom's partner municipalities." },
];

export default function CulturePage() {
  const { t } = useLocale();
  return (
    <div>
      <PageHero
        page="culture"
        title={t("Cultural Weeks & Festivals")}
        description={t("Cultural programmes planned in Qom for international and intercultural audiences. Dates are confirmed by the municipality before publication.")}
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
          {FESTIVALS.map((f) => (
            <article key={f.title} className="border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2">
              <div className="relative grid aspect-[3/2] place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
                <span className="font-mono text-[10px] tracking-[.14em] text-[rgba(250,248,244,.40)] uppercase">{t("festival image")}</span>
                <span
                  className="font-mono absolute top-3.5 left-3.5 px-2.5 py-[5px] text-[10px] tracking-[.14em] uppercase"
                  style={{
                    background: f.statusStyle === "gold" ? "#C8A75D" : f.statusStyle === "teal" ? "rgba(0,168,168,.92)" : "rgba(11,31,58,.85)",
                    color: f.statusStyle === "navy" ? "#FAF8F4" : "#0B1F3A",
                  }}
                >
                  {t(f.status)}
                </span>
              </div>
              <div className="p-6.5">
                <h2 className="m-0 mb-3 font-serif text-[21px] font-medium">{t(f.title)}</h2>
                <div className="mb-3.5 grid gap-1.5 text-[13px] text-gray dark:text-dark-ink-dimmer">
                  <div>{t("Date:")} {t("[to be confirmed]")}</div>
                  <div>{t("Location:")} {t(f.location || "[venue], Qom")}</div>
                  <div>{t("Theme:")} {t(f.theme)}</div>
                </div>
                <p className="m-0 text-sm leading-[1.65] text-slate dark:text-dark-ink-dim">{t(f.body)}</p>
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
