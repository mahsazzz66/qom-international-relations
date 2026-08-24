"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { PAGES } from "@/lib/pages-meta";

export default function Breadcrumbs({ page, label }: { page: string; label?: string }) {
  const { t, locale } = useLocale();
  const meta = PAGES[page];
  const sep = <span className="text-[rgba(250,248,244,.30)]">{locale === "en" ? "›" : "‹"}</span>;
  return (
    <nav
      aria-label={t("Breadcrumb")}
      className="font-mono mb-6 flex min-h-[15px] flex-wrap items-center gap-2.5 text-[10.5px] tracking-[.14em] uppercase"
    >
      <Link href="/" className="text-gold">{t("Home")}</Link>
      {sep}
      {meta?.group && (
        <>
          <span className="text-[rgba(250,248,244,.62)]">{t(meta.group)}</span>
          {sep}
        </>
      )}
      <span className="text-[rgba(250,248,244,.92)]">{t(label || meta?.label || page)}</span>
    </nav>
  );
}
