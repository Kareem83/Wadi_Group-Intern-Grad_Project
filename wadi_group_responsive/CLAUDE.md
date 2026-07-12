# CLAUDE.md — Wadi Group Website

Static marketing website for **Wadi Group** (Egyptian integrated agribusiness, est. 1984).
No build step, no framework, no package manager, no git repo. Pure HTML + CSS + vanilla JS.
To preview: open `index.html` directly in a browser.

## Structure

```
wadi_group_responsive/
├── index.html          # Homepage — hero, divisions, 3 sector sections, team, contact, footer
├── about.html          # About — overview(+See more), vision/mission/purpose, goals, values, stakeholder marquee
├── leaders.html        # Full leadership team page (linked from index "See Our Full Team")
├── awards.html         # (ORPHANED) old Awards page — removed from Corporate dropdown; content now in for-media.html#awards. Kept, unlinked.
├── careers.html        # Careers (links out to Taleo portal)
├── media.html          # Media Center (nav "Media") — News/Videos/Events hub; video modal + news/events detail modal
├── for-media.html      # Public Relations (nav "Public Relations") — media-kit: overview, brand-asset grid, download CTA, guidelines
│                        #   (press.html was DELETED — its press/news/events content merged into media.html)
├── styles.css          # ALL styling for every page (~1300 lines, single shared stylesheet)
├── assets/
│   ├── logo-wadigroup.png   # Nav logo used on every page
│   └── site.js              # Shared inner-page JS (nav, reveals, count-up, See-more)
├── Dawagen-sector.png      # Sector brand marks (root-level, used on homepage cards)
├── Mazareh-sector.png
├── Sinaat-sector.png
├── main logo.jpg           # (unused spare logo)
└── README_RESPONSIVE.txt   # Change log of prior responsive/design edits
```

## Tech & conventions

