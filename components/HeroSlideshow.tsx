"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n";

interface Slide {
  labelKey: string;
  titleKey: string;
  descKey: string;
  primary: { href: string; key: string };
  secondary: { href: string; key: string };
}

const SLIDES: Slide[] = [
  {
    labelKey: "image placeholder — aerial view of qom & holy shrine",
    titleKey: "Connecting Qom to the World",
    descKey: "Advancing international municipal cooperation, urban diplomacy and global partnerships from the heart of Qom.",
    primary: { href: "/cooperation", key: "Explore International Activities" },
    secondary: { href: "/contact", key: "Contact Us" },
  },
  {
    labelKey: "image placeholder — pilgrims at the holy shrine of qom",
    titleKey: "Qom — A Global Pilgrimage City",
    descKey: "Strengthening cooperation among pilgrimage cities and creating new platforms for international dialogue.",
    primary: { href: "#pcwg", key: "Explore Pilgrimage Cities" },
    secondary: { href: "/memberships", key: "Memberships & Networks" },
  },
  {
    labelKey: "image placeholder — municipal delegation meeting",
    titleKey: "Building International Municipal Partnerships",
    descKey: "Connecting municipalities, institutions and cities through dialogue, cooperation and knowledge exchange.",
    primary: { href: "/cooperation", key: "International Cooperation" },
    secondary: { href: "/departments", key: "Deputy Departments" },
  },
  {
    labelKey: "image placeholder — urban development in qom",
    titleKey: "International Opportunities in Qom",
    descKey: "Discover opportunities for cooperation, investment and urban development.",
    primary: { href: "#investment", key: "Explore Opportunities" },
    secondary: { href: "/contact", key: "Contact the Office" },
  },
  {
    labelKey: "image placeholder — international conference hosted in qom",
    titleKey: "International Events & Dialogues",
    descKey: "Discover conferences, meetings, festivals and international programs connected to Qom.",
    primary: { href: "/events", key: "View Events" },
    secondary: { href: "/culture", key: "Cultural Weeks" },
  },
];

export default function HeroSlideshow() {
  const { t } = useLocale();
  const [slide, setSlide] = useState(0);
  // The source never clears the outgoing slide's `style.animation`, so every
  // slide that has been shown keeps carrying qomKen/qomReveal; `run` restarts
  // them on the slide that has just become active.
  const [run, setRun] = useState(0);
  // slide index -> the run it was last activated on; a slide that is not in the
  // map has never been shown and carries no animation yet.
  const activationRef = useRef<Record<number, number>>({ 0: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = SLIDES.length;
  activationRef.current[slide] = run;

  const restart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => { setSlide((s) => (s + 1) % count); setRun((r) => r + 1); }, 7000);
  };

  useEffect(() => {
    restart();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (n: number) => {
    setSlide(((n % count) + count) % count);
    setRun((r) => r + 1);
    restart();
  };

  return (
    <section
      className="relative overflow-hidden bg-navy dark:bg-dark-navy"
      style={{ height: "min(70vh, 660px)", minHeight: 490 }}
      onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
      onMouseLeave={restart}
    >
      {SLIDES.map((s, i) => {
        const active = i === slide;
        const activation = activationRef.current[i];
        const shown = activation !== undefined;
        return (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(.25,.1,.25,1)]"
            style={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none" }}
          >
            <div
              key={`ken-${i}-${activation ?? 0}`}
              className="absolute inset-0"
              style={{
                backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.14) 0 2px, transparent 2px 11px)",
                ...(shown ? { animation: "qomKen 9s ease-out forwards", transformOrigin: "center" } : null),
              }}
            >
              <span className="font-mono absolute top-[22px] max-w-[40%] text-right text-[10.5px] tracking-[.16em] text-[rgba(250,248,244,.34)] uppercase right-6">
                {t(s.labelKey)}
              </span>
            </div>
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, rgba(11,31,58,.94) 0%, rgba(11,31,58,.80) 48%, rgba(11,31,58,.30) 100%)" }}
            />
            <div
              key={`body-${i}-${activation ?? 0}`}
              className="relative flex h-full max-w-[1280px] flex-col justify-center px-6 pb-[74px] mx-auto"
              style={shown ? { animation: "qomReveal .9s cubic-bezier(.22,.61,.36,1) both" } : undefined}
            >
              {(() => {
                const Heading = i === 0 ? "h1" : "h2";
                return (
                  <Heading
                    className="m-0 mb-[18px] font-serif font-medium text-bg text-pretty"
                    style={{ fontSize: "clamp(33px, 4.4vw, 58px)", lineHeight: 1.07, letterSpacing: "-.015em", maxWidth: i === 2 ? 860 : 800 }}
                  >
                    {t(s.titleKey)}
                  </Heading>
                );
              })()}
              <p className="m-0 mb-7 max-w-[580px] text-[rgba(250,248,244,.80)] text-pretty" style={{ fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.6 }}>
                {t(s.descKey)}
              </p>
              <div className="flex flex-wrap gap-3.5">
                {s.primary.href.startsWith("#") ? (
                  <a href={s.primary.href} className="border border-gold bg-gold px-[27px] py-[15px] text-[13.5px] font-semibold text-navy transition-colors hover:bg-transparent hover:text-gold">
                    {t(s.primary.key)}
                  </a>
                ) : (
                  <Link href={s.primary.href} className="border border-gold bg-gold px-[27px] py-[15px] text-[13.5px] font-semibold text-navy transition-colors hover:bg-transparent hover:text-gold">
                    {t(s.primary.key)}
                  </Link>
                )}
                <Link href={s.secondary.href} className="border border-[rgba(250,248,244,.35)] px-[27px] py-[15px] text-[13.5px] font-medium text-bg transition-colors hover:border-bg hover:bg-[rgba(250,248,244,.08)]">
                  {t(s.secondary.key)}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-7 z-[6] flex gap-2.5 right-6">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(slide - 1)}
          className="h-12 w-12 border border-[rgba(250,248,244,.32)] bg-[rgba(11,31,58,.35)] dark:bg-dark-fill text-lg text-bg transition-colors hover:border-gold hover:bg-gold hover:text-navy"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(slide + 1)}
          className="h-12 w-12 border border-[rgba(250,248,244,.32)] bg-[rgba(11,31,58,.35)] dark:bg-dark-fill text-lg text-bg transition-colors hover:border-gold hover:bg-gold hover:text-navy"
        >
          →
        </button>
      </div>

      <div className="absolute bottom-[34px] z-[5] flex gap-2.5 left-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => go(i)}
            className="h-[3px] w-[34px] border-0 p-0"
            style={{ background: i === slide ? "#C8A75D" : "rgba(250,248,244,.35)" }}
          />
        ))}
      </div>
    </section>
  );
}
