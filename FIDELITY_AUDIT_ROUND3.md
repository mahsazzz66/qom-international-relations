# Fidelity Audit — Round 3 (independent re-derivation)

**TOTALS: Match=89 · Different=11 · Missing=7 · Broken=2 · Simplified=1 — 110 findings checked this round, 21 non-Match**

> **Granularity note.** This round was produced by four independent agents auditing disjoint areas in parallel (Homepage/Header/Hero/Menu/Footer; Animations/News/Departments/Investment; remaining pages + cross-cutting CSS; RTL/Arabic + the two disputed claims from fix pass 2), then compiled here. Their finding granularity is coarser in places than round 2's (which logged individual color/spacing values as separate rows), so the Match/Total denominators are **not directly comparable** to round 1 (178 findings) or round 2 (199 findings). What's comparable and what matters for the fix-until-zero goal is the **non-Match count**: 61 (round 1) → 33 (round 2) → **21 (round 3)**.
>
> **Deduplication note.** The hardcoded (non-locale-aware) `›` breadcrumb separator was independently found in three files (`ArticleView.tsx`, `DeptDetailView.tsx`, `InvestmentDetailView.tsx`) by the same sub-agent. Counted once here as one Different finding, per the same convention round 2 used for its 20-call-site `ltr:`/`rtl:` finding — the fix still needs to touch all three files.
>
> **Accepted exception, not re-flagged:** the hash-anchor router quirk (source's non-deep-linkable hash router vs. the port's real Next.js routes) — a deliberate, accepted improvement.

---

## Adjudication of fix pass 2's two flagged ambiguities

