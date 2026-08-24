# Fidelity Audit — Round 6 (Final Confirmation Pass)

TOTALS: Match=very-high Different=3 Missing=0 Broken=0 Simplified=0

This round found **2 new, previously-unflagged issues** (both narrow, both real) in addition to
confirming the Round 5 fix. Both new issues are RTL/i18n-completeness gaps that do not affect
visible layout in the common case — they affect assistive-technology labels and one decorative
badge's position in Arabic mode. Every other area checked (all 11 + appendix) came back Match.

Counting individually-affected call sites as separate findings under the same root cause:
- Finding A (untranslated `aria-label`s): 10 call sites, 1 root cause → counted as 1 "Different" class, 10 locations.
- Finding B (VideoCard hint badge physical vs. logical position): 1 root cause, used on `/media`'s video grid.
- Round 5 regression (contact info-strip): **re-verified fixed, now Match.**

If you want a single number: **3 distinct root-cause findings**, all severity **Different**, zero Missing/Broken/Simplified.

---

## 0. Round 5 fix verification — `/contact` info-strip grid-gap-background technique

**Re-verified independently by reading source code directly, not trusting the fix description.**

Source (`Qom International Relations.dc.html:2329-2333`): container uses
`display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1px; background:rgba(11,31,58,.12); border:1px solid rgba(11,31,58,.12)`,
each cell uses `background:#fff; border-top:2px solid #C8A75D` only (no side borders) — the classic
"gap reveals container background" divider technique.

Port (`app/contact/page.tsx:72-82`, current code read fresh):
```
<div className="mb-19 grid gap-px border border-navy/[.12] dark:border-dark-line bg-navy/[.12] dark:bg-dark-fill" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
  ...
  <div key={k} className="grid content-start gap-2.5 border-t-2 border-gold bg-white dark:bg-dark-surface-2 px-7.5 py-8">
```
This is now a structural match: `gap-px` (1px) + container `bg-navy/[.12]` / `border-navy/[.12]`, cells only carry `border-t-2 border-gold` + their own background — exactly the source's technique, no more per-cell side borders.

**Live-measured, independently, at all 4 combinations:**
- Desktop (1280px), light/LTR: 3 equal columns (404px each), no wrap — unaffected by the fix, unchanged. Match.
- Narrow (600px), light/LTR: 2 columns, 3rd cell wraps alone into column 1; sampled the empty leftover grid area (right column of row 2) via `elementFromPoint` — it resolves to the grid container itself with `background-color: oklab(... / 0.12)` (the resolved form of `rgba(11,31,58,.12)`), i.e. correctly filled, not transparent. Match.
- Narrow (600px), dark/RTL (Arabic — verified via `document.documentElement.lang="ar"`, confirmed the `rtl:` Tailwind variant fires off `:lang(ar)` in the generated CSS, not `dir` on `<html>` — see §9 for why `<html dir>` intentionally stays `"ltr"`): container background resolves to `rgba(250, 248, 244, 0.13)` (= `--color-dark-fill`, matching source's dark-mode override `rgba(250,248,244,.13)` for any element whose light-mode background matched `rgba(11,31,58,...)`), border resolves to `rgba(250, 248, 244, 0.16)` (= `--color-dark-line`, matching source's dark override). Grid flow correctly mirrors (DOM-order first child renders in the rightmost column, as expected under `dir=rtl` grid auto-flow). The leftover empty cell in row 2 (this time on the visual left, since RTL reverses which column is "leftover") was sampled directly and again resolved to the container's own dark-fill background. Match.

**Verdict: Match.** The Round 5 fix is correct in all four combinations (light/dark × LTR/RTL) at both the wrapped and unwrapped widths. No regression, no residual divergence.

---

## 1. Homepage

Hero slideshow, ribbon, news teaser, PCWG map, investment teaser, media teaser, footer all checked structurally against source (`Qom International Relations.dc.html` lines ~140-2610, script 2612-4412) and against `app/page.tsx` + `components/home/*`. No divergence found beyond what's covered in dedicated sections below (Hero, Header, Footer, Animations).

- `data-ribbon` 4-column grid → `[data-ribbon]` breakpoints (1000px→2col, 620px→1col) present verbatim in `app/globals.css:283-294`. Match.
- Homepage PCWG mini-map (`components/home/HomePcwgMap.tsx`) pin percentages, region-label captions, pulsing "chair" marker (`qomPulse 2.8s ease-out infinite`) — all confirmed against source lines 563-618. The map caption labels use **physical** `left-3.5`/`left-[19px]`, which is **correct** because source also uses physical `left: 14px` / `left: 19px` here (line 563, 575) — a geographic map legitimately should not mirror in RTL, unlike purely decorative page-hero icons elsewhere. Match.

