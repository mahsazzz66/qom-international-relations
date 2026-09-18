import type { ContentItem } from "./types";
import type { InvestmentItem, NewsItem } from "@/lib/data";

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

// Adapts an admin-entered investment opportunity (content_items, type
// "investment") to the InvestmentItem shape the existing investment list,
// card and detail components already render. A handful of display-only
// fields the admin form doesn't collect yet (participation type, exact
// coordinates) fall back to sensible defaults rather than blocking on them.
export function contentItemToInvestmentItem(item: ContentItem, locale: "en" | "ar"): InvestmentItem {
  const pick = (en: string, ar: string) => (locale === "ar" ? ar || en : en || ar);
  const dateSource = item.event_date ? new Date(item.event_date) : new Date(item.created_at);
  const start = { d: dateSource.getDate(), m: dateSource.getMonth() + 1, y: dateSource.getFullYear() };
  const endSource = item.end_date ? new Date(item.end_date) : null;
  const end = endSource
    ? { d: endSource.getDate(), m: endSource.getMonth() + 1, y: endSource.getFullYear() }
    : { ...start, y: start.y + 2 };

  return {
    id: item.id,
    ref: "QOM-INV-" + item.id.slice(0, 8).toUpperCase(),
    cat: item.category,
    base: item.category,
    district: item.location || "",
    title: pick(item.title_en, item.title_ar) || "(untitled)",
    summary: pick(item.excerpt_en, item.excerpt_ar) || pick(item.body_en, item.body_ar),
    status: item.status || "Open for participation",
    type: item.investment_type || "Participation agreement",
    start,
    end,
    lat: item.lat || "34.6416",
    lng: item.lng || "50.8746",
    order: 2000,
  };
}
