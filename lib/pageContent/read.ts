"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { withDefaults, type PageSchema, type BilingualText } from "./schema";

// Picks the display string for the current locale from a bilingual field,
// falling back to the other language, then to a hardcoded default (the
// page's original static copy) if the field was never filled in.
export function pickText(value: BilingualText | undefined | null, locale: "en" | "ar", fallback = ""): string {
  if (!value) return fallback;
  const primary = locale === "ar" ? value.ar : value.en;
  const secondary = locale === "ar" ? value.en : value.ar;
  return primary || secondary || fallback;
}

export function pickImage(value: string | null | undefined, fallback: string | null = null): string | null {
  return value || fallback;
}

// Client-side hook used by public pages to read a page's admin-edited
// content. Returns null while loading and an empty-but-defaulted object if
// the page was never edited, so callers can always index into it safely and
// fall back to their own hardcoded copy field by field via pickText/pickImage.
export function usePageContent(page: string, schema: PageSchema): Record<string, unknown> | null {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("page_content")
      .select("data")
      .eq("page", page)
      .maybeSingle()
      .then(({ data: row }) => {
        if (cancelled) return;
        setData(withDefaults(schema, (row?.data as Record<string, unknown>) ?? {}));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return data;
}
