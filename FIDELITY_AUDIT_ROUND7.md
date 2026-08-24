# Fidelity Audit — Round 7

**Scope:** Independent, read-only re-audit of the Next.js port (`E:\claude\qom-international-relations`) against the original design source (`E:\claude\design-export\Qom International Relations.dc.html` + `i18n.js`). This round first verified the two fixes claimed after Round 6, then performed a full from-scratch sweep of all 11 areas + appendix, with extra scrutiny on translation completeness per the round's brief.

## TOTALS

**TOTALS: Match=0 Different=2 Missing=0 Broken=0 Simplified=0**

(2 distinct root-cause findings, both severity **Different**; one is a genuine regression introduced by the Round 6 fix pass, the other is a previously-unflagged translation gap in the same family of bug Round 6 targeted but didn't fully clear.)

---

## Round 6 fix verification

### Fix claim 1 — 10 untranslated `aria-label`s wrapped in `t()`

**Verified correct.** All 10 call sites across 8 files now wrap the literal string in `t()`, and all 10 dictionary keys exist in `lib/i18n-data.js` with values byte-identical to `design-export/i18n.js` (diffed the two files directly — only cosmetic differences in the `translate()` helper's arrow-escaping, functionally identical, dictionary content 100% identical):

- `components/SiteHeader.tsx:146` `aria-label={t("Menu")}` → live AR: `القائمة`
- `components/SiteHeader.tsx:202-203` `aria-label={t("Switch theme")}` / `title={t("Switch theme")}` → live AR: `تبديل المظهر`
- `components/SiteHeader.tsx:232` `aria-label={t("Primary")}` → live AR: `التنقل الرئيسي`
- `components/SiteHeader.tsx:376` `aria-label={t("Close")}` → live AR: `إغلاق`
- `components/ArticleView.tsx:47`, `components/Breadcrumbs.tsx:13`, `components/DeptDetailView.tsx:46`, `components/InvestmentDetailView.tsx:60` `aria-label={t("Breadcrumb")}` → live AR: `مسار التنقل`
- `components/ArchiveSection.tsx:140` `aria-label={t("Sort")}` → dictionary key confirmed
- `components/SearchBox.tsx:58` `aria-label={t("Clear search")}` → dictionary key confirmed
- `components/BackToTop.tsx:46` `aria-label={t("Back to top")}` → live AR: `العودة إلى الأعلى`

Live-verified on `/departments/planning` in Arabic mode via DOM query of every `[aria-label]/[title]/[placeholder]` element — all 7 non-social-icon values came back correctly translated. Confirmed **Match**.

One adjacent check: `app/investment/page.tsx:140` still has a raw `aria-label="Sort opportunities"` (not wrapped). Verified this is **correct as-is**: the source's investment-page sort `<select>` uses `aria-label="Sort opportunities"` (source line 2107) — a distinct string from the plain `"Sort"` used on the News/Statements archives (source lines 896, 952) — and `i18n.js` has no dictionary entry for `"Sort opportunities"`, nor does the generic-prefix/suffix partial-match logic in `translate()` (i18n.js:1062-1080) catch it, since the whole string is alphanumeric. So the source itself never translates this string; leaving it hardcoded in the port reproduces that faithfully. Not a bug.

### Fix claim 2 — `VideoCard.tsx` hint badge `left-3.5` → `start-3.5`

**Verified applied, but the fix is backwards for 2 of the badge's 3 usage contexts — see Finding 2 below.** The literal edit landed (`components/VideoCard.tsx:38` now reads `start-3.5` not `left-3.5`), but re-deriving the source's actual behavior per context shows the physical→logical change was the wrong direction for the `/media` and homepage video-tab contexts, which the source deliberately keeps physically pinned left even in RTL. Only the `/pcwg` gallery context wants logical positioning, and that context has other, larger, pre-existing style mismatches untouched by this fix. Detailed below.

---

## Finding 1 (Different) — Social-media icon `aria-label`s stay in English in Arabic mode

`components/SiteFooter.tsx:37` and `app/contact/page.tsx:100` render social icon links as:

```tsx
{SOCIAL.map((s) => (
  <a key={s.label} href="..." aria-label={s.label} ...>
```

where `s.label` is one of the raw literals `"Instagram"`, `"X"`, `"Telegram"`, `"LinkedIn"`, `"YouTube"`, `"Facebook"` (defined in a local `SOCIAL` array in each file, duplicated verbatim between the two files). None of these are passed through `t()`.

The source's generic attribute-translation pass (`attrEls` in the runtime class, `Qom International Relations.dc.html:4085-4126`) walks every element with a `placeholder`/`aria-label`/`title` attribute and re-translates it on every language change — this is exactly the mechanism Round 6 fixed 10 other call sites against. `i18n.js` **does** carry Arabic entries for 5 of these 6 words:

```
'Instagram': { ar: 'إنستغرام' },
'Telegram':  { ar: 'تيليغرام' },
'YouTube':   { ar: 'يوتيوب' },
'Facebook':  { ar: 'فيسبوك' },
'LinkedIn':  { ar: 'لينكد إن' }
```

(`X` has no dictionary entry and is correctly expected to stay `"X"` in Arabic — that part is fine either way.)

**Live-verified** on the port in Arabic mode (`qom-lang=ar` in `localStorage`), both on the homepage footer and on `/contact`'s "Social media" block, and cross-checked again on `/departments/planning`'s footer (footer is site-wide, so this reproduces on every page):

```json
["Instagram","X","Telegram","LinkedIn","YouTube","Facebook"]
```

— all 6 aria-labels are still in English; 5 of them should read `إنستغرام`, `تيليغرام`, `لينكد إن`, `يوتيوب`, `فيسبوك`. Every other translatable attribute on the same pages (`Menu`, search placeholder, `Switch theme`, `Primary`, `Close`, `Breadcrumb`, `Back to top`) came back correctly translated in the same query, confirming this is isolated to the two `SOCIAL` arrays and not a regression in the shared `t()`/attribute mechanism.

`components/ArticleView.tsx:88`'s share buttons (`aria-label={s.label}` with labels `"Share on X"`, `"Share on Telegram"`, `"Share on LinkedIn"`, `"Share on Facebook"`) were also checked and are **not** a bug — `i18n.js` has no entries for any `"Share on …"` string, so the source itself never translates those either.

**Fix scope:** `SiteFooter.tsx:37` and `contact/page.tsx:100` need `aria-label={t(s.label)}` instead of `aria-label={s.label}`.

---

## Finding 2 (Different) — `VideoCard.tsx` hint badge: Round 6's logical-positioning fix is correct for the wrong context, breaking two others

This supersedes Round 6's "Finding B," which mis-cited its own source evidence. Re-deriving from `Qom International Relations.dc.html` directly: the `[data-video-hint]` "Hover to preview · muted" badge is **not one consistent element** in the source — it appears in three markup contexts with materially different CSS, and only one of the three uses logical positioning:

| Context | Source lines | Position | Visual style |
|---|---|---|---|
| Homepage `#media` video tab | 761, 774, 787 | `position: absolute; left: 14px; bottom: 12px` (**physical**) | gold text `#C8A75D` on `rgba(11,31,58,.7)` chip, `.14em` tracking |
| Standalone `/media` "Video Gallery" | 2284, 2292, 2300 | `left: 14px; bottom: 12px` (**physical**) | same gold-chip style as above |
| `/pcwg` "Gallery" section | 1910, 1922, 1938 | `bottom: 12px; inset-inline-start: 12px` (**logical**) | plain `rgba(250,248,244,.65)` text, **no background chip**, `.12em` tracking |

(Round 6's report cited lines 1910/1922/1938 — the `/pcwg` instance — as evidence for "`/media`'s video grid," which is incorrect; the actual `/media` grid is at lines 2284/2292/2300 and is physical, not logical.)

`components/VideoCard.tsx` is one shared component used by all three (`app/media/page.tsx`, `components/home/HomeMedia.tsx`, `app/pcwg/page.tsx`), and renders one fixed class string for all of them:

```
font-mono absolute bottom-3 start-3.5 bg-[rgba(11,31,58,.7)] dark:bg-dark-fill px-2 py-[5px] text-[9.5px] tracking-[.14em] text-gold uppercase transition-opacity
```

**Live-verified**, original source at `localhost:8934`, Arabic/RTL, on the standalone `/media` page (navigated via `data-goto="media"`, confirmed via `[data-video-hint]` query): badge stays pinned to the **physical left**, 14px from the card's left edge (`left: 14px`, `right: auto`, measured `rectLeftFromParent: 14`) — it does **not** mirror to the right in RTL.

**Live-verified**, port at `localhost:3000`, Arabic mode (`qom-lang=ar`), on `/media`: the badge (class includes `start-3.5`) now resolves to `left: 133.719px; right: 14px` — i.e. it **has mirrored to the physical right**, 14px from the card's right edge. This is the opposite of source behavior for this page.

Before Round 6's fix (when the class used `left-3.5`), `/media` and the homepage video tab were **correct** (physical, non-mirroring, matching source) and only `/pcwg` was wrong (source wants logical there). After the fix, it's inverted: `/pcwg`'s position type now matches source (though its 12px value and entirely different chip-vs-plain-text styling still don't — a separate, smaller, pre-existing gap not touched by Round 6), while `/media` and the homepage video tab — 6 of the 9 `data-video-hint` instances in the source — now regress.

**Net effect of the Round 6 fix:** it moved the bug from one page to two others; it did not eliminate it. A correct fix requires `VideoCard.tsx` to distinguish its `/pcwg` caller from its `/media`/homepage callers (e.g. a `variant` prop), applying physical `left-3.5` + gold chip style for the latter two and logical `start-3` (12px) + plain-text style for the former, rather than one shared class string for all three.

---

## 1. Homepage — Match

Ribbon, ken-burns hero, stats strip, media tabs (photo/video/docs/press), PCWG regional map widget, news/statements teasers, investment ribbon, footer — structurally and behaviorally unchanged since Round 6. `data-reveal` scroping, scroll-driven back-to-top button, and theme toggle all re-verified working with no console errors.

## 2. Header — Match

Search overlay, mega panels (`activities`/`municipality`), theme toggle, mobile burger — all functioning; all `aria-label`/`title` on header elements correctly translated (Finding 1 does not touch the header).

## 3. Hero — Match

5-slide Ken Burns carousel, prev/next/dot controls. Re-verified the corner label (`top: 22px; right: 24px; text-align: right`, source line 313), nav arrows (`right: 24px`, source line 324), and dot row (`left: 24px`, source line 329) are all literal physical positions in source (no `inset-inline-start` used anywhere in the hero), and the port's `HeroSlideshow.tsx` (`right-6` lines 111/157, `left-6` line 176, `text-right`) correctly mirrors that — i.e. these do **not** move in RTL in either source or port. This is intentional/consistent, not a bug (distinguishing it from Finding 2's badges, which the source treats inconsistently).

## 4. Mobile menu/drawer — Match

Drawer slide-in direction re-derived from source script (`Qom International Relations.dc.html:2666-2669`: `drawer.style.left/right` toggled by `rtlNow`, `transform: translateX(±100%)` swapped by direction) and compared against `components/SiteHeader.tsx:366-368` (`left-0 rtl:left-auto rtl:right-0` + `style={{transform: drawerOpen ? "translateX(0)" : locale === "ar" ? "translateX(100%)" : "translateX(-100%)"}}`) — logically equivalent, confirmed Match.

## 5. Animations (6 keyframes) — Match

`qomPulse`, `qomBob`, `qomKen`, `qomReveal`, `qomFlow`, `qomGlow` all present in `app/globals.css:53-103` with identical values to source lines 24-29.

## 6. News pages — Match

Archive filters, sort, search, pagination, article detail, share buttons — re-checked, no regressions.

## 7. Department pages — Match

List + detail views, breadcrumb translation (re-verified live, Arabic), no regressions found.

## 8. Investment pages — Match

Filter groups, sort, pagination, detail view map hint (`InvestmentDetailView.tsx:145` `left-4` — verified physical in source too, line 2453 `left: 16px` — correctly not logical, Match).

## 9. RTL mode — 1 finding (Finding 2)

Full sweep of every remaining `left-`/`right-` physical Tailwind utility in `app`/`components` (11 call sites) cross-checked against source:

- `contact/page.tsx:91`, `InvestmentDetailView.tsx:144` (`left-1/2` centering dots) — direction-neutral, source uses literal `left: 50%` too. Match.
- `culture/page.tsx:44` (festival status badge, `top-3.5 left-3.5`) — source line 2077-2079 uses literal `top: 14px; left: 14px`, physical. Match (not part of Finding 2 — this is a separate, correctly-physical badge, distinct component from `VideoCard`).
- `HomePcwgMap.tsx:61` (`left-3.5`) — source line 563 `left: 14px`, physical. Match.
- `HeroSlideshow.tsx:111/157/176` — see Area 3, Match.
- `SiteHeader.tsx:366` (`left-0 rtl:left-auto rtl:right-0`) — see Area 4, Match.
- `VideoCard.tsx:38` (`start-3.5`) — **Finding 2**, Different (wrong for 2 of 3 contexts).

## 10. Arabic mode — 2 findings (Finding 1 and Finding 2)

Broadened this round per the brief beyond the 10 previously-fixed spots: full-repo grep of every `aria-label=`, `placeholder=`, `title=`, and `alt=` attribute in `app`/`components`, cross-checked each raw (non-`t()`-wrapped) literal against `i18n.js` for a dictionary entry.

- All `placeholder=` attributes: 100% wrapped in `t()`. Match.
- All `title=` attributes: either wrapped in `t()`, or (investment `FilterGroup`, meetings `MeetingRow`, media/pcwg `VideoCard`) are React prop names coincidentally called `title` that render as translated text content, not HTML `title` tooltips. Match.
- `alt=`: source has zero `<img alt>` usage (no real `<img>` tags, all placeholder blocks); port matches (no unwrapped `alt`). Match.
- `aria-label=`: **8 files** with raw (non-`t()`) literals found; 6 are correctly hardcoded because the source has no dictionary entry for that exact string (`investment` "Sort opportunities", `feedback` "N star rating", `HeroSlideshow` "Previous/Next/Slide N", `Pagination` "Pagination", `ArticleView` "Share on …") — verified against `i18n.js`, confirmed no-entry in each case, so leaving them in English is faithful to source. **2 files are a genuine gap: `SiteFooter.tsx:37` and `contact/page.tsx:100`** (Finding 1) — 5 of their 6 social-icon labels do have dictionary entries and should translate but don't.
- Full-repo sweep for literal English JSX text nodes not wrapped in `t()` (regex-based scan of all `.tsx` under `app`/`components`): zero matches outside of the attribute cases above.
- Dictionary completeness: `lib/i18n-data.js` diffed byte-for-byte against `design-export/i18n.js` — identical (only a cosmetic Unicode-escape difference in the arrow-flipping regex inside `translate()`, functionally identical). So no missing dictionary entries exist anywhere; every gap found this round is a call site not invoking `t()`, not a missing translation string.
- Font-family switching (`IBM Plex Sans/Serif` → Noto Kufi Arabic in AR), breadcrumb separator flip (`›`↔`‹`), `<html lang>`/`dir` staying `ltr` while the inner `[data-rtl-root]`/`[data-qom="2"]` wrapper flips to `rtl` (scrollbar-stays-right behavior, source comment line 30 / script 4138-4139 ↔ `lib/i18n.tsx:80` `<div dir={...} data-rtl-root>`, `app/layout.tsx:42` `dir="ltr"`) — all re-verified, Match.

## 11. Footer — 1 finding (Finding 1)

Structure, quick links, contact block, language switcher, copyright — all Match. Social icon `aria-label`s — see Finding 1.

## Appendix

`about`, `about-qom`, `culture`, `cooperation`, `events`, `media`, `meetings`, `memberships`, `contact`, `feedback`, `pcwg` — spot-checked each for structural/content regressions since Round 6; none found beyond Findings 1 (contact) and 2 (media, pcwg, homepage). `meetings/page.tsx`'s `MeetingRow` and `investment/page.tsx`'s `FilterGroup` (both take a `title` prop) verified to render it through `t()` internally, not as a raw HTML `title` attribute — not a false positive for Finding 1's pattern.

Cross-cutting: `npm run build` clean (157 static routes, no errors/warnings), no console errors on any page checked live (`/`, `/media`, `/pcwg`, `/contact`, `/departments/planning`), dictionary parity 100% (byte-diffed).

---

## Summary for next round

Two fixes, both scoped and mechanical:

1. `SiteFooter.tsx:37` and `contact/page.tsx:100`: change `aria-label={s.label}` to `aria-label={t(s.label)}`.
2. `VideoCard.tsx`: needs a variant to distinguish the `/pcwg` caller (logical `start-3` @ 12px, plain-text style, no chip) from the `/media` + homepage callers (physical `left-3.5` @ 14px, gold-on-navy chip) — a single shared style can't be correct for both, because the source itself uses two different treatments.