**Claim 1 — `text-wrap: pretty` over-application: CONFIRMED, with a corrected count.** The source applies it as an inline style on **77** specific elements (not the 102 fix pass 2 estimated) — 66 in static markup, 11 in JS template strings — out of 447 total `h1`–`h4`/`p` elements (~17%), in an irregular, hand-applied pattern with no discernible rule (hero headings get it, "Latest International News" doesn't, etc.). The port's blanket `@layer base { h1,h2,h3,h4,p { text-wrap: pretty } }` rule (`globals.css` lines 129–138) applies it to essentially the entire heading/paragraph population instead. **Verdict: Different.**

**Claim 2 — RTL decorative-edge mismatch: PARTIALLY CONFIRMED, with corrections.** Of the 6 locations fix pass 2 named:
- **3 genuine mismatches, confirmed via live computed-style measurement in Arabic:** homepage About 3-up columns (`app/page.tsx:137`), `/about` page mission/vision blocks (`app/about/page.tsx:71,75`), `/memberships` org-logo boxes (`app/memberships/page.tsx:26`). Source hand-writes physical `border-right`/`padding-right` inline styles that never mirror (nothing in the source's language switch touches inline decoration); the port's `rtl:` Tailwind overrides do mirror them, producing a genuine divergence — low visual severity (thin hairline borders), but a real one.
- **1 location corrected:** the `/departments/[slug]` detail-page aside has **no** border decoration in either codebase — not a mismatch. The real instance is on the **`/departments` list page**'s "Cooperation interests" panel (`app/departments/page.tsx:40`), which does have the same mismatch pattern as the other three.
- **2 false positives, now resolved as Match:** `/feedback`'s checklist box uses a CSS **logical property** (`border-inline-start`) in the source itself, which auto-mirrors correctly — port and source produce identical computed borders. `/contact`'s 3-card row has no fixed-edge border in the source at all (it's a grid-gap seam, direction-agnostic) — nothing to mismatch.

Net: **4 genuine Different findings** (homepage About columns, About page, Memberships, Departments list), tallied below.

---

## 1. Homepage

| # | Finding | Severity |
|---|---|---|
| 1.1 | Ribbon: 4 items, icon colors, titles/subtitles, grid dividers. Source 338–369 ↔ `app/page.tsx` 51–68 | **Match** |
| 1.2 | Newsroom: 1 feature + 4-row list, badges, clamps. Source 3320–3361 ↔ `components/home/HomeNews.tsx` | **Match** |
| 1.3 | Statements: exactly 4 rows, correct border pattern. Source 3304–3317 ↔ `HomeNews.tsx` (`HomeStatements`) | **Match** |
| 1.4 | About: intro, 3-column Mission/Vision/Objectives, media pair. Source 408–464 ↔ `page.tsx` 111–173 | **Match** |
| 1.5 | Cooperation: 8 numbered cards, hover-inversion. Source 466–526 ↔ `page.tsx` 175–207 | **Match** |
| 1.6 | PCWG: tiles + map, all 30 pin coordinates byte-identical, tooltip logic. Source 528–668, 2935–2953 ↔ `HomePcwgMap.tsx` | **Match** |
| 1.7 | Investment teaser: 6 cards, hover-reveal, lift, color inversion. Source 670–728 ↔ `HomeInvestmentTeaser.tsx` | **Match** |
| 1.8 | Media teaser: 4 tabs, exact item counts and copy. Source 730–843 ↔ `HomeMedia.tsx` | **Match** |
| 1.9 | **Reveal/fade-in scope on Media section too broad.** Source wraps only the header row in `data-reveal` (line 731); the 4 tab panels are unanimated siblings. Port wraps the entire `<HomeMedia/>` output — header **and** panels — in one `<Reveal>` (`app/page.tsx` 318–320), so panel grids replay `qomReveal` on scroll when source never gives them that. Cosmetic only. | **Different** |
| 1.10 | Video preview hover/tap zoom, hint-text swap. Source 2889–2933 ↔ `VideoCard.tsx` | **Match** |
| 1.11 | `data-reveal` wrap scoping verified correct everywhere else against source's exact placement (ribbon none, news 2, statements 1, about 3, cooperation 1, pcwg 2, investment 1). | **Match** |
| 1.12 | All 6 keyframes defined identically. Source 24–29 ↔ `globals.css` 53–103 | **Match** |

## 2. Header

| # | Finding | Severity |
|---|---|---|
| 2.1 | Scroll-shrink: all 8 tracked properties (padding, logo size/font, sub-label fade, navbar padding, bg alpha, box-shadow, CTA padding). Source `syncHeader` 4032–4058 ↔ `SiteHeader.tsx`. Live-verified via synthetic scroll. | **Match** |
| 2.2 | Search box: placeholder, clear, Escape, click-outside, results dropdown, "N results". Source `initSearch` 4219–4274 ↔ `SearchBox.tsx` | **Match** |
| 2.3 | Language toggle: `<html>` stays `ltr`, `<body>`/root gets `dir=rtl`. Live-verified. Source 4129–4144 ↔ `SiteHeader.tsx` 180–199 | **Match** |
| 2.4 | Theme toggle: icon swap, dark CTA/header colors, live-verified exact. Source 3873–3897 ↔ `SiteHeader.tsx` 200–212 | **Match** |
| 2.5 | Mega menu: hover/focus/click/mouseleave-on-navbar/Escape/outside-click, active-group underline via NAVGROUP map. Source `initMega` 3077–3091, 2794 ↔ `SiteHeader.tsx` | **Match** |
| 2.6 | Burger/rail breakpoint split (1023 vs 1024px — 1px boundary, not flagged). | **Match** |
| 2.7 | ≤760px responsive header: padding, search reorder, CTA shrink. Live-verified at 653px. Source 53–57 ↔ `globals.css` 240–260 | **Match** |
| 2.8 | Drawer geometry + RTL side-flip. Source 2662–2674 ↔ `SiteHeader.tsx` 365–368 | **Match** |

## 3. Hero section

| # | Finding | Severity |
|---|---|---|
| 3.1 | All 5 slides' copy/CTAs, including in-page hash anchors for slides 2/4. Source 248–322 ↔ `HeroSlideshow.tsx` | **Match** |
| 3.2 | Autoplay 7000ms, pause/restart on hover, restart on manual nav. Source 2852–2861 ↔ `HeroSlideshow.tsx` 67–91 | **Match** |
| 3.3 | Ken-Burns/reveal replay only on newly-activated slide (different technique — React key-remount vs. source's animation-reset trick — same effect). Source 2638–2645 ↔ `HeroSlideshow.tsx` | **Match** |
| 3.4 | Prev/Next + 5 dots, active/inactive colors. Source 324–335 ↔ `HeroSlideshow.tsx` 157–187 | **Match** |
| 3.5 | `<h1>` only on slide 1, `<h2>` on 2–5. Source 255/270/285/300/315 ↔ `HeroSlideshow.tsx` 125 | **Match** |
| 3.6 | **Crossfade easing curve wrong.** Source: `transition: opacity 1.1s ease` (CSS `ease` = `cubic-bezier(.25,.1,.25,1)`). Port `HeroSlideshow.tsx:100` uses Tailwind's `duration-[1100ms]` with no explicit timing-function, so it resolves to Tailwind's default `cubic-bezier(0.4,0,0.2,1)`. Duration correct, only the acceleration curve differs — crossfade feels slightly more abrupt at the start. Live-verified via `getComputedStyle`. | **Different** |

## 4. Mobile menu / drawer

| # | Finding | Severity |
|---|---|---|
| 4.1 | Burger toggle, `aria-expanded`. Source 2959–2960, 2672–2673 ↔ `SiteHeader.tsx` 144–155. Live-verified. | **Match** |
| 4.2 | Close button + backdrop click. Source 2961–2964. Live-verified at 375px. | **Match** |
| 4.3 | Escape closes. Source 2965 ↔ `SiteHeader.tsx` 99–102. Live-verified. | **Match** |
| 4.4 | **Deliberately no scroll-lock or focus-trap in either.** Verified live: `body.overflow` unchanged, `document.activeElement` stays `BODY` in both source and port when drawer opens — port correctly did not "fix" behavior source doesn't have. | **Match** |
| 4.5 | Drawer nav groups/order/labels, active-item styling. Source 224–245 ↔ `SiteHeader.tsx` 25–49, 389–402 | **Match** |
| 4.6 | Drawer footer text block. Source 245 ↔ `SiteHeader.tsx` 407–411 | **Match** |
| 4.7 | Drawer opens from correct (right) side in Arabic, pixel-identical to source. Source 2669 ↔ `SiteHeader.tsx` 367. Live-verified at 390px. | **Match** |

## 5. Animations — all six keyframes

| # | Finding | Severity |
|---|---|---|
| 5.1 | All 6 `@keyframes` byte-identical. Source 24–29 ↔ `globals.css` 53–106 | **Match** |
| 5.2 | `qomBob` genuinely unused in both source and port (dead keyframe, faithful). Port's invented duration for it is harmless since unapplied. | **Match** |
| 5.3 | `qomPulse` (map ring), `qomKen` (hero zoom, restart-on-activation), `qomReveal` (scroll-reveal + card stagger + hero body) — all timings/triggers verified exact. | **Match** |
| 5.4 | `qomFlow` (PCWG network lines): gold 11–18s, teal 16–23s, per-node formula exact. Source line 1596 ↔ `PcwgNetwork.tsx:35–38` | **Match** |
| 5.5 | `qomGlow`, 2 contexts (hero constellation r=90, network center r=74), both correct. Source 1572, 1596 ↔ `PcwgConstellation.tsx`, `PcwgNetwork.tsx` | **Match** |

*(Item 3.6, hero crossfade easing, is filed under Area 3 above — logically part of this area too.)*

## 6. News pages

| # | Finding | Severity |
|---|---|---|
| 6.1 | `ArchiveSection.tsx`: full filter/search/sort/paginate engine — category chips, live search, sort, year/month archive with live counts, Clear-filters, Load More, pagination. Source `filterList`/`renderList`/`initNewsFilters`/`pagerHTML`/`archChip` ↔ port | **Match** |
| 6.2 | `lib/data.ts` generators (`filterList`, `relatedFor`, `pageList`, `articleParas`, `fmtDate`) line-for-line logical ports. | **Match** |
| 6.3 | News/Statements filter independently, verified live (category click narrows one list, not the other). | **Match** |
| 6.4 | `ArticleView.tsx`: hero/body/share/related paddings and share-button styling exact. Source 2517–2521 ↔ `ArticleView.tsx` | **Match** |
| 6.5 | **Breadcrumb separator not locale-aware.** Source: `lang==='en' ? '›' : '‹'` (3412, 3712, 3786). Port hardcodes `›` regardless of locale in `ArticleView.tsx:49`, `DeptDetailView.tsx:48`, `InvestmentDetailView.tsx:62` — recurs in all 3 files, counted once here. | **Different** |
| 6.6 | **Pagination click on already-active page is not a no-op.** Source: `if (!to \|\| to === current) return` (line 3124) — clicking the current page number does nothing. Port's `Pagination.tsx`/`ArchiveSection.tsx` still fires `onChange`/smooth-scrolls even when the clicked page is already active. Very low severity. | **Different** |

## 7. Department pages

| # | Finding | Severity |
|---|---|---|
| 7.1 | `/departments` list layout: grid columns, gap, padding all exact. Source 1438–1493 ↔ `app/departments/page.tsx` | **Match** |
| 7.2 | `DeptDetailView.tsx` verified pixel-for-pixel across every section (hero, layout grid/gap, heading spacing, portfolio/counterparts/meetings spacing, related-news, gallery). | **Match** |
| 7.3 | Layout collapses to 1 column with 44px gap under 940px. Live-verified at 700px. | **Match** |
| 7.4 | Theme-dependent accent color (`dark ? dept.hero : dept.ink`) on numbers/refs/labels. Source 3720 ↔ `DeptDetailView.tsx:24` | **Match** |
| 7.5 | Photo gallery uses the distinct 45°/46px checkerboard (not the 135° stripe used elsewhere) — source-level distinction preserved. Source 3762 ↔ `DeptDetailView.tsx:162` | **Match** |
| 7.6 | Related news filtered/sorted/capped exactly as source. Source 3759 ↔ `DeptDetailView.tsx:25` | **Match** |
| — | Breadcrumb separator — see 6.5 (same finding, `DeptDetailView.tsx:48`), not double-counted. | — |
| 7.7 | **RTL decorative edge on "Cooperation interests" panel** (the corrected location for fix pass 2's misattributed `[slug]`-aside claim). Source hand-writes physical `border-left`/`padding-left:30px` (1446–1491) that never mirrors; port's `rtl:` classes (`app/departments/page.tsx:40`) do mirror it. Confirmed via live computed-style measurement in Arabic. Low visual severity. | **Different** |

## 8. Investment pages

| # | Finding | Severity |
|---|---|---|
| 8.1 | Two distinct card systems (homepage hover-reveal teaser vs. marketplace grid) correctly kept distinct — port doesn't cross-apply the hover-reveal treatment to marketplace cards. | **Match** |
| 8.2 | `[data-invcard]:hover` rules byte-identical (5 sub-rules). Source 90–95 | **Match** |
| 8.3 | `[data-invopt]` filter-rail hover states, incl. dark-mode override. | **Match** |
| 8.4 | Sticky aside `top:132px` ≥941px. Live-verified at 1400px. | **Match** |
| 8.5 | `[data-inv-layout]`/`[data-invdetail-body]` collapse under 940px. Live-verified at 700px. | **Match** |
| 8.6 | `invFilter()` sort/filter logic identical. | **Match** |
| 8.7 | Pagination `marginTop` correctly differs per page (36px `/news` vs. 42px `/investment`). Source 929/2148 | **Match** |
| 8.8 | `InvestmentDetailView.tsx`: specs grid, documents list, map/coords, key-facts aside, Enquiries CTA all verified against source 2440–2488, 3775–3854. | **Match** |
| 8.9 | Related-opportunities logic (same-category-first, slice 3) byte-identical. Source 3850–3853 ↔ `InvestmentDetailView.tsx:26–29` | **Match** |
| — | Breadcrumb separator — see 6.5 (same finding, `InvestmentDetailView.tsx:62`), not double-counted. | — |

## 9. RTL mode

| # | Finding | Severity |
|---|---|---|
| 9.1 | **RTL flip target differs (cosmetic, non-functional).** Source flips `div[data-qom="2"]` (script 2751–2753, 2767), an inner wrapper; port flips `<body>` directly (`lib/i18n.tsx` 49–55, `globals.css:149`). Since that wrapper is body's only child in source, the two techniques produce identical layout/inheritance. Both correctly keep `<html dir="ltr">` untouched (scrollbar-stays-right intent preserved in both, live-verified). Implementation detail only — no visual/behavioral difference. | **Different** |
| 9.2 | Header layout mirrors pixel-identically to source in Arabic (every child's `getBoundingClientRect()` matched). | **Match** |
| 9.3 | Mobile drawer mirrors pixel-identically (opens from the right, exact coordinates). | **Match** |
| 9.4 | Footer/search fully translated, byte-identical `innerText` to source. | **Match** |
| 9.5 | Date formatting (Western numerals + translated month) identical technique and output. | **Match** |
| 9.6 | Untranslated English fragments on the Investment page (Newest reference, Title A–Z, etc.) are a **shared source limitation**, faithfully replicated — not a port defect. | **Match** |
| 9.7 | **RTL decorative-edge mismatches**, 4 confirmed locations (homepage About 3-up, `/about` page, `/memberships`, `/departments` list — see 7.7): source hand-writes physical border/padding that never mirrors; port's `rtl:` classes do mirror. Counted here as the umbrella RTL finding; the departments instance is also listed at 7.7 (not double-counted in the totals). | **Different** |
| 9.8 | Two of fix pass 2's six claimed decorative-edge locations are **not actually mismatches**: `/feedback` already uses a CSS logical property in source (auto-mirrors correctly, byte-identical computed values) and `/contact`'s row divider is a grid-gap seam with no fixed-edge decoration in source to mismatch against. | **Match** |

## 10. Arabic mode

| # | Finding | Severity |
|---|---|---|
| 10.1 | Arabic font stack exact (Noto Kufi Arabic → IBM Plex Sans; port's extra "Fallback" entries are Next/font's transparent metric-matched fallbacks). | **Match** |
| 10.2 | ~20-string translation spot-check across header, nav, homepage, departments, footer, investment, news card arrow-flip — all correct, no drift. | **Match** |
| 10.3 | Bracketed placeholder content correctly stays untranslated in both (per source's own documented behavior). | **Match** |
| 10.4 | **`text-wrap: pretty` over-applied** — see adjudication above. Corrected count: 77 source elements (not 102) vs. port's blanket rule on ~447 candidates. | **Different** |

## 11. Footer

| # | Finding | Severity |
|---|---|---|
| 11.1 | 5-column layout, all link sets/copy identical. Source 2550–2599 ↔ `SiteFooter.tsx` | **Match** |
| 11.2 | 6 social icons, identical SVGs and hover states. Source 2560–2565 | **Match** |
| 11.3 | Copyright + footer-scoped language switcher with correctly-inverted active-state styling vs. header's switcher (source's own `dark: closest('footer')` logic). Source 2601–2607, 2743–2749 ↔ `SiteFooter.tsx` 88–106 | **Match** |
| 11.4 | Dark-mode footer background exact (`#0A1220`). Live-verified. | **Match** |

## Appendix — other pages and cross-cutting

| # | Finding | Severity |
|---|---|---|
| A.1 | `/about` — content/structure match. **Missing hero icon** (source 991; `PageHero` supports an `icon` prop, correctly used on news/departments/investment/feedback, but not passed here). | **Missing** |
| A.2 | `/about-qom` — very high fidelity incl. the RTL Persian caption with correct `dir`/font. **Hero padding wrong**: source `80px 24px 84px` asymmetric (1099) vs. port's symmetric `py-20`. 4px gap, cosmetic. | **Different** |
| A.3 | `/culture` — Match against source. | **Match** |
| A.4 | `/cooperation` — content/structure match, and `[data-coop-grid]` breakpoints verified live exact (1000px/620px). **Missing hero icon** (source 1358). **Cards stay white in dark mode** — `bg-white dark:bg-dark-surface-2` on `[data-coop-grid] article` renders `rgb(255,255,255)` in dark instead of `#151D2B`, live-verified. Isolated bug: the identical class combo works correctly on the same page's Agreements table and on `/memberships`/`/about-qom` — points to a component/route-specific cascade-ordering issue, not a global dark-mode failure. | **Missing + Broken** |
| A.5 | `/events` — Match. **Missing hero icon** (source 2008). | **Missing** |
| A.6 | `/media` + `VideoCard.tsx` — Match, faithful hover-preview (neither source nor port wires a real video src). **Missing hero icon** (source 2260). Confirmed the Photo/Video/Docs/Press tab switcher belongs to the homepage section, not this standalone page — source has no tabs here either, port correctly matches. | **Missing** |
| A.7 | `/meetings` — Match. **Missing hero icon** (source 2030). | **Missing** |
| A.8 | `/memberships` — Match (content). **Missing hero icon** (source 1963). (RTL decorative-edge finding tracked at 9.7.) | **Missing** |
| A.9 | `/contact` — Match, high fidelity (social icons, FAQ accordion, form validation regex/required-fields byte-match source). **Missing hero icon** (source 2321). **Missing focus management**: source calls `.focus()` on the first invalid field after failed validation (script 4368); port's submit handler omits this. | **Missing + Simplified** |
| A.10 | `/feedback` — correctly has its hero icon (matches source 2166). **Name field wrongly required.** Source's `validate()` never marks Name as required (only Message is, regardless of the "submit anonymously" checkbox, script line 4346/2215). Port's submit handler makes Name conditionally required when not anonymous — blocks a submission source would accept. | **Broken** |
| A.11 | `/pcwg` + `PcwgNetwork.tsx` + `PcwgConstellation.tsx` — excellent fidelity: node positions, hover/opacity logic, the "Members by country" legend (including source's own quirk of listing more cities than graph nodes), flow-line timing all faithfully reproduced. | **Match** |
| A.12 | `app/globals.css` vs. source style block — near line-for-line, every documented breakpoint (760/940/1000/1040/700/620/941px) expressed as literal `@media` pixel values, correctly avoiding Tailwind-default breakpoint divergence. | **Match** |
| A.13 | Dark-mode palette hex values spot-checked across about-qom, memberships, cooperation (hero/body), contact, feedback — all exact except the isolated cooperation-card bug at A.4. | **Match** |
| A.14 | `lib/i18n-data.js` byte-for-byte content-identical to source `i18n.js` (diff shows only cosmetic unicode-escape formatting, zero content differences). | **Match** |
| A.15 | Theme toggle mechanism (localStorage key, default, no system-preference detection, target attribute) behaviorally identical. | **Match** |

---

## What's still open, by priority

1. **A.10 — Feedback form wrongly requires Name.** Functional bug: blocks valid non-anonymous submissions with no name. Fix: remove the conditional-required check, matching source (only Message is ever required).
2. **A.4 — `/cooperation` dark-mode cards stay white.** Isolated cascade bug, same class combo works everywhere else — needs root-cause (likely a more-specific light-mode rule winning, or ordering issue in this specific component).
3. **7 × Missing hero icons** — about, cooperation, events, media, meetings, memberships, contact. Mechanical: pass the right `icon` prop to `PageHero` on each (or add the SVGs if they don't exist yet — a prior fix pass added them to news/departments/investment/feedback, this just extends to the remaining 7).
4. **9.7/7.7 — RTL decorative-edge mismatch**, 4 locations (homepage About 3-up, `/about`, `/memberships`, `/departments` list). Decide/execute: remove the `rtl:` border/padding-flip classes on these specific elements so decoration stays on the same physical edge as source (matching source's accidental non-mirroring exactly, per the "reproduce exactly" mandate) — do NOT touch `/feedback` or `/contact`, which are already correct.
5. **10.4 — `text-wrap: pretty` over-applied.** Remove the blanket base-layer rule; apply it only to the 77 specific source elements (or accept as a known, documented, low-severity simplification if per-element annotation is judged not worth the effort — flagging for a decision).
6. **6.5 — Breadcrumb separator not locale-aware**, 3 files (`ArticleView.tsx`, `DeptDetailView.tsx`, `InvestmentDetailView.tsx`). Fix: `lang === "en" ? "›" : "‹"` matching source.
7. **A.9 — Contact form missing focus-on-error.** Add `.focus()` on the first invalid field after failed validation.
8. **1.9 — Homepage Media section reveal-scope too broad.** Narrow the `<Reveal>` wrap to just the header row, matching source.
9. **A.2 — About Qom hero padding.** `80px 24px 84px` asymmetric, not `py-20` symmetric.
10. **3.6 — Hero crossfade easing curve.** Add explicit `ease` timing-function (`cubic-bezier(.25,.1,.25,1)`), not Tailwind's default.
11. **6.6 — Pagination click-on-active-page not a no-op.** Very low severity, guard against re-triggering on the already-active page.
12. **9.1 — RTL flip target DOM node differs.** Cosmetic/non-functional (confirmed no visual or behavioral difference) — lowest priority, optional to address.
