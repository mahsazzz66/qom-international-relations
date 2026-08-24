"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n";

/**
 * Ports `initVideoPreviews`: on hover (pointer devices) the placeholder
 * thumbnail zooms slightly to imply a live preview; on touch devices the
 * card is tapped to toggle the same state. No real video source is wired
 * up (this is a design placeholder in the source too), so this reproduces
 * the visual behaviour without a <video> element.
 */
export default function VideoCard({ title, desc, caption, thumbLabel, hintPosition = "physical", variant = "card" }: { title?: string; desc?: string; caption?: string; thumbLabel?: string; hintPosition?: "physical" | "logical"; variant?: "card" | "figure" }) {
  const { t } = useLocale();
  const [active, setActive] = useState(false);
  // The source's markup ships the hover hint and `initVideoPreviews` rewrites
  // it to the tap hint only after mount, once it has queried the media list.
  // Reading matchMedia during render would desync the server and client HTML.
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  const handlers = canHover
    ? { onMouseEnter: () => setActive(true), onMouseLeave: () => setActive(false) }
    : { onClick: () => setActive((v) => !v) };

  const Wrapper = variant === "figure" ? "figure" : "article";

  return (
    <Wrapper className={variant === "figure" ? "m-0 border border-bg/[.16] bg-bg/[.04]" : "border border-navy/[.12] dark:border-dark-line bg-white dark:bg-dark-surface-2"}>
      <div {...handlers} className="relative aspect-video cursor-pointer overflow-hidden bg-navy dark:bg-dark-navy">
        <div
          className="absolute inset-0 grid place-items-center transition-transform duration-[3500ms] ease-out"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)", transform: active ? "scale(1.06)" : "none" }}
        >
          <span className={`font-mono ${variant === "figure" ? "text-[9.5px]" : "text-[10px]"} tracking-[.14em] text-[rgba(250,248,244,.42)] uppercase`}>{t(thumbLabel || "video thumbnail")}</span>
        </div>
        <span
          className={
            variant === "figure"
              ? `font-mono absolute bottom-3 ${hintPosition === "logical" ? "start-3" : "left-3.5"} text-[9.5px] tracking-[.12em] text-bg/[.65] uppercase transition-opacity`
              : `font-mono absolute bottom-3 ${hintPosition === "logical" ? "start-3.5" : "left-3.5"} bg-[rgba(11,31,58,.7)] dark:bg-dark-fill px-2 py-[5px] text-[9.5px] tracking-[.14em] text-gold uppercase transition-opacity`
          }
          style={{ opacity: active ? 0 : 1 }}
        >
          {canHover ? t("Hover to preview · muted") : t("Tap to preview · muted")}
        </span>
      </div>
      {variant === "figure" ? (
        <figcaption className="px-4.5 py-4 text-[13.5px] leading-[1.6] text-[rgba(250,248,244,.72)]">{t(caption || title || "")}</figcaption>
      ) : (
        <div className="p-[22px]">
          <h3 className="m-0 mb-1.5 font-serif text-lg font-medium">{t(title || "")}</h3>
          <p className="m-0 text-[13.5px] leading-[1.6] text-slate dark:text-dark-ink-dim">{t(desc || caption || "Preview plays silently on hover; on touch devices, tap to preview.")}</p>
        </div>
      )}
    </Wrapper>
  );
}