## 2. Header

- Sticky/compact-on-scroll behavior (`components/SiteHeader.tsx:79-88`) reproduces source's `syncHeader()` (script lines 4032-4058) value-for-value: padding 14px→7px, logo mark 44px→36px/19px→16px font, logo-sub maxHeight 20px→0/opacity 1→0, header shadow/background/border-color per theme, navbar padding 7px→3px, CTA padding 13px→10px. Threshold: source uses `root.getBoundingClientRect().top < -60`; port uses `window.scrollY > 60` — equivalent since root sits at document top. Match.
- Nav rail visible ≥1024px, burger visible <1024px (`app/globals.css` media queries) — Match.
- Mega menus (`activities`/`municipality`) open on hover (desktop, hover-capable) or click/focus; close on outside click, Escape, route change. `inset-x-0` full-width panel — no RTL positioning concern since it spans edge-to-edge. Match.
- Drawer nav items keep **physical** `border-l-2` (`SiteHeader.tsx:393`), matching source's physical `border-left: 2px solid transparent` (lines 225-242) — correctly *not* flipped in RTL, since source doesn't flip it either. Match.
- **Finding A** (see below): several `aria-label`/`title` attributes on header controls are hardcoded English and don't translate in Arabic mode, unlike source.

## 3. Hero

- 5 slides, copy/CTAs/`data-goto` targets all verified against source lines 248-336 — Match.
- Ken Burns (`qomKen 9s ease-out forwards`) and per-slide reveal (`qomReveal .9s cubic-bezier(.22,.61,.36,1) both`) — exact duration/easing match (`components/HeroSlideshow.tsx:108,122` vs. script line 2641/2643).
- Prev/next arrows pinned `right-6` (fixed, **not** `rtl:`-flipped) and dots pinned `left-6` (fixed) — confirmed this is intentional and correct: source's JS never conditionally repositions `[data-slide-nav]`/`[data-dots]` for RTL (script lines 2857-2858 register click handlers only, no RTL branch), and the inline styles are plain `right: 24px` / `left: 24px` (lines 324, 329) — genuinely un-mirrored in the source itself. Match — this is one of the "hero controls pinning" checks called out as historically fragile, and it remains correct.
- Placeholder image caption pinned `right-6` — matches source's fixed `right: 24px` (line 251 etc., not `inset-inline-end`). Match.

## 4. Mobile menu / drawer

