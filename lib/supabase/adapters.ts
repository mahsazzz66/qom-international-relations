import type { ContentItem } from "./types";
import type { NewsItem } from "@/lib/data";

// Adapts a database content_items row to the shape the existing site
// components (NewsCard, MsgCard, ArchiveSection, ArticleView) already know
// how to render. Bilingual fields are resolved to a single string up front
// based on the current locale — the legacy `t()` translator is a no-op
// pass-through for strings it doesn't recognise, so this plain text renders
// as-is in either language.
export function contentItemToNewsItem(item: ContentItem, locale: "en" | "ar"): NewsItem {
  const pick = (en: string, ar: string) => (locale === "ar" ? ar || en : en || ar);
  const dateSource = item.event_date ? new Date(item.event_date) : new Date(item.created_at);
  const y = dateSource.getFullYear();
  const m = dateSource.getMonth() + 1;
  const d = dateSource.getDate();

  return {
    id: item.id,
    kind: item.type === "statement" ? "msg" : "news",
    cat: item.category,
    title: pick(item.title_en, item.title_ar) || "(untitled)",
    excerpt: pick(item.excerpt_en, item.excerpt_ar),
    y,
    m,
    d,
    stamp: y * 10000 + m * 100 + d,
  };
}
