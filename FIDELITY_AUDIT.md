# Fidelity Audit — Next.js port vs. original design

**Ground truth (A):** `E:\claude\design-export\Qom International Relations.dc.html` (markup + inline `<style>` at lines 18–133; the entire behaviour layer lives in the `<script type="text/x-dc" data-dc-script>` block at **lines 2612–4412**), plus `E:\claude\design-export\i18n.js`.

**Port (B):** `E:\claude\qom-international-relations` (`app/`, `components/`, `lib/`, `app/globals.css`).

**Method:** every line of the source markup, the source behaviour script, and the source dictionary was read; every port component and route file was read; both were loaded live (`localhost:8934` original hash-routed, `localhost:3000` port) and compared with `read_page` / `get_page_text` / computed-style and `getBoundingClientRect` introspection at desktop (1400px), tablet (653px) and mobile (375/382px), in EN and AR, light and dark.

> **Important correction to the brief:** `support.js` is **not** the app's behaviour layer — it is the generic `dc-runtime` bundle (React template compiler, helmet, pseudo-class engine, registry). All of the portal's real behaviour (router, slideshow, scroll-reveal, drawer, filters, pagination, language/theme toggles, data generators) is in the **inline `<script data-dc-script>` in the HTML, lines 2612–4412**. All source line references below point there.

**Severity legend:** **Missing** · **Broken** · **Simplified** · **Different** · **Match**

---

## Executive summary — highest-impact findings

| # | Finding | Severity | Area |
|---|---|---|---|
| 1 | Dark mode is non-functional beyond the page background — header stays cream, every card stays white | **Broken** | 2, 11 |
| 2 | `ltr:` and `rtl:` Tailwind variants both apply simultaneously in Arabic (html stays `dir=ltr`, body is `dir=rtl`) — 20 call sites affected | **Broken** | 9 |
| 3 | Ken-Burns (`qomKen`) animates an element with `background-image: none` — the zoom is invisible | **Broken** | 3, 5 |
| 4 | News/statement cards carry `data-cardbody`/`data-cardtitle`, so hovering turns their text near-white on a white card | **Broken** | 6 |
| 5 | Every source `@media` breakpoint rule was dropped: homepage ribbon, home news grid, investment layout, dept detail layout, invdetail body | **Missing** | 1, 7, 8 |
| 6 | Hydration failure on every page containing a `VideoCard` (`canHover` read during render) | **Broken** | 1 |
| 7 | "Load More News / Load More Statements" control absent; Statements archive mislabelled "News archive" | **Missing / Broken** | 6 |
| 8 | Back-to-top floating button absent entirely | **Missing** | 11 |
| 9 | Several dictionary-backed strings rendered raw, so they stay English in Arabic where the source translates them | **Broken** | 10 |

---

## 1. Homepage

### Section order & presence

| Item | Source | Port | Severity |
|---|---|---|---|
| Section order: hero → ribbon → news → statements → about → cooperation → pcwg → investment → media | lines 248–843 | `app/page.tsx` 45–321 | **Match** |
| Section ids `#top #news #statements #about #cooperation #pcwg #investment #media` | — | all present | **Match** |
| `#news` padding `96px 24px 44px` (line 373) | — | `pt-24 pb-11 px-6` = 96/44/24 | **Match** |
| `#statements` padding `0 24px 92px` (line 392); `#about` / `#cooperation` / `#pcwg` / `#investment` / `#media` `100px 24px` | — | `pb-[92px]`, `py-[100px]` | **Match** |

### Ribbon (4 quick links)

| Finding | Detail | Severity |
|---|---|---|
| Copy, icons, colours, links of all 4 tiles | source 341–368 vs `app/page.tsx` 12–29 — identical incl. teal `#00A8A8` on tiles 3–4 | **Match** |
| **No responsive collapse** | Source: `[data-ribbon]` → 2 cols ≤1000px (line 82), 1 col ≤620px (line 83). Port hard-codes `gridTemplateColumns: "repeat(4, minmax(0, 1fr))"` (`app/page.tsx` 54) with no media query. Measured at 382px viewport: `81px 81px 81px 81px` — four unreadable 81px columns. | **Missing** |

### News teaser

| Finding | Detail | Severity |
|---|---|---|
| Feature = `NEWS()[0]`, list = `NEWS()[1..5]` (4 rows) | source `renderHome()` 3349–3361 vs `components/home/HomeNews.tsx` 10–11 | **Match** |
| Feature card markup/typography | source `homeFeatureHTML()` 3320–3335 vs `HomeNews.tsx` 15–31 — padding `30px 32px 34px`, clamp `22–29px`, `data-clamp2/3`, "Featured" chip all match | **Match** |
| **Home news grid never collapses** | Source: `@media (max-width: 940px) { [data-home-news] { grid-template-columns: minmax(0,1fr) !important } }` (line 69) and `[data-home-list] { grid-template-rows: none }` (line 70). Port `HomeNews.tsx` 14/33 hard-codes `minmax(0, 1.32fr) minmax(300px, 0.88fr)` / `repeat(4, minmax(0,1fr))`. Measured at 382px: computed `grid-template-columns: 0px 300px` — **the featured story is crushed to zero width.** | **Broken** |
| Row hover | Source `homeListRowHTML` has `transition: background .2s` but no hover rule (3340). Port adds `hover:bg-bg` (`HomeNews.tsx` 35). | **Different** |

### Statements teaser

| Finding | Detail | Severity |
|---|---|---|
| First 4 `MSGS()`, `76px / 1fr / auto` grid, `14px 22px` padding, gold `→` | source 3304–3317 vs `HomeNews.tsx` 56–75 | **Match** |
| "View All Messages & Statements" loses its scroll target | Source (line 402) `data-goto="news" data-scroll="statements-block"` → opens News page **and scrolls to the statements block**. Port (`app/page.tsx` 103) is `<Link href="/news">` — no `#statements-block` fragment, lands at the top of the news page. | **Missing** |

### About / Cooperation / PCWG / Investment / Media teasers

