"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";

const SOCIAL = [
  { label: "Instagram", d: "M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.51.01-4.75.07-.9.04-1.38.19-1.71.31-.43.17-.73.37-1.05.69-.32.32-.52.62-.69 1.05-.12.33-.27.81-.31 1.71C3.43 8.49 3.42 8.86 3.42 12s.01 3.51.07 4.75c.04.9.19 1.38.31 1.71.17.43.37.73.69 1.05.32.32.62.52 1.05.69.33.12.81.27 1.71.31 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.9-.04 1.38-.19 1.71-.31.43-.17.73-.37 1.05-.69.32-.32.52-.62.69-1.05.12-.33.27-.81.31-1.71.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.04-.9-.19-1.38-.31-1.71a2.83 2.83 0 0 0-.69-1.05 2.83 2.83 0 0 0-1.05-.69c-.33-.12-.81-.27-1.71-.31C15.51 4.01 15.14 4 12 4zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3zm5.15-3.2a1.16 1.16 0 1 1 0 2.32 1.16 1.16 0 0 1 0-2.32z" },
  { label: "X", d: "M17.53 3h3.02l-6.6 7.54L21.75 21h-5.9l-4.62-6.04L5.94 21H2.9l7.06-8.07L2.4 3h6.05l4.18 5.52zM16.47 19.2h1.67L7.63 4.7H5.84z" },
  { label: "Telegram", d: "M21.9 5.2 18.9 19.3c-.22 1-.82 1.25-1.66.78l-4.6-3.39-2.22 2.14c-.25.25-.45.45-.92.45l.33-4.68 8.5-7.68c.37-.33-.08-.51-.57-.18l-10.5 6.61-4.53-1.42c-.98-.31-1-.98.21-1.45l17.7-6.82c.82-.3 1.54.18 1.26 1.44z" },
  { label: "LinkedIn", d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3.2 9.2h3.6V21H3.2zM9.3 9.2h3.45v1.62h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.33 2.4 4.33 5.53V21h-3.6v-5.77c0-1.38-.03-3.15-1.93-3.15-1.93 0-2.22 1.5-2.22 3.05V21H9.3z" },
  { label: "YouTube", d: "M21.58 7.19a2.51 2.51 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41a2.51 2.51 0 0 0-1.77 1.78A26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.51 2.51 0 0 0 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.81-.41a2.51 2.51 0 0 0 1.77-1.78A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81zM10 15.02V8.98L15.2 12z" },
  { label: "Facebook", d: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94z" },
];

export default function SiteFooter() {
  const { t, locale, setLocale } = useLocale();
  return (
    <footer className="bg-navy dark:bg-dark-navy text-[rgba(250,248,244,.72)]">
      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-8">
        <div className="grid gap-11" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
          <div>
            <div className="mb-[18px] flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center border-[1.5px] border-gold font-serif text-[17px] text-gold">Q</div>
              <div className="leading-[1.2] text-bg">
                <div className="font-serif text-[15px]">{t("Qom Municipality")}</div>
                <div className="text-[10px] tracking-[.16em] text-gold uppercase">{t("International Relations")}</div>
              </div>
            </div>
            <p className="m-0 text-[13.5px] leading-[1.7]">
              {t("Urban diplomacy, international cooperation and municipal partnerships for the city of Qom.")}
            </p>
            <div className="mt-5.5 flex flex-wrap gap-[9px]">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href="#top"
                  aria-label={t(s.label)}
                  className="grid h-[38px] w-[38px] place-items-center border border-bg/[.22] text-[rgba(250,248,244,.72)] transition-colors hover:border-gold hover:bg-gold/[.12] hover:text-gold"
                >
                  <svg aria-hidden width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-[18px] text-[11.5px] tracking-[.16em] text-gold uppercase">{t("Quick links")}</div>
            <div className="grid gap-[11px] text-[13.5px]">
              <Link href="/news" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("News")}</Link>
              <Link href="/about" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("About Us")}</Link>
              <Link href="/cooperation" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("International Activities")}</Link>
              <Link href="/departments" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("Deputy Departments")}</Link>
              <Link href="/feedback" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("Share Your Experience")}</Link>
            </div>
          </div>

          <div>
            <div className="mb-[18px] text-[11.5px] tracking-[.16em] text-gold uppercase">{t("International cooperation")}</div>
            <div className="grid gap-[11px] text-[13.5px]">
              <Link href="/pcwg" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("Pilgrimage Cities Working Group")}</Link>
              <Link href="/memberships" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("Memberships & Networks")}</Link>
              <Link href="/events" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("Events & Participation")}</Link>
              <Link href="/meetings" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("Meetings in Qom")}</Link>
            </div>
          </div>

          <div>
            <div className="mb-[18px] text-[11.5px] tracking-[.16em] text-gold uppercase">{t("Investment & media")}</div>
            <div className="grid gap-[11px] text-[13.5px]">
              <Link href="/investment" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("Investment Opportunities")}</Link>
              <Link href="/culture" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("Cultural Weeks & Festivals")}</Link>
              <Link href="/media" className="text-[rgba(250,248,244,.72)] hover:text-gold">{t("Media & Publications")}</Link>
            </div>
          </div>

          <div>
            <div className="mb-[18px] text-[11.5px] tracking-[.16em] text-gold uppercase">{t("Contact")}</div>
            <div className="text-[13.5px] leading-[1.8]">
              {t("Qom Municipality, Central Building")}<br />
              {t("Qom, Iran")}<br />
              {t("[official email address]")}<br />
              {t("[official telephone number]")}
            </div>
          </div>
        </div>

        <div className="mt-[52px] flex flex-wrap items-center justify-between gap-5 border-t border-bg/[.14] pt-6 text-[12.5px]">
          <div>© 2026 {t("Qom Municipality")} — {t("International Relations & Communications Department")}.</div>
          <div className="flex gap-0.5 border border-bg/[.22] p-[3px]">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className="border-0 font-sans text-[11.5px] tracking-[.1em] cursor-pointer px-[11px] py-1.5"
              style={{ background: locale === "en" ? "#C8A75D" : "transparent", color: locale === "en" ? "#0B1F3A" : "rgba(250,248,244,.72)" }}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("ar")}
              className="border-0 font-sans text-[11.5px] tracking-[.1em] cursor-pointer px-[11px] py-1.5"
              style={{ background: locale === "ar" ? "#C8A75D" : "transparent", color: locale === "ar" ? "#0B1F3A" : "rgba(250,248,244,.72)" }}
            >
              AR
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