Live-tested at 600px viewport, both directions:
- LTR: burger click → `aria-expanded` flips to `"true"`, `<aside>` renders at `x:0, width:420` (= `min(420px, 88vw)` at this viewport), `transform: matrix(1,0,0,1,0,0)` (open). Matches source's `left:0; transform:translateX(0)` (script line 2667-2669).
- Arabic/RTL: same drawer, `<aside>` now measured at `x:180` (`right:0px` computed), i.e. flush against the right edge, width unchanged. Matches source's `right:0` rtl branch.
- Closed-state transform target: port uses `locale === "ar" ? "translateX(100%)" : "translateX(-100%)"` (`SiteHeader.tsx:367`), matching source's `rtlNow ? 'translateX(100%)' : 'translateX(-100%)'` (script line 2669). Match.
- Overlay opacity/pointer-events toggle present (`SiteHeader.tsx:363`). Match.
- Drawer heading text `{t("Menu")}` correctly translates to "القائمة" in Arabic (`SiteHeader.tsx:371`) — Match. (Contrast with the burger *button's* `aria-label`, which does not — Finding A.)

## 5. Animations (6 keyframes)

All six keyframes (`qomPulse`, `qomBob`, `qomKen`, `qomReveal`, `qomFlow`, `qomGlow`) are defined byte-for-byte identically in `app/globals.css:53-106` vs. source `<style>` lines 24-29, and every usage site was individually cross-checked:

| Animation | Source | Port | Location |
|---|---|---|---|
| `qomPulse 2.8s ease-out infinite` | script 573 | `HomePcwgMap.tsx:81` | Match |
| `qomKen 9s ease-out forwards` | script 2641 | `HeroSlideshow.tsx:108` | Match |
| `qomReveal .9s cubic-bezier(.22,.61,.36,1) both` (hero) | script 2643 | `HeroSlideshow.tsx:122` | Match |
| `qomReveal .8s cubic-bezier(.22,.61,.36,1) both` (scroll reveal) | script 2834 | `Reveal.tsx:45` | Match |
| `qomReveal .5s ...` delay `min(i,11)*35ms` (news card) | script 3279 | `NewsCard.tsx:13` | Match |
| `qomReveal .5s ...` delay `min(i,8)*40ms` (msg card) | script 3292 | `NewsCard.tsx:46` | Match |
| `qomReveal .5s ...` delay `min(i,11)*32ms` (investment card) | script 3501 | `InvestmentCard.tsx:22` | Match |
| `qomGlow 5s ease-in-out infinite` (×2 map circles) | script 1572/1596 | `PcwgConstellation.tsx:34`, `PcwgNetwork.tsx:59` | Match |
| `qomFlow {n}s linear infinite` (n=11..23, per-line) | script 1596 | `PcwgNetwork.tsx:56` | Match |
| `qomBob` | defined, **never applied** in source | defined, **never applied** in port | Match (both dead code) |

Reveal-on-scroll trigger mechanism (IntersectionObserver-driven, `[data-reveal]`-equivalent) — `Reveal.tsx` reproduces the animate-once-then-freeze behavior described in source script line ~2834. No divergence found.

## 6. News pages

`/news` list/archive/sort/filter chips/pagination all checked against `app/news/page.tsx`, `components/ArchiveSection.tsx`, `components/Pagination.tsx`, `components/NewsCard.tsx` vs. source lines ~850-995, 3255-3310.

- `[data-msgcard]` grid (`216px minmax(0,1fr) 216px` → `200px minmax(0,1fr)` at 1040px → single column at 700px), and `[data-msgmeta]`'s `border-inline-start:0 !important; border-top:1px solid ...` override at the 1040px breakpoint — reproduced verbatim in `app/globals.css:297-319`, including the logical-property override (so it still correctly participates in RTL). Match.
- Pagination arrow-swap for RTL (`rtl ? "→ "+"Previous" : "← "+"Previous"`, and the mirror for Next) — matches source's `pagerHTML()` (script 3261-3274) exactly, same Unicode codepoints. Match.
- **Finding A** applies to `ArchiveSection.tsx:140`'s sort-`<select>` `aria-label="Sort"` (hardcoded) vs. source's `aria-label="Sort"` which *does* get auto-translated to "الترتيب" by source's generic attribute-translation pass (confirmed the string exists in both `i18n.js:996` and the port's `lib/i18n-data.js:996` — the dictionary entry exists, it's just not wired to this specific attribute).

## 7. Department pages

`/departments` and `/departments/[slug]` checked against source lines ~1000-1050, 1440-1500, and `app/departments/page.tsx`, `components/DeptDetailView.tsx`.

- About-style mission/vision split panels use **physical** `border-r` + asymmetric padding (`pr-11 py-10` / `px-11 py-10`) matching source's physical `border-right` + `padding: 40px 44px 40px 0` / `padding: 40px 44px` (lines 425, 432) — correctly un-flipped. Match.
- Cooperation-interest list uses physical `border-l pl-7.5` matching source's physical `border-left: 1px; padding-left: 30px` (lines 1446-1491) — correctly un-flipped. Match.
- `[data-deptd-layout]` single-column collapse at 940px (`gap:44px !important`) present in `app/globals.css`. Match.
- **Finding A** applies to `DeptDetailView.tsx:46`'s `aria-label="Breadcrumb"`.

## 8. Investment pages

`/investment`, `/investment/[slug]` checked against source lines ~2140-2170, 2400-2470, 3480-3510, and `app/investment/page.tsx`, `components/InvestmentCard.tsx`, `components/InvestmentDetailView.tsx`.

- Filter rail (`[data-invopt]` hover backgrounds, light/dark) — `app/globals.css` reproduces both the light (`rgba(200,167,93,.10)`) and dark (`rgba(217,188,126,.12)`) hover rules verbatim. Match.
- `[data-inv-layout]` single-column collapse at 940px, `[data-inv-aside]` sticky at `top:132px` from 941px — present. Match.
- Investment card status badge uses **logical** `start-3` (`InvestmentCard.tsx:27`), matching source's `inset-inline-start: 12px` (script line 3504) — correctly flips in RTL. Match.
- Investment-detail interactive-map caption and center dot use **physical** `left-4`/`left-1/2` (`InvestmentDetailView.tsx:144-145`), matching source's physical `left: 16px` (line 2453) for the same map-caption element — correctly un-flipped (same "maps don't mirror" rule as §1's homepage map). Match.
- **Finding A** applies to `InvestmentDetailView.tsx:60`'s `aria-label="Breadcrumb"`.

## 9. RTL mode

This was the most scrutinized area this round, given its fragility history.

- **`<html dir>` stays `"ltr"` always; only an inner wrapper flips.** Confirmed this is *intentional source behavior*, not a bug: source script lines 4137-4139 explicitly set `root.setAttribute('dir', lang==='en'?'ltr':'rtl')` on an inner root while forcing `document.documentElement.dir = 'ltr'`, with the comment *"The document keeps LTR direction so the browser scrollbar stays on the right in AR/FA."* Port's `lib/i18n.tsx:49-57,80` reproduces this exactly (`html.dir = "ltr"` always; the `[data-rtl-root]` wrapper div carries `dir={locale==="ar"?"rtl":"ltr"}`). Verified live: `document.documentElement.dir === "ltr"` even while the whole page renders mirrored in Arabic. Tailwind's `rtl:` variant works correctly here because its generated selector is `:is(:lang(ar), ..., [dir="rtl"], [dir="rtl"] *)` — it fires off `document.documentElement.lang="ar"` (which the port does set) independent of where `dir="rtl"` physically sits in the DOM. Confirmed via generated CSS (`.next/dev/static/chunks/*.css`). Match.
- **Mobile drawer side** — see §4. Match.
- **Hero controls pinning** — see §3. Confirmed correctly un-flipped (fixed pixel `right:24px`/`left:24px`, matching source's non-RTL-aware inline styles). Match.
- **Pagination arrows** — see §6. Confirmed correctly flipped. Match.
- **Decorative-edge locations (rounds 3-4 focus)**: systematically re-audited all 38 occurrences of `border-inline-start/end`, `padding-inline-start/end`, `inset-inline-start/end`, `margin-inline-*`, and `text-align: left/right` in the source, cross-checked against every physical `border-left/right` occurrence too (11 instances: navbar drawer items, about mission/vision panels, cooperation-interest cards, organisation-logo cards — all correctly kept physical in the port). Findings:
  - `PageHero.tsx:44`'s decorative page-icon (`end-[1%]`) — shared by every appendix page's hero — correctly uses the **logical** end position, live-verified to flip from `right:` (LTR) to `left:` (RTL) via direct `getBoundingClientRect()` measurement in Arabic mode on `/departments/planning`. Match.
  - `BackToTop.tsx:48` (`end-6`) — correctly logical, matching source's `inset-inline-end: 24px` (line 2546). Match.
  - `NewsCard.tsx:47` msgcard accent border (`border-s-[3px] border-s-gold`) and `:61` msgmeta border (`border-s`) — correctly logical, matching source's `border-inline-start` (lines 3292, 3300). Match.
  - `feedback/page.tsx:187`'s bullet-list accent — implemented as explicit `border-l-2 rtl:border-l-0 rtl:border-r-2 rtl:pr-4.5 rtl:pl-0` rather than a native logical utility, but resolves identically to source's `border-inline-start: 2px; padding-inline-start: 18px` (line 2231) in both directions. Match.
  - `SearchBox.tsx:67` dropdown panel (`start-0`) — correctly logical, matching source's `inset-inline-start: 0` (line 161). Match.
  - `InvestmentCard.tsx:27` status badge (`start-3`) / `pcwg/page.tsx:81` "Current member" badge (`start-3`) — correctly logical, matching source (lines 3504, 1633 etc.). Match.
  - **`VideoCard.tsx:38`'s "Hover to preview · muted" hint badge uses physical `left-3.5` (14px) instead of logical `start-3`.** Source uses `inset-inline-start: 12px` for this exact element (`data-video-hint`, lines 1910/1922/1938, used on `/media`'s video grid). Live-verified in Arabic mode on `/media`: the badge stays pinned 14px from the *physical* left edge instead of moving to the visual right (`inset-inline-start` in RTL = right side). This is **Finding B** — a genuine, reproducible RTL regression, scoped to one badge on one page section (video cards on `/media`).
- **Dark + RTL combined**: tested together on `/contact` (§0) and `/departments/planning` — theme tokens (`dark-fill`, `dark-line`, `dark-navy`, `dark-surface-2`) apply correctly alongside the RTL mirror with no interaction bugs; no console errors in either combination.

## 10. Arabic mode

- Text translation pipeline (`t()` / `translate()` in `lib/i18n-data.js`) verified against `i18n.js` for spot-checked strings across multiple pages (contact, news, footer, breadcrumbs) — dictionary keys and Arabic values match 1:1 where sampled.
- Directional-arrow strings that embed the glyph in the translatable string itself (`"Read More →"` → `"← اقرأ المزيد"`, `"View Details →"` → `"← عرض التفاصيل"`) are ported correctly — confirmed both the dictionary entries (`lib/i18n-data.js:176,227`) and call sites (`NewsCard.tsx:33`, `InvestmentCard.tsx:41`) match source exactly, including the embedded arrow flip.
- Font-family switch (Noto Kufi Arabic for `ar`) applied via `LANGS` config — matches source's `cfg.font`/`cfg.serif` swap logic structurally.
- **Finding A**: a small, specific set of `aria-label`/attribute translations are missing (detailed below) — visible text is unaffected; this is an assistive-technology-only gap.

## 11. Footer

`components/SiteFooter.tsx` checked line-for-line against source lines 2550-2609:
- 5-column grid (`repeat(auto-fit, minmax(190px,1fr))`, `gap-11`=44px), logo block, tagline, 6 social icons (`h-[38px] w-[38px]`, `border-bg/[.22]`, hover states) — Match.
- Quick-links / International-cooperation / Investment-media / Contact columns — all 12 links present with correct hrefs and labels, `mb-[18px]` spacing. Match.
- Copyright: `"© 2026 {…} — {…}."` — hardcoded `2026`, **not** dynamically computed from `new Date()`, matching source's hardcoded `© 2026` (line 2602). This is correct fidelity, not a bug (source doesn't auto-update the year either). Match.
- EN/AR toggle buttons with active-state gold background — Match.