| Finding | Detail | Severity |
|---|---|---|
| About: eyebrow, headline, 3-column Mission/Vision/Objectives with `40px 44px` paddings and dividers, gold "International Strategy" panel | source 408–464 vs `app/page.tsx` 112–173 | **Match** |
| Cooperation cards are links in the port | Source cards are inert `<div data-card>` (lines 484–523). Port wraps each in `<Link href="/cooperation">` (`app/page.tsx` 198) — 8 new navigations the source does not have. | **Different** |
| Cooperation: 8 cards, numbers `01`–`08`, copy | identical | **Match** |
| PCWG map: 31 pins (1 chair + 15 current + 15 proposed) with identical `left/top` percentages, `qomPulse` ring on Qom, tooltip on hover/click | source 572–610 vs `components/home/HomePcwgMap.tsx` 9–40 | **Match** |
| Investment teaser: 6 cards `i1`–`i6`, tags, `[Urban development project]` titles, hover preview panel | source 685–726 vs `components/home/HomeInvestmentTeaser.tsx` | **Match** |
| Media teaser: eyebrow "Official archive", 4 tabs, panel contents | source 730–842 vs `components/home/HomeMedia.tsx` | **Match** |
| Media panels unmount instead of `display:none` | Source keeps all four panels in the DOM and toggles `display` (`syncDOM` 2715–2721). Port conditionally renders (`HomeMedia.tsx` 77/87/95/108). No visual difference; noted for completeness. | **Different** |
| **Hydration failure from `VideoCard`** | `components/VideoCard.tsx` 20 computes `canHover` **during render** from `window.matchMedia("(hover: hover)")`, then uses it in output text (line 44). SSR emits `Tap to preview · muted`, client emits `Hover to preview · muted`. Verified: `fetch('/media')` HTML contains "Tap to preview" (`ssrHasTap: true`), live DOM contains "Hover to preview" — console shows `Hydration failed because the server rendered text ...`. Affects `/media`, `/pcwg`, and the homepage Video tab. The source guards this correctly by branching inside `initVideoPreviews` after mount (2889–2932). | **Broken** |

---

## 2. Header

| Finding | Detail | Severity |
|---|---|---|
| Logo mark `44px` → `36px`, font `19px` → `16px`, subtitle `max-height 20→0` + `opacity 1→0` on scroll | source `syncHeader()` 4032–4058 vs `SiteHeader.tsx` 117–131 | **Match** |
| Scroll threshold | Source `root.getBoundingClientRect().top < -60` (4037); port `window.scrollY > 60` (`SiteHeader.tsx` 61) — equivalent | **Match** |
| Header top padding `14px → 7px`, navbar `7px → 3px`, CTA `13px → 10px` vertical | source 4040–4057 vs `SiteHeader.tsx` 101, 181, 174 | **Match** |
| Header **background** does not condense | Source also changes `background: rgba(250,248,244,.94) → .97` and `border-bottom-color: rgba(11,31,58,.10) → .16` on scroll (4049–4052). Port hard-codes `bg-[rgba(250,248,244,.94)]` and `border-navy/10` and only animates `box-shadow` (`SiteHeader.tsx` 96–97). | **Different** |
| Box-shadow `0 18px 38px -30px rgba(11,31,58,.62)` on scroll | identical | **Match** |
| Desktop nav items: Home, News, About Us, About Qom, International Activities ▼, Municipality ▼, Pilgrimage Cities Working Group | source 182–188 vs `SiteHeader.tsx` 10–15, 194–224 | **Match** |
| "International Activities ▼" mega panel: **Cooperation** (International Cooperation, Memberships & Networks) / **Participation** (International Events & Participation, International Meetings in Qom) / **Culture** (Cultural Weeks & Festivals) / **Presidency** promo card with "Open the network →" | source 193–200 vs `SiteHeader.tsx` 228–266 — headings, sub-copy, links, promo copy all identical | **Match** |
| "Municipality ▼" mega panel: **Administration** (Municipal Deputy Departments) / **Economy** (Investment Opportunities) / **Engagement** (Visitor Feedback, Media & Publications) / **Single point of contact** promo with "Contact the office →" | source 202–209 vs `SiteHeader.tsx` 268–304 | **Match** |
| **Active-group underline on the mega triggers is gone** | Source: `b.style.borderBottomColor = open \|\| key === navGroup ? '#C8A75D' : 'transparent'` where `navGroup` comes from `this.NAVGROUP` (2693–2701, map at 2794) — so on e.g. the Investment page the "Municipality" trigger keeps a gold underline. Port only reacts to `mega === "municipality"` (`SiteHeader.tsx` 201, 213). Verified live on `/investment`: both triggers computed `border-bottom-color: rgba(0,0,0,0)`. | **Missing** |
| Mega trigger does not open on keyboard focus | Source binds `btn.addEventListener('focus', () => setMega(key))` (3086). Port has `onClick` + `onMouseEnter` only. | **Missing** |
| Mega close-on-mouseleave scope | Source listens on the whole `[data-navbar]` (3088). Port attaches `onMouseLeave` to the panel only (`SiteHeader.tsx` 229, 269), so sliding off a trigger sideways leaves the panel open. | **Different** |
| Search box: 15px icon, `13.5px` input, gold focus border, `min(440px,86vw)` panel, 12-result cap, `N results` footer, "No results found", Escape clears | source `initSearch` 4219–4274 vs `components/SearchBox.tsx` | **Match** |
| Search index rows | `searchIndex()` 4153–4217 ported verbatim into `lib/data.ts` 366–430 (57 rows + 17 cities) | **Match** |
| Clear button does not refocus the input | Source: `input.value=''; renderSearch(); input.focus()` (4261). Port omits `.focus()` (`SearchBox.tsx` 57). | **Different** |
| Language toggle EN/AR, `#0B1F3A`/`#FAF8F4` active state | source 167–170 / `syncDOM` 2743–2750 vs `SiteHeader.tsx` 139–156 | **Match** |
| Theme toggle: moon/sun swap, `qom-theme` localStorage key | source 3873–3897 vs `lib/theme.tsx` | **Match** |
| "Contact Us" CTA `#0B1F3A` bg, gold hover | source 175 vs `SiteHeader.tsx` 170–177 | **Match** |
| **Dark theme does not reach the header or any surface** | Source repaints via inline-style attribute selectors covering every surface (`[style*="background: rgb(255,255,255)"]`, `header[style*="rgba(250,248,244,0.94)"]`, etc., lines 96–132). Port replaces these with opt-in classes (`app/globals.css` 222–258) that are almost never applied: `.qom-surface` appears **1×** in the whole app, `.qom-text-navy` **0×**, against **75** uses of `bg-white`. Measured with `data-theme="dark"`: source → header `rgba(13,19,31,.93)`, card `rgb(21,29,43)`; port → header `rgba(250,248,244,.94)`, card `rgb(255,255,255)`, body `rgb(14,20,32)`. Result: white cards floating on a near-black page. The `.qom-header` rule does exist but is defeated by Tailwind's layered utility `bg-[rgba(250,248,244,.94)]`. | **Broken** |
| Mobile header tweaks at ≤760px | Source: `[data-header-top] { padding: 0 16px; gap: 12px }`, `[data-search] { order: 6; flex: 1 1 100% }`, `[data-cta] { font-size: 12px; padding: 11px 15px }` (lines 53–57). Port has only `px-4 sm:px-6` and no search re-ordering / CTA shrink. | **Missing** |

---

## 3. Hero section

