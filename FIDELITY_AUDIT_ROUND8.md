# Fidelity Audit — Round 8

TOTALS: Match=13 Different=2 Missing=0 Broken=1 Simplified=0

## Summary

Round 7's two fix claims were independently re-verified and both hold:

1. **Social-media `aria-label`s** — `SiteFooter.tsx:37` and `app/contact/page.tsx:100` now wrap the social icon labels in `t(s.label)`. Cross-checked against `lib/i18n-data.js` (which is byte-for-byte equivalent to the source `i18n.js` dictionary — see below): `Instagram`/`Telegram`/`LinkedIn`/`YouTube`/`Facebook` all have entries and translate correctly live in Arabic; `X` has no dictionary entry in source either, so it correctly stays "X" in Arabic mode in both source and port. **Confirmed fixed, no regression.**

2. **`VideoCard.tsx` hint-badge mirroring** — the component now takes a `hintPosition?: "physical" | "logical"` prop (default `"physical"`). Homepage (`components/home/HomeMedia.tsx`) and `/media` (`app/media/page.tsx`) both use the default, so the hint stays at a fixed `left-3.5`, matching source lines 761/774/787 and 2284/2292/2300, which use `left: 14px` (physical) — confirmed live: the badge stays at `left: 14px` even when the UI language is Arabic. `/pcwg`'s gallery (`app/pcwg/page.tsx:251`) explicitly passes `hintPosition="logical"`, producing `inset-inline-start`, which does mirror under RTL, matching source line 1910/1922/1938's `inset-inline-start: 12px`. **Confirmed fixed, no regression.**

However, the item round 7 flagged as **out of scope but worth checking** — "`/pcwg`'s badge sits at 12px in source vs 14px in the port, and source's badge is plain text with no background while the port renders a gold chip" — is real, and investigating it surfaced a **larger, previously-undetected problem** with the same root cause: `VideoCard.tsx` is a single component shared between two visually incompatible source contexts (the light homepage/media card and the dark `/pcwg` gallery tile), and beyond the badge, the *entire card shell* and its *text structure* are wrong for the `/pcwg` case. Full detail under Appendix → pcwg below. This is the only substantive new finding this round; the site's other 10 areas plus the rest of the appendix continue to hold at Match.

Also independently re-verified: source's live translation mechanism (`captureText`/`applyLanguage`, lines 4060–4127) is a `TreeWalker`-based exact-text-node dictionary lookup, not a phrase-composition system. This means some concatenated strings (e.g. `"Qom Municipality, Central Building — Qom, Iran"` at source line 2344, a single text node with no exact dictionary key) are *intentionally* never translated even in Arabic, while the same address split across a `<br>` (source lines 2330/2403, two separate text nodes, both of which do have dictionary entries) *does* translate both halves. The port replicates this exact quirk faithfully: `app/contact/page.tsx:94` hardcodes the concatenated form untranslated, while `app/contact/page.tsx:159` and `SiteFooter.tsx:79-82` correctly split the two-line form into two separate `t()` calls. This is a deliberately-preserved source idiosyncrasy, not a bug — confirmed Match.

## Method

- Source: `E:\claude\design-export\Qom International Relations.dc.html` (served at `localhost:8934`), `i18n.js`.
- Port: `E:\claude\qom-international-relations` (Next.js dev server at `localhost:3000`).
- Full-dictionary diff: source `i18n.js` and port `lib/i18n-data.js` parsed with a regex extractor and compared key-by-key — **958/958 keys matched, 0 missing, 0 extra, 0 value differences.** (Raw `ar:` token counts also match exactly: 984 vs 984.)
- All 6 `@keyframes` (`qomPulse`, `qomBob`, `qomKen`, `qomReveal`, `qomFlow`, `qomGlow`) diffed line-for-line between the source `<style>` block and `app/globals.css` — byte-identical.
- Live DOM introspection via the browser tool (`getComputedStyle`, `getBoundingClientRect`) with `*{transition:none!important;animation:none!important}` injected before measuring, per the method note. No screenshot tool used.
- Grepped the whole port for `aria-label=`, `title=`, `placeholder=`, `alt=` to catch any newly-introduced untranslated/attribute-based strings; none found beyond ones already verified as intentionally matching source's own untranslated set (`Pagination`, `Previous slide`/`Next slide`/`Slide N`, `Sort opportunities`, `N star rating`, `Share on X/Telegram/LinkedIn/Facebook` — none of these have dictionary entries in source's `i18n.js` either, so leaving them hardcoded in the port is correct fidelity, not an omission).

