"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n";

/**
 * Ports `initBackToTop` (source script 4276–4300) and its markup (2546–2548):
 * a fixed circular navy/gold button that fades in once the page has scrolled
 * past 300px and glides back to the top on its own easing curve — the source
 * drives the animation itself because `scrollTo({behavior})` is not honoured
 * in every host it runs in.
 */
export default function BackToTop() {
  const { t } = useLocale();
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(window.scrollY > 300);
    window.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => window.removeEventListener("scroll", sync);
  }, []);

  const glideToTop = () => {
    const from = window.scrollY || document.documentElement.scrollTop || 0;
    const dist = -from;
    if (Math.abs(dist) < 2) {
      window.scrollTo(0, 0);
      return;
    }
    const dur = Math.min(700, Math.max(260, Math.abs(dist) * 0.45));
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      window.scrollTo(0, from + dist * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <button
      type="button"
      data-top-btn
      aria-label={t("Back to top")}
      onClick={glideToTop}
      className="fixed bottom-6 end-6 z-150 grid h-[54px] w-[54px] cursor-pointer place-items-center rounded-full border border-gold/55 bg-navy text-gold shadow-[0_22px_46px_-22px_rgba(11,31,58,.7)] transition-[opacity,transform,background,color,border-color] hover:border-gold hover:bg-gold hover:text-navy dark:bg-dark-navy"
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0) scale(1)" : "translateY(16px) scale(.94)",
        pointerEvents: on ? "auto" : "none",
        transition:
          "opacity .45s cubic-bezier(.22,.61,.36,1), transform .45s cubic-bezier(.22,.61,.36,1), background .25s ease, color .25s ease, border-color .25s ease",
      }}
    >
      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V6" />
        <path d="m5 13 7-7 7 7" />
      </svg>
    </button>
  );
}
