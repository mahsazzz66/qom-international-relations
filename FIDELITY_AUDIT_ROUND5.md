# Fidelity Audit — Round 5

**TOTALS: Match=34 · Different=0 · Missing=0 · Broken=0 · Simplified=1 — 35 findings checked this round, 1 non-Match**

Independent, read-only re-audit, likely final round. Method: re-derived every claim from the
original source (`design-export/Qom International Relations.dc.html`, inline `<style>` 18–133,
behavior script 2612–4412; `design-export/i18n.js`) against the live port (`localhost:3000`,
`npm run dev`), compared via `getComputedStyle`/`getBoundingClientRect`/`elementFromPoint`
introspection at desktop (1400px) and mobile (390px/700px) widths, EN/AR locales, light/dark
themes, and via direct source-vs-port code reading for logic that live measurement can't capture
(validation order, focus targeting). No screenshots were used (this environment's preview pane
does not composite frames — screenshot calls hang rather than render anything useful); all
transition-sensitive measurements had `*{transition:none!important}` injected plus a forced
reflow before reading computed values, per the task's method note.

**Headline: the round-4 RTL restructuring (`dir`/`direction` moved from `<body>` onto the new
`[data-rtl-root]` wrapper `<div>`) is solid — no regression found anywhere.** This was the
single highest-risk change entering this round, explicitly flagged as "the exact class of change
that caused the round 1→2 RTL regression," and it received the most thorough live verification of
any item in this audit (see §0). Every measured dimension — the wrapper's `dir`/computed
`direction`, `<html>`'s untouched `dir="ltr"`, `<body>`'s absence of any `dir` attribute, element
positions in Arabic at desktop and mobile, the mobile drawer's physical edge, hero controls'
fixed pinning, pagination arrow mirroring, all four RTL decorative-edge locations (including the
just-fixed Objectives column), and dark+RTL interaction — matched source pixel-for-pixel (within
1-2px rounding) or matched exactly in the underlying DOM attributes/classes. Both of round 4's
other two targeted fixes (the Objectives-column padding, and `/feedback`'s focus-on-error) are
also independently confirmed correct.

The only new finding this round is **unrelated to RTL and unrelated to any of round 4's claimed
work**: `/contact`'s "Address / Email / Telephone" info-strip reimplements the source's
grid-gap-background divider technique with explicit per-item borders instead, which is visually
equivalent at desktop widths but diverges once the strip wraps to two rows below ~780px content
width. This exact code was inspected and passed in round 4 (round 4 finding "4", above) under a
check that only tested RTL-flip equivalence at a width where the grid doesn't wrap — this round's
narrower-viewport measurement is what surfaces it. Every other instance of this same
gap-background technique elsewhere in the port (9 files, ~13 occurrences) was checked and is
implemented correctly.

---

## 0. RTL mechanism — priority verification

### 0.1 What's actually there now

`lib/i18n.tsx` (read in full):
- `useEffect` at lines 45-57 sets `document.documentElement.lang = locale` and
  `document.documentElement.dir = "ltr"` (always, unconditionally) — no `document.body.dir`
  assignment anywhere in the file.
- Lines 73-84: `LocaleProvider` renders `<div dir={locale === "ar" ? "rtl" : "ltr"} data-rtl-root>{children}</div>`
  as body's effective direct child (via `<html><body>{ThemeProvider→LocaleProvider→this div}</body></html>`
  in `app/layout.tsx`), mirroring the source's `document.querySelector('[data-qom="2"]')` root
  (confirmed at source line 136: `<div data-qom="2" ...>` is literally the first element after
  `<body>` at line 8, and script lines 2751-2753 flip `root.style.direction`/`root.setAttribute('dir', ...)`
  on that node, never on `<body>`).

`app/globals.css` (read in full):
- Line 137-139: `html { direction: ltr; }` (unconditional).
- Line 140-142: `[data-rtl-root][dir="rtl"] { direction: rtl; }` — the only rule that flips
  `direction`, scoped to the wrapper, matching source's `root.style.direction = rtl ? 'rtl' : 'ltr'`.

This is an exact structural match to the source's technique, not just a visually-equivalent
substitute.

### 0.2 Live DOM state, both locales

| Attribute | Port (AR) | Source (AR) | Port (EN) |
|---|---|---|---|
| `<html lang>` | `ar` | `ar` | `en` |
| `<html dir>` | `ltr` | `ltr` | `ltr` |
| `<html>` computed `direction` | `ltr` | `ltr` | `ltr` |
| `<body dir>` | `null` (absent) | `null` (absent) | `null` (absent) |
| `<body>` computed `direction` | `ltr` | — | `ltr` |
| wrapper `dir` | `rtl` | `rtl` | `ltr` |
| wrapper computed `direction` | `rtl` | `rtl` | `ltr` |

