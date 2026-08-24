# Fidelity Audit — Round 9

TOTALS: Match=13 Different=1 Missing=0 Broken=0 Simplified=0

## Summary

Round 8's `VideoCard.tsx` fix (adding a `variant?: "card" | "figure"` prop so `/pcwg`'s dark gallery tiles no longer reuse the light homepage/media card shell) was independently re-verified. The **structural** part of the fix holds completely: `/pcwg` video tiles now render as a bare `<figure>` with translucent card styling (`border-bg/[.16] bg-bg/[.04]`), a single `<figcaption>` (no duplicated title+description), and a plain unstyled hint span with no gold chip/background — all confirmed live via `getComputedStyle` in both themes, matching source lines 1906-1941.

However, round 8's own claim that the hint badge now sits at the source's `12px` offset was **not actually true** — live measurement shows it is still `14px`. Digging into the source's four distinct `data-video-card` markup blocks (article/light at lines 755-793 & 2280-2300, figure/dark at lines 1906-1941) turned up that the "card" and "figure" visual languages differ in **three** numeric details, not just the shell/caption structure round 8 fixed:

| Property | Source "card" (light, home/media) | Source "figure" (dark, pcwg) | Port (both variants) |
|---|---|---|---|
| Thumb-label font-size | `10px` (lines 758, 2282) | `9.5px` (line 1908) | `10px` (hardcoded) — **wrong for figure** |
| Hint letter-spacing | `.14em` (line 761) | `.12em` (line 1910) | `.14em` (hardcoded) — **wrong for figure** |
| Hint offset (`hintPosition="logical"`) | n/a | `inset-inline-start: 12px` (line 1910) | `start-3.5` = `14px` — **wrong, should be `start-3`=12px** |

`VideoCard.tsx` still has a single set of thumb-label/hint typography constants that don't branch on `variant`, so the pcwg gallery's video tiles are off by 0.5px font-size, 0.02em letter-spacing, and 2px offset versus source — small but measurable and reproducible live (see Method). This is the same root cause round 8 fixed for the shell/caption but the fix didn't go far enough. Rated **Different** (not Simplified/Missing) because the properties exist and are wired to `variant`, just with the wrong hardcoded values for one branch.

One apparent second bug turned out to be a false positive worth documenting: the mobile drawer's RTL slide-direction (`SiteHeader.tsx:366-367`) initially appeared broken — `getComputedStyle().transform` showed the LTR-closed matrix even with `locale==="ar"` and the drawer open. This was the environment's documented "CSS transitions never advance" quirk (a stuck Web Animation with `progress:0` was shadowing the live inline style in the cascade). Re-measured after injecting `*{transition:none!important}` plus a forced reflow, both the closed (`translateX(100%)`, right-anchored) and open (`translateX(0)`) RTL states resolve exactly as source's script lines 2664-2669 specify. Confirmed **Match**, not a regression — flagged here only so future rounds don't waste time rediscovering it.

## Method

