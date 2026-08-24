"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n";

export type NetworkNode = { name: string; country: string; status: string; note: string; cx: number; cy: number; current: boolean };
type Node = NetworkNode;

/** Shared with the hero constellation, which draws the same geometry. */
export const NETWORK_NODES: Node[] = [
  { name: "Mashhad", country: "Iran", status: "Current member", note: "Shrine city of Imam Reza and the largest pilgrimage destination in Iran.", cx: 920, cy: 350, current: true },
  { name: "Shiraz", country: "Iran", status: "Current member", note: "Shrine city of Shah Cheragh and a centre of Persian cultural heritage.", cx: 826, cy: 231, current: true },
  { name: "Karbala", country: "Iraq", status: "Current member", note: "Host city of the Arbaeen pilgrimage, among the largest annual gatherings in the world.", cx: 600, cy: 182, current: true },
  { name: "Najaf", country: "Iraq", status: "Current member", note: "Shrine city of Imam Ali and a historic seat of religious scholarship.", cx: 374, cy: 231, current: true },
  { name: "Mecca", country: "Saudi Arabia", status: "Current member", note: "Destination of the Hajj, performed annually by Muslims from every continent.", cx: 280, cy: 350, current: true },
  { name: "Medina", country: "Saudi Arabia", status: "Current member", note: "City of the Prophet Mosque and a principal station for pilgrims.", cx: 374, cy: 469, current: true },
  { name: "Damascus", country: "Syria", status: "Current member", note: "Home to the shrine of Sayyidah Ruqayyah and centuries of pilgrimage heritage.", cx: 600, cy: 518, current: true },
  { name: "Hebron", country: "Palestine", status: "Current member", note: "City of the Sanctuary of Abraham, venerated across the Abrahamic traditions.", cx: 826, cy: 469, current: true },
  { name: "Samarra", country: "Iraq", status: "Proposed city", note: "Shrine city of the Askari sanctuary; candidacy under discussion.", cx: 1064, cy: 245, current: false },
  { name: "Samarkand", country: "Uzbekistan", status: "Proposed city", note: "Historic centre of Islamic scholarship and monumental heritage.", cx: 787, cy: 90, current: false },
  { name: "Bukhara", country: "Uzbekistan", status: "Proposed city", note: "City of shrines, madrasas and long-standing pilgrimage routes.", cx: 413, cy: 90, current: false },
  { name: "Konya", country: "Turkey", status: "Proposed city", note: "Resting place of Rumi and a destination of cultural pilgrimage.", cx: 136, cy: 245, current: false },
  { name: "Sanliurfa", country: "Turkey", status: "Proposed city", note: "Ancient city associated with the prophet Abraham.", cx: 136, cy: 455, current: false },
  { name: "Varanasi", country: "India", status: "Proposed city", note: "One of the oldest continuously inhabited pilgrimage cities in the world.", cx: 413, cy: 610, current: false },
  { name: "Lahore", country: "Pakistan", status: "Proposed city", note: "City of Sufi shrines and major seasonal pilgrimage gatherings.", cx: 787, cy: 610, current: false },
  { name: "Turkistan", country: "Kazakhstan", status: "Proposed city", note: "Site of the mausoleum of Khoja Ahmed Yasawi.", cx: 1064, cy: 455, current: false },
];

const QOM: Node = { name: "Qom", country: "Islamic Republic of Iran", status: "President · Permanent Secretariat", note: "Qom Municipality presides over the Working Group and hosts its permanent secretariat, coordinating sessions, membership and joint programmes.", cx: 600, cy: 350, current: true };

/**
 * Source line 1596: the gold "member" lines run 11s–18s and the teal
 * "proposed" lines run 16s–23s, so the two families overlap in that band.
 */
function flowDuration(n: Node) {
  const family = NETWORK_NODES.filter((x) => x.current === n.current);
  return (n.current ? 11 : 16) + family.indexOf(n);
}