| Finding | Detail | Severity |
|---|---|---|
| 5 slides, exact titles, descriptions, image-placeholder captions | source 248–322 vs `components/HeroSlideshow.tsx` 15–51 | **Match** |
| Autoplay `setInterval(..., 7000)` | source 2854 vs `HeroSlideshow.tsx` 61 | **Match** |
| Pause on `mouseenter`, restart on `mouseleave`; prev/next/dot click restarts the timer | source 2857–2861 vs `HeroSlideshow.tsx` 72–83 | **Match** |
| Cross-fade `opacity 1.1s ease` | source 249 vs `HeroSlideshow.tsx` 89 (`duration-[1100ms]`) | **Match** |
| Dot indicators: 34×3px, active `#C8A75D`, inactive `rgba(250,248,244,.35)` | source 330–334 / 2635–2637 vs `HeroSlideshow.tsx` 154–163 | **Match** |
| Prev/next buttons 48×48, `rgba(11,31,58,.35)` bg, gold hover | source 325–326 vs `HeroSlideshow.tsx` 135–150 | **Match** |
| **Ken-Burns zoom animates nothing** | Source puts the animation on `[data-ken]`, which *is* the element carrying `background-image: repeating-linear-gradient(...)` (line 250 + `syncDOM` 2641). Port splits them: the parent div holds `backgroundImage` (`HeroSlideshow.tsx` 92–95) and an **empty child** carries `animation: qomKen 9s ease-out forwards` (line 96–99). Verified live: the single `qomKen` element computes `background-image: none` — a transparent, empty box is being scaled, so no zoom is visible at all. | **Broken** |
| Text reveal `qomReveal .9s cubic-bezier(.22,.61,.36,1) both` per slide | source 2643 vs `HeroSlideshow.tsx` 110 | **Match** |
| Heading semantics | Source uses `<h1>` for slide 0 and `<h2>` for slides 1–4 (lines 255, 270, 285, 300, 315). Port renders `<h1>` for all five (`HeroSlideshow.tsx` 112) — verified live: 5 `<h1>` elements on the homepage. | **Different** |
| Slide 2 & 4 primary CTA targets | Source slide 2 → `href="#pcwg"` (scrolls to the homepage PCWG band, line 273); slide 4 → `href="#investment"` (homepage band, line 303). Port routes both to the full pages `/pcwg` and `/investment` (`HeroSlideshow.tsx` 27, 41). | **Different** |
| Hero controls mirror in Arabic (see area 9) | Source pins arrows to `right: 24px` and dots to `left: 24px` **physically** (lines 324, 329) so they never move; port uses `ltr:right-6 rtl:left-6` / `ltr:left-6 rtl:right-6` | **Different** |
| Previous-slide animation not cleared | Source leaves `style.animation` on the outgoing slide (2 elements end up with `qomKen`, 2 with `qomReveal`); port only styles the active slide (1 each). Cosmetic only. | **Different** |

---

## 4. Mobile menu / drawer

| Finding | Detail | Severity |
|---|---|---|
| Breakpoint: burger < 1024px, rail ≥ 1024px | source `@media` lines 51–52 vs `SiteHeader.tsx` `lg:hidden` / `lg:block`. Verified: burger `display:none` at 1400px, `display:grid` at 653px. | **Match** |
| Drawer width `min(420px, 88vw)`, navy bg, `30px 0 60px -30px` shadow | source 215 vs `SiteHeader.tsx` 315 | **Match** |
| Open/close transition `transform .42s cubic-bezier(.22,.61,.36,1)` | source 215 vs `SiteHeader.tsx` 315 (`duration-[420ms] ease-[cubic-bezier(.22,.61,.36,1)]`) | **Match** |
| Header block: "MENU" eyebrow + "Browse dedicated pages" + `×` close button (40×40, gold hover) | source 216–222 vs `SiteHeader.tsx` 318–331 | **Match** |
| Group structure — ungrouped (Home, News, About Us, About Qom, Pilgrimage Cities Working Group) → **INTERNATIONAL ACTIVITIES** (International Cooperation, International Events & Participation, International Meetings in Qom, Cultural Weeks & Festivals, Memberships & Networks) → **MUNICIPALITY** (Municipal Deputy Departments, Investment Opportunities, Visitor Feedback) → **MEDIA & CONTACT** (Media & Publications, Contact) | source 225–242 vs `SiteHeader.tsx` 25–49 — **every link, label and order matches**; verified live in AR: group labels render `الأنشطة الدولية / البلدية / الإعلام والاتصال` | **Match** |
| Active-item styling (`rgba(250,248,244,.08)` bg + gold left border) | source 2655–2660 vs `SiteHeader.tsx` 343–347 | **Match** |
| Footer block "Qom Municipality / International Relations & Communications Department" | source 245 vs `SiteHeader.tsx` 356–360 | **Match** |
| Backdrop `rgba(11,31,58,.55)`, click-to-close, Escape-to-close | source 213, 2963–2965 vs `SiteHeader.tsx` 309–313, 76–78 | **Match** |
| Backdrop fade duration | Source `opacity .35s ease` (line 213); port `duration-300` (`SiteHeader.tsx` 311) | **Different** |
| Scroll-lock | Neither implements one — the page scrolls behind the drawer in both | **Match** |
| **Drawer opens from the wrong side in Arabic** | Source explicitly flips it: `drawer.style.left = rtl ? 'auto' : '0'; drawer.style.right = rtl ? '0' : 'auto'` (2666–2669) → drawer enters from the **right** in AR. Port uses `ltr:left-0 rtl:right-0` (`SiteHeader.tsx` 315); because `<html>` stays `dir="ltr"` both variants match, so computed style is `left: 0px; right: 0px` — the over-constrained box resolves against the LTR initial containing block and anchors **left**. Measured in AR at 382px: drawer box `left −330 → 0`. | **Broken** |

---

## 5. Animations (all six keyframes)

All six `@keyframes` are byte-identical between source (lines 24–29) and `app/globals.css` 43–96. **Match.**