## Appendix (about, about-qom, culture, cooperation, events, media, meetings, memberships, contact, feedback, pcwg)

Spot-checked each page for: HTTP 200, no console errors, translated content, and the decorative `PageHero` icon (shared component, see §9). All 14 top-level routes plus 3 sampled dynamic routes (`/news/n1`, `/departments/planning`, `/investment/i1`) return 200 and render without console errors, in EN and AR, light and dark.

- `/media`: video-grid hint badge — see Finding B.
- `/culture`: festival-card "Upcoming/Ongoing/Completed" badges use **physical** `left-3.5`/`top-3.5`, matching source's physical `top:14px; left:14px` (lines 2077-2079) — correctly un-flipped (verified this is intentionally physical in source, unlike the logical `PageHero` icon). Match.
- `/feedback`, `/pcwg`, `/memberships`, `/meetings`, `/events`, `/cooperation`, `/about`, `/about-qom`: structural spot-checks (grid breakpoints, border technique, translated headings) found no divergence.
- Cross-cutting CSS: dark-mode token set (`--color-dark-*` in `app/globals.css:20-34`) matches every hex value in source's `[data-theme="dark"]` override block (lines 99-132) 1:1. i18n data file (`lib/i18n-data.js`) is a structural port of `i18n.js`.

---