`<html>` and `<body>` are completely unaffected by locale in both port and source — confirmed
live via `getComputedStyle`/`getAttribute` on both `localhost:3000` and `localhost:8934`.

### 0.3 Live element-position comparison, Arabic, 1400px, transitions disabled

| Element | Port x | Source x | Verdict |
|---|---|---|---|
| Header logo | 1179 | 1179 | Match |
| Header CTA | 76 | 77 | Match (1px rounding) |
| Hero `<h1>` | 508 | 509 | Match |
| First ribbon cell | 1001 | 1001 | Match |
| `/departments` "Cooperation interests" panel | x=116, border-left 1px, padding-left 30px | x=115, border-left 0.8px, padding-left 30px | Match (physical edge kept, not mirrored, in both) |
| `/memberships` logo panel | x=1048, w=260, border-right 1px | x=1048, w=260, border-right 0.8px | Match |

### 0.4 Mobile drawer, Arabic, 390px

Both measured via `getBoundingClientRect` on the actual drawer `<aside>`/equivalent element,
`*{transition:none}` + reflow applied first (drawer opened via direct `.click()` on the trigger,
not a scripted animation wait):

| | Port | Source |
|---|---|---|
| Right edge distance from viewport | 0px (flush) | 0px (flush) |
| Width | 343px | 343px (390−47) |

`components/SiteHeader.tsx:365-367` — the `<aside>` is `fixed ... left-0 rtl:left-auto rtl:right-0`
with `transform: translateX(100%)` when closed in Arabic (slides in from the right) — matches.

### 0.5 Hero controls — physically pinned regardless of language

Source keeps `data-slide-nav="prev"/"next"` at `right: 24px` and `data-dots` at `left: 24px`
(source lines 324-329) — fixed regardless of `direction`, since these use `position: absolute`
physical offsets, not logical ones.

| Element | Port x | Source x |
|---|---|---|
| Prev button | 1313 | 1313 |
| Next button | 1255 | 1255 |
| First dot (`aria-label="Slide 1"` / `data-dot="0"`) | 200 | 200 |

All exact matches. Note prev renders to the *right* of next, and the first dot renders at the
*right* end of the dot row — in both port and source. This is CSS Grid/Flexbox's native
direction-aware reordering (the parent's inherited `direction: rtl` reverses `flex`/`grid` child
order), not a bug in either — both exhibit it identically, confirming the port's controls sit in
an equivalently RTL-inherited context as source's.

`components/HeroSlideshow.tsx:157,176` — the containers use plain `right-6`/`left-6` with no
`rtl:` variant, correctly relying on the fixed physical CSS position (as source does) rather than
manually flipping it.

### 0.6 Pagination arrows

Source (`pagerHTML`, script lines 3261-3272): `(rtl ? '→ ' : '← ') + Previous` and
`Next + (rtl ? ' ←' : ' →')`.

`components/Pagination.tsx:40,68`: `{rtl ? "→ " : "← "}{t("Previous")}` and
`{t("Next")}{rtl ? " ←" : " →"}` — byte-identical logic. Match.

### 0.7 RTL decorative-edge fixes — all four locations, including the just-fixed one

Source's Mission/Vision/Objectives 3-up (source lines 425-450) uses physical, never-mirrored
`padding`/`border-right`/`border-left` (an accidental non-mirroring in the original design that
prior rounds established must be preserved, not "corrected," in the port).

Live-measured in Arabic, 1400px, transitions disabled:

| Location | Column | Port `pl`/`pr`/`border` | Source equivalent | Verdict |
|---|---|---|---|---|
| Homepage (`app/page.tsx:137,145`) | Mission (col 1) | pl:0 pr:44 br:1 | `padding:40px 44px 40px 0; border-right` | Match |
| Homepage | Vision (col 2) | pl:44 pr:44 br:1 | `padding:40px 44px; border-right` | Match |
| Homepage | **Objectives (col 3)** | pl:44 pr:0 no border | `padding:40px 0 40px 44px` (no border) | **Match** — round 4's fix confirmed live |
| `/about` (`app/about/page.tsx:79,83,87`) | Mission | pl:0 pr:44 br:1 (x=898, rightmost in RTL) | same | Match |
| `/about` | Vision | pl:44 pr:44 br:1 (x=487) | same | Match |
| `/about` | **Objectives** | pl:44 pr:0 no border (x=77, leftmost) | same | **Match** — round 4's fix confirmed live |
| `/memberships` logo panel | — | border-right retained (§0.3) | source line 1973 `border-right` | Match |
| `/departments` "Cooperation interests" | — | border-left/padding-left retained (§0.3) | source line 1446 `border-left`/`padding-left` | Match |