- **CDNs (homepage only):** Three.js r128 + anime.js 3.2.1 power the `index.html` animated hero and its scroll reveals.
- **Shared scroll animations (inner pages):** `assets/site.js` is a dependency-free script loaded by every inner page (`about`, `leaders`, `awards`, `careers`, `media`, `for-media`). It handles the nav (scroll background + mobile menu), IntersectionObserver **scroll reveals**, and **count-up** numbers — replacing the old per-page inline nav script. Mark content with `data-reveal` (variants: `left` / `right` / `zoom` / `fade`) and numbers with `data-count="8+"`. Reveal CSS lives at the bottom of `styles.css` under "SHARED SCROLL-REVEAL SYSTEM"; JS adds `.js-reveal` to `<html>` so with JS disabled everything stays visible, and `prefers-reduced-motion` / zero-height viewports fall back to fully shown. `index.html` keeps its own richer anime.js reveals and does NOT load `site.js`.
- **About-page components** (all CSS at the bottom of `styles.css`): a CSS-only **stakeholder marquee** (`.marquee` → `.marquee-track` with `@keyframes marquee-scroll`, right-to-left, pauses on hover; the logo set is duplicated in the HTML and the track shifts `-50% - half-gap` for a seamless loop, so keep both sets in sync); vision/mission/purpose `.pillar` cards tinted with the three sector accents; a `.goals-band`; a `.values-grid`; and a **See-more** pattern — a `button[data-more-toggle="<id>"]` toggles `.more-open` on the target (a `grid-template-rows:0fr→1fr` reveal), handled generically in `site.js`. Stakeholder logos are hot-linked from wadigroup.com's `/corporate/about` page (11 banks/DFIs; `logo-2/3/4.png` = CIB/HSBC/Proparco).
- **Nav (updated):** "Media" and "Public Relations" are now **direct links** (no dropdowns) — `Media → media.html`, `Public Relations → for-media.html`. The old "Video" dropdown and the separate In-The-Press page were removed. Footer "More" column links Public Relations → for-media.html.
- **Public Relations** (`for-media.html`): simplified to **two sections** with a sticky `.pr-tabs` bar (scroll-spy active state): **(1) Media Resources** — 6 `.asset-card`s from the inline `RESOURCES` array (download buttons are `[data-download]` toast placeholders — wire real files later); **(2) Awards & Certificates** — 6 `.award-card`s (`AWARDS` array, real award images) + a filterable, scrollable `.cert-panel` of 23 `.cert-row`s (`CERTS` array). **Certificate download links and the "Download all (ZIP)" are REAL wadigroup.com PDFs** (`/sites/default/files/certificates/…`), so those work. Cert filters (All/ISO/OHSAS/Global GAP/Food Safety/Organic) toggle `.cert-hide`. Awards & Certificates was **removed from the Corporate dropdown** across all pages; footer "Awards" now points to `for-media.html#awards`. Also reuses `.pr-cta` (Download-All) and `.pr-contact`. New CSS for tabs/awards/certs is at the very bottom of `styles.css`.
- **Media Center** (`media.html`): the company updates hub — **News / Videos / Events** filters over a grid rendered from the inline `MEDIA_ITEMS` array (merged the former press content). `type:'video'` items open the **video modal** (YouTube embed + a "Watch on YouTube" link, `.media-modal-yt`); `type:'article'` items open a **text detail modal** (`#detailModal`, reuses `.pr-modal`). Also has a dark on-brand green hero (glow shapes + parallax + count-up stats) and a featured card. Item fields: `id/title/category/type/date/description/youtubeId or image+body/featured`. CSS is scoped under `.media-*` + per-category accent classes (`.cat-videos/.cat-news/.cat-events` and the PR `.cat-*` set) at the bottom of `styles.css`. Grid card reveals use their own IntersectionObserver (site.js already ran before the cards exist); everything respects `prefers-reduced-motion`. Real Wadi YouTube IDs are sample data — replace titles/descriptions/dates with real metadata when available.
- **Fonts:** Google Fonts — Fraunces (headings) + Inter (body).
- **Brand colors** are CSS variables in `styles.css`, e.g. `--group-green` (#7CA13C), plus amber/tan/maroon accents used in the Three.js palette.
- **Nav + footer are duplicated verbatim in every page** (no includes). Any change to nav or footer must be repeated across all 7 HTML files. Inner pages link back with `index.html#anchor`; `index.html` itself uses bare `#anchor`.
- **Interactivity:** `[data-tilt]` cards get a JS mouse-tilt effect (homepage); `.nav-toggle` drives the mobile menu (breakpoint at `innerWidth <= 1100`).
- **"Our Management" pinned slider** (`#team.mgmt` on `index.html`): a scroll-pinned horizontal card slider. Structure `.mgmt-pin > .mgmt-sticky > (.mgmt-head, .mgmt-viewport > ul.mgmt-track > li.mgmt-card, .mgmt-progress)`. CSS (bottom of `styles.css`, "OUR MANAGEMENT") is scoped to `.mgmt`; **base styles are a swipe slider** (works with no JS / mobile / reduced-motion), and the inline `<script>` in `index.html` adds `.mgmt-js` on `min-width:768px` to upgrade it: it sets `.mgmt-pin` height = `100vh + (trackWidth − viewportWidth)` and translates `.mgmt-track` by scroll progress (rAF-throttled), plus a center-focus scale via per-card `--s`/`--o`. Requires `body{overflow-x:clip}` (not `hidden`) or `position:sticky` breaks. The old legacy `#team .team-card` rules are now dead (new markup uses `mgmt-*`).
- **Local preview server:** `.claude/launch.json` defines a `wadi-site` config that runs `node server.js` (a dependency-free static server at repo root) serving `wadi_group_responsive/` on port 8123. (Windows Python is a Store stub — don't use `python -m http.server`.)
- Most section imagery is hot-linked from `https://www.wadigroup.com/sites/default/files/...`.

## Sectors & brands (source of truth for content)

- **Dawagen** (poultry): Katkoot El Wadi, Inmaa Sudan, Hi-Tec
- **Mazareh** (agri/food): Wadi Food, Rula Farms
- **Sina'at** (industrial/logistics): Tabreed, A'laf Al Wadi, Haditha

## Resolved issues (fixed 2026-07-05)

1. **Mixed-content `http://` links** — all upgraded to `https://` in `index.html`: the Google Maps iframe (was blank on HTTPS hosts), the four brand "Visit site →" links, and the Facebook / LinkedIn / YouTube social links.
2. **Footer brand mismatch** — the non-existent Sina'at brands (Idafat, NSSC, Tawseel) were removed from all 7 footers and replaced with the real **Haditha** card. Also fixed a mislabeled Haditha photo `alt` on the homepage (was "NSSC river port").

## Working notes

- When editing nav/footer/shared content, apply the same change to all pages that contain it (grep the string across `*.html`).
- No tests, no linter, no CI. Verify visually by opening the page.
