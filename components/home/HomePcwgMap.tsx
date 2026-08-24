"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n";

type Pin = { city: string; kind: "chair" | "current" | "proposed"; left: number; top: number };

const PINS: Pin[] = [
  { city: "Qom", kind: "chair", left: 39.8, top: 25.9 },
  { city: "Mashhad, Iran", kind: "current", left: 53.2, top: 21.8 },
  { city: "Shiraz, Iran", kind: "current", left: 42.4, top: 38.5 },
  { city: "Ray, Iran", kind: "current", left: 40.7, top: 23.5 },
  { city: "Kashan, Iran", kind: "current", left: 41.4, top: 27.9 },
  { city: "Astaneh-ye Ashrafiyeh, Iran", kind: "current", left: 38.4, top: 19.4 },
  { city: "Shush, Iran", kind: "current", left: 35.8, top: 32 },
  { city: "Karbala, Iraq", kind: "current", left: 29.3, top: 31 },
  { city: "Najaf, Iraq", kind: "current", left: 29.8, top: 32.4 },
  { city: "Mecca, Saudi Arabia", kind: "current", left: 22.8, top: 59 },
  { city: "Medina, Saudi Arabia", kind: "current", left: 22.5, top: 51.3 },
  { city: "Damascus, Syria", kind: "current", left: 17.4, top: 28.7 },
  { city: "Tbilisi, Georgia", kind: "current", left: 30.4, top: 8.2 },
  { city: "Yerevan, Armenia", kind: "current", left: 30, top: 12.1 },
  { city: "Hebron, Palestine", kind: "current", left: 15.5, top: 33.7 },
  { city: "Antakya, Turkey", kind: "current", left: 17.2, top: 22 },
  { city: "Semnan (Bastam), Iran", kind: "proposed", left: 46.2, top: 21.3 },
  { city: "Khoy, Iran", kind: "proposed", left: 30.7, top: 16.1 },
  { city: "Kadhimiya, Iraq", kind: "proposed", left: 28.6, top: 29.1 },
  { city: "Samarra, Iraq", kind: "proposed", left: 29, top: 27 },
  { city: "Samarkand, Uzbekistan", kind: "proposed", left: 64.6, top: 13.4 },
  { city: "Bukhara, Uzbekistan", kind: "proposed", left: 60.6, top: 13.1 },
  { city: "Varanasi, India", kind: "proposed", left: 89.2, top: 49.2 },
  { city: "Ajmer, India", kind: "proposed", left: 76.4, top: 46.4 },
  { city: "Bodh Gaya, India", kind: "proposed", left: 92.3, top: 50.8 },
  { city: "Lahore, Pakistan", kind: "proposed", left: 75.9, top: 33.6 },
  { city: "Multan, Pakistan", kind: "proposed", left: 71.6, top: 37 },
  { city: "Konya, Turkey", kind: "proposed", left: 11.5, top: 17.8 },
  { city: "Şanlıurfa, Turkey", kind: "proposed", left: 21.2, top: 19.6 },
  { city: "Turkistan, Kazakhstan", kind: "proposed", left: 66.6, top: 5.5 },
  { city: "Lumbini, Nepal", kind: "proposed", left: 89.7, top: 43.8 },
];

const REGION_LABELS = [
  { label: "TURKEY", left: 16, top: 20 },
  { label: "CAUCASUS", left: 30, top: 5 },
  { label: "IRAQ", left: 27, top: 37 },
  { label: "IRAN", left: 44, top: 33 },
  { label: "ARABIAN PENINSULA", left: 18, top: 65 },
  { label: "CENTRAL ASIA", left: 60, top: 6 },
  { label: "SOUTH ASIA", left: 76, top: 58 },
];

export default function HomePcwgMap() {
  const { t } = useLocale();
  const [tip, setTip] = useState<Pin | null>(null);

  return (
    <div
      className="relative h-[420px] border border-bg/[.12]"
      style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.07) 0 1px, transparent 1px 14px), linear-gradient(180deg, rgba(0,168,168,.05), transparent)" }}
    >
      <span className="font-mono absolute bottom-2.5 left-3.5 text-[9.5px] tracking-[.14em] uppercase text-[rgba(250,248,244,.32)]">
        regional basemap placeholder — 25°E–90°E
      </span>
      {REGION_LABELS.map((r) => (
        <span key={r.label} className="font-mono absolute text-[9.5px] tracking-[.2em] text-[rgba(250,248,244,.26)]" style={{ left: `${r.left}%`, top: `${r.top}%` }}>
          {t(r.label)}
        </span>
      ))}

      {PINS.map((p) => (
        <div
          key={p.city}
          onMouseEnter={() => setTip(p)}
          onMouseLeave={() => setTip(null)}
          onClick={() => setTip(p)}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
        >
          {p.kind === "chair" ? (
            <>
              <span className="absolute -inset-[5px] rounded-full border border-gold" style={{ animation: "qomPulse 2.8s ease-out infinite" }} />
              <span className="block h-[13px] w-[13px] rounded-full bg-gold" style={tip?.city === p.city ? { boxShadow: "0 0 0 4px rgba(200,167,93,.25)" } : undefined} />
              <span className="absolute -top-[7px] left-[19px] text-[12.5px] font-semibold whitespace-nowrap text-gold">
                {t("Qom · President & Secretariat")}
              </span>
            </>
          ) : p.kind === "current" ? (
            <span className="block h-[9px] w-[9px] rounded-full bg-gold" style={tip?.city === p.city ? { boxShadow: "0 0 0 4px rgba(200,167,93,.25)" } : undefined} />
          ) : (
            <span className="block h-[9px] w-[9px] rounded-full border-[1.5px] border-teal" style={tip?.city === p.city ? { boxShadow: "0 0 0 4px rgba(200,167,93,.25)" } : undefined} />
          )}
        </div>
      ))}

      {tip && (
        <div
          className="pointer-events-none absolute bg-bg dark:bg-dark-surface px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-navy dark:text-dark-ink"
          style={{ left: `${tip.left}%`, top: `${tip.top}%`, transform: "translate(-50%, -160%)" }}
        >
          {tip.city}
          {tip.kind === "proposed" ? " — proposed" : tip.kind === "chair" ? "" : " — current member"}
        </div>
      )}
    </div>
  );
}