export default function PcwgNetwork() {
  const { t } = useLocale();
  const [active, setActive] = useState<Node>(QOM);

  return (
    <div>
      <div className="mx-auto mb-14 max-w-[1040px] px-3">
        <svg viewBox="0 0 1200 700" width="100%" style={{ display: "block", overflow: "visible" }}>
          {NETWORK_NODES.map((n) => (
            <line
              key={"line-" + n.name}
              x1={600} y1={350} x2={n.cx} y2={n.cy}
              stroke={n.current ? "#C8A75D" : "#00A8A8"}
              strokeWidth={n.current ? 1.2 : 1}
              strokeOpacity={n.current ? 0.55 : 0.28}
              strokeDasharray={n.current ? "7 9" : "3 10"}
              style={{ animation: `qomFlow ${flowDuration(n)}s linear infinite` }}
            />
          ))}
          <circle cx={600} cy={350} r={74} fill="#C8A75D" fillOpacity={0.07} style={{ animation: "qomGlow 5s ease-in-out infinite" }} />
          <circle cx={600} cy={350} r={46} fill="#C8A75D" fillOpacity={0.13} />
          <g style={{ cursor: "pointer" }} onMouseEnter={() => setActive(QOM)} onClick={() => setActive(QOM)}>
            <circle cx={600} cy={350} r={21} fill="#C8A75D" />
            <text x={600} y={357} textAnchor="middle" fill="#0B1F3A" fontSize={16} fontWeight={600} fontFamily="IBM Plex Sans, sans-serif">{t("QOM")}</text>
            <text x={600} y={424} textAnchor="middle" fill="#C8A75D" fontSize={13} letterSpacing={3} fontFamily="IBM Plex Mono, monospace">{t("PRESIDENT")}</text>
          </g>
          {NETWORK_NODES.map((n) => (
            <g
              key={n.name}
              style={{ cursor: "pointer", opacity: active.name === n.name || active.name === "Qom" ? 1 : 0.4, transition: "opacity .3s ease" }}
              onMouseEnter={() => setActive(n)}
              onMouseLeave={() => setActive(QOM)}
              onClick={() => setActive(n)}
            >
              {n.current ? (
                <>
                  <circle cx={n.cx} cy={n.cy} r={20} fill="#C8A75D" fillOpacity={0.1} />
                  <circle cx={n.cx} cy={n.cy} r={7.5} fill="#C8A75D" />
                </>
              ) : (
                <>
                  <circle cx={n.cx} cy={n.cy} r={14} fill="#00A8A8" fillOpacity={0.08} />
                  <circle cx={n.cx} cy={n.cy} r={5.5} fill="none" stroke="#00A8A8" strokeWidth={1.4} strokeDasharray="2 2" />
                </>
              )}
              <text
                x={n.cx > 600 ? n.cx + (n.current ? 20 : 16) : n.cx < 600 ? n.cx - (n.current ? 20 : 16) : n.cx}
                y={n.cy < 350 ? n.cy - (n.current ? 15 : 10) : n.cy > 350 ? n.cy + (n.current ? 22 : 18) : n.cy + 5}
                textAnchor={n.cx > 600 ? "start" : n.cx < 600 ? "end" : "middle"}
                fill={n.current ? "rgba(250,248,244,.88)" : "rgba(250,248,244,.58)"}
                fontSize={n.current ? 17 : 14.5}
                fontFamily="IBM Plex Sans, sans-serif"
              >
                {t(n.name)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid gap-px bg-bg/[.16]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div className="grid content-start gap-2.5 bg-gold/10 p-7.5">
          <div className="font-mono text-[10.5px] tracking-[.18em] text-gold uppercase">{t(active.status)}</div>
          <div className="font-serif text-[27px] text-bg">{t(active.name)}</div>
          <div className="text-[13px] text-[rgba(250,248,244,.6)]">{t(active.country)}</div>
          <p className="m-0 mt-1.5 text-sm leading-[1.7] text-[rgba(250,248,244,.78)] text-pretty">{t(active.note)}</p>
        </div>
        <div className="bg-bg/[.04] p-7.5">
          <div className="font-mono mb-4.5 text-[10.5px] tracking-[.18em] text-gold uppercase">{t("Legend")}</div>
          <div className="grid gap-3.5 text-[13.5px] text-[rgba(250,248,244,.78)]">
            <div className="flex items-center gap-2.5"><span className="h-3.5 w-3.5 shrink-0 rounded-full bg-gold" />{t("Current member")}</div>
            <div className="flex items-center gap-2.5"><span className="h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-dashed border-teal" />{t("Proposed city")}</div>
            <div className="flex items-center gap-2.5"><span className="h-3.5 w-3.5 shrink-0 rounded-full bg-gold" style={{ boxShadow: "0 0 0 5px rgba(200,167,93,.2)" }} />{t("Qom — President")}</div>
          </div>
        </div>
        <div className="bg-bg/[.04] p-7.5">
          <div className="font-mono mb-4.5 text-[10.5px] tracking-[.18em] text-gold uppercase">{t("Members by country")}</div>
          <div className="grid gap-3.5 text-[13.5px] leading-[1.75] text-[rgba(250,248,244,.78)]">
            <div><span className="text-gold">{t("Iran")}</span><br />{t("Qom · Mashhad · Shiraz · Ray · Kashan · Astaneh-ye Ashrafiyeh · Shush")}</div>
            <div><span className="text-gold">{t("Iraq")}</span><br />{t("Karbala · Najaf")}</div>
            <div><span className="text-gold">{t("Saudi Arabia")}</span><br />{t("Mecca · Medina")}</div>
            <div><span className="text-gold">{t("Levant, Caucasus & Turkey")}</span><br />{t("Damascus · Hebron · Tbilisi · Yerevan · Antakya")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