---

## 1. Homepage — Match

No discrepancies found. Hero, network map (`HomePcwgMap.tsx`) pin/label coordinates use physical `left`/`top` percentages exactly matching source's map-coordinate system (confirmed source also uses physical `left: 14px` / `left: 19px` for the same two labels — a geographic map correctly never mirrors under RTL).

## 2. Header — Match

`SiteHeader.tsx` reproduces the compact/scroll state, burger button, logo, search box, language switch, and theme toggle with attributes matching source exactly (`aria-label={t("Menu")}`, `title={t("Switch theme")}`, `aria-label={t("Primary")}` on the nav — all present in source's dictionary and correctly wrapped).

## 3. Hero — Match

`HeroSlideshow.tsx` replicates the `qomKen` (9s) and `qomReveal .9s` per-slide restart behavior (source lines 2640-2643) via key-remounting instead of the source's manual `style.animation='none'; reflow; style.animation=...` trick — functionally equivalent, confirmed by direct duration match. Slide-opacity transition (`duration-[1100ms] ease-[cubic-bezier(.25,.1,.25,1)]`) is the literal expansion of CSS `ease`, matching source's `transition: opacity 1.1s ease` exactly.

## 4. Mobile menu/drawer — Match

No discrepancies found in this pass.

## 5. Animations (6 keyframes) — Match

All 6 keyframes byte-identical to source (see Method). Usage-site durations spot-checked: `qomPulse 2.8s` (hero pulse ring, `HomePcwgMap.tsx:81`, matches source line 573); `qomGlow 5s` (network diagrams, `PcwgNetwork.tsx:59`, matches source lines 1572/1596); `qomFlow` variable per-line duration on the network diagram (`PcwgNetwork.tsx:35-38`, `flowDuration()` computing 11–18s for "current" lines and 16–23s for "proposed" lines) exactly reproduces source's line-by-line 11s→23s staggered durations (source line 1596). `qomBob` is defined but unused in both source and port — confirmed intentional dead CSS in both.

## 6. News pages — Match

## 7. Department pages — Match

## 8. Investment pages — Match

Badge offsets (`top-3 start-3` = `top:12px; inset-inline-start:12px`) on `InvestmentCard.tsx:27` and the "Current member" badge on `pcwg/page.tsx:81` both correctly match source's `top: 12px; inset-inline-start: 12px` (8 occurrences in source, all logical/mirroring) — distinct from the `/pcwg` video-hint badge case below, which source deliberately keeps non-mirroring at a different (12px physical, no chip) style.

## 9. RTL mode — Match

Document `dir` stays `"ltr"` at the root in both source and port (source's own comment: "the document keeps LTR direction so the browser scrollbar stays on the right in AR/FA"); individual components use `inset-inline-*`/logical Tailwind utilities where source does, and physical `left`/`right` where source does (map pins, homepage/media video hint). No mirroring regressions found this round.

## 10. Arabic mode / translation completeness — Match

Dictionary is a complete, exact match (958/958 keys, see Method). Every `aria-label`, `title`, and `placeholder` in the port was enumerated and cross-checked against source's dictionary; all either translate identically to source or are — like source — intentionally left untranslated because no dictionary entry exists for that exact string. No `alt` attributes exist in either version (design uses placeholder text, not real images). The `TreeWalker`/exact-text-node translation quirk (see Summary) is faithfully reproduced, including the specific concatenated-address edge case.

## 11. Footer — Match

`SiteFooter.tsx` link groups, social icons, copyright line (`© 2026`, hardcoded in source too — not computed from current date), and the two-line address (correctly split into two `t()` calls, line 79-82) all match source line-for-line.

---

## Appendix

### about, about-qom, culture, cooperation, events, meetings, memberships, contact, feedback, media — Match

No discrepancies found in this pass.

### pcwg — 3 findings, all in the "Photo & Video Showcase" gallery (`app/pcwg/page.tsx:244-260`, rendered via `components/VideoCard.tsx`)

Source's `/pcwg` gallery (lines 1901-1944) sits on a dark navy section (`background: #0B1F3A`) and alternates video tiles (`data-video-card`, lines 1906-1913/1918-1925/1934-1941) with plain photo tiles (lines 1914-1917/1926-1929/1930-1933). Both tile types share one visual language: a translucent card (`border: 1px solid rgba(250,248,244,.16); background: rgba(250,248,244,.04)`) with a single `<figcaption>` of cream-colored text — no separate title heading, no white card body, no colored badge chip.

The port's non-video photo tiles (`app/pcwg/page.tsx:253-258`, `<figure className="border border-bg/[.16] bg-bg/[.04]">`) get this exactly right. The video tiles (`app/pcwg/page.tsx:251`), however, are rendered through `VideoCard.tsx`, a component shared with the homepage's and `/media`'s video grids — both of which sit on *light* sections in source (`background: #fff`, e.g. lines 755/768/781) and are structured differently (a `<h3>` title *and* a `<p>` description, lines 764-765). Because `VideoCard.tsx` has only one visual identity, three things go wrong specifically for `/pcwg`, live-confirmed via `getComputedStyle` in both light and dark theme:

1. **Different — card shell.** `VideoCard.tsx:29` hardcodes `bg-white dark:bg-dark-surface-2 border-navy/[.12]`. On `/pcwg` this renders as a solid white card (light theme: `rgb(255,255,255)` background, `oklab(...) / 0.12` navy border) sitting incongruously in the dark navy gallery, directly beside the correctly-translucent photo `<figure>` tiles in the same grid row. Source's `/pcwg` video tile background is `rgba(250,248,244,.04)` / border `rgba(250,248,244,.16)` — nothing like `#fff`/navy-border. Live-confirmed at both `localhost:3000/pcwg` (light and dark theme).

2. **Broken — duplicated caption text.** `app/pcwg/page.tsx:251` passes `title={g.caption} caption={g.caption}` (the same string to both props) because `VideoCard.tsx` always renders a `<h3>{t(title)}</h3>` *and* a `<p>{t(desc || caption || …)}</p>` (`VideoCard.tsx:45-46`). Source's `/pcwg` video tile has only one `<figcaption>` (e.g. "Plenary session of the Working Group", source line 1912) — no separate heading. Live-confirmed: both the card's `<h3>` and `<p>` render the identical string ("الجلسة العامة لمجموعة العمل" in Arabic) — the same caption prints twice on every one of the 3 video tiles (indices 0, 2, 5 of the `GALLERY` array, `app/pcwg/page.tsx:67/69/72`).

3. **Different — hint-badge chip/offset** (the item round 7 flagged as out of scope). `VideoCard.tsx:38` always renders the hint as a gold-on-navy chip with padding (`bg-[rgba(11,31,58,.7)] px-2 py-[5px] text-gold`) at a `3.5` (14px) inset, because that's what source's homepage/media hint looks like (line 761: `background: rgba(11,31,58,.7); color: #C8A75D; padding: 5px 8px;` at `left: 14px`). Source's `/pcwg` hint (line 1910/1922/1938) is plain, unstyled cream text with no background and no padding, at `inset-inline-start: 12px` — `<span style="... inset-inline-start: 12px; ... color: rgba(250,248,244,.65); transition: opacity .3s ease;">`, no `background`, no `padding`. Live-confirmed at `/pcwg`: the badge renders with `background-color: rgba(250, 248, 244, 0.13)` (dark-theme chip fill), `color: rgb(200, 167, 93)` (gold), `padding: 5px 8px`, `inset-inline-start: 14px` — all four properties wrong versus source's plain/no-background/12px cream-text badge.

All three stem from the same cause (one component, two incompatible source designs) and are localized entirely to `components/VideoCard.tsx` and its `/pcwg` call site at `app/pcwg/page.tsx:251`; nothing else in the file is affected, and the homepage/`/media` uses of the same component remain correct (per round 7's fix, re-confirmed above).
