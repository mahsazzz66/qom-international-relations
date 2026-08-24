"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import VideoCard from "@/components/VideoCard";
import Reveal from "@/components/Reveal";

const TABS = ["photo", "video", "docs", "press"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  photo: "Photo Gallery",
  video: "Video Gallery",
  docs: "Publications & Reports",
  press: "Press Kit",
};

const PHOTOS = ["photo — delegation visit", "photo — signing ceremony", "photo — working group session", "photo — cultural programme"];

const VIDEOS = ["[Video title — city film]", "[Video title — working group session]", "[Video title — cultural week]"];

const DOCS = [
  { cat: "Official publication", title: "[Publication title]", desc: "Official document issued by the International Relations Department." },
  { cat: "International report", title: "[Report title]", desc: "Report on international cooperation activity." },
  { cat: "Annual report", title: "[Annual report title]", desc: "Yearly account of the department's international work." },
  { cat: "Brochure", title: "[Brochure title]", desc: "Introductory brochure for international partners and guests." },
];

const PRESS = [
  { cat: "Press kit", title: "Logos & visual identity", desc: "Official municipal marks and usage guidance for accredited media.", href: "/media", label: "Download →" },
  { cat: "Press kit", title: "Fact sheet", desc: "Verified municipal information for journalists and international media.", href: "/media", label: "Download →" },
  { cat: "Media enquiries", title: "Accreditation & interviews", desc: "Requests from international press are handled by the department.", href: "/contact", label: "Press office →" },
];

export function HomeMediaTabs({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const { t } = useLocale();
  return (
    <div data-media-tabs className="flex flex-wrap gap-2">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          data-on={active === tab ? "1" : undefined}
          className={`cursor-pointer border px-[15px] py-[9px] text-[12.5px] transition-colors${
            active === tab ? "" : " border-navy/20 dark:border-dark-line text-slate dark:text-dark-ink-dim"
          }`}
          style={
            active === tab
              ? { borderColor: "#0B1F3A", background: "#0B1F3A", color: "#FAF8F4" }
              : { background: "transparent" }
          }
        >
          {t(TAB_LABELS[tab])}
        </button>
      ))}
    </div>
  );
}

export default function HomeMedia() {
  const { t } = useLocale();
  const [tab, setTab] = useState<Tab>("photo");

  return (
    <>
      <Reveal className="mb-8.5 flex flex-wrap items-end justify-between gap-7">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-7 bg-gold" />
            <span className="font-mono text-[11px] tracking-[.2em] text-gray dark:text-dark-ink-dimmer uppercase">{t("Official archive")}</span>
          </div>
          <h2 className="m-0 font-serif font-medium" style={{ fontSize: "clamp(30px, 3.2vw, 44px)", lineHeight: 1.15, letterSpacing: "-.015em" }}>
            {t("Media & Publications")}
          </h2>
        </div>
        <HomeMediaTabs active={tab} onChange={setTab} />
      </Reveal>

      <div className="gap-5" style={{ display: tab === "photo" ? "grid" : "none", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {PHOTOS.map((p) => (
            <div key={p} className="grid aspect-[4/3] place-items-center bg-navy dark:bg-dark-navy p-3.5 text-center" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
              <span className="font-mono text-[10px] tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase">{t(p)}</span>
            </div>
          ))}
      </div>

      <div className="gap-5" style={{ display: tab === "video" ? "grid" : "none", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {VIDEOS.map((v) => (
            <VideoCard key={v} title={v} />
          ))}
      </div>

      <div className="gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill" style={{ display: tab === "docs" ? "grid" : "none", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {DOCS.map((d) => (
            <div key={d.title} className="bg-white dark:bg-dark-surface-2 p-7">
              <div className="mb-3 text-[11.5px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{t(d.cat)}</div>
              <h3 className="m-0 mb-2.5 font-serif text-[19px] font-medium">{t(d.title)}</h3>
              <p className="m-0 mb-4 text-sm leading-[1.65] text-slate dark:text-dark-ink-dim">{t(d.desc)}</p>
              <Link href="/media" className="text-[13px] font-semibold">{t("Download PDF →")}</Link>
            </div>
          ))}
      </div>

      <div className="gap-5" style={{ display: tab === "press" ? "grid" : "none", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {PRESS.map((p) => (
            <div key={p.title} className="border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2 p-7">
              <div className="mb-3 text-[11.5px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{t(p.cat)}</div>
              <h3 className="m-0 mb-2.5 font-serif text-[19px] font-medium">{t(p.title)}</h3>
              <p className="m-0 mb-4 text-sm leading-[1.65] text-slate dark:text-dark-ink-dim">{t(p.desc)}</p>
              <Link href={p.href} className="text-[13px] font-semibold">{t(p.label)}</Link>
            </div>
          ))}
      </div>
    </>
  );
}
