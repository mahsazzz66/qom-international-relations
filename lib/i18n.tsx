"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LANGS, translate } from "./i18n-data";

export type Locale = "en" | "ar";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (s: string) => string;
  dir: "ltr" | "rtl";
  fontFamily: string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "qom-lang";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    // One-time hydration from localStorage on mount (mirrors the source's
    // own client-only language persistence) — not a state-sync loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "ar" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    // Mirrors the source behaviour exactly: the document keeps LTR direction
    // (so the browser scrollbar stays on the right in Arabic), only the
    // app root element flips to RTL and swaps its font stack.
    const html = document.documentElement;
    html.lang = locale;
    html.dir = "ltr";
    // Note: the actual RTL flip target is the wrapper div rendered below
    // (`[data-rtl-root]`), not <body> — this mirrors the source, which flips
    // `dir`/`direction` on an inner root element (`div[data-qom="2"]`, script
    // lines 2751-2753/2767) rather than on <body> itself. <body> never
    // receives a `dir` attribute, matching source.
  }, [locale]);

  const t = useCallback((s: string) => translate(s, locale) || s, [locale]);

  const cfg = LANGS[locale];
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      dir: locale === "ar" ? "rtl" : "ltr",
      fontFamily: cfg ? cfg.font : "'IBM Plex Sans', system-ui, sans-serif",
    }),
    [locale, setLocale, t, cfg]
  );

  return (
    <LocaleContext.Provider value={value}>
      {/* This wrapper is the RTL flip target — it plays the role of the
          source's inner root (`div[data-qom="2"]`), which is body's only
          meaningful child and the element whose `dir`/`direction` the
          source's runtime actually flips (script lines 2751-2753/2767).
          <body> itself never carries a `dir` attribute, matching source. */}
      <div dir={locale === "ar" ? "rtl" : "ltr"} data-rtl-root>
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
