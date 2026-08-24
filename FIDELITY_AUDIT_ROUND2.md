# Fidelity Audit — Round 2 (independent re-derivation)

**Match: 165 · Different: 17 · Missing: 7 · Broken: 9 · Simplified: 1 — total 199 atomic findings**

*(One further row, 10.6, is a cross-reference to 1.17 and is deliberately not counted twice.)*

Audited: `E:\claude\design-export\Qom International Relations.dc.html` (markup 136–2611, inline `<style>` 18–133, behaviour script 2612–4412) + `E:\claude\design-export\i18n.js` **vs** `E:\claude\qom-international-relations` (`app/`, `components/`, `lib/`, `app/globals.css`).

Both loaded live and compared with computed-style / `getBoundingClientRect` introspection at **1400px**, **653px** and **390px**, in **EN** and **AR**, **light** and **dark**. Source served at `http://localhost:8934`, port at `http://localhost:3000`.

> **Method note.** The preview pane does not composite frames, so CSS *transitions* never advance and `getComputedStyle` returns the pre-transition value for any transitioned property. Every colour/padding measurement in this report was taken after injecting `*{transition:none !important}` on **both** pages, and every scroll-driven measurement was taken after dispatching a synthetic `scroll` event. Measurements taken without those precautions were discarded.
>
> **Accepted-as-is.** The source's `data-goto` hash router is not deep-linkable; the port's real Next.js routes are a deliberate improvement. Not counted as a finding. All 21 routes verified 200.
>
> **Dev-server note.** The dev server that was running when this audit began had a crashed render worker (`Jest worker encountered 2 child process exceptions`) and returned 500 for every dynamic route. It was killed and restarted; all routes then returned 200. Not a port defect.

---

## Headline regressions

Three findings dominate this round, and two of them are **new regressions introduced by the fix pass**:

1. **RTL mirroring is completely dead** (§9.1). `app/globals.css:132–135` `html, body { direction: ltr }` overrides the `dir="rtl"` attribute that `lib/i18n.tsx:55` sets on `<body>`. Measured computed `direction` on `<body>` in Arabic: `ltr`. Nothing mirrors.
2. **Because `rtl:` variants key off the *attribute*, they still fire** on top of an un-mirrored LTR layout, so every `rtl:` override the fix pass added now lands on the wrong edge (§9.2). Measured on `/departments` in Arabic: sidebar occupies 857..1270 (right, as in LTR) but its divider border and 30px padding are on its **right/outer** edge.
3. **The `/cooperation` "Cooperation Areas" grid lost its responsive collapse** (§7 note / §A.4). Source: 3 → 2 cols ≤1000px → 1 col ≤620px via `[data-coop-grid]`. Port: hard-coded `repeat(3, minmax(0,1fr))` with no breakpoint. Measured at 390px: three 99px-wide cards.

Plus a systemic dark-mode gap: every control whose colours are written as **React inline `style`** rather than `dark:` utilities stays in its light palette at night (§ 1.10, 1.22, 6.5, 6.7, 6.9, 11-adjacent).

---

## 1. Homepage

| # | Finding | Severity |
|---|---|---|
| 1.1 | Ribbon: 4-col `gap-px` grid on `rgba(11,31,58,.10)`, 20/14px cells, gold + teal icons, `hover:bg-gold/[.09]`. Measured 4×307.25px at 1400 (src identical). `app/page.tsx:54–65` ↔ src 340–369 | **Match** |
| 1.2 | Ribbon responsive: 2 cols ≤1000px, 1 col ≤620px (`globals.css:260–269`, `!important` beats the inline `gridTemplateColumns`). Measured 2×302px at 653. ↔ src 82–83 | **Match** |
| 1.3 | Ribbon dark: cell `#101827`, title `#EAE7E0`, sub `#8E97A5`. Measured identical to source. | **Match** |
| 1.4 | News teaser header: rule + `Newsroom` eyebrow + "Placeholder content" gold badge + `clamp(30px,3.2vw,44px)` h2 + "View All News" bordered link, `mb-[38px]`. `app/page.tsx:72–86` ↔ src 374–384 | **Match** |
| 1.5 | `[data-home-news]` `minmax(0,1.32fr) minmax(300px,0.88fr)` gap 30px; collapses to 1 col ≤940px. Measured 721.19/480.81 at 1400, 605px at 653. `components/home/HomeNews.tsx:14` + `globals.css:233–239` ↔ src 386, 69–70 | **Match** |
| 1.6 | Home feature card: 16:9 stripe placeholder "featured news image", Featured badge, teal category, mono date, `clamp(22px,2vw,29px)` clamped title, clamp-3 excerpt, "Read More →" pinned bottom, padding 30/32/34. `HomeNews.tsx:15–31` ↔ src 3320–3335 | **Match** |
| 1.7 | `[data-home-list]`: `repeat(4, minmax(0,1fr))` rows, 104px thumbs, 18/20px padding, `gap-px` hairlines, rows collapse to `none` ≤940px. Measured `114px 114px 124.88px 114px` at 653 (rows released). ↔ src 388, 3337–3347 | **Match** |
| 1.8 | Statements block: bordered white card, `#FAF8F4` header bar, 3px×26px gold rule, "Official notices" eyebrow, 20px serif h2, mono "View All Messages & Statements" link → `/news#statements-block`. `app/page.tsx:93–108` ↔ src 392–406 | **Match** |
| 1.9 | Home statement rows: `76px minmax(0,1fr) auto`, gap 18, padding 14/22, 4:3 thumb, clamp-2 title, teal category, mono date + gold arrow. `HomeNews.tsx:51–77` ↔ src 3304–3317 | **Match** |
| 1.10 | **Row separators do not repaint in dark.** `HomeNews.tsx:61` writes `borderTop: "1px solid rgba(11,31,58,.10)"` as an inline style with no dark counterpart. Measured port dark: `rgba(11,31,58,0.1)` on a `#151D2B` surface (invisible). Source dark rule (src 110–111) repaints it to `rgba(250,248,244,.16)` — measured on source. | **Broken** |
| 1.11 | About teaser: `About us` eyebrow, `clamp(30px,3.4vw,46px)` h2 (max 620px), 17px/1.75 lede (max 520px), "Read the full profile →" gold-underlined. `app/page.tsx:114–130` ↔ src 410–421 | **Match** |
| 1.12 | About 3-up Mission/Vision/Objectives: top rule, per-cell `40px 44px 40px 0` / `40px 44px` / `40px 0 40px 44px`, mono numerals, gold em-dashes, with correct `rtl:` mirrors. `app/page.tsx:132–156` ↔ src 424–451 | **Match** |
| 1.13 | About media pair: 380px navy stripe placeholder + gold strategy panel with `clamp(34px,4vw,56px)` padding and "See the strategy →". ↔ src 453–462 | **Match** |
| 1.14 | Cooperation section: 8 `data-card` tiles on a `gap-px` grid, `auto-fit minmax(280px,1fr)`, mono 01–08, `hover:bg-navy` with `[data-card]:hover [data-cardtitle]/[data-cardbody]` inversion (`globals.css:157–162`). ↔ src 483–524, 87–88 | **Match** |
| 1.15 | PCWG homepage block: President / Permanent Secretariat / Mandate tiles on `bg-bg/[.16]` hairlines, and the scrolling member/proposed list panel (max-h 540) with country groupings and the disclaimer line. `app/page.tsx:219–288` ↔ src 536–665 | **Match** |
| 1.16 | PCWG homepage map: 420px stage, striped basemap, 31 pins at the exact source percentages (1 chair + 15 current + 15 proposed), `qomPulse 2.8s ease-out infinite` ring on the chair, hover/click tooltip with `translate(-50%,-160%)`. `components/home/HomePcwgMap.tsx` ↔ src 562–611, 2935–2953 | **Match** |
| 1.17 | **Map region labels are not translated.** `HomePcwgMap.tsx:66` renders `{r.label}` raw. In Arabic the source shows `تركيا / القوقاز / العراق / إيران / شبه الجزيرة العربية / آسيا الوسطى / جنوب آسيا` (measured); the port shows `TURKEY / CAUCASUS / IRAQ / IRAN / ARABIAN PENINSULA / CENTRAL ASIA / SOUTH ASIA`. The dictionary does have them — `i18n.js` builds a lowercase `LOWER` index (line 1054) so `t("TURKEY")` resolves. | **Missing** |
| 1.18 | Chair pin has no tooltip and no hover ring. `HomePcwgMap.tsx:95` gates on `tip.kind !== "chair"`; source (2940) builds a label for the chair too (`"Qom"`, no suffix) and applies the `0 0 0 4px rgba(200,167,93,.25)` shadow to every pin including the chair. | **Different** |
| 1.19 | Investment teaser: 6 `data-invcard` tiles, `auto-fit minmax(min(100%,340px),1fr)` gap 24, `translateY(-4px)` + gold border on hover, and the full `[data-invpreview]/[data-invtag]/[data-invtitle]/[data-invbody]/[data-invlink]` hover-inversion set (`globals.css:175–195`). ↔ src 684–727, 90–95 | **Match** |
| 1.20 | Media teaser: 4 tabs and 4 panels (photo 4×4:3 / video 3 cards / docs bordered `gap-px` grid / press 3 cards), panels driven by `display:grid\|none` exactly as `syncDOM` does. `components/home/HomeMedia.tsx` ↔ src 730–843, 2715–2721 | **Match** |
| 1.21 | Media-teaser tab active state (`#0B1F3A` fill, `#FAF8F4` label) and dark gold via `[data-on]` (`globals.css:312–318`). | **Match** |
| 1.22 | **Inactive media-teaser tabs do not repaint in dark.** `HomeMedia.tsx:46–50` writes `color:"#3d4a5c"` / `border:1px solid rgba(11,31,58,.20)` inline. Measured port dark: `rgb(61,74,92)` on `#0E1420`, border `rgba(11,31,58,0.2)`. Source measured dark: `rgb(174,183,196)` / `rgba(250,248,244,0.16)`. | **Broken** |
| 1.23 | Reveal scope: the port wraps the whole media section (header **and** panels) in `<Reveal>` (`app/page.tsx:317–319`); the source puts `data-reveal` on the header block only (src 731). The panels therefore replay `qomReveal` in the port and do not in the source. | **Different** |
| 1.24 | Section rhythm: news `96/44`, statements `0/92`, about `100`, cooperation `100`, pcwg `100`, investment `100`, media `100` — all `px-6`, `max-w-[1280px]`. | **Match** |
| 1.25 | `<span id="activities">` anchor inside the cooperation section (src 467) has no counterpart in `app/page.tsx`. | **Missing** |