## Finding A — Untranslated `aria-label`/attribute strings (Different)

**Root cause:** Source's runtime generically re-translates **every** `placeholder`, `aria-label`, and `title` attribute on the page whenever `applyLanguage()` runs (script lines 4085-4126: it captures `[placeholder],[aria-label],[title]` elements once, then on every language change re-sets each attribute via `tr(orig, lang)` if a dictionary entry exists). This is attribute-content-agnostic — any element with a translatable literal value gets swept up automatically.

The port has no equivalent generic mechanism (a reasonable, standard React choice: each attribute must explicitly call `t(...)`). Most of the codebase does this correctly (e.g. `BackToTop.tsx:46` `aria-label={t("Back to top")}`, `SearchBox.tsx:50-51` `placeholder={t(...)} aria-label={t(...)}`, `SiteHeader.tsx:203` `title={t("Switch theme")}`) — but **10 call sites across 6 components** hardcode the English literal instead:

| File:Line | Attribute | Hardcoded value | Has Arabic entry in `i18n.js`/`i18n-data.js`? |
|---|---|---|---|
| `components/SiteHeader.tsx:146` | `aria-label` (burger button) | `"Menu"` | Yes — `'Menu': {ar:'القائمة'}` |
| `components/SiteHeader.tsx:202` | `aria-label` (theme toggle — note `title` on the *same element*, line 203, **is** translated) | `"Switch theme"` | Yes — `'Switch theme': {ar:'تبديل المظهر'}` |
| `components/SiteHeader.tsx:232` | `aria-label` (`<nav>`) | `"Primary"` | Yes — `'Primary': {ar:'التنقل الرئيسي'}` |
| `components/SiteHeader.tsx:376` | `aria-label` (drawer close button) | `"Close"` | Yes — `'Close': {ar:'إغلاق'}` |
| `components/Breadcrumbs.tsx:13` | `aria-label` (`<nav>`, shared component) | `"Breadcrumb"` | Yes — `'Breadcrumb': {ar:'مسار التنقل'}` |
| `components/ArticleView.tsx:47` | `aria-label` (`<nav>`, duplicate breadcrumb markup) | `"Breadcrumb"` | Yes (same) |
| `components/DeptDetailView.tsx:46` | `aria-label` (`<nav>`, duplicate breadcrumb markup) | `"Breadcrumb"` | Yes (same) |
| `components/InvestmentDetailView.tsx:60` | `aria-label` (`<nav>`, duplicate breadcrumb markup) | `"Breadcrumb"` | Yes (same) |
| `components/ArchiveSection.tsx:140` | `aria-label` (`<select>` sort control, used on both `/news` tabs) | `"Sort"` | Yes — `'Sort': {ar:'الترتيب'}` |
| `components/SearchBox.tsx:58` | `aria-label` (clear-search button) | `"Clear search"` | Yes — `'Clear search': {ar:'مسح البحث'}` |