- Source: `E:\claude\design-export\Qom International Relations.dc.html` (served at `localhost:8934`), `i18n.js`.
- Port: `E:\claude\qom-international-relations` (Next.js dev server at `localhost:3000`, restarted clean; `npm run build` also re-run this round — clean, all 157 static/SSG routes generated with no errors).
- Full dictionary diff re-run independently (own regex extractor, not reused from round 8): 957 `key → {ar: value}` pairs extracted from both `i18n.js` and `lib/i18n-data.js` — **0 missing, 0 extra, 0 value diffs**. Raw `ar:` occurrence counts also re-verified: 984 vs 984.
- All 6 `@keyframes` re-diffed line-for-line, source `<style>` (lines 24-29) vs `app/globals.css:53-106` — byte-identical. Usage sites re-verified: `qomPulse` (`HomePcwgMap.tsx`), `qomKen`/`qomReveal` (`HeroSlideshow.tsx`), `qomFlow` variable-duration logic (`PcwgNetwork.tsx:35-38`, confirmed the `11 + index`/`16 + index` formula against source's literal 11s→23s per-line durations at line 1596), `qomGlow` (`PcwgNetwork.tsx:59`, `PcwgConstellation.tsx:34`). `qomBob` confirmed still-unused dead CSS in both source and port.
- Live DOM introspection via the browser tool: `getComputedStyle`, `getBoundingClientRect`, `element.getAnimations()`. `*{transition:none!important;animation:none!important}` injected + forced reflow (`void el.offsetHeight`) before measuring every transition/animation-gated property, per the method note — this specifically caught and resolved the mobile-drawer false positive above.
- Cross-checked reused per-item render logic beyond `VideoCard`: `NewsCard.tsx` (`data-card`/`data-msgcard` delay formulas `min(i,11)*35ms` / `min(i,8)*40ms`), `InvestmentCard.tsx` (`min(i,11)*32ms`), and the homepage's *separate* `homeFeatureHTML`/`homeListRowHTML`/`homeMsgRowHTML` render paths (source lines 3304-3347) against `components/home/HomeNews.tsx` — all font-sizes, paddings, grid-template-columns, and letter-spacings matched exactly; these are genuinely distinct source render functions from `newsCardHTML`, and the port correctly keeps them as distinct code paths rather than reusing `NewsCard`.
- Spot-checked physical-vs-logical CSS direction choices at ~15 additional sites (mission/vision column dividers, drawer active-link indicator, investment-detail map pin/label, footer social icons) against source's mix of intentionally-physical (map pins, video hints in "card" variant, drawer border-left indicator, 3-column dividers) and intentionally-logical (badges, msgcard borders) properties — all matched source's per-element choice.
- No screenshot tool used, per method note.

---

## 1. Homepage — Match

## 2. Header — Match

Caret rotation (`data-caret` → `rotate(180deg)`, source line 2700) reproduced exactly in `SiteHeader.tsx:254,267`.

## 3. Hero — Match

## 4. Mobile menu/drawer — Match

RTL slide-direction re-verified after resolving a measurement false-positive (see Summary) — `SiteHeader.tsx:366-367` correctly right-anchors and reverses the closed-state translate sign for `locale==="ar"`, matching source script lines 2664-2669.

## 5. Animations (6 keyframes) — Match

All 6 byte-identical; usage-site durations/easings re-verified (see Method).

## 6. News pages — Match

## 7. Department pages — Match

## 8. Investment pages — Match

## 9. RTL mode — Match

## 10. Arabic mode — Match

Dictionary re-confirmed complete and exact (957/957 keys, 984/984 raw `ar:` tokens).

## 11. Footer — Match

Re-verified byte-for-byte: link groups/order, social icons, `© 2026` (hardcoded, not computed), two-line address split (`SiteFooter.tsx:79-82`).

---

## Appendix

### about, about-qom, culture, cooperation, events, meetings, memberships, contact, feedback, media — Match

### pcwg — 1 finding (carried over from round 8's incomplete fix)

**Different** — `components/VideoCard.tsx`'s `variant="figure"` branch (used only by `app/pcwg/page.tsx:251`) still hardcodes three typography values from the "card" (light, home/media) visual language instead of the "figure" (dark, pcwg) one:

1. **Thumb-label font-size**: `VideoCard.tsx:37` uses `text-[10px]` for both variants. Source's figure/dark video tiles (lines 1908, 1920, 1936) use `font-size: 9.5px` for this label; only the light "card" tiles (lines 758, 771, 784, 2282, 2290, 2298) use `10px`. Live-confirmed via `getComputedStyle` on `/pcwg`: renders `10px`, should be `9.5px`.
2. **Hint letter-spacing**: `VideoCard.tsx:42-43` uses `tracking-[.14em]` for both variants. Source's figure/dark hint (lines 1910, 1922, 1938) uses `letter-spacing: .12em`; the light "card" hint (lines 761, 774, 787, 2284, 2292, 2300) uses `.14em`. Live-confirmed: renders `1.33px` (`9.5×.14em`), should be `1.14px` (`9.5×.12em`).
3. **Hint offset**: `VideoCard.tsx:42` maps `hintPosition="logical"` (used only by the figure variant) to `start-3.5` (14px). Source's figure/dark hint uses `inset-inline-start: 12px` (lines 1910, 1922, 1938) — 2px less than the light "card" variant's physical `left: 14px` (lines 761, 774, 787). Live-confirmed: `insetInlineStart` computes to `14px`, should be `12px` (i.e. should be `start-3`, not `start-3.5`).

All three are visible on every video tile in `/pcwg`'s "Photo & Video Showcase" gallery, in both light/dark theme and both EN/AR, since they're independent of theme/locale — the discrepancy is purely `variant="figure"` not carrying its own sizing constants the way it now correctly carries its own shell/caption markup. Not visually catastrophic (sub-pixel/2px), but it is a real, measurable, reproducible deviation from source and the direct continuation of the exact bug class round 8 was fixing, so it doesn't meet the bar for Match.

No other issues found in a full pass over `/pcwg`: member-city badges (`top-3 start-3`, `InvestmentCard.tsx`-style pattern), the network diagram's per-line `qomFlow` durations, the `qomGlow` pulsing hub, and the constellation view all re-confirmed Match against source.

### Cross-cutting CSS/i18n/theme — Match

Dictionary, keyframes, and theme-variant (`@custom-variant dark`) mechanics all re-confirmed exact (see Method).
