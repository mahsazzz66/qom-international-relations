import React from "react";
import Breadcrumbs from "./Breadcrumbs";

/**
 * Shared dark hero header used at the top of every sub-page: diagonal dot-grid
 * background (masked to fade toward the bottom), an optional decorative motif
 * on the inline-end side, breadcrumbs, eyebrow, title and lede.
 */
export default function PageHero({
  page,
  eyebrow,
  title,
  description,
  icon,
  actions,
  wide = false,
  ledeWidth = 640,
}: {
  page: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  wide?: boolean;
  /** Source lede width: 640px on most pages, 660px on /departments and /investment. */
  ledeWidth?: number;
}) {
  return (
    <div className="relative overflow-hidden bg-navy dark:bg-dark-navy">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(200,167,93,.055) 25%, transparent 25% 75%, rgba(200,167,93,.055) 75%), linear-gradient(-45deg, rgba(200,167,93,.055) 25%, transparent 25% 75%, rgba(200,167,93,.055) 75%), radial-gradient(circle, rgba(200,167,93,.16) 0 1.1px, transparent 1.7px)",
          backgroundSize: "78px 78px, 78px 78px, 39px 39px",
          backgroundPosition: "center",
          WebkitMaskImage: "linear-gradient(170deg, rgba(0,0,0,.95), rgba(0,0,0,.18))",
          maskImage: "linear-gradient(170deg, rgba(0,0,0,.95), rgba(0,0,0,.18))",
        }}
      />
      {icon && (
        <div aria-hidden className="pointer-events-none absolute top-1/2 w-[min(23%,300px)] -translate-y-1/2 opacity-45 end-[1%]">
          {icon}
        </div>
      )}
      <div className="relative mx-auto max-w-[1280px] px-6 py-[84px] pb-[76px]">
        <Breadcrumbs page={page} />
        {eyebrow && (
          <div className="font-mono mb-4 flex items-center gap-3 text-[11px] tracking-[.2em] text-gold uppercase">
            <span className="h-px w-7 bg-gold" />
            {eyebrow}
          </div>
        )}
        <h1
          className="m-0 mb-5 font-serif font-medium text-bg"
          style={{ fontSize: "clamp(34px, 4.4vw, 58px)", lineHeight: 1.08, letterSpacing: "-.015em", maxWidth: wide ? 900 : 860 }}
        >
          {title}
        </h1>
        {description && (
          <p className="m-0 text-[17px] leading-[1.7] text-[rgba(250,248,244,.78)]" style={{ maxWidth: ledeWidth }}>{description}</p>
        )}
        {actions && <div className="mt-7 flex flex-wrap gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}