Confirmed **not** an issue for: `Pagination.tsx:27` (`aria-label="Pagination"`), `HeroSlideshow.tsx:160,168` (`"Previous slide"`/`"Next slide"`), `investment/page.tsx:140` (`"Sort opportunities"`, a different string from the one above) — none of these have Arabic dictionary entries in source's `i18n.js` either, so their remaining untranslated in the port is correct fidelity, not a gap.

**Impact:** Purely assistive-technology-facing (screen readers). No visible text, layout, or color is affected — this does not change anything a sighted user sees. It is a real, reproducible divergence from source behavior in Arabic mode, and is flagged per the audit's severity legend as **Different**.

## Finding B — VideoCard hint badge: physical positioning instead of logical (Different)

`components/VideoCard.tsx:38` positions the "Hover to preview · muted" / "Tap to preview · muted" badge with `left-3.5` (14px, physical), while source's equivalent `[data-video-hint]` span (script/markup lines 1910, 1922, 1938 — used for all `/media` video cards) uses `inset-inline-start: 12px` (logical, plus a 2px value difference independent of the logical/physical issue).

**Live-verified** on `/media` in Arabic mode: the badge remains 14px from the DOM-physical left edge instead of moving to the visual right (where `inset-inline-start` resolves to in RTL). Confirmed via `getComputedStyle` (`left: "14px"`) and geometry (`rect.x === 39` inside a 550px-wide card at 600px viewport, i.e. hugging the left, not the right).

**Impact:** Cosmetic-only, scoped to the video preview badge on `/media`'s video grid, visible only in Arabic mode. Everything else on that page (card border, thumbnail, title, description) is unaffected.

---

## Summary

Round 6 re-confirms the Round 5 contact-page fix is correct in all four theme/direction combinations at both wrapped and unwrapped widths, and finds **two new, narrow, previously-undetected fidelity gaps**, both classified **Different**:

1. Ten `aria-label`/attribute call sites across the header, breadcrumbs, archive sort control, and search box stay in English when the source would translate them to Arabic (assistive-technology-only impact).
2. One decorative hint badge on `/media`'s video cards (`VideoCard.tsx:38`) uses physical instead of logical inline positioning, so it doesn't mirror correctly in RTL (cosmetic-only, one element).

No **Missing**, **Broken**, or **Simplified** findings this round. Every other checked area — Homepage, Header, Hero, Mobile drawer, all 6 animation keyframes and their usage sites, News, Departments, Investment, RTL mechanics (drawer side, hero pinning, pagination arrows, the 38 logical/physical positioning rules audited exhaustively, dark+RTL combination), Arabic-mode text translation, Footer, and all 11 appendix pages — came back as exact **Match**.