## 2. Header

| # | Finding | Severity |
|---|---|---|
| 2.1 | Sticky, `z-100`, `backdrop-filter: saturate(1.2) blur(6px)`, 1px bottom rule, `background/border-color/box-shadow` transition. `SiteHeader.tsx:125–137` ↔ src 138 | **Match** |
| 2.2 | Scroll-condense (measured after a synthetic scroll event at y=500): padding 14→**7**, logo mark 44→**36**px and 19→**16**px, sub-label `max-height` 20→**0** and `opacity` 1→**0**, navbar padding 7→**3**, header bg `.94`→**`.97`**, `box-shadow: 0 18px 38px -30px rgba(11,31,58,.62)`, border `.10`→**`.16`**, CTA vertical padding 13→**10**. Every value identical to `syncHeader` (src 4032–4058). | **Match** |
| 2.3 | Condensed CTA also shrinks **horizontally** to 15px (`SiteHeader.tsx:217` `padding: compact ? "10px 15px" : "13px 20px"`). The source only touches `paddingTop`/`paddingBottom` (src 4057), leaving 20px horizontal. Measured port condensed: `10px / 15px`. | **Different** |
| 2.4 | One navigation system per breakpoint: burger `display:none` ≥1024, navbar `display:none` <1024. Measured `none/block` at 1400 and `grid/none` at 653. ↔ src 51–52 | **Match** |
| 2.5 | Header-top padding 24px desktop, forced to 16px and gap to 12px ≤760px (`globals.css:212–230`). Measured 24/24 at 1400, 16/12 at 653. ↔ src 53–57 | **Match** |
| 2.6 | Search field drops to `order:6; flex:1 1 100%; max-width:none` ≤760px. Measured exactly that at 653. | **Match** |
| 2.7 | CTA forced to 12px / 11px 15px ≤760px. Measured. | **Match** |
| 2.8 | Nav rail gap is **24px** (`gap-6`, `SiteHeader.tsx:232`); source is **26px** (src 181). Measured 24 vs 26. | **Different** |
| 2.9 | Nav link active underline `#C8A75D` on the matching route. | **Match** |
| 2.10 | Mega triggers: click toggles, `mouseenter` opens on pointer devices only, `focus` opens, Escape closes, outside click closes, caret `rotate(180deg)`, `aria-expanded` tracked. Verified live by dispatching `focusin` → panel rendered, `aria-expanded="true"`. ↔ src 3077–3091 | **Match** |
| 2.11 | Active-group underline from the NAVGROUP map, including `/departments/[slug]` → municipality. Measured on `/cooperation`: `International Activities` trigger border `rgb(200,167,93)`, `Municipality` transparent. `SiteHeader.tsx:56–73` ↔ src 2693–2701, 2794 | **Match** |
| 2.12 | Mega panel: `repeat(auto-fit, minmax(238px,1fr))` gap 28, 34px padding, three link groups + navy promo card, `z-130`, bottom border, `0 44px 70px -46px` shadow. Measured 4×287px and the exact 6-link set. ↔ src 193–209 | **Match** |
| 2.13 | Mega-trigger label colour in dark: port `#EAE7E0` (`dark:text-dark-ink`); source measured `rgb(11,31,58)` — the source's `[style*="color: rgb(11, 31, 58)"]` rule does not take effect on those two `<button>`s. The port is more legible but diverges from what the source renders. | **Different** |
| 2.14 | Search box geometry: `flex:1 1 240px; min-width:180px; max-width:330px`, 15px magnifier, `#9aa3ae` placeholder, gold border on focus, `×` clear appears with content, Escape clears+blurs. `SearchBox.tsx` ↔ src 155–164, 4256–4261 | **Match** |
| 2.15 | Search panel: `top: calc(100% + 8px)`, `start-0`, `min(440px,86vw)`, `max-h-[62vh]`, `z-140`, 12-hit cap, per-row title + teal kind + gold arrow, "N results" footer, "No results found" empty state. Live query `pilgrim` → 2 rows + "2 results" (identical set to source). ↔ src 4232–4254 | **Match** |
| 2.16 | Search index parity: all 58 rows + 17 city rows, EN/localised/kind matching, `Home` mapped to `/` (`lib/data.ts:376`) rather than a bogus `/home`. ↔ src 4153–4217 | **Match** |
| 2.17 | Language toggle (header): active `#0B1F3A`/`#FAF8F4`, inactive transparent/`#6B7280`; in dark the active pill goes gold via `[data-on]` (`globals.css:312`), matching the source's `button[style*="background: rgb(11, 31, 58)"]` rule. Measured both = `rgb(217,188,126)`. | **Match** |
| 2.18 | Inactive language button colour in dark: port measured `rgb(107,114,128)` (`#6B7280`, hard-coded inline at `SiteHeader.tsx:186/195`); source measured `rgb(142,151,165)` (`#8E97A5`, src 117–118). | **Different** |
| 2.19 | Theme toggle: moon↔sun swap, 40px bordered square, gold hover, `qom-theme` in `localStorage`, `data-theme` on `<html>`. `lib/theme.tsx` ↔ src 3873–3897 | **Match** |
| 2.20 | Header CTA → `/contact`, 13px/500, navy fill, gold hover; dark gold via `[data-cta]`. | **Match** |
| 2.21 | Logo lockup: 44px gold-bordered navy `Q`, 16px serif name, 10.5px/.16em uppercase sub-label. Dark: mark `#0A1220` (matches the source's own `background: #0B1F3A → #0A1220` mapping), burger bars likewise `#0A1220` — the port reproduces the source's own low-contrast night quirk exactly. | **Match** |

## 3. Hero section

| # | Finding | Severity |
|---|---|---|
| 3.1 | 5 slides with the source's exact headings, ledes and CTA pairs. `HeroSlideshow.tsx:15–51` ↔ src 249–322 | **Match** |
| 3.2 | Heading semantics: slide 1 `<h1>`, slides 2–5 `<h2>`. Measured DOM order `H1,H2,H2,H2,H2`. ↔ src 255/270/285/300/315 | **Match** |
| 3.3 | CTA targets: slide 2 primary is an in-page `#pcwg` anchor and slide 4 primary is `#investment` (both plain `<a>`, matching the source's non-`data-goto` hrefs at src 273/303); the other eight are real routes. | **Match** |
| 3.4 | Autoplay `setInterval(..., 7000)`, `mouseenter` clears, `mouseleave` restarts, every prev/next/dot click restarts the timer. ↔ src 2842–2864 | **Match** |
| 3.5 | `qomKen 9s ease-out forwards` re-armed on each activation via a remount key (`HeroSlideshow.tsx:104`). Measured after a next-click: slides 0–3 carry `qomKen`, slide 4 `none`. Equivalent to the source's `animation:none; void offsetWidth; animation:qomKen…` restart (src 2641). | **Match** |
| 3.6 | `qomReveal .9s cubic-bezier(.22,.61,.36,1) both` on the slide body, re-armed the same way. ↔ src 2643 | **Match** |
| 3.7 | Outgoing slides keep their animations (the source never clears them); the port reproduces this deliberately. | **Match** |
| 3.8 | 1.1s opacity crossfade + `pointer-events` gating. ↔ src 249/264 | **Match** |
| 3.9 | Prev/next cluster physically `right:24px; bottom:28px`, 48px squares, `rgba(11,31,58,.35)` fill, gold hover — physical, not logical, so it stays on the right in RTL. Measured RTL source: cluster right-aligned; port likewise. ↔ src 324–327 | **Match** |
| 3.10 | Dot rail physically `left:24px; bottom:34px`, 34×3px, active `#C8A75D` / rest `rgba(250,248,244,.35)`. Measured active-dot tracking. ↔ src 329–335 | **Match** |
| 3.11 | Slide 3's heading is capped at 800px in the port; the source uses `max-width: 860px` for that slide only (src 285). | **Different** |
| 3.12 | The Ken-Burns layer carries an extra `overflow-hidden` (`HeroSlideshow.tsx:105`) that the source's `[data-ken]` does not have (src 250); it clips the corner "image placeholder" caption during the 1.12× zoom. | **Different** |
| 3.13 | Stage `height: min(70vh,660px); min-height:490px` — measured 630px on both at 900px viewport height. | **Match** |
| 3.14 | 90° navy gradient scrim `.94 → .80@48% → .30`. | **Match** |
| 3.15 | Dark: nav buttons take `rgba(250,248,244,.13)` — matching the source's `rgba(11,31,58,…) → rgba(250,248,244,.13)` mapping (src 108–109). | **Match** |

## 4. Mobile menu / drawer

Measured live at 390px with the drawer open.

| # | Finding | Severity |
|---|---|---|
| 4.1 | Panel `min(420px,88vw)` → measured **343px**, navy fill `rgb(11,31,58)`, `z-201`, `30px 0 60px -30px` shadow, `transform` transition 420ms `cubic-bezier(.22,.61,.36,1)`. ↔ src 215 | **Match** |
| 4.2 | Overlay `rgba(11,31,58,.55)`, `z-200`, opacity/`pointer-events` toggled, click closes. Measured `oklab(… / 0.55)`, opacity 1, `pointer-events:auto`. ↔ src 213, 2664–2674 | **Match** |
| 4.3 | Header block: mono "Menu" eyebrow, "Browse dedicated pages", 40px `×` close with gold hover, 22/26 padding, hairline. ↔ src 216–222 | **Match** |
| 4.4 | 15 links in exactly the source's order and 3 group labels (`International Activities`, `Municipality`, `Media & contact`). Measured link list identical to src 225–242. | **Match** |
| 4.5 | Active row: `border-left: 2px #C8A75D`, `background rgba(250,248,244,.08)`, `color #FAF8F4` — physical `border-left`, as in `syncDOM` (src 2655–2660). | **Match** |
| 4.6 | Footer block "Qom Municipality / International Relations & Communications Department" with top hairline, 20/26 padding, 12px/1.7. ↔ src 245 | **Match** |
| 4.7 | Escape closes; route change closes (`SiteHeader.tsx:91–112`) — the source closes on `openPage` (src 2983). | **Match** |
| 4.8 | RTL side: `left-0 rtl:left-auto rtl:right-0` + `translateX(100%)` when closed. Measured in Arabic: panel parked at 1385..1805 (off-screen right). Correct — and it survives the broken `direction` because the `rtl:` variant matches on the `dir` attribute. ↔ src 2666–2669 | **Match** |
| 4.9 | Overlay in dark takes `rgba(250,248,244,.13)`, matching the source's own mapping of its `rgba(11,31,58,.55)` inline. | **Match** |

## 5. Animations — all six keyframes

| # | Finding | Severity |
|---|---|---|
| 5.1 | All six `@keyframes` present with byte-identical frames (`globals.css:53–106` ↔ src 24–29). Enumerated live from the CSSOM: `qomPulse, qomBob, qomKen, qomReveal, qomFlow, qomGlow`. | **Match** |
| 5.2 | `qomPulse 2.8s ease-out infinite` — one instance, the PCWG chair pin ring. Measured on both. ↔ src 573 | **Match** |
| 5.3 | `qomKen 9s ease-out forwards` — hero slides only. ↔ src 2641 | **Match** |
| 5.4 | `qomReveal .8s cubic-bezier(.22,.61,.36,1) both` — `Reveal` (IO) blocks. ↔ src 2834 | **Match** |
| 5.5 | `qomReveal .9s …` — hero slide bodies. ↔ src 2643 | **Match** |
| 5.6 | `qomReveal .5s …` with staggered `animation-delay`: news cards `min(i,11)*35ms`, statement cards `min(i,8)*40ms`, investment cards `min(i,11)*32ms`. ↔ src 3279 / 3292 / 3501 | **Match** |
| 5.7 | `qomFlow` — 16 lines on `/pcwg`; measured durations 11,12,…,18s (gold, `stroke-opacity .55`, dash `7 9`) and 16,17,…,23s (teal, `.28`, dash `3 10`). Byte-identical to src 1596. Timing confirmed correct after the fix pass. | **Match** |
| 5.8 | `qomGlow 5s ease-in-out infinite` — exactly 2 instances (`PcwgConstellation` r=90/.05, `PcwgNetwork` r=74/.07), matching src 1572 and 1596 including the differing radii and opacities. | **Match** |
| 5.9 | `qomBob` is defined but referenced nowhere — in **both** source and port. Faithful. | **Match** |
| 5.10 | IntersectionObserver options `{threshold: 0.12, rootMargin: "0px 0px -6% 0px"}` + `unobserve` after first fire; content is never hidden by JS. `components/Reveal.tsx` ↔ src 2828–2840 | **Match** |
| 5.11 | `[data-invopt] { transition: background .2s ease; }` (src 72) is absent from `globals.css` — only the two `:hover` rules (168–173) were ported. Measured `transition-property: none` on `/investment` filter rows, so the gold wash snaps instead of fading. | **Missing** |
| 5.12 | Video preview: hover on pointer devices / tap toggle on touch, thumbnail `scale(1.06)` over `transform 3.5s ease`, hint label swaps to "Tap to preview · muted". `components/VideoCard.tsx` ↔ src 2889–2933 | **Match** |

## 6. News pages

### `/news`

| # | Finding | Severity |
|---|---|---|
| 6.1 | Hero: dot-grid + masked background, newspaper motif at `end-[1%]`, breadcrumbs, `clamp(34px,4.4vw,58px)` h1, 17px lede, gold "News" + outlined "Messages & Statements" jump buttons (12px/18px). ↔ src 848–860 | **Match** |
| 6.2 | Section headers (`Category A` / `Category B`), copy, and the mono totals — measured "75 articles in the archive" and 33 statements, matching the generated datasets exactly. ↔ src 862–944, 3929 | **Match** |
| 6.3 | Featured card: `auto-fit minmax(330px,1fr)`, 330px striped image, Featured/category/date row, `clamp(24px,2.6vw,34px)` title, fixed excerpt, "Read More →" box, `margin-bottom:46px`. Hidden when a category/year/query narrows the list (measured: disappears on filter). ↔ src 875–887, 3962–3976 | **Match** |
| 6.4 | Search + Sort controls (`flex 1 1 320px` / `0 1 260px`, mono "Sort" label, Newest/Oldest First). ↔ src 889–901 | **Match** |
| 6.5 | Category filter chips: 8 news + 6 statement labels in source order, body face, 12.5px, `9px 15px`, active navy fill. **Measured light: exact match.** | **Match** |
| 6.6 | **Filter chips do not repaint in dark.** `ArchiveSection.tsx:148/160` writes `color:"#3d4a5c"` and `borderColor:"rgba(11,31,58,.20)"` as inline styles. Measured port dark: `rgb(61,74,92)` / `rgba(11,31,58,0.2)`. Source dark: `rgb(174,183,196)` / `rgba(250,248,244,0.16)`. | **Broken** |
| 6.7 | Archive rail: "News archive"/"Statements archive" label, mono chips 12px/.04em/`8px 14px` with `(n)` counts at `opacity .55`, month row revealed on year select with its own top rule. **Measured light: exact match.** ↔ src 913–919, 3981–4008 | **Match** |
| 6.8 | **Archive year/month chips do not repaint in dark** — same inline-style cause. Measured `rgb(61,74,92)` / `rgba(11,31,58,0.18)` vs source `rgb(174,183,196)` / `rgba(250,248,244,0.16)`. | **Broken** |
| 6.9 | Meta row: measured port `1–9 / 9 ArticlesInternational MeetingsClear filters` — character-identical to the source's meta row under the same filter. Range/unit/active-chip logic matches `renderList` (src 3931–3949). | **Match** |
| 6.10 | **"Clear filters" typography diverges.** Port (`ArchiveSection.tsx:204`, reuses `chipBase`): measured `12px / letter-spacing .48px / text-transform none / padding 8px 14px`. Source (src 3945): measured `10.5px / 1.47px (.14em) / uppercase / 8px 13px`. | **Different** |
| 6.11 | "Clear filters" also lacks `data-chipbtn`, so it has no gold hover, and its inline `color:#0B1F3A` stays navy in dark (source: `#EAE7E0`). | **Different** |
| 6.12 | **Load More is present and correct.** Measured port "Load More News (63)" ≡ source "Load More News (63)"; mono 11.5px/.16em/uppercase, `16px 30px`, `margin-top 34px`, gold hover, remainder recomputed, resets on every other control (the `Extra` counter). ↔ src 926–928, 3951–3957 | **Match** |
| 6.13 | Pagination: identical `pageList` keep-set algorithm, `…` gaps, `min-width:44px`, `12px 15px`, active navy, disabled `opacity .3`, hidden when `pages <= 1`. `lib/data.ts:440–452` ↔ src 3250–3274 | **Match** |
| 6.14 | Pagination margins: `margin-top 36px`, `padding-top 30px`, top hairline — measured 36px on `/news`. ↔ src 929 | **Match** |
| 6.15 | Pagination scroll-back to `#news-block` / `#statements-block` (`scrollIntoView` honouring `html { scroll-padding-top: 96px }`). ↔ src 3126–3127 | **Match** |
| 6.16 | Prev/next and number buttons lack `data-chipbtn`, so they have no gold hover; the source adds it to every enabled pager button (src 3266). Their dark colours **are** correct (`dark:text-dark-ink`, `dark:border-dark-line` — measured `rgb(234,231,224)` / `rgba(250,248,244,0.16)`). | **Different** |
| 6.17 | RTL pager arrow flip (`→ Previous` / `Next ←`) in Arabic. `Pagination.tsx:38/62` ↔ src 3267/3272 | **Match** |
| 6.18 | Empty state: dashed `rgba(11,31,58,.22)` border, `62px 24px`, 20px serif line + 14px gray line, per-list copy. ↔ src 922–925, 976–979 | **Match** |
| 6.19 | News card: 16:9 stripe placeholder, teal category, mono date, clamp-2 title `min-h 52px`, clamp-3 excerpt `min-h 70px`, "Read More →" pinned, `22px 24px 24px` padding, `aria-label`. `components/NewsCard.tsx:7–38` ↔ src 3276–3287 | **Match** |
| 6.20 | Statement card: `216px minmax(0,1fr) 216px`, `border-inline-start: 3px #C8A75D`, gold-wash category pill, clamp-2 title `min-h 57px`, "Read Statement →", `data-msgmeta` with Issued by / Reference. Collapses to `200px 1fr` ≤1040 (meta spans, gains a top rule) and to 1 col ≤700 with `min-height:190px` image. **Measured at 390: `338px`, meta `1 / -1`, `border-inline-start-width 0`, `border-top-width 1px`, image `min-height 190px`.** ↔ src 59–67, 3289–3302 | **Match** |
| 6.21 | Per-page counts 12 (news) / 6 (statements). Measured 12 cards + 6 msg cards. ↔ src 3901–3902 | **Match** |
| 6.22 | Dataset generation is a 1:1 port (months loop, `mi % 3` / `mi % 4` cadence, title/category rotation, `stamp`). `lib/data.ts:34–147` ↔ src 3153–3225 | **Match** |

### `/news/[slug]`

| # | Finding | Severity |
|---|---|---|
| 6.23 | Hero: 1080px measure, `76px/66px` padding, breadcrumbs `Home › News|Messages & Statements › Category` with the locale-aware `›`/`‹` separator, `clamp(29px,3.7vw,50px)` h1, mono meta row (gold category • date • author/issuing office). ↔ src 2490–2504, 3414–3422 | **Match** |
| 6.24 | Body: 16:9 striped image with kind-aware label, `[caption and photo credit]` at 12/40 margins, serif lede paragraph `clamp(19px,1.8vw,23px)` + 16px/1.8 body, `max-w 780px`, gap 22. ↔ src 2506–2512, 3425–3427 | **Match** |
| 6.25 | Share row: X / Telegram / LinkedIn / Facebook 42px buttons + mono "Copy link", `navigator.clipboard`, status text that clears after 2800ms, kind-aware message. ↔ src 2514–2524, 3856–3870 | **Match** |
| 6.26 | Related block: "More on this subject" eyebrow, kind-aware h2 and back-link label + `#news-block`/`#statements-block` target, `relatedFor` same-category-first ordering, 3 cards. ↔ src 2527–2541, 3393–3398, 3429–3435 | **Match** |

## 7. Department pages

### `/departments`

| # | Finding | Severity |
|---|---|---|
| 7.1 | Hero with the skyline motif, `max-width: 660px` lede, breadcrumbs `Home › Municipality › Municipal Deputy Departments`. ↔ src 1429–1437 | **Match** |
| 7.2 | **Outer border restored**: `border border-navy/[.12]` around the `gap-px` stack (`app/departments/page.tsx:31`). Measured `1px rgba(250,248,244,0.16)` in dark / `rgba(11,31,58,.12)` in light. ↔ src 1438 | **Match** |
| 7.3 | **Full-length listing copy restored** — all six `listing` strings byte-match src 1443/1452/1461/1470/1479/1488 (`lib/data.ts:325/332/339/346/353/360`). | **Match** |
| 7.4 | Row layout `minmax(0,1.7fr) minmax(220px,1fr)` gap 40, `p-9.5` (38px), mono `01`–`06`, 25px serif h2, 620px copy measure, "Explore Activities →". ↔ src 1439–1446 | **Match** |
| 7.5 | Cooperation-interests aside: inline-start divider + 30px padding, mono eyebrow, 13.5px/1.9 list. Correct in LTR. ↔ src 1446 | **Match** |
| 7.6 | No responsive collapse for the 1.7fr/220px row — **matching the source**, which also has no breakpoint for it. | **Match** |
| 7.7 | Wrapper padding `72px 24px 96px`. | **Match** |

### `/departments/[slug]`

| # | Finding | Severity |
|---|---|---|
| 7.8 | Hero `78px/72px`, breadcrumbs, per-department motif SVG at `end-[2%]` `opacity .5` tinted with `dept.hero`, `clamp(31px,4.1vw,54px)` h1, 640px lede. ↔ src 1497–1507, 3714–3726 | **Match** |
| 7.9 | **Mono eyebrow present**: `Deputy department · NN` in `IBM Plex Mono` 11px/.2em/uppercase coloured `dept.hero`. `DeptDetailView.tsx:53` ↔ src 1503, 3723 | **Match** |
| 7.10 | `[data-deptd-layout]` `minmax(0,1.6fr) minmax(280px,1fr)` gap 56 → 1 col with gap 44 ≤940px (`globals.css:244–247`). Measured collapse at 653. ↔ src 78, 1509 | **Match** |
| 7.11 | Outer borders on all four hairline stacks (responsibilities, projects, partnerships, meetings) — measured `1px` + `gap-px` on each. ↔ src 1517/1533/1540/1545 | **Match** |
| 7.12 | Accent switching `theme === "dark" ? dept.hero : dept.ink` for numerals, project refs and "Active" labels. `DeptDetailView.tsx:24` ↔ src 3720 | **Match** |
| 7.13 | Facts card + navy International-contact card + gold "Contact Us" button. ↔ src 1520–1527, 3738–3741 | **Match** |
| 7.14 | Portfolio cards with `border-top: 2px dept.hero` and `QOM-NN-0i` refs; partnerships and meetings rows. ↔ src 3744–3757 | **Match** |
| 7.15 | Related-news block: `mt-19` (76px) + top rule + white surface, "View All News", 3 category-matched cards. Bottom padding is **72px** (`py-18`); the source uses `72px 24px 76px` (src 1550). | **Different** |
| 7.16 | Photo-gallery tile background diverges: port uses `repeating-linear-gradient(135deg, rgba(200,167,93,.16) 0 2px, transparent 2px 11px)` (`DeptDetailView.tsx:162`); the source uses a 45°/−45° checkerboard at `rgba(200,167,93,.07)` with `background-size: 46px 46px` (src 3762). | **Different** |
| 7.17 | Gallery grid `auto-fit minmax(min(100%,240px),1fr)` gap 20, 4 tiles, wrapper `72px/96px`. | **Match** |

## 8. Investment pages

### `/investment`

| # | Finding | Severity |
|---|---|---|
| 8.1 | Hero with the bar-chart motif, `max-width: 660px` lede, breadcrumbs `Home › Municipality › Investment Opportunities`. ↔ src 2090–2098 | **Match** |
| 8.2 | Search + 4-option sort (`Newest reference`, `Title A–Z`, `By category`, `By district`) and the identical `invFilter` sort comparators. `lib/data.ts:276–301` ↔ src 3478–3492 | **Match** |
| 8.3 | `[data-inv-layout]` `268px minmax(0,1fr)` gap 36 → 1 col ≤940px. Measured `605px` at 653. ↔ src 77, 2116 | **Match** |
| 8.4 | Filter rail: "Refine" + "Reset all", three bordered groups (Category / District / Status) with counts, 16px checkbox rows, `rgba(200,167,93,.14)` active wash and 600-weight label. Measured 18 option rows, active box `#0A1220` in dark. ↔ src 2117–2139, 3515–3526 | **Match** |
| 8.5 | Investor-desk card. ↔ src 2134–2138 | **Match** |
| 8.6 | Meta row range/unit and the Clear-filters chip (10.5px/.14em/uppercase here, unlike the news one). ↔ src 3589–3603 | **Match** |
| 8.7 | Card grid `auto-fill minmax(292px,1fr)` gap 26, 9 per page; measured 9 cards + pager. ↔ src 2143, 3547 | **Match** |
| 8.8 | Investment card: 16:9 placeholder, `start-3` status badge on `rgba(250,248,244,.92)`, teal category, clamp-2 title `min-h 50px`, pin + district, clamp-2 summary `min-h 43px`, ref + "View Details →", `20px 22px 22px` padding. ↔ src 3498–3513 | **Match** |
| 8.9 | Pagination `margin-top: 42px` (measured) and scroll-back to the meta row. ↔ src 2148, 3638–3639 | **Match** |
| 8.10 | Empty state. ↔ src 2144–2147 | **Match** |
| 8.11 | **Investor-resources grid is missing its outer border.** Source (src 2154) has `border: 1px solid rgba(11,31,58,.12)` around the `gap-px` trio; `app/investment/page.tsx:196` has only `grid gap-px bg-navy/[.12]`. Measured `border-top-width: 0px`. | **Missing** |
| 8.12 | Investor-resources spacing `margin-top 86px` / `padding-top 76px` + top rule. | **Match** |
| 8.13 | Dataset generation is a 1:1 port of `INVEST()` (18 items, ref/district/status/type/date/lat/lng formulas). `lib/data.ts:227–261` ↔ src 3442–3476 | **Match** |

### `/investment/[slug]`

| # | Finding | Severity |
|---|---|---|
| 8.14 | Hero: breadcrumbs, gold status pill (`6px 10px`), teal category chip, mono ref, `clamp(28px,3.5vw,46px)` h1, pin + district line, `76px/66px` padding. ↔ src 2409–2422, 3788–3795 | **Match** |
| 8.15 | Category chip padding is `5px 10px` (`px-2.5`); the source is `5px 9px` (src 2416). | **Different** |
| 8.16 | Category chip colour `#46CFCF` in both themes — the source hard-codes that same value inline (src 2416), so this is faithful, not a dark-mode leak. | **Match** |
| 8.17 | Gallery: 21:9 hero tile + `auto-fit minmax(150px,1fr)` row of four 4:3 tiles, gap 12. ↔ src 2424–2436 | **Match** |
| 8.18 | `[data-invdetail-body]` `minmax(0,1fr) 340px` gap 44 → 1 col ≤940px. Measured `605px` at 653. ↔ src 84, 2439 | **Match** |
| 8.19 | `[data-inv-aside]` `position: sticky; top: 132px` **only** ≥941px. Measured `static` at 653, sticky at 1400. ↔ src 85 | **Match** |
| 8.20 | Specifications: `auto-fit minmax(230px,1fr)` `gap-px` **with** outer border (measured `1px`), 2 gold-inset date cards (15.5px/600 values) + 10 spec cards. ↔ src 2445, 3805–3823 | **Match** |
| 8.21 | Documents list with outer border, file glyph, title/kind stack, "Download PDF →". ↔ src 2448, 3825–3837 | **Match** |
| 8.22 | Location: 16:9 map placeholder linking to `https://www.google.com/maps?q=lat,lng`, centre pin with `0 0 0 6px rgba(200,167,93,.25)`, coords bar with `border-top: 0` and "Open in Google Maps →". ↔ src 2450–2455, 3839–3843 | **Match** |
| 8.23 | Key-facts card: `1px rgba(11,31,58,.14)` box with a `3px #C8A75D` top edge. Measured `border-top: 3px rgb(200,167,93)`, sides `1px …/0.14` — the `border` / `border-t-3` ordering resolves correctly. ↔ src 2459 | **Match** |
| 8.24 | Enquiries card + gold "Submit an enquiry →" with `hover:bg-bg`. ↔ src 2463–2468 | **Match** |
| 8.25 | Related opportunities: "Same category" eyebrow, `clamp(26px,2.8vw,38px)` h2, "All opportunities" link, same-category-first 3-card selection. ↔ src 2473–2487, 3850–3853 | **Match** |

## 9. RTL mode

| # | Finding | Severity |
|---|---|---|
| 9.1 | **RTL mirroring never applies.** `lib/i18n.tsx:55` sets `document.body.dir = "rtl"`, but `app/globals.css:132–135` declares `html, body { direction: ltr; }` — an author rule that outranks the UA's `[dir=rtl] { direction: rtl }` presentational hint. **Measured in Arabic at 1400px:** `body.dir === "rtl"` but `getComputedStyle(body).direction === "ltr"`; logo `77..206` (left), CTA `1219..1309` (right), first nav link `77..124`, first ribbon cell `77..384`, hero `<h1>` `77..877`. The source flips its inner root instead (`root.style.direction = rtl`, src 2752) and measures the exact mirror: logo `1179..1308`, CTA `76..165`, nav `1261..1308`, ribbon `1001..1308`, h1 `508..1308`. Verified causally: injecting `body[dir="rtl"]{direction:rtl!important}` in the live page immediately mirrors the departments layout (`main 568..1270`, `side 116..528`). | **Broken** |
| 9.2 | **`rtl:` overrides fire on top of the un-mirrored layout.** Tailwind's `rtl:` variant matches the `dir` **attribute**, which *is* `rtl`, so every override the fix pass added applies while the base layout is still LTR — landing on the wrong edge. **Measured on `/departments` in Arabic:** the aside is still at `857..1270` (right, LTR position) but `border-right: 1px` / `padding-right: 30px` / `border-left: 0` / `padding-left: 0` — the divider is drawn on the card's outer edge and the aside text is flush against the main column. Same failure mode for `app/page.tsx:137/145` (about columns), and for the `rtl:` overrides in `app/about`, `app/contact`, `app/feedback`, `app/memberships`. | **Broken** |
| 9.3 | Consequence of 9.1: the back-to-top button uses the correct logical `end-6` but resolves to `right: 24px` in Arabic (measured `inset-inline-end: 24px; direction: ltr`). The source measures `26..76` — the **left** edge. | **Broken** |
| 9.4 | Hero prev/next cluster and dot rail are physically pinned (`right-6` / `left-6`), so they stay on the correct physical sides in Arabic — matching the source's `right: 24px` / `left: 24px`. | **Match** |
| 9.5 | Drawer opens from the right in Arabic (measured parked at `1385..1805`). | **Match** |
| 9.6 | `<html dir="ltr">` is preserved so the browser scrollbar stays on the right, exactly as the source intends (src 30–31, 4138–4139). | **Match** |
| 9.7 | Pagination arrows mirror in Arabic (`→ Previous` / `Next ←`). | **Match** |
| 9.8 | **No `ltr:` prefixes remain anywhere** in `app/`, `components/` or `globals.css` — the round-1 double-apply bug is genuinely gone. Repo-wide grep returns zero hits. | **Match** |
| 9.9 | Logical properties used where the source uses them: `border-s`/`border-inline-start` on statement cards and meta panels, `start-3` on investment status badges, `start-0` on the search panel, `end-[1%]`/`end-[2%]` on hero motifs. Correct in intent — currently inert because `direction` is stuck LTR. | **Match** |

## 10. Arabic mode

Coverage sampled by walking every **visible** text node on both pages and diffing the set of strings that still contain Latin letters.

| # | Finding | Severity |
|---|---|---|
| 10.1 | `lib/i18n-data.js` is byte-identical to `design-export/i18n.js` apart from unicode escaping (`\u2190` vs `←`) and two dropped comment lines. Diff verified. | **Match** |
| 10.2 | `translate()` semantics preserved: exact key, lowercase fallback index, and the ornament-stripping branch that mirrors `←`/`→` while translating the core label. | **Match** |
| 10.3 | Font swap: `html[lang="ar"] body { font-family: var(--font-kufi) }` + `html[lang="ar"] .font-serif { … }` (`globals.css:345–350`). Measured body face in Arabic: `"Noto Kufi Arabic"`. Mono labels stay in IBM Plex Mono, as in the source's `fontEls` logic (src 4091–4115). | **Match** |
| 10.4 | **Homepage:** the port's untranslated-string set is identical to the source's, except for the map labels (10.6). Both leave the five hero image placeholders, the six investment teaser titles, the four bracketed news/statement headlines, `image`, `image placeholder — qom municipality`, and `regional basemap placeholder — 25°E–90°E` in English (no dictionary entries exist for them). | **Match** |
| 10.5 | **`/investment`:** untranslated sets are character-for-character identical (38 strings: sort options, `Status`, `Investor desk`, `Opportunities`, `Investor resources`, card titles/summaries, `QOM-INV-*` refs, resource titles). The `← تحميل PDF` arrow flip works. | **Match** |
| 10.6 | PCWG map region labels untranslated — 7 strings. *(Cross-reference to 1.17; counted once, there.)* | — |
| 10.7 | **`/departments/planning`:** untranslated sets identical (6 strings, all refs and bracketed headlines). | **Match** |
| 10.8 | **`/pcwg` network SVG labels untranslated.** The port renders literal `QOM` and `PRESIDENT` in `<text>` (`PcwgNetwork.tsx:66/67`); the source renders `قم` and `الرئاسة` (measured). City node names *are* translated in both. | **Missing** |
| 10.9 | **`/pcwg` gallery captions diverge and are untranslated.** The port composes `photo placeholder — {caption.toLowerCase()}` from a separate `GALLERY` list (`app/pcwg/page.tsx:63–70, 252`), producing e.g. `photo placeholder — visiting delegation of member cities`; the source has `photo placeholder — delegation visit` / `video placeholder — plenary session` etc. (six distinct captions, measured). Because the label is split across two text nodes it also can't be translated. Video tiles additionally fall back to the generic `video thumbnail` label from `VideoCard`. | **Different** |
| 10.10 | Filter/tab chip labels render in `IBM Plex Sans` in Arabic (`ArchiveSection.tsx:100` `font-sans`, `app/investment/page.tsx:33` `font-sans`) and therefore fall back to a system Arabic face; the source uses `font-family: inherit`, which becomes Noto Kufi Arabic. Measured chip font in AR: `"IBM Plex Sans"`. | **Different** |
| 10.11 | `<html lang>` follows the locale and `dir` stays `ltr`, matching `initLang` (src 4129–4143). Locale persisted in `localStorage` under `qom-lang`. | **Match** |
| 10.12 | Breadcrumb separator switches `›`→`‹` in Arabic (`Breadcrumbs.tsx:10`, `ArticleView.tsx:49`, `DeptDetailView.tsx:48`, `InvestmentDetailView.tsx:62`) ↔ src 3412/3712/3786/4019. | **Match** |
| 10.13 | Page-level heading inventory verified across all 17 sub-pages: every `h1`/`h2` on `/about`, `/about-qom`, `/cooperation`, `/departments`, `/departments/[slug]`, `/pcwg`, `/memberships`, `/events`, `/meetings`, `/culture`, `/investment`, `/investment/[slug]`, `/feedback`, `/media`, `/contact`, `/news`, `/news/[slug]` matches the source's `data-page` sections exactly, in order. | **Match** |

## 11. Footer

Measured element-by-element against the source at 1400px.

| # | Finding | Severity |
|---|---|---|
| 11.1 | Surface `#0B1F3A` / `rgba(250,248,244,.72)`; dark `#0A1220`. Inner padding measured **72px 24px 32px** on both. ↔ src 2550–2551 | **Match** |
| 11.2 | Column grid `repeat(auto-fit, minmax(190px,1fr))`, gap **44px**, 5 columns. Measured 211.19px vs source 211.2px. ↔ src 2552 | **Match** |
| 11.3 | Identity block: 40px gold-bordered `Q` (measured 38.19×40 vs source 38.18×40 — identical flex shrink), 15px `IBM Plex Serif` name. ↔ src 2555–2556 | **Match** |
| 11.4 | **Sub-label correct**: `International Relations`, measured **10px / letter-spacing 1.6px (.16em) / uppercase / `rgb(200,167,93)`** on both. ↔ src 2556 | **Match** |
| 11.5 | **Tagline correct**: "Urban diplomacy, international cooperation and municipal partnerships for the city of Qom.", measured **13.5px / line-height 22.95px** on both. ↔ src 2558 | **Match** |
| 11.6 | 6 social links (Instagram, X, Telegram, LinkedIn, YouTube, Facebook), 38px squares, `href="#top"` — matching the source's placeholder targets — gold hover + `rgba(200,167,93,.12)` wash, `margin-top 22px`, gap 9px. ↔ src 2559–2566 | **Match** |
| 11.7 | Column headings measured **11.5px / 1.84px (.16em) / uppercase / gold**, `margin-bottom 18px`; link stacks `gap 11px` at 13.5px with gold hover; all four column titles and every link target match. ↔ src 2568–2594 | **Match** |
| 11.8 | Contact column: 4-line address block at 13.5px/1.8. ↔ src 2597 | **Match** |
| 11.9 | Bottom bar measured **margin-top 52px / padding-top 24px / 12.5px** with a `rgba(250,248,244,.14)` top rule and the exact © line. ↔ src 2601–2602 | **Match** |
| 11.10 | Footer language toggle: gold active pill on navy, `rgba(250,248,244,.72)` inactive — the source's footer-specific palette (src 2603–2606, 2743–2750). | **Match** |
| 11.11 | **Back-to-top button built and correct**: `position: fixed`, `inset-inline-end: 24px`, `bottom: 24px`, 54px circle, `z-150`, `1px rgba(200,167,93,.55)` border, navy fill (dark `#0A1220`), gold glyph, gold-fill hover, `0 22px 46px -22px` shadow, `opacity 0→1` / `translateY(16px) scale(.94) → none` over `.45s cubic-bezier(.22,.61,.36,1)`, threshold **300px** (verified via a synthetic scroll event: opacity 0 → 1), and a hand-rolled cubic ease glide identical to `glide()`. `components/BackToTop.tsx` ↔ src 2546–2548, 4276–4300 | **Match** |

## A. Cross-cutting / appendix

| # | Finding | Severity |
|---|---|---|
| A.1 | **`text-wrap: pretty` is never emitted.** The source applies it to 96 headings/paragraphs (measured live: 96 of 492 elements resolve `text-wrap-style: pretty`); the port measures **0 of 80** on the homepage, including the hero `<h1>`. Affects headline ragging site-wide. src 255/256/416/459/475/478 and ~90 more. | **Missing** |
| A.2 | **`white-space: nowrap` on chips/pagers/tabs not ported** (src 45–46: `[data-chipbtn], [data-arch-page], [data-news-filters] button, [data-msg-filters] button, [data-event-filters] button, [data-media-tabs] button`). Measured `white-space: normal` on `/news` filter chips, archive chips and pager buttons, so long labels break mid-phrase instead of wrapping as whole rows. | **Missing** |
| A.3 | **`[data-coop-grid]` responsive rules not ported** (src 80–81: 2 cols ≤1000px, 1 col ≤620px). `app/cooperation/page.tsx:37` hard-codes `repeat(3, minmax(0,1fr))` with no `data-coop-grid` attribute and no matching rule in `globals.css`. **Measured at 653px: `187px 187px 187px`. Measured at 390px: `99.33px 99.33px 99.34px`** — the six Cooperation Areas cards are unusable on mobile. | **Broken** |
| A.4 | Feedback star-rating buttons keep `color:#6B7280` and `borderColor:rgba(11,31,58,.20)` in dark (`app/feedback/page.tsx:108`, inline style). Measured port dark: `rgb(107,114,128)` / `rgba(11,31,58,0.2)`; source dark: `rgb(142,151,165)` / `rgba(250,248,244,0.16)`. | **Broken** |
| A.5 | `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` is correctly wired and reaches every route — verified by measuring `dark:` utilities firing on the header, cards, panels, borders, inputs, selects, submit buttons, pagination, Load More, investment rail, forms, footer and all 17 sub-pages. The residual dark gaps (1.10, 1.22, 6.6, 6.8, A.4, 2.18, 6.11) are all elements whose colours were left as React inline `style` rather than converted to `dark:` utilities. | **Match** |
| A.6 | Dark surface palette exact-value check (port vs source, both measured with transitions disabled): body `#0E1420`/`#0E1420`; header `rgba(13,19,31,.93)`/same; header border `rgba(250,248,244,.16)`/same; card + panel `#151D2B`/same; ribbon + page ground `#101827`/same; navy blocks `#0A1220`/same; body copy `#AEB7C4`/same; mono gray `#8E97A5`/same; graylight `#7C8593`/same; teal `#46CFCF`/same; CTA/`[data-on]` `#D9BC7E` on `#0B1F3A`/same; footer `#0A1220`/same. | **Match** |
| A.7 | `a { color }` / `a:hover` and `input,textarea,select,button { font-family: inherit }` are inside `@layer base` (`globals.css:122–129`, `138–145`) so `text-*` and `font-*` utilities outrank them — verified live (gold breadcrumbs, mono chips, `rgba(250,248,244,.72)` footer links all win). The dark `a` override is layered the same way (323–330). | **Match** |
| A.8 | `[data-card]:hover` box-shadow plus the `[data-cardtitle]`/`[data-cardbody]` inversion are scoped so they cannot bleed: `NewsCard`, `InvestmentCard` and the home feature card carry `data-card` but no `data-cardtitle`/`data-cardbody`, exactly as in the source. The round-1 hover-text bug is genuinely fixed. | **Match** |
| A.9 | `html { scroll-padding-top: 96px }`, `* { box-sizing: border-box }`, `body { margin: 0 }`, `body { overflow-x: clip }`, `summary::-webkit-details-marker { display:none }`, `[data-clamp2]`/`[data-clamp3]` — all ported verbatim. No horizontal overflow measured at 1400 / 653 / 390 on any page. | **Match** |
| A.10 | `[data-search-input]::placeholder`/`:focus` and `[data-arch-input]::placeholder`/`:focus` (src 33–34, 40–41) are expressed as `placeholder:text-graylight` / `outline-none` utilities instead of attribute rules — measured equivalent. | **Match** |
| A.11 | `[data-qom] svg, [data-qom] img { max-width: 100% }`, `[data-qom] a { display: inline-block }` and `[data-qom] p a, [data-qom] span > a { display: inline }` (src 42–43, 47) have no counterpart; the port relies on Tailwind/React defaults. No layout divergence was observable at any breakpoint, so this is a reduced-but-equivalent expression rather than a defect. | **Simplified** |
| A.12 | Page metadata: `<title>` and `<meta name="description">` byte-match src 12–13. | **Match** |
| A.13 | All 21 routes return HTTP 200 after a clean dev-server restart (`/`, `/news`, `/news/n0`, `/news/s0`, `/about`, `/about-qom`, `/cooperation`, `/memberships`, `/events`, `/meetings`, `/culture`, `/departments`, `/departments/planning`, `/departments/architecture`, `/investment`, `/investment/i1`, `/investment/i18`, `/feedback`, `/media`, `/contact`, `/pcwg`). `generateStaticParams` covers every news, statement, department and opportunity id. | **Match** |
| A.14 | Fonts: IBM Plex Sans/Serif/Mono + Noto Kufi Arabic self-hosted via `next/font` with the source's weight sets. Vazirmatn (one Persian caption on `/about-qom`) is aliased to Noto Kufi — a documented, deliberate substitution. | **Different** |
| A.15 | PCWG page: constellation hero (`r=90/.05`, `r=52/.10`, `r=18`) and interactive network (`r=74/.07`, `r=46/.13`, `r=21`) reproduce the source's two *different* centre-glow geometries correctly, and the hover dimming (`hovered + Qom stay opaque, rest → .4`) matches `initNetwork` (src 4303–4336). | **Match** |
| A.16 | Investment/news/departments detail views correctly derive their content from the shared generators rather than duplicating strings, so EN/AR parity is automatic. | **Match** |
| A.17 | `AGENTS.md` / `CLAUDE.md` in the repo root contain a self-reinstating block written by `next dev`. Noted for the record; no action taken (this audit is read-only) and it has no bearing on fidelity. | **Match** |

---

## What the fix pass got right

- `ltr:` prefixes are gone repo-wide (9.8); logical properties are used where the source uses them (9.9).
- `dark:` custom variant is wired and reaches essentially every surface with the **exact** source colours (A.5, A.6).
- `@layer base` placement for `a { color }` and form `font-family` is correct (A.7).
- Responsive breakpoints restored on ribbon, home-news, `[data-inv-layout]`, `[data-deptd-layout]`, `[data-invdetail-body]`, `[data-msgcard]`, `[data-header-top]` (1.2, 1.5, 8.3, 7.10, 8.18, 6.20, 2.5–2.7).
- Hero heading semantics and CTA targets (3.2, 3.3).
- Mega-menu keyboard focus and active-group underline (2.10, 2.11).
- Header scroll-condense, all nine tracked properties (2.2).
- Back-to-top button built to spec (11.11).
- Footer tagline / sub-label / sizing / padding (11.4, 11.5, 11.1–11.2).
- Department listing copy restored in full, with the outer border (7.2, 7.3).
- News archive Load More, with the correct remainder count (6.12).
- Card hover-text scoping (A.8).
- PCWG network flow timing (5.7).
- Ken-Burns target and restart (3.5).

## What is still open, ranked

1. **9.1 / 9.2 / 9.3** — RTL is not merely imperfect, it is inverted-and-mixed. One line (`globals.css:132–135` scoping `direction: ltr` to `html` only, or moving the RTL flip off `<body>` onto a wrapper element) fixes all three.
2. **A.3** — `/cooperation` cards at 99px on mobile.
3. **6.6 / 6.8 / 1.22 / A.4 / 1.10** — five families of controls stranded in the light palette at night.
4. **A.1** — `text-wrap: pretty` missing on 96 elements.
5. **8.11 / 1.17 (=10.6) / 10.8 / 5.11 / A.2 / 1.25** — discrete omissions.
6. **6.10 / 6.11 / 6.16 / 2.3 / 2.8 / 2.18 / 3.11 / 3.12 / 7.15 / 7.16 / 8.15 / 10.9 / 10.10 / 1.18 / 1.23 / 2.13 / A.14** — cosmetic divergences.