All 8 physical-edge checks (2 pages × 4 columns/panels, counting the previously-fixed pairs plus
the two round-4 Objectives fixes) confirmed matching, live, in Arabic, via `getComputedStyle`.

`/feedback` and `/contact` correctly *do* mirror (their source markup has no fixed physical
decoration to preserve): `app/feedback/page.tsx:187` uses
`border-l-2 rtl:border-l-0 rtl:border-r-2 rtl:pr-4.5 rtl:pl-0`, and the search panel
(`components/SearchBox.tsx:67`) uses the logical `start-0` utility matching source's
`inset-inline-start: 0` (source line 161) — both correctly flip with direction, confirmed by code
reading (logical/`rtl:`-paired classes present, no physical-only classes left unguarded).

### 0.8 EN mode — nothing broken

Live-checked on `/`: `lang="en"`, `<html dir="ltr">` computed `ltr`, wrapper `dir="ltr"` computed
`ltr`, `<body>` has no `dir` attribute. No artifacts left over from Arabic state.

### 0.9 Dark mode + RTL combined

Homepage, Arabic + `data-theme="dark"`: `<body>` background `rgb(14,20,32)` = `#0e1420`
(`--color-dark-bg`), text `rgb(234,231,224)` = `#eae7e0` (`--color-dark-ink`) — both exact
matches to the CSS variables in `globals.css`. Wrapper `dir` still `rtl`, computed `direction`
still `rtl` — no interaction bug between the new wrapper structure and the `html[data-theme="dark"]`
selectors (which target `<html>`/`<body>`, independent of the wrapper).

`/departments`, same combination: the "Cooperation interests" panel's border color computed
`rgba(250,248,244,0.16)` = `--color-dark-line`, applied via the `dark:border-dark-line` utility
alongside the physical `border-l` class — both cascades apply cleanly together, no override
conflicts.

**RTL verdict: no regression of any kind. The round-4 restructuring is fully sound.**

---

## 1. Round-4 fixes, independently re-verified

| # | Fix | Verdict | Evidence |
|---|---|---|---|
| 1 | RTL flip target moved to `[data-rtl-root]` wrapper | **Match** | See §0 in full — exhaustively re-verified, no regression. |
| 2 | Objectives column keeps physical (non-mirrored) padding | **Match** | Live-measured on both `app/page.tsx` and `app/about/page.tsx` in Arabic — `pl-11` with no `rtl:` override, computed `padding-left: 44px`/`padding-right: 0px` regardless of direction. See §0.7. |
| 3 | `/feedback` focus-on-error | **Match** | `app/feedback/page.tsx:45-46` calls `document.getElementById(firstErrorId)?.focus()`, with the same email-before-message priority as source's DOM-order `validate()` (script 4342-4353, only `fbp-msg` carries `data-required="1"` per source markup line 2215 — name/country/suggestions are optional, email is format-only-if-filled, exactly matching the port's validation scope). **Live-tested**: submitting the empty feedback form moved focus to `#fbp-msg` (confirmed via `document.activeElement.id` immediately after a scripted `submit` click). `/contact`'s equivalent (round 3's original fix) re-tested at the same time and still works: empty submit focuses `#cp-name`. |

---

## 2. New finding

