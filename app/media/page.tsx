"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import { useLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import type { ContentItem } from "@/lib/supabase/types";

export default function MediaPage() {
  const { t, locale } = useLocale();
  const [items, setItems] = useState<ContentItem[] | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("content_items")
      .select("*")
      .in("type", ["photo", "video", "document"])
      .eq("published", true)
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as ContentItem[]) ?? []));
  }, []);

  const photos = items?.filter((i) => i.type === "photo") ?? [];
  const videos = items?.filter((i) => i.type === "video") ?? [];
  const docs = items?.filter((i) => i.type === "document") ?? [];

  const pick = (en: string, ar: string) => (locale === "ar" ? ar || en : en || ar);

  return (
    <div>
      <PageHero
        page="media"
        title={t("Media & Publications")}
        description={t("The official visual archive and downloadable resources of the International Relations & Communications Department.")}
        icon={
          <svg viewBox="0 0 200 140" width="100%" fill="none" stroke="#C8A75D" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
            <rect x="12" y="34" width="110" height="76" />
            <path d="M12 46h110M12 98h110" />
            <path d="M26 34v12M46 34v12M66 34v12M86 34v12M106 34v12M26 98v12M46 98v12M66 98v12M86 98v12M106 98v12" opacity=".5" />
            <path d="M58 60v24l22-12z" fill="#C8A75D" stroke="none" />
            <rect x="138" y="46" width="48" height="58" />
            <path d="M148 60h28M148 72h28M148 84h16" opacity=".6" />
          </svg>
        }
      />
      <div className="mx-auto max-w-[1280px] px-6 pt-18 pb-24">
        {items === null ? (
          <div className="py-16 text-center text-sm text-gray">{t("Loading…")}</div>
        ) : (
          <>
            <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.3vw, 32px)" }}>{t("Photo Gallery")}</h2>
            {photos.length === 0 ? (
              <p className="mb-15.5 text-sm text-gray">{t("No items have been published yet.")}</p>
            ) : (
              <div className="mb-15.5 grid gap-4.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
                {photos.map((p) => (
                  <div key={p.id} className="group relative aspect-[4/3] overflow-hidden bg-navy dark:bg-dark-navy">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt={pick(p.title_en, p.title_ar)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="grid h-full place-items-center p-3.5 text-center" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
                        <span className="font-mono text-[10px] tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase">{p.category}</span>
                      </div>
                    )}
                    {(p.title_en || p.title_ar) && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent px-3 pb-2.5 pt-6 text-[12.5px] text-white">
                        {pick(p.title_en, p.title_ar)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.3vw, 32px)" }}>{t("Video Gallery")}</h2>
            {videos.length === 0 ? (
              <p className="mb-15.5 text-sm text-gray">{t("No items have been published yet.")}</p>
            ) : (
              <div className="mb-15.5 grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {videos.map((v) => (
                  <a
                    key={v.id}
                    href={v.media_url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="block border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2"
                  >
                    <div className="relative grid aspect-video place-items-center bg-navy dark:bg-dark-navy" style={v.image_url ? { backgroundImage: `url(${v.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : { backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/90">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0B1F3A"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    </div>
                    <div className="p-[22px]">
                      <h3 className="m-0 mb-1.5 font-serif text-lg font-medium">{pick(v.title_en, v.title_ar)}</h3>
                      <p className="m-0 text-[13.5px] leading-[1.6] text-slate dark:text-dark-ink-dim">{pick(v.excerpt_en, v.excerpt_ar)}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.3vw, 32px)" }}>{t("Publications, Reports & Downloads")}</h2>
            {docs.length === 0 ? (
              <p className="text-sm text-gray">{t("No items have been published yet.")}</p>
            ) : (
              <div className="grid gap-px bg-navy/[.12] dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))" }}>
                {docs.map((d) => (
                  <div key={d.id} className="bg-white dark:bg-dark-surface-2 p-7">
                    <div className="mb-3 text-[11.5px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{d.category}</div>
                    <h3 className="m-0 mb-2.5 font-serif text-lg font-medium">{pick(d.title_en, d.title_ar)}</h3>
                    <p className="m-0 mb-3.5 text-[13.5px] leading-[1.65] text-slate dark:text-dark-ink-dim">{pick(d.excerpt_en, d.excerpt_ar)}</p>
                    {d.media_url && (
                      <a href={d.media_url} target="_blank" rel="noreferrer" className="text-[13px] font-semibold">
                        {t("Download PDF →")}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
