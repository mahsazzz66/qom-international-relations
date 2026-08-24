# Fidelity Audit — Round 4

**TOTALS: Match=27 · Different=2 · Missing=1 · Broken=0 · Simplified=0 — 30 findings checked this round, 3 non-Match**

Independent, read-only re-audit. Method: re-derived every claim from the original source
(`design-export/Qom International Relations.dc.html`, inline `<style>` 18–133, behavior script
2612–4412; `design-export/i18n.js`) against the live port (`localhost:3000`, `npm run dev`),
compared byte-for-byte where practical (SVG path data, keyframe values, JS literals) and via
live `getComputedStyle`/`getBoundingClientRect` introspection at desktop/mobile, EN/AR, light/dark.
All transition-sensitive measurements were taken with `*{transition:none!important}` injected and
a forced reflow beforehand, per the environment's non-compositing preview pane (see method note
in the task and confirmed personally on the `/cooperation` dark-mode case, item 1 below).

This round's scope: (a) rigorously re-verify all 21 non-Match findings from Round 3 against fix
pass 3's claims, and (b) sweep the 11 areas + appendix for any new regressions the fix pass may
have introduced. Three of three prior fix passes introduced at least one new defect — this round
found that pattern held again, in a narrow and specific way (finding 2 below).

**Headline: fix pass 3 delivered on essentially everything it claimed.** 20 of Round 3's 21
findings are now confirmed Match. One (the RTL flip-target DOM node) was correctly left alone, as
the fix pass stated, and remains a harmless implementation-detail difference. Round 4 surfaced two
new items fix pass 3 did not claim to touch and did not fully cover: a residual, narrower version
of the RTL decorative-edge bug inside two of the four "fixed" locations, and a missing
focus-on-error behavior on the feedback form (a sibling of the exact bug just fixed on the contact
form).

---

## 1. Re-verification of Round 3's 21 findings

