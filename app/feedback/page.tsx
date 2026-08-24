"use client";

import { useState } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";

const VISITOR_TYPES = ["Pilgrim", "Tourist", "Official delegation", "Investor", "Researcher or student", "Media representative", "Resident of Qom"];
const EXPERIENCE_TYPES = ["Urban services", "Cleanliness & sanitation", "Transport & access", "Hospitality & accommodation", "Signage & information", "Safety & security", "Digital services", "Cultural programmes"];

const TESTIMONIALS = [
  { quote: "[Visitor testimonial — to be supplied from submitted feedback.]", meta: "[Visitor type]" },
  { quote: "[Delegation testimonial — to be supplied from submitted feedback.]", meta: "[Visitor type]" },
  { quote: "[Pilgrim testimonial — to be supplied from submitted feedback.]", meta: "[Visitor type]" },
];

const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v);

export default function FeedbackPage() {
  const { t } = useLocale();
  const [rating, setRating] = useState(0);
  const [types, setTypes] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!message.trim()) nextErrors.message = t("This field is required.");
    if (email.trim() && !emailOk(email.trim())) nextErrors.email = t("Please enter a valid email address.");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ text: t("Please complete the required fields before submitting."), error: true });
      const firstErrorId = nextErrors.email ? "fbp-email" : nextErrors.message ? "fbp-msg" : null;
      if (firstErrorId) document.getElementById(firstErrorId)?.focus();
      return;
    }
    setStatus({ text: t("Thank you — your feedback has been submitted to Qom Municipality."), error: false });
    setRating(0); setTypes([]); setExperience([]); setAnonymous(false);
    setName(""); setCountry(""); setEmail(""); setMessage(""); setSuggestions("");
    setTimeout(() => setStatus(null), 4000);
  };

  const chipClass = (on: boolean) =>
    `inline-flex cursor-pointer items-center gap-2.5 border px-3.5 py-2.5 text-[13.5px] transition-colors ${on ? "border-gold bg-gold/[.14]" : "border-navy/20 dark:border-dark-line"}`;

  return (
    <div>
      <PageHero
        page="feedback"
        eyebrow={t("Visitors & pilgrims")}
        icon={
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke="#C8A75D" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 32h94a9 9 0 0 1 9 9v38a9 9 0 0 1-9 9H52l-20 17V88H18a9 9 0 0 1-9-9V41a9 9 0 0 1 9-9z" />
            <path d="M134 58h42a8 8 0 0 1 8 8v30a8 8 0 0 1-8 8h-6v14l-16-14h-20a8 8 0 0 1-8-8V66a8 8 0 0 1 8-8z" opacity=".5" />
            <path d="m64 44 6 12 13 2-9.5 9.4 2.4 13.2L64 74.2 51.1 80.6l2.4-13.2L44 58l13-2z" fill="#C8A75D" stroke="none" />
          </svg>
        }
        title={t("Visitor Feedback")}
        description={t("Your experience helps us make Qom a more welcoming and internationally connected city.")}
      />

      <div className="border-b border-navy/10 dark:border-dark-line bg-white dark:bg-dark-surface-2">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-px bg-navy/10 dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {[
              ["Reviewed", "Every submission is read by the International Relations & Communications Department."],
              ["Anonymous option", "Feedback submitted without a name is reviewed on the same terms."],
              ["Three languages", "Persian, Arabic and English are all received and answered by the department."],
            ].map(([title, body]) => (
              <div key={title} className="bg-white dark:bg-dark-surface-2 px-6.5 py-7.5">
                <div className="font-mono mb-2.5 text-[10.5px] tracking-[.16em] text-teal dark:text-dark-teal uppercase">{t(title)}</div>
                <p className="m-0 text-sm leading-[1.7] text-slate dark:text-dark-ink-dim">{t(body)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-10">
        <div className="grid items-start gap-11" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          <form onSubmit={submit} className="grid gap-6.5 border border-navy/[.14] dark:border-dark-line bg-white dark:bg-dark-surface-2 p-9.5">
            <div>
              <h2 className="m-0 mb-2.5 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.4vw, 32px)" }}>{t("Share your experience of Qom")}</h2>
              <p className="m-0 text-[14.5px] leading-[1.7] text-slate dark:text-dark-ink-dim">{t("Tourists, pilgrims, delegations and official guests can submit their experience of municipal services, hospitality and the urban environment.")}</p>
            </div>

            <div className="grid gap-3">
              <div className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Your rating")}</div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star rating`}
                    onClick={() => setRating(n)}
                    className={`h-11.5 w-11.5 cursor-pointer border text-lg transition-colors${
                      n <= rating ? "" : " border-navy/20 dark:border-dark-line text-gray dark:text-dark-ink-dimmer"
                    }`}
                    style={n <= rating ? { background: "#C8A75D", color: "#0B1F3A", borderColor: "#C8A75D" } : { background: "transparent" }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("I am a")}</div>
              <div className="flex flex-wrap gap-2.5">
                {VISITOR_TYPES.map((v) => (
                  <label key={v} className={chipClass(types.includes(v))}>
                    <input type="checkbox" checked={types.includes(v)} onChange={() => toggle(types, setTypes, v)} className="h-[15px] w-[15px] accent-gold" />
                    {t(v)}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("What did your visit involve?")}</div>
              <div className="flex flex-wrap gap-2.5">
                {EXPERIENCE_TYPES.map((v) => (
                  <label key={v} className={chipClass(experience.includes(v))}>
                    <input type="checkbox" checked={experience.includes(v)} onChange={() => toggle(experience, setExperience, v)} className="h-[15px] w-[15px] accent-gold" />
                    {t(v)}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
              <div className="grid gap-2">
                <label htmlFor="fbp-name" className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Name")}</label>
                <input id="fbp-name" value={name} disabled={anonymous} onChange={(e) => setName(e.target.value)} className="border border-navy/20 dark:border-dark-line bg-bg dark:bg-dark-surface px-3.5 py-3 text-[15px] text-navy dark:text-dark-ink disabled:opacity-45" style={{ borderColor: errors.name ? "#B4472F" : undefined }} />
                {errors.name && <div className="text-xs text-red">{errors.name}</div>}
              </div>
              <div className="grid gap-2">
                <label htmlFor="fbp-country" className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Country")}</label>
                <input id="fbp-country" value={country} onChange={(e) => setCountry(e.target.value)} className="border border-navy/20 dark:border-dark-line bg-bg dark:bg-dark-surface px-3.5 py-3 text-[15px] text-navy dark:text-dark-ink" />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="fbp-email" className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Email")}</label>
              <input id="fbp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-navy/20 dark:border-dark-line bg-bg dark:bg-dark-surface px-3.5 py-3 text-[15px] text-navy dark:text-dark-ink" style={{ borderColor: errors.email ? "#B4472F" : undefined }} />
              {errors.email && <div className="text-xs text-red">{errors.email}</div>}
            </div>

            <div className="grid gap-2">
              <label htmlFor="fbp-msg" className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Message")}</label>
              <textarea id="fbp-msg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="resize-y border border-navy/20 dark:border-dark-line bg-bg dark:bg-dark-surface px-3.5 py-3 text-[15px] text-navy dark:text-dark-ink" style={{ borderColor: errors.message ? "#B4472F" : undefined }} />
              {errors.message && <div className="text-xs text-red">{errors.message}</div>}
            </div>

            <div className="grid gap-2">
              <label htmlFor="fbp-sugg" className="text-[11.5px] tracking-[.14em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Suggestions for the city")}</label>
              <textarea id="fbp-sugg" rows={3} value={suggestions} onChange={(e) => setSuggestions(e.target.value)} className="resize-y border border-navy/20 dark:border-dark-line bg-bg dark:bg-dark-surface px-3.5 py-3 text-[15px] text-navy dark:text-dark-ink" />
            </div>

            <label className={`${chipClass(anonymous)} justify-self-start`}>
              <input type="checkbox" checked={anonymous} onChange={(e) => { setAnonymous(e.target.checked); if (e.target.checked) setName(""); }} className="h-[15px] w-[15px] accent-gold" />
              {t("Submit anonymously")}
            </label>

            <div className="flex flex-wrap items-center gap-5">
              <button type="submit" className="cursor-pointer border border-navy bg-navy dark:bg-dark-navy px-6.5 py-4 text-sm font-medium text-bg transition-colors hover:border-gold hover:bg-gold hover:text-navy">{t("Submit feedback")}</button>
              {status && <div className="min-h-[18px] text-[13.5px]" style={{ color: status.error ? "#B4472F" : "#00A8A8" }}>{status.text}</div>}
            </div>
          </form>

          <div className="grid content-start gap-6.5">
            <div className="border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 p-7.5">
              <div className="font-mono mb-3.5 text-[10.5px] tracking-[.18em] text-gold uppercase">{t("How feedback is used")}</div>
              <p className="m-0 mb-3.5 text-[14.5px] leading-[1.75] text-slate dark:text-dark-ink-dim">{t("Every submission is read by the International Relations & Communications Department. Feedback that concerns another deputy department is forwarded for action.")}</p>
              <div className="grid gap-2.5 border-gold pl-4.5 text-sm text-slate dark:text-dark-ink-dim border-l-2 rtl:border-l-0 rtl:border-r-2 rtl:pr-4.5 rtl:pl-0">
                <div>{t("Service quality reports for the deputy departments")}</div>
                <div>{t("Improvements to visitor information and signage")}</div>
                <div>{t("Planning of hospitality and cultural programmes")}</div>
              </div>
            </div>
            <div className="border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 p-7.5">
              <div className="font-mono mb-3.5 text-[10.5px] tracking-[.18em] text-gold uppercase">{t("Structured surveys")}</div>
              <p className="m-0 mb-4 text-[14.5px] leading-[1.75] text-slate dark:text-dark-ink-dim">{t("Periodic surveys for delegations and international guests, issued by the department after official visits.")}</p>
              <Link href="/contact" className="text-[13px] font-semibold">{t("Request a survey →")}</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pt-10 pb-24">
        <h2 className="m-0 mb-3 font-serif font-medium" style={{ fontSize: "clamp(26px, 2.6vw, 36px)" }}>{t("Testimonials")}</h2>
        <p className="m-0 mb-7.5 max-w-[660px] text-[15.5px] leading-[1.7] text-gray dark:text-dark-ink-dimmer">{t("Published with the author's permission. Entries appear here once submitted and approved by the department.")}</p>
        <div className="grid gap-6.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
          {TESTIMONIALS.map((ts) => (
            <blockquote key={ts.quote} className="m-0 border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 p-8.5">
              <p className="m-0 mb-5.5 font-serif text-lg leading-[1.6] text-pretty">&ldquo;{t(ts.quote)}&rdquo;</p>
              <footer className="text-[13px] leading-[1.6] text-gray dark:text-dark-ink-dimmer">{t(ts.meta)}<br />{t("[Country]")}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  );
}
