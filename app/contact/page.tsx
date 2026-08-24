"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";

const SOCIAL = [
  { label: "Instagram", d: "M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.51.01-4.75.07-.9.04-1.38.19-1.71.31-.43.17-.73.37-1.05.69-.32.32-.52.62-.69 1.05-.12.33-.27.81-.31 1.71C3.43 8.49 3.42 8.86 3.42 12s.01 3.51.07 4.75c.04.9.19 1.38.31 1.71.17.43.37.73.69 1.05.32.32.62.52 1.05.69.33.12.81.27 1.71.31 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.9-.04 1.38-.19 1.71-.31.43-.17.73-.37 1.05-.69.32-.32.52-.62.69-1.05.12-.33.27-.81.31-1.71.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.04-.9-.19-1.38-.31-1.71a2.83 2.83 0 0 0-.69-1.05 2.83 2.83 0 0 0-1.05-.69c-.33-.12-.81-.27-1.71-.31C15.51 4.01 15.14 4 12 4zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3zm5.15-3.2a1.16 1.16 0 1 1 0 2.32 1.16 1.16 0 0 1 0-2.32z" },
  { label: "X", d: "M17.53 3h3.02l-6.6 7.54L21.75 21h-5.9l-4.62-6.04L5.94 21H2.9l7.06-8.07L2.4 3h6.05l4.18 5.52zM16.47 19.2h1.67L7.63 4.7H5.84z" },
  { label: "Telegram", d: "M21.9 5.2 18.9 19.3c-.22 1-.82 1.25-1.66.78l-4.6-3.39-2.22 2.14c-.25.25-.45.45-.92.45l.33-4.68 8.5-7.68c.37-.33-.08-.51-.57-.18l-10.5 6.61-4.53-1.42c-.98-.31-1-.98.21-1.45l17.7-6.82c.82-.3 1.54.18 1.26 1.44z" },
  { label: "LinkedIn", d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3.2 9.2h3.6V21H3.2zM9.3 9.2h3.45v1.62h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.33 2.4 4.33 5.53V21h-3.6v-5.77c0-1.38-.03-3.15-1.93-3.15-1.93 0-2.22 1.5-2.22 3.05V21H9.3z" },
  { label: "YouTube", d: "M21.58 7.19a2.51 2.51 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41a2.51 2.51 0 0 0-1.77 1.78A26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.51 2.51 0 0 0 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.81-.41a2.51 2.51 0 0 0 1.77-1.78A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81zM10 15.02V8.98L15.2 12z" },
  { label: "Facebook", d: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94z" },
];

const FAQS = [
  { q: "How can a city propose a sister-city relationship with Qom?", a: "A formal letter of intent from the mayor or city council should be addressed to the International Relations & Communications Department, which prepares the proposal for municipal and national review." },
  { q: "How can a city join the Pilgrimage Cities Working Group?", a: "Requests are submitted to the permanent secretariat in Qom and reviewed by the members at the following session." },
  { q: "Who should investors contact first?", a: "The International Relations Office is the single entry point for foreign investors and refers each enquiry to the relevant deputy department." },
  { q: "How are media and interview requests handled?", a: "Media requests are received by the communications team, which arranges accreditation, interviews and access to the municipal media archive." },
  { q: "In which languages can I write?", a: "Persian, Arabic and English are all received and answered by the department." },
];

const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v);

export default function ContactPage() {
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = t("This field is required.");
    if (!email.trim()) nextErrors.email = t("This field is required.");
    else if (!emailOk(email.trim())) nextErrors.email = t("Please enter a valid email address.");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ text: t("Please complete the required fields before submitting."), error: true });
      const firstErrorId = nextErrors.name ? "cp-name" : nextErrors.email ? "cp-email" : null;
      if (firstErrorId) document.getElementById(firstErrorId)?.focus();
      return;
    }
    setStatus({ text: t("Thank you — your message has been received by the International Relations Office."), error: false });
    setName(""); setOrg(""); setCountry(""); setEmail(""); setMessage("");
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <div>
      <PageHero
        page="contact"
        title={t("Contact the International Relations Office")}
        description={t("Enquiries from municipalities, international organisations, investors, media and visiting delegations.")}
        icon={
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke="#C8A75D" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <rect x="12" y="46" width="102" height="66" />
            <path d="m12 46 51 37 51-37" />
            <path d="M160 34c14 0 24 11 24 25 0 18-24 45-24 45s-24-27-24-45c0-14 10-25 24-25z" />
            <circle cx="160" cy="58" r="8" />
            <path d="M124 24c6 4 10 10 10 18M136 16c9 6 16 16 16 26" opacity=".5" />
          </svg>
        }
      />

      <div className="mx-auto max-w-[1280px] px-6 pt-19 pb-22">
        <div className="mb-19 grid gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {[
            ["Address", "Qom Municipality, Central Building\nQom, Islamic Republic of Iran"],
            ["Email", "[official email address]"],
            ["Telephone", "[official telephone number]"],
          ].map(([k, v]) => (
            <div key={k} className="grid content-start gap-2.5 border-t-2 border-gold bg-white dark:bg-dark-surface-2 px-7.5 py-8">
              <div className="font-mono text-[10.5px] tracking-[.18em] text-gray dark:text-dark-ink-dimmer uppercase">{t(k)}</div>
              <div className="text-[15.5px] leading-[1.65]">{v.split("\n").map((line, li) => <span key={li}>{t(line)}{li === 0 && v.includes("\n") && <br />}</span>)}</div>
            </div>
          ))}
        </div>

        <div className="grid items-start gap-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
          <div>
            <div className="mb-3.5 flex items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Visit")}</span></div>
            <h2 className="m-0 mb-5.5 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.3vw, 32px)" }}>{t("Location")}</h2>
            <div className="relative grid aspect-[4/3] place-items-center bg-navy dark:bg-dark-navy" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.14) 0 2px, transparent 2px 11px)" }}>
              <span className="font-mono text-[10.5px] tracking-[.14em] text-[rgba(250,248,244,.45)] uppercase">{t("map — municipality location, qom")}</span>
              <span className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
            </div>
            <div className="mb-11 flex flex-wrap items-center justify-between gap-4 border border-t-0 border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 px-5.5 py-4.5">
              <span className="text-sm leading-[1.6]">Qom Municipality, Central Building — Qom, Iran</span>
              <span className="font-mono text-[10.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Saturday–Wednesday · 08:00–15:00")}</span>
            </div>
            <h2 className="m-0 mb-4.5 font-serif font-medium" style={{ fontSize: "clamp(22px, 2vw, 28px)" }}>{t("Social media")}</h2>
            <div className="flex flex-wrap gap-2.5">
              {SOCIAL.map((s) => (
                <a key={s.label} href="/contact" aria-label={t(s.label)} className="grid h-11 w-11 place-items-center border border-navy/20 dark:border-dark-line text-slate dark:text-dark-ink-dim transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold">
                  <svg aria-hidden width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="grid content-start gap-5 border border-navy/[.14] dark:border-dark-line bg-white dark:bg-dark-surface-2 p-9">
            <h2 className="m-0 mb-1 font-serif font-medium" style={{ fontSize: "clamp(22px, 2vw, 28px)" }}>{t("Send an enquiry")}</h2>
            <div className="grid gap-2">
              <label htmlFor="cp-name" className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Name")}</label>
              <input id="cp-name" value={name} onChange={(e) => setName(e.target.value)} className="border border-navy/20 dark:border-dark-line bg-bg dark:bg-dark-surface px-3.5 py-3 text-[15px] text-navy dark:text-dark-ink" style={{ borderColor: errors.name ? "#B4472F" : undefined }} />
              {errors.name && <div className="text-xs text-red">{errors.name}</div>}
            </div>
            <div className="grid gap-2">
              <label htmlFor="cp-org" className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Organization")}</label>
              <input id="cp-org" value={org} onChange={(e) => setOrg(e.target.value)} className="border border-navy/20 dark:border-dark-line bg-bg dark:bg-dark-surface px-3.5 py-3 text-[15px] text-navy dark:text-dark-ink" />
            </div>
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
              <div className="grid gap-2">
                <label htmlFor="cp-country" className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Country")}</label>
                <input id="cp-country" value={country} onChange={(e) => setCountry(e.target.value)} className="border border-navy/20 dark:border-dark-line bg-bg dark:bg-dark-surface px-3.5 py-3 text-[15px] text-navy dark:text-dark-ink" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="cp-email" className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Email")}</label>
                <input id="cp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-navy/20 dark:border-dark-line bg-bg dark:bg-dark-surface px-3.5 py-3 text-[15px] text-navy dark:text-dark-ink" style={{ borderColor: errors.email ? "#B4472F" : undefined }} />
                {errors.email && <div className="text-xs text-red">{errors.email}</div>}
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="cp-msg" className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Message")}</label>
              <textarea id="cp-msg" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="resize-y border border-navy/20 dark:border-dark-line bg-bg dark:bg-dark-surface px-3.5 py-3 text-[15px] text-navy dark:text-dark-ink" />
            </div>
            <button type="submit" className="justify-self-start cursor-pointer border border-navy bg-navy dark:bg-dark-navy px-6 py-4 text-sm font-medium text-bg transition-colors hover:border-gold hover:bg-gold hover:text-navy">{t("Send message")}</button>
            {status && <div className="min-h-[18px] text-[13.5px]" style={{ color: status.error ? "#B4472F" : "#00A8A8" }}>{status.text}</div>}
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pt-21 pb-24">
        <div className="mb-4 flex flex-wrap items-center gap-3"><span className="h-px w-7 bg-gold" /><span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Guidance")}</span></div>
        <h2 className="m-0 mb-8 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.8vw, 38px)" }}>{t("Frequently asked questions")}</h2>
        <div className="grid gap-px bg-navy/[.12] dark:bg-dark-fill">
          {FAQS.map((f) => (
            <details key={f.q} className="bg-white dark:bg-dark-surface-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4.5 px-7 py-6 font-serif text-[17px] leading-[1.4]">
                {t(f.q)}<span className="font-mono shrink-0 text-[15px] text-gold">+</span>
              </summary>
              <p className="m-0 max-w-[780px] px-7 pb-6.5 text-[14.5px] leading-[1.75] text-slate dark:text-dark-ink-dim">{t(f.a)}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 grid gap-6.5 border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 p-7.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div>
            <div className="mb-2.5 text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Working hours")}</div>
            <div className="text-[15px] leading-[1.65]">{t("Saturday to Wednesday, 08:00–15:00 (Iran Standard Time)")}</div>
          </div>
          <div>
            <div className="mb-2.5 text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("International Relations Office")}</div>
            <div className="text-[15px] leading-[1.65]">{t("Qom Municipality, Central Building")}<br />{t("Qom, Islamic Republic of Iran")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