| Keyframe | Source usage | Port usage | Severity |
|---|---|---|---|
| `qomPulse 2.8s ease-out infinite` | 1× — the ring around the Qom pin on the homepage map (line 573) | 1× — `HomePcwgMap.tsx`; verified live: `qomPulse\|2.8s` × 1 on `/` | **Match** |
| `qomBob` | 0× — dead keyframe in the source too | 0× | **Match** (expected) |
| `qomKen 9s ease-out forwards` | Hero slide `[data-ken]` — the element with the diagonal-stripe background (2641) | Applied to an **empty** sibling with no background | **Broken** (see area 3) |
| `qomReveal .8s cubic-bezier(.22,.61,.36,1) both` | IntersectionObserver on every `[data-reveal]`, `threshold: 0.12`, `rootMargin: '0px 0px -6% 0px'`, **one-shot** (`io.unobserve`) (2828–2840) | `components/Reveal.tsx` 27–39 — identical threshold, rootMargin, one-shot, identical timing | **Match** |
| `qomReveal .9s …` | Hero slide body per slide change (2643) | `HeroSlideshow.tsx` 110 | **Match** |
| `qomReveal .5s …` + stagger | News cards `min(i,11) × 35ms` (3279); statement cards `min(i,8) × 40ms` (3292); investment cards `min(i,11) × 32ms` (3501) | `NewsCard.tsx` 13 (35ms), `NewsCard.tsx` 46 (40ms), `InvestmentCard.tsx` 22 (32ms) — all three exact | **Match** |
| `qomFlow` — line count | 16 animated lines on the PCWG network SVG | 16 lines | **Match** |
| `qomFlow` — durations | Gold member lines **11s–18s**, teal proposed lines **16s–23s** (source line 1596) — the two families deliberately overlap | Port computes `11 + index` across the flat `NODES` array → **11s–26s**, so the teal family runs 19s–26s. Verified live: source has `16s ×2, 17s ×2, 18s ×2`; port has one of each 11–26. | **Different** |
| `qomGlow 5s ease-in-out infinite` | **2×**: `r=90 fill-opacity .05` in the PCWG hero constellation SVG, and `r=74 fill-opacity .07` in the interactive network SVG | **1×** — `PcwgNetwork.tsx` 48 uses `r=90 / .05` (the hero's values) in the network; **the hero constellation SVG is missing entirely** (`app/pcwg/page.tsx` 106–108 keeps only the two gradient overlays, not the `opacity:.9` line/node SVG from source line 1572) | **Missing** |
| Scroll-reveal replay | Both one-shot | **Match** |
| Reveal wrapper coverage | Source has `[data-reveal]` on 12 homepage wrappers; port's `<Reveal>` covers the equivalent wrappers | **Match** |
| Back-to-top transition `opacity/transform .45s cubic-bezier(.22,.61,.36,1)` | source 2546 | Button does not exist (see area 11) | **Missing** |
| Video preview thumb zoom `transform 3.5s ease` → `scale(1.06)` | source 2910–2911 | `VideoCard.tsx` 39 (`duration-[3500ms]`, `scale(1.06)`) | **Match** |
| Map pin hover ring `0 0 0 4px rgba(200,167,93,.25)` | source 2946 | `HomePcwgMap.tsx` | **Match** |

---

## 6. News pages

### `/news` list (source `data-page="news"`, lines 847–987)

| Finding | Detail | Severity |
|---|---|---|
| Hero: breadcrumbs, `News & Official Communications`, lede, two jump buttons to `#news-block` / `#statements-block`, dot-grid background, `84px 24px 76px` | source 848–860 vs `app/news/page.tsx` 60–70 + `components/PageHero.tsx` | **Match** |
| **Hero decorative motif SVG missing** | Source line 850 places a newspaper-motif SVG at `inset-inline-end: 1%`, `width: min(23%,300px)`, `opacity .45`. `PageHero` supports an `icon` prop but `/news` never passes one. Same omission on `/departments` (source 1431, bar-chart motif), `/investment` (source 2092), `/feedback` (source 2166). | **Missing** |
| Featured article card, hidden when narrowed | Source: `narrowed = filter!=='all' \|\| year!=='all' \|\| query` (3964) — note month is deliberately excluded. Port `ArchiveSection.tsx` 87 replicates exactly. | **Match** |
| Page size 12 (news) / 6 (statements) | source `renderArchive()` 3901–3902 vs `app/news/page.tsx` 89, 120. Verified live: 12 news cards, 6 statement cards. | **Match** |
| Sort options: `Newest First` / `Oldest First` only | source 897–898, 953–954 vs `ArchiveSection.tsx` 112–113 | **Match** |
| News category filters: All News + International Meetings, International Delegations, Agreements & Cooperation, Pilgrimage Cities, Events & Conferences, Investment, Urban Diplomacy, Announcements | source 903–911 vs `app/news/page.tsx` 10–19 | **Match** |
| Statement category filters: All Statements + Official Messages, Municipal Statements, Congratulations, Condolences, Announcements, Official Positions (values `Official Message`, `Municipal Statement`, `Congratulations`, `Condolence`, `Announcement`, `Official Position`) | source 959–965 vs `app/news/page.tsx` 21–28 — **labels and underlying values both match** | **Match** |
| Year/month archive with counts, months only shown once a year is chosen | source `renderArchNav()` 3981–4008 vs `ArchiveSection.tsx` 140–166. Verified live: `2026 (19) / 2025 (28) / 2024 (28)`. | **Match** |
| **Statements block is labelled "News archive"** | Source uses `News archive` (line 915) and `Statements archive` (line 969) — both keys exist in `i18n.js`. `ArchiveSection.tsx` 142 hard-codes `t("News archive")` for both instances. Verified live: two elements reading "News archive" on `/news`. | **Broken** |
| **"Load More" control absent** | Source has `[data-news-more]` / `[data-msg-more]` rendering `Load More News (N)` / `Load More Statements (N)`, wired to a per-page `Extra` counter that appends another `per` items without leaving the page (`renderList` 3951–3957, handler 3129–3130, reset 3098). Both dictionary keys exist. No equivalent anywhere in `ArchiveSection.tsx`. Verified live: zero buttons matching /load/i. | **Missing** |
| Range/meta row: `1–12 / 75 ARTICLES` + active-filter chips + "Clear filters" | source 3931–3949 vs `ArchiveSection.tsx` 168–183 | **Match** |
| **"N articles in the archive" counter is in the wrong place** | Source renders `[data-news-total]` in the **section header, right-aligned next to the "News" heading** (line 872, filled at 3928–3929). Port renders it as a standalone line **below** the meta row and **above** the card grid (`ArchiveSection.tsx` 185–187). | **Different** |
| Category filter chips use the wrong type style | Source `[data-nfilter]`/`[data-mfilter]` buttons: `font-family: inherit; font-size: 12.5px; padding: 9px 15px` (lines 903–911). Port reuses `chipBase` = `font-mono … text-xs (12px) px-3.5 (14px) py-2 (8px)` for the category chips as well as the archive chips (`ArchiveSection.tsx` 85, 122, 132) — the source only uses mono for the archive chips (`archChip()` 3243). | **Different** |
| Pagination does not scroll back to the block | Source scrolls to `#news-block` / `#statements-block` after a page change (3126–3127); `/investment` scrolls to `[data-inv-meta]` (3638–3639). Port's `onChange={(n) => setPage(n)}` (`ArchiveSection.tsx` 198, `app/investment/page.tsx` 167) leaves the viewport where it was. | **Missing** |
| Pagination markup: `← Previous`, `pageList()` windowing with `…` gaps, `Next →`, disabled `opacity .3`, RTL arrow flip | source `pagerHTML()` 3261–3274 + `pageList()` 3250–3259 vs `components/Pagination.tsx` + `lib/data.ts` 432–444 — logic ported verbatim; verified live in AR: `→ السابق · 1 2 3 4 … 7 · التالي ←` | **Match** |
| Pagination top margin | Source `margin-top: 36px` on `/news` (line 929) but `42px` on `/investment` (line 2148). Port hard-codes `mt-9` (36px) in the shared component. | **Different** |
| Empty states ("No articles match your search." / "No statements match your search." + "Try another keyword, category or archive period.") | source 922–925, 976–978 vs `ArchiveSection.tsx` 192–195 | **Match** |
| Data generators `NEWS()` (75 items) and `MSGS()` | source 3153–3225 vs `lib/data.ts` 34–147 — ported line-for-line incl. the `mi % 3` / `mi % 4` cadence, `26 - k*8` / `21 - k*11` day maths and `stamp` | **Match** |
| Statement card: 3-column `216px / 1fr / 216px` grid, gold inline-start rule, "Issued by / [issuing office]", "Reference / [no.]", `Read Statement →` | source `msgCardHTML()` 3289–3302 + CSS 59–67 vs `NewsCard.tsx` 40–75 + `globals.css` 191–212 | **Match** |
| **News/statement card hover makes the text disappear** | `globals.css` 137–142 keeps the source's `[data-card]:hover [data-cardtitle] { color: #FAF8F4 }` and `[data-card]:hover [data-cardbody] { color: rgba(250,248,244,.82) }` — in the source these only ever hit the *dark-inverting* homepage cooperation cards (lines 87–88, 484–523). `NewsCard.tsx` 21/29/32 adds `data-card` to the card **and** `data-cardbody` to the excerpt and `data-cardtitle` to the "Read More →" span, on a card whose background stays `#fff`. Hovering therefore paints the excerpt and CTA cream-on-white. Rules confirmed live as matching the element. | **Broken** |

### `/news/[slug]` article detail (source `data-page="article"`, lines 2490–2542)

| Finding | Detail | Severity |
|---|---|---|
| Hero: `max-width 1080px`, `76px 24px 66px`, breadcrumbs `Home › News/Messages & Statements › {category}`, title clamp `29–50px`, meta row `{cat} • {date} • {author}` | source 2491–2504 + `renderArticle()` 3412–3422 vs `components/ArticleView.tsx` 33–65 | **Match** |
| Author field: `International Relations & Communications` for news, `[issuing office]` for statements | source 3422 vs `ArticleView.tsx` 62 | **Match** |
| Body: 5 paragraphs for news / 4 for statements, first as serif lede `clamp(19px,1.8vw,23px)`, `[caption and photo credit]` | source `articleParas()` 3380–3391 + 3425–3427 vs `lib/data.ts` 155–170 + `ArticleView.tsx` 73–79 | **Match** |
| Share row: X, Telegram, LinkedIn, Facebook, "Copy link", status text `Link copied` / `Sharing opens once the portal is published.`, 2800ms auto-clear | source `initShare()` 3856–3869 + 2514–2524 vs `ArticleView.tsx` 9–29, 81–104 | **Match** |
| Related: `relatedFor()` — same-category first, then rest, sliced to 3 | source 3393–3398 vs `lib/data.ts` 172–177 | **Match** |
| Related eyebrow copy changed | Source: `More on this subject` (line 2533) — **has an Arabic entry** (`i18n.js`). Port: `t("Related")` (`ArticleView.tsx` 113) — **no dictionary entry**, so it also stays English in Arabic. | **Different** |
| Back link `All News` / `All Messages & Statements` | source 3433 vs `ArticleView.tsx` 120 | **Match** |

---

## 7. Department pages

### `/departments` (source `data-page="departments"`, lines 1428–1494)

| Finding | Detail | Severity |
|---|---|---|
| All 6 departments, numbers `01`–`06`, exact titles (Planning & Human Resources Development, Technical & Civil Affairs, Environment & Urban Services, Transportation & Traffic, Financial & Economic Affairs, Architecture & Urban Development) | source 1439–1492 / `DEPTS()` 3659–3688 vs `lib/data.ts` 317–358 | **Match** |
| "Cooperation interests" panel with the 3 interests per department | source 1446 etc. vs `app/departments/page.tsx` 27–37 | **Match** |
| Card grid `minmax(0,1.7fr) minmax(220px,1fr)`, `38px` padding, `40px` gap, `Explore Activities →` | source 1439 vs `app/departments/page.tsx` 20–25 | **Match** |
| **Listing body copy is truncated** | The source listing uses a **longer, listing-specific** paragraph, not `d.mission`. Dept 01 source (line 1443): *"Responsible for municipal planning, staffing and organisational development. In international work it is the counterpart for capacity building, staff training exchanges and administrative cooperation with partner municipalities."* Port (`app/departments/page.tsx` 24) renders `t(d.mission)` = *"The counterpart for capacity building, staff training exchanges and administrative cooperation with partner municipalities."* — **the opening "Responsible for…" sentence is dropped for all six departments.** (Dept 06 also loses ", including the shrine precinct area".) | **Different** |
| Outer border on the article stack | Source wraps the six articles in `border: 1px solid rgba(11,31,58,.12)` (line 1438). Port has `gap-px bg-navy/[.12]` only (`app/departments/page.tsx` 18) — no outer hairline. | **Different** |
| Hero lede max-width | Source `660px` (1435) vs `PageHero` `max-w-[640px]` | **Different** |
| Hero motif SVG | Source line 1431; not passed to `PageHero` | **Missing** |

### `/departments/[slug]` (source `data-page="deptdetail"`, lines 1497–1567 + `renderDept()` 3701–3764)

| Finding | Detail | Severity |
|---|---|---|
| Full field set present: **Department overview** (Mandate), **International responsibilities** (Remit), **International projects** (Portfolio), **International partnerships** (Counterparts), **Meetings & delegations** (Record), **Related news** (Newsroom), **Photo gallery** (Archive), **International contact** + Key-facts aside | source 1509–1566 vs `components/DeptDetailView.tsx` 59–167 — every block present in the same order | **Match** |
| Key facts: `Department`, `Reference` = `QOM-DEP-{no}`, `International focal point` | source 3738 vs `DeptDetailView.tsx` 86 | **Match** |
| Per-department accent SVG motif in the hero, `min(22%,280px)`, `opacity .5`, stroke = `dept.hero` | source 1500 + 3726 vs `DeptDetailView.tsx` 42–44 | **Match** |
| Accent colour rule (`dark ? hero : ink`) applied to responsibility numbers, project refs, partner "Active" labels | source 3720 vs `DeptDetailView.tsx` 24, 74, 107, 123 | **Match** |
| Project refs `QOM-{no}-0{i}`, 3 projects, 3 partners, 3 meetings, 4 gallery tiles, related news filtered by `dept.newsCat` and capped at 3 | source 3743–3763 vs `DeptDetailView.tsx` 13–19, 25, 104–166 | **Match** |
| Hero eyebrow loses its mono face | Source `[data-deptd-eyebrow]` is `font-family: 'IBM Plex Mono'` (line 1503). Port omits `font-mono` (`DeptDetailView.tsx` 53), so `Deputy department · 01` renders in the sans face. | **Different** |
| Outer hairline borders dropped on 4 blocks | Source has `border: 1px solid rgba(11,31,58,.12)` on `[data-deptd-resp]` (1517), `[data-deptd-projects]` (1533), `[data-deptd-partners]` (1540), `[data-deptd-meetings]` (1545). Port uses `gap-px bg-navy/[.12]` alone (`DeptDetailView.tsx` 71, 104, 119, 131). | **Different** |
| **Two-column layout never collapses** | Source: `@media (max-width: 940px) { [data-deptd-layout] { grid-template-columns: minmax(0,1fr) !important; gap: 44px !important } }` (line 78). Port hard-codes `minmax(0, 1.6fr) minmax(280px, 1fr)` (`DeptDetailView.tsx` 59). | **Missing** |
| Hero motif hidden below `sm` | Source shows it at all widths; port adds `hidden sm:block` (`DeptDetailView.tsx` 42). | **Different** |

---

## 8. Investment pages

### `/investment` (source `data-page="investment"`, lines 2089–2161)

| Finding | Detail | Severity |
|---|---|---|
| **Opportunity count = 18** | `INVEST()` loops `i < 18` (source 3456) → `lib/data.ts` 241. Verified live: "All categories **18**". | **Match** |
| Facet counts: 6 categories × 3, 6 districts × 3, 3 statuses × 6 | verified live on `/investment` — `18 / 3,3,3,3,3,3 / 18 / 3,3,3,3,3,3 / 18 / 6,6,6` | **Match** |
| Category / District / Status facet groups with checkbox rows, `rgba(200,167,93,.14)` selected background, `font-weight 600` when active, count on the trailing edge | source `invOption()` 3515–3526 + 3561–3587 vs `app/investment/page.tsx` 11–49 | **Match** |
| "Refine" + "Reset all", "Investor desk" card, "Contact the desk →" | source 2118–2138 vs `app/investment/page.tsx` 129–141 | **Match** |
| Sort options: `Newest reference`, `Title A–Z`, `By category`, `By district` (values `new`/`az`/`cat`/`district`) and their tie-break maths | source 2108–2112 + `invFilter()` 3486–3490 vs `app/investment/page.tsx` 120–123 + `lib/data.ts` 290–299 | **Match** |
| Page size 9, meta reads `1–9 / 18 OPPORTUNITIES`, `0 / 18` when empty | source 3547, 3600 vs `app/investment/page.tsx` 62, 147 | **Match** |
| Search fields (`title + cat + district + summary + ref`) | source 3485 vs `lib/data.ts` 288 | **Match** |
| Card grid `repeat(auto-fill, minmax(292px,1fr))`, gap 26px | source 2143 vs `app/investment/page.tsx` 158 | **Match** |
| Investor resources block (`Portfolio` / `Procedure` / `Legal`), `86px` top margin, `76px` top padding | source 2152–2158 vs `app/investment/page.tsx` 171–186 | **Match** |
| **Filter-rail layout never collapses** | Source: `@media (max-width: 940px) { [data-inv-layout] { grid-template-columns: minmax(0,1fr) !important } }` (line 77). Port hard-codes `268px minmax(0, 1fr)` (`app/investment/page.tsx` 128). Measured at 620px viewport: computed `grid-template-columns: 268px 23px` — **the results column collapses to 23px and the opportunity cards become unreadable.** | **Broken** |
| Hero lede max-width `660px` → `640px`; hero motif SVG missing | source 2092, 2096 | **Different / Missing** |

### `/investment/[slug]` (source `data-page="invdetail"`, lines 2409–2488 + `renderInvDetail()` 3775–3854)

| Finding | Detail | Severity |
|---|---|---|
| Hero: status chip (gold), category chip (`#46CFCF` on `rgba(0,168,168,.45)` border), reference, title `clamp(28px,3.5vw,46px)`, `{district} · Qom, Islamic Republic of Iran` with pin icon | source 2414–2420 + 3791–3795 vs `components/InvestmentDetailView.tsx` 67–76 | **Match** |
| Gallery: one `21/9` hero tile + four `4/3` tiles labelled `gallery 01`–`04` | source 2426–2433 vs `InvestmentDetailView.tsx` 81–92 | **Match** |
| "The opportunity" — 4 paragraphs, first serif `clamp(18px,1.7vw,22px)` | source 3797–3803 vs `InvestmentDetailView.tsx` 98–106 | **Match** |
| Specifications — `Start date` + `End date` highlighted with `inset 0 2px 0 #C8A75D`, then **Opportunity ID, Opportunity status, Investment type, Investment category, District, Land area, Estimated investment value, Term of participation, Geographic coordinates, Responsible department** | source 3805–3823 vs `InvestmentDetailView.tsx` 31–42, 108–124 — **all 12 fields, same order, same `[site area — m²]` / `[estimated value]` / `[term]` placeholders, `{lat}° N, {lng}° E`, `Financial & Economic Affairs`** | **Match** |
| Documents & attachments — Project brief, Site plan, Participation terms, Due diligence pack, each `Download PDF →` | source 3825–3837 vs `InvestmentDetailView.tsx` 8–13, 126–140 | **Match** |
| Location — map panel linking to `https://www.google.com/maps?q={lat},{lng}`, gold pin with `0 0 0 6px` halo, coords strip with `INDICATIVE` and `Open in Google Maps →` | source 2451–2455 + 3839–3843 vs `InvestmentDetailView.tsx` 142–150 | **Match** |
| Key-facts aside (Opportunity status, Investment type, Land area, Estimated value, Opportunity ID) + navy Enquiries card | source 3845–3848 + 2459–2468 vs `InvestmentDetailView.tsx` 153–171 | **Match** |
| Related Opportunities — same-category first, 3 cards, "All opportunities" button | source 3850–3853 vs `InvestmentDetailView.tsx` 26–29, 175–188 | **Match** |
| **Aside is not sticky** | Source: `@media (min-width: 941px) { [data-inv-aside] { position: sticky; top: 132px } }` (line 85). No sticky anywhere in `InvestmentDetailView.tsx`. | **Missing** |
| **Body layout never collapses** | Source: `@media (max-width: 940px) { [data-invdetail-body] { grid-template-columns: minmax(0,1fr) !important } }` (line 84). Port hard-codes `minmax(0, 1fr) 340px` (`InvestmentDetailView.tsx` 96). | **Missing** |
| Outer hairline dropped on Specifications & Documents grids | Source has `border: 1px solid rgba(11,31,58,.12)` (lines 2445, 2448); port uses `gap-px bg-navy/[.12]` only (109, 127). | **Different** |

---

## 9. RTL mode

| Finding | Detail | Severity |
|---|---|---|
| `<html dir="ltr">` preserved, `<body dir="rtl">` in Arabic (scrollbar stays right) | source 4136–4139 vs `lib/i18n.tsx` 49–55. Verified live: `htmlDir: "ltr"`, `bodyDir: "rtl"`. | **Match** |
| Arrow-flipping strings from the dictionary (`View All Opportunities →` → `← عرض جميع الفرص`, `Read More →` → `← اقرأ المزيد`) | `translate()` FLIP map ported verbatim (`lib/i18n-data.js` 1055, 1072–1073) | **Match** |
| Pagination arrows flip (`→ السابق` / `التالي ←`) | source 3267/3272 vs `Pagination.tsx` 34, 57 | **Match** |
| Breadcrumb separator flips `›` → `‹` | source 3412/4019 vs `Breadcrumbs.tsx` 10 | **Match** |
| Hero prev/next arrow glyphs stay `←`/`→` (not flipped) in both | source 325–326; `HeroSlideshow.tsx` 141/149 | **Match** |
| Mono-font data stays LTR-readable — dates (`26 أغسطس 2026`), coordinates (`34.6416° N`), reference IDs (`QOM-INV-2026-101`), phone placeholders — none are reversed | verified live on `/news` and `/investment/i1` in AR | **Match** |
| **`ltr:` and `rtl:` variants both apply in Arabic** | Tailwind compiles `ltr:` to `:where([dir="ltr"], [dir="ltr"] *)` and `rtl:` to `:where([dir="rtl"], [dir="rtl"] *)`. Because `<html dir="ltr">` is an ancestor of every element **and** `<body dir="rtl">` is too, **both selectors match simultaneously**. Proved with a synthetic probe injected in AR: `class="ltr:left-6 rtl:right-6 absolute"` → computed `left: 24px; right: 24px`. **20 call sites are affected** (`app/about/page.tsx` 71,75; `app/contact/page.tsx` 63; `app/departments/page.tsx` 27; `app/feedback/page.tsx` 172; `app/memberships/page.tsx` 26; `app/page.tsx` 137; `app/pcwg/page.tsx` 77; `DeptDetailView.tsx` 42; `HeroSlideshow.tsx` 100,134,153; `InvestmentCard.tsx` 27; `NewsCard.tsx` 47,61; `PageHero.tsx` 41; `SearchBox.tsx` 65; `SiteHeader.tsx` 315). Concrete consequences: the mobile drawer anchors left in AR (see area 4); statement cards get a **3px gold accent on both edges** (`NewsCard.tsx` 47); the statement meta panel gets both a left and a right divider (`NewsCard.tsx` 61); the departments/about/feedback/memberships column dividers double up; hero dot strip stretches the full slide width. | **Broken** |
| **Hero controls mirror where the source pins them physically** | Source uses physical `right: 24px` on the arrows (line 324), `left: 24px` on the dots (329) and `right: 24px` on the image-placeholder caption (251) — they **do not move** in Arabic. Measured in the source in AR at 654px: arrows at `left ≈ 566` (right side), dots at `left = 24`, caption at `left ≈ 360` (right side). Port uses `ltr:right-6 rtl:left-6` etc., so in AR the arrows jump to `left: 24` and the caption to `left: 24`. | **Different** |
| Logical properties otherwise mirror correctly (padding, text-align, flex order, `border-inline-start`) | verified visually on `/news`, `/investment`, `/departments` | **Match** |

---

## 10. Arabic mode / translation coverage

| Finding | Detail | Severity |
|---|---|---|
| **The dictionary is a byte-for-byte port** | `diff design-export/i18n.js lib/i18n-data.js` → the only differences are the comment block and `←`/`→` written as `\u2190`/`\u2192`. **983 Arabic entries in both.** `LANGS`, `lookup()`, `translate()` and the ornament-stripping regex are identical. | **Match** |
| Font swap: sans + serif → `Noto Kufi Arabic`, mono stays `IBM Plex Mono` | source `applyLanguage()` 4110–4115 vs `globals.css` 263–268. Verified live: `body`/`h1` → `"Noto Kufi Arabic"…`, `.font-mono` → `"IBM Plex Mono"…`. | **Match** |
| Bracketed placeholders (`[Meeting with the mayor of a partner city…]`) correctly stay English — the source has no entries for them either | verified live on both | **Match** |
| Persian caption on About Qom — `<p dir="rtl">قم، نگین ایران زمین</p>`, 24px, gold, `margin-bottom 24px` | source 1321 vs `app/about-qom/page.tsx` 248. Vazirmatn dropped, falls back to Noto Kufi via `--font-vazir` (`globals.css` 33) — **markup, direction, size and colour otherwise intact** | **Match** (documented font substitution) |
| Coverage sampled across page types (home, news, article, departments, dept detail, investment, invdetail, pcwg, contact, feedback, media) — headings, eyebrows, chips, sort options, empty states, form labels, breadcrumbs all translate | e.g. `/news` AR: `الأخبار`, `الرسائل والبيانات`, `كل الأخبار`, `الأحدث أولاً`, `2026 (19)` | **Match** |
| **Strings rendered raw that the source translates** | The source translates by walking **every text node**, so any literal in the markup with a dictionary entry gets swapped. The port only translates what is wrapped in `t()`. Verified divergences: <br>• `app/page.tsx` 263 & 280 — the homepage PCWG member/proposed city lists. Source AR: `قم · مشهد · شيراز (شاه چراغ) · الري …`, `كربلاء · النجف`, `مكة · المدينة المنورة`, `دمشق · تبليسي · يريفان`, `الخليل · أنطاكيا`. Port AR: all still English. <br>• `SiteFooter.tsx` 76–77 — `Qom Municipality, Central Building` / `Qom, Iran`. Source AR: `بلدية قم، المبنى المركزي` / `قم، إيران`. Port: English. <br>• `app/contact/page.tsx` — `Qom Municipality, Central Building` appears twice, untranslated; the source translates both (verified live in the source's contact page: only two Latin strings survive in AR, and neither is this one). <br>• `InvestmentDetailView.tsx` 168 — same string in the Enquiries card. <br>• `app/page.tsx` 161 — `headquarters` (the second text node of the About image placeholder) has an entry in the dictionary. <br>• `app/pcwg/page.tsx` CityCard `{name}` and `PcwgNetwork.tsx` 107–110 country lists — `Mashhad`, `Karbala`, `Karbala · Najaf`, `Mecca · Medina` all have entries. | **Broken** |
| `t("Related")` has no dictionary entry | `ArticleView.tsx` 113 — see area 6; the source's `More on this subject` does have one. | **Broken** |
| Copyright line composed rather than looked up | Source has the full-string key `'© 2026 Qom Municipality — International Relations & Communications Department.'`. Port concatenates `t("Qom Municipality")` + `t("International Relations & Communications Department")` (`SiteFooter.tsx` 85) — the **rendered AR output is identical** (`© 2026 بلدية قم — إدارة العلاقات الدولية والاتصالات.`). | **Match** |
| Two contact-page strings correctly remain English in AR (`Qom Municipality, Central Building — Qom, Iran`, `SATURDAY–WEDNESDAY · 08:00–15:00`) | confirmed the source leaves exactly these two untranslated as well | **Match** |

---

## 11. Footer

| Finding | Detail | Severity |
|---|---|---|
| Four link groups + contact block, exact link sets: **Quick links** (News, About Us, International Activities, Deputy Departments, Share Your Experience) / **International cooperation** (Pilgrimage Cities Working Group, Memberships & Networks, Events & Participation, Meetings in Qom) / **Investment & media** (Investment Opportunities, Cultural Weeks & Festivals, Media & Publications) | source 2568–2594 vs `SiteFooter.tsx` 43–71 | **Match** |
| Contact block: `Qom Municipality, Central Building / Qom, Iran / [official email address] / [official telephone number]` | source 2597 vs `SiteFooter.tsx` 75–80 | **Match** (but see area 10 — first two lines untranslated in AR) |
| 6 social icons in order Instagram, X, Telegram, LinkedIn, YouTube, Facebook; 38×38, `rgba(250,248,244,.22)` border, gold hover | source 2560–2565 vs `SiteFooter.tsx` 6–12, 29–40 | **Match** |
| Duplicate EN/AR toggle in the footer bar, gold active state (`#C8A75D` bg / `#0B1F3A` text) — distinct from the header's navy variant | source 2603–2606 + `syncDOM` 2743–2749 vs `SiteFooter.tsx` 86–103 | **Match** |
| Copyright `© 2026 Qom Municipality — International Relations & Communications Department.` | source 2602 | **Match** |
| **Brand tagline replaced with the wrong copy** | Source (line 2558): *"Urban diplomacy, international cooperation and municipal partnerships for the city of Qom."* — this string **has an Arabic entry** (`i18n.js` line 309). Port (`SiteFooter.tsx` 26–28) renders *"International Relations & Communications Department"* instead. The source sentence appears nowhere in the port. | **Different** |
| **"International Relations" gold sub-label missing under the logo** | Source (2556) stacks `Qom Municipality` (serif 15px) over `International Relations` (10px, `.16em`, uppercase, `#C8A75D`). Port keeps only the first line (`SiteFooter.tsx` 24). | **Missing** |
| Footer logo mark sized wrong | Source `40×40`, font-size `17px` (2555). Port `h-11 w-11` (44px), `text-[19px]` (`SiteFooter.tsx` 23) — it reuses the header's dimensions. | **Different** |
| Brand title weight/size | Source `font-size: 15px` regular serif; port `text-base font-semibold` (16px, 600). | **Different** |
| Footer padding | Source `72px 24px 32px` (2551). Port `py-16` = 64px top **and** 64px bottom (`SiteFooter.tsx` 19). | **Different** |
| Column grid | Source `repeat(auto-fit, minmax(190px, 1fr))`, gap `44px` (2552). Port `minmax(220px, 1fr)`, `gap-12` = 48px (`SiteFooter.tsx` 20). | **Different** |
| Social links point to `/contact` | Source uses `href="#top"` placeholders (2560–2565); port links each icon to `/contact` (`SiteFooter.tsx` 33) — six links that navigate where the source does not. | **Different** |
| **Back-to-top button missing entirely** | Source has a fixed 54×54 circular navy/gold button at `inset-inline-end: 24px; bottom: 24px`, `z-index 150`, revealed once the page scrolls past 300px, with `opacity/transform .45s cubic-bezier(.22,.61,.36,1)` and a smooth custom-eased scroll-to-top (`initBackToTop()` 4276–4300, markup 2546–2548). The dictionary entry `Back to top` survives in `lib/i18n-data.js` 323 but no component renders it — `grep -rn "Back to top\|top-btn\|BackToTop"` across `app/` and `components/` returns nothing. | **Missing** |

---

## Additional cross-cutting notes

| Finding | Detail | Severity |
|---|---|---|
| Placeholder data generators (`NEWS`, `MSGS`, `INVEST`, `DEPTS`, `filterList`, `invFilter`, `pageList`, `relatedFor`, `articleParas`, `searchIndex`) | `lib/data.ts` is a faithful, deterministic 1:1 transcription of source 3153–3690 and 4153–4217 | **Match** |
| Palette tokens `#0B1F3A / #C8A75D / #FAF8F4 / #00A8A8 / #3d4a5c / #6B7280 / #9aa3ae / #B4472F` and the dark surfaces `#0E1420 / #101827 / #151D2B / #0D131F / #EAE7E0 / #AEB7C4 / #8E97A5 / #D9BC7E / #E4CB93 / #46CFCF` | source 96–132 vs `globals.css` 5–24 — all present and exact | **Match** |
| Font families IBM Plex Sans / Serif / Mono + Noto Kufi Arabic, self-hosted via `next/font` | source 16–17 vs `app/layout.tsx` 9–32 | **Match** (Vazirmatn dropped, documented) |
| `html { scroll-padding-top: 96px }`, `body { overflow-x: clip }` | source 19, 136 vs `globals.css` 98–100 + `layout.tsx` 42 | **Match** |
| Page metadata title & description | source 12–13 vs `app/layout.tsx` 33–37 | **Match** |
| `PAGES` breadcrumb map | Port's `lib/pages-meta.ts` omits the source's `article`, `invdetail`, `deptdetail` entries (source 2789–2791), but all three detail views hard-code equivalent breadcrumb trails, matching the source's own custom `[data-article-crumbs]` / `[data-invd-crumbs]` / `[data-deptd-crumbs]` handling. No user-visible difference. | **Match** |
| Forms (contact / feedback): `novalidate`, per-field `This field is required.` / `Please enter a valid email address.`, `#B4472F` error border, success messages, star rating, chips, anonymous-name toggle | source `initForms()` 4338–4409 — present in `app/contact/page.tsx` and `app/feedback/page.tsx`; not exhaustively re-verified in this pass | *not fully audited* |
| Hash-anchor router quirk | The source is **not** deep-linkable: loading `…#page-pcwg` does nothing (the router only reacts to `[data-goto]` clicks; there is no `hashchange`/load handler). The port's real routes are a strict improvement, not a regression. | **Different** (improvement) |
