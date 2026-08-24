"use client";

import Link from "next/link";
import PageHero from "@/components/PageHero";
import VideoCard from "@/components/VideoCard";
import { useLocale } from "@/lib/i18n";

const PHOTOS = ["photo — delegation visit", "photo — signing ceremony", "photo — working group session", "photo — cultural programme", "photo — conference hall", "photo — city & shrine"];

const VIDEOS = ["[Video title — city film]", "[Video title — working group session]", "[Video title — cultural week]"];

const DOCS = [
  { cat: "Official publication", title: "[Publication title]", body: "Official document issued by the department." },
  { cat: "International report", title: "[Report title]", body: "Report on international cooperation activity." },
  { cat: "Annual report", title: "[Annual report title]", body: "Yearly account of the department's international work." },
  { cat: "Brochure", title: "[Brochure title]", body: "Introductory brochure for partners and guests." },
  { cat: "Press Kit", title: "Logos & visual identity", body: "Official marks and usage guidance for accredited media." },
  { cat: "Press Kit", title: "Fact sheet", body: "Verified municipal information for journalists." },
];

export default function MediaPage() {
  const { t } = useLocale();
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
        <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.3vw, 32px)" }}>{t("Photo Gallery")}</h2>
        <div className="mb-15.5 grid gap-4.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {PHOTOS.map((p) => (
            <div key={p} className="grid aspect-[4/3] place-items-center bg-navy dark:bg-dark-navy p-3.5 text-center" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)" }}>
              <span className="font-mono text-[10px] tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase">{t(p)}</span>
            </div>
          ))}
        </div>

        <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.3vw, 32px)" }}>{t("Video Gallery")}</h2>
        <div className="mb-15.5 grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {VIDEOS.map((v) => <VideoCard key={v} title={v} />)}
        </div>

        <h2 className="m-0 mb-6 font-serif font-medium" style={{ fontSize: "clamp(24px, 2.3vw, 32px)" }}>{t("Publications, Reports & Downloads")}</h2>
        <div className="grid gap-px bg-navy/[.12] dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))" }}>
          {DOCS.map((d) => (
            <div key={d.title} className="bg-white dark:bg-dark-surface-2 p-7">
              <div className="mb-3 text-[11.5px] tracking-[.14em] text-teal dark:text-dark-teal uppercase">{t(d.cat)}</div>
              <h3 className="m-0 mb-2.5 font-serif text-lg font-medium">{t(d.title)}</h3>
              <p className="m-0 mb-3.5 text-[13.5px] leading-[1.65] text-slate dark:text-dark-ink-dim">{t(d.body)}</p>
              <Link href="/media" className="text-[13px] font-semibold">{t(d.cat === "Press Kit" ? "Download →" : "Download PDF →")}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