| # | Round 3 finding | Round 4 verdict | Evidence |
|---|---|---|---|
| 1 | `/cooperation` dark-mode cards allegedly stay white (**Missing+Broken**, half of A.4) | **Match** | Live-measured with `*{transition:none!important}` injected + forced reflow before reading `getComputedStyle`. `[data-coop-grid] article` background = `rgb(21,29,43)` = `#151D2B` exactly, in dark mode. `el.getAnimations()` returned `[]` (nothing mid-transition). **Fix pass 3's claim is independently confirmed correct**: this was a testing-environment false positive from Round 3 (raw `getComputedStyle` read while a CSS transition was frozen mid-flight by the non-compositing preview pane), not a real defect. The underlying cascade was already correct. |
| 2 | 7× missing hero icons: about, cooperation, events, media, meetings, memberships, contact | **Match** (all 7) | Diffed every `<svg>` the port now passes to `PageHero`'s `icon` prop against the source's decorative hero-motif SVG at each page's `data-page="…"` section (source lines 991, 1358, 2008, 2260, 2030, 1963, 2321). Path data is **byte-identical** in all 7 cases (columns/pediment for about, globe+dashed triangulation for cooperation, podium+flag for events, film-reel+doc-panel for media, round-table+attendees for meetings, 3-circle Venn for memberships, envelope+map-pin for contact). Files: `app/about/page.tsx:45-48`, `app/cooperation/page.tsx:36-41`, `app/events/page.tsx:24-30`, `app/media/page.tsx:29-37`, `app/meetings/page.tsx:43-50`, `app/memberships/page.tsx:21-27`, `app/contact/page.tsx:60-66`. |
| 3 | RTL decorative-edge mismatch, 4 locations (homepage About 3-up, `/about`, `/memberships`, `/departments` list) — physical border should stay non-mirrored per source's own accidental bug | **Match** (borders) — see finding 2 below for a residual gap | Live-measured in Arabic (`body[dir=rtl]`) with transitions disabled: homepage Mission/Vision columns (`app/page.tsx:137`), `/about` `#about-mission`/`#about-vision` (`app/about/page.tsx:79,83`), `/memberships` logo panels (`app/memberships/page.tsx:36`), `/departments` "Cooperation interests" panel (`app/departments/page.tsx:40`) — all now use plain physical `border-r`/`border-l` with **no** `rtl:` variant. Computed `border-left-width`/`border-right-width` confirmed the border stays on the same physical edge in both EN and AR, exactly reproducing source's non-logical `border-right`/`border-left` (source lines 425, 432, 1021, 1028, 1973/1981/1989, 1446 etc.). |
| 4 | `/feedback` and `/contact` — 2 of fix pass 2's original 6 claimed decorative-edge locations, confirmed in Round 3 as **not** mismatches and told to be left alone | **Match** (untouched, still correct) | `/feedback`'s checklist box (`app/feedback/page.tsx:185`) still uses `border-l-2 rtl:border-l-0 rtl:border-r-2 …` — a manual mirror-flip that reproduces the same auto-mirroring behavior as source's CSS logical `border-inline-start` (source line 2231). Confirmed flips correctly to `border-right` in AR. `/contact`'s 3-card row (`app/contact/page.tsx:78`) uses `border-l rtl:border-l-0 rtl:border-r` on non-first cards; traced the visual effect through CSS Grid's direction-aware column reordering and confirmed it reproduces the same divider positions as source's gap/background-seam technique (source line 2329) in both directions — a different but visually-equivalent technique, not a regression. |
| 5 | `text-wrap: pretty` blanket base-layer rule (Different — over-applied to ~447 candidates vs. source's 77) | **Match** | `globals.css` no longer contains any blanket `text-wrap:pretty` rule. Source has exactly 77 occurrences (`grep -c` confirmed). Port now applies the Tailwind `text-pretty` utility at 35 discrete JSX call sites across 13 files, which fan out to the full 77 rendered instances once repeated/templated content is accounted for (hero slides ×5, PCWG member/candidate city cards ×16, "how it operates"/"functions" grids, card templates rendered per news/investment/dept item, etc.) — every logical group in source's list of 77 has a corresponding `text-pretty` call site in the port. Live-verified: hero `<h1>` computed `text-wrap: pretty`; the dark hero `<h1>` on `/cooperation` (which source never gives `text-wrap:pretty` either) computed `text-wrap: wrap` (default) — correctly *not* applied where source doesn't apply it either. |
| 6 | Breadcrumb separator not locale-aware, 3 files (`ArticleView.tsx`, `DeptDetailView.tsx`, `InvestmentDetailView.tsx`) | **Match** | All 3 files plus `Breadcrumbs.tsx` now use `locale === "en" ? "›" : "‹"`, matching source's `lang === 'en' ? '›' : '‹'` used consistently at all 4 breadcrumb-builder call sites (source lines 3412, 3712, 3786, 4019). |
| 7 | Contact form missing focus-on-error (Simplified, part of A.9) | **Match** | `app/contact/page.tsx:45-46` now calls `document.getElementById(firstErrorId)?.focus()` with the same DOM-order precedence (name before email) as source's `validate()` → `bad.focus()` (script line 4368). |
| 8 | `/feedback` Name field wrongly required (Broken) | **Match** | `app/feedback/page.tsx:39-41` — only `message` is required; `name` has no required check, matching source's `validate()` (only `data-required="1"` on the Message field, script line 4346 / markup 2215). The `if (!anonymous)` conditional-required logic that blocked valid submissions is gone. |
| 9 | Homepage Media section reveal-scope too broad (Different) | **Match** | `components/home/HomeMedia.tsx:68-79` — `<Reveal>` now wraps only the header row (title + tab buttons), matching source's `data-reveal` on line 731 which wraps the same header div and stops before the tab-panel grids. |
| 10 | `/about-qom` hero padding wrong (symmetric vs. source's asymmetric 80/24/84) | **Match** | `app/about-qom/page.tsx:72` now uses `pt-20 pb-21 px-6` = `80px / 24px / 84px`, matching source's `padding: 80px 24px 84px` exactly (source line 1099). |
| 11 | Hero crossfade easing curve wrong (Different) | **Match** | `components/HeroSlideshow.tsx:100` now specifies `ease-[cubic-bezier(.25,.1,.25,1)]` explicitly, which is the literal expansion of CSS's `ease` keyword used by source (`transition: opacity 1.1s ease`, line 249) — functionally and now also textually equivalent. |
| 12 | Pagination click-on-active-page not a no-op (Different) | **Match** | `components/Pagination.tsx:49` — `onClick={() => { if (v !== page) onChange(v); }}` guards against re-triggering, matching source's `if (!to \|\| to === current) return` (script line 3124). |
| 13 | RTL flip-target DOM node differs — cosmetic/non-functional (Different) | **Different** (unchanged, as intended) | Confirmed again live: port sets `dir="rtl"` on `<body>` (`lib/i18n.tsx:55`, `globals.css:139-141`), source flips an inner wrapper div. `<html>` stays `dir="ltr"`/`direction:ltr` in both, preserving the "scrollbar stays right" intent. No visual or behavioral difference detected. This was explicitly *not* re-attempted by fix pass 3 per the task brief, and correctly so — it's genuinely inert. Left open at lowest priority, as before. |

## 2. New findings (not part of fix pass 3's claimed scope, or an incomplete fix within it)

| # | Finding | Severity | Evidence |
|---|---|---|---|
| 14 | **RTL decorative-edge fix is incomplete on 2 of the 4 "fixed" locations.** The homepage About 3-up (`app/page.tsx:145`) and `/about` page (`app/about/page.tsx:87`) each have a **third** column ("Objectives") beside the two ("Mission"/"Vision") whose borders were correctly un-mirrored. Source gives this third column asymmetric physical padding — `padding: 40px 0 40px 44px` (source line 439), never mirrored, same accidental-non-mirroring pattern as the borders on columns 1–2. The port's third column still carries `pl-11 rtl:pl-0 rtl:pr-11` — an active mirror-flip that fix pass 3 left untouched when it removed the sibling columns' `rtl:` border classes. Live-verified in Arabic with transitions disabled: computed `padding-right: 44px` / `padding-left: 0px` (i.e. it flips), where source (and the sibling columns, post-fix) would keep the offset on the physical left regardless of direction. Low visual severity (a single column's inner padding gap moves side), but it's the same bug category the fix pass otherwise eliminated, left half-done in the two locations that have this extra column. | **Different** |
| 15 | **`/feedback` form is missing the same focus-on-error behavior just fixed on `/contact`.** Source's generic `wire()`/`validate()` (script 4340-4376) is applied identically to `[data-page-form]` (contact) *and* `[data-feedback-page-form]` (feedback) — both call `bad.focus()` on the first invalid field (line 4368). Fix pass 3 added `document.getElementById(firstErrorId)?.focus()` to `app/contact/page.tsx`'s submit handler (confirmed at finding 7 above) but made no equivalent change to `app/feedback/page.tsx:37-46`, whose `submit()` sets error state and status text but never calls `.focus()` on the invalid field (the Message textarea, feedback's only required field). A user submitting invalid feedback sees the error message but the browser does not move focus to it, unlike source and unlike the port's own (now-correct) contact form. | **Missing** |

## 3. Spot-checks across the 11 areas — confirming no regressions elsewhere

Representative live verification outside the Round 3 punch list, to catch anything fix pass 3
might have disturbed incidentally. No regressions found in any of the following.

| Area | Check | Verdict |
|---|---|---|
| 2. Header | Scroll-compact state via synthetic `scroll` events: padding 14px→7px, logo mark 44px→36px, box-shadow `0 18px 38px -30px rgba(11,31,58,.62)` appear/revert correctly at scroll thresholds. | **Match** |
| 2. Header | Mega-menu ("International Activities") toggles `aria-expanded` and panel visibility on click. | **Match** |
| 4. Mobile drawer | At 390px viewport: drawer opens flush to the physical left edge in EN (`left:0`), flush to the physical right edge in AR (`right:390` = viewport width) — RTL side-flip (the Round 1→2 regression subject) remains solid. | **Match** |
| 5. Animations | All 6 keyframes (`qomPulse`, `qomBob`, `qomKen`, `qomReveal`, `qomFlow`, `qomGlow`) present in `globals.css:53-105`, values byte-identical to source (lines 24-29). `qomBob` is unused in both source and port (dead keyframe in source itself) — correctly not invoked in the port either, not a gap. | **Match** |
| 9/10. RTL / Arabic, dark mode | Dark-mode card backgrounds on `/investment` (19 elements) and via the same technique on `/departments` confirmed `rgb(21,29,43)` with transitions disabled — the Round 3 `/cooperation` scare was isolated to a measurement artifact, not a systemic dark-mode issue, consistent with fix pass 3's own root-cause claim. | **Match** |
| 11. Footer | Full content diff against source lines 2550-2610: logo lockup, tagline, 6 social icons (identical path data), 4 link columns with identical hrefs/labels, contact block, hardcoded "© 2026" copyright (matches source's own hardcoded 2026, not dynamic in either), EN/AR toggle. | **Match** |
| 6. News | `/news` structure: News/Statements category toggle, sort dropdown, category filter chips, year-archive counts, "Load more" counts, pagination — all present and internally consistent with the data counts shown (75 articles, 40 statements). | **Match** |
| Appendix: `/pcwg` | Network diagram renders (11 SVGs, 63 node/decoration circles) with node/flow-line elements present; consistent with Round 3's A.11 "excellent fidelity" verdict. | **Match** |

## 4. Known, accepted exception (not re-flagged)

The hash-anchor router quirk (source's non-deep-linkable hash router vs. the port's real Next.js
routes) was encountered incidentally while navigating but is an accepted improvement per the task
brief — not re-flagged as a defect.

---

## What's still open

1. **Finding 14** — give the "Objectives" third column the same treatment as its sibling columns:
   drop `rtl:pl-0 rtl:pr-11` from `app/page.tsx:145` and `app/about/page.tsx:87`, leaving plain
   `pl-11`, so the padding stays on the physical left in both directions like source.
2. **Finding 15** — add the same `document.getElementById(...)?.focus()` call fix pass 3 added to
   `app/contact/page.tsx` to `app/feedback/page.tsx`'s `submit()` handler, focusing the Message
   field (or Email, if that's the one that fails) on validation failure.
3. **Finding 13 (9.1 legacy)** — RTL flip-target DOM node difference remains open at lowest
   priority; confirmed again this round to be genuinely inert (no visual/behavioral effect),
   optional to address.