| # | Finding | Severity | Evidence |
|---|---|---|---|
| 4 | **`/contact`'s Address/Email/Telephone info-strip uses a different divider technique than source, which diverges visibly once the strip wraps.** Source (line 2329) draws the three-cell divider using the "grid-gap-as-seam" trick: `display:grid; gap:1px; background:rgba(11,31,58,.12); border:1px solid …`, with each cell painted opaque white — so 1px grey seams show through *every* gap (including between wrapped rows), and if a row has fewer items than there are column tracks (e.g. the third cell wraps alone under two columns), the **entire leftover empty grid cell renders as solid grey** (confirmed live on source at 700px: `elementFromPoint` at the empty row-2/col-2 coordinate returns the grid container itself with `background: rgba(11,31,58,0.12)`). `app/contact/page.tsx:78` instead gives every item after the first an explicit `border-l rtl:border-l-0 rtl:border-r` class. This is visually identical to source when all three cells fit in one row (the common desktop case, and the only case round 4 checked), but at content widths below ~780px where the grid wraps to two rows: (a) the ported cell 3 — now the *leftmost* item in its own row — still carries a spurious `border-l`/1px, which source's technique would never produce for an item that starts a row; and (b) the leftover empty grid area (row 2, column 2) in the port renders fully transparent (`elementFromPoint` there returns the outer grid `<div>` with `background: rgba(0, 0, 0, 0)`), instead of source's solid grey rectangle. Live-measured at 700px width, EN, light theme: port cell 3 at x=25,y=704,w=325,`border-left-width:1px`; source cell 3 at the equivalent x=25,y=700,w=325 with *no* border-left (divider effect comes entirely from the seam/empty-cell background, not a per-item border). Checked for scope: this exact gap-background technique is implemented **correctly** (matching source, no per-item borders) in every other instance found in the port — `app/page.tsx` (ribbon), `app/about/page.tsx`, `app/about-qom/page.tsx` (3 instances), `app/feedback/page.tsx`, `app/media/page.tsx`, `app/meetings/page.tsx` (3 instances), `app/pcwg/page.tsx` (2 instances), `app/investment/page.tsx`, `components/DeptDetailView.tsx` (4 instances), `components/InvestmentDetailView.tsx` (2 instances) — all use `grid gap-px bg-navy/[.12] …` correctly. Only this one call site in `app/contact/page.tsx` diverges. Not RTL-related and not part of any of round 4's claimed work; round 4's own re-check of this exact element (round 4 finding "4") only tested RTL-flip equivalence at a width where the grid doesn't wrap, which is why it read as Match then and only surfaces now under a narrower-viewport check. | **Simplified** |

---

## 3. Sweep of the 11 areas + appendix — no other regressions found

Console errors: checked and clean (zero errors/warnings) on `/`, `/news`, `/about`, `/about-qom`,
`/pcwg`, `/cooperation`, `/events`, `/culture`, `/media`, `/meetings`, `/investment`,
`/investment/i1`, `/feedback`, `/contact`.

| Area | Check performed | Verdict |
|---|---|---|
| 1. Homepage | Ribbon divider technique (`gap-px bg-navy`), Mission/Vision/Objectives grid, RTL positions | Match |
| 2. Header | Logo/CTA position (RTL), search box logical positioning (`start-0`), desktop nav renders all groups, mega-menu items present | Match |
| 3. Hero | `<h1>` position (RTL), prev/next/dots physical pinning + native flex/grid reversal parity, crossfade easing (carried from round 4, code unchanged) | Match |
| 4. Mobile drawer | Right-flush position + exact width match in Arabic at 390px; `aside` transform/positioning classes unchanged from round 4 | Match |
| 5. Animations (6 keyframes) | `qomPulse`, `qomBob`, `qomKen`, `qomReveal`, `qomFlow`, `qomGlow` in `app/globals.css:53-106` diffed value-for-value against source lines 24-29 — identical timing functions, percentages, transform/opacity values | Match |
| 6. News pages | `/news`, `/news/n0` load clean, pagination logic verified (§0.6) | Match |
| 7. Department pages | `/departments` list panel (§0.3), `DeptDetailView.tsx` divider technique (4 correct instances) | Match |
| 8. Investment pages | `/investment`, `/investment/i1` load clean; `InvestmentDetailView.tsx` divider technique (2 correct instances) | Match |
| 9. RTL mode | See §0 in full | Match |
| 10. Arabic mode | Font-family swap rules unchanged in `globals.css:368-376` (`html[lang="ar"] body`/`.font-serif` → `--font-kufi`); locale toggling confirmed clean in both directions | Match |
| 11. Footer | Language switcher dark-styled variant (`components/SiteFooter.tsx:87-104`) matches source's `dark = !!g.closest('footer')` styling logic (gold bg + navy text when active) exactly | Match |
| Appendix: contact | Focus-on-error re-confirmed (§1); info-strip divider bug (§2, finding 4) | 1 Simplified |
| Appendix: feedback | Focus-on-error fix confirmed live (§1) | Match |
| Appendix: about, about-qom, culture, cooperation, events, media, meetings, memberships, pcwg | Console-clean; divider-technique code audit clean (§2 scope check) | Match |

---

## Summary

Round 4's highest-risk change — restructuring the RTL flip mechanism onto a new
`[data-rtl-root]` wrapper — is fully correct and introduced no regression, verified across DOM
attributes, live element positions (desktop and mobile), the mobile drawer, hero controls,
pagination, all RTL decorative-edge locations, EN mode, and dark+RTL interaction. Both of round
4's other targeted fixes (Objectives column padding, `/feedback` focus-on-error) are confirmed
working live. One new, narrow-scope, RTL-unrelated finding surfaced: `/contact`'s info-strip
divider technique diverges from source once it wraps below ~780px — an isolated one-file issue,
not a repeat of the systemic pattern seen in prior rounds, and not present anywhere else the same
technique is used in the port.
