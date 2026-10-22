@AGENTS.md

# HyperGrid Landing Page — Codebase Guide

B2B lead-generation site for HyperGrid — "the world's first unmanned, multiplayer LED-floor arena."
Targets FEC (Family Entertainment Center) operators, bowling alleys, amusement parks, and arcades
to request an operator brochure / book a demo. "Meta" in the repo name refers to Meta/Facebook
advertising (Pixel + Conversions API), not the Meta company's own product.

---

## What This Is

- **Stack:** Next.js (App Router), React 18, TypeScript, Tailwind CSS v4
- **Deployment:** Vercel (`vercel.json` sets long-lived immutable cache headers for static assets)
- **i18n:** Client-side only — browser-language detection + string-bundle swap (en/de/fr/it/es). No `/de`, `/fr` routes; locale never appears in the URL.
- **Region variants:** `/asia` and `/northamerica` are full parallel landing-page + brochure-quiz flows, built by deliberately duplicating files rather than parameterizing by region.
- **Note:** `chat-automation/` at the repo root is a separate, independently-scaffolded Next.js project (own `node_modules`/`.env.local`) — not wired into this app's routing. Don't confuse it with the main site.

---

## Directory Structure

```
src/
├── app/                          ← Next.js App Router root
│   ├── layout.tsx                ← root layout: fonts, metadata, I18nProvider, LogRocketInit
│   ├── page.tsx                  ← "/" → <LandingPage showCTA={true}/>
│   ├── no-cta/page.tsx           ← "/no-cta" → same landing page, CTA sections hidden (ad testing)
│   ├── demo/page.tsx             ← "/demo" → internal design-reference page, not linked from nav
│   ├── thank-you/page.tsx        ← "/thank-you" → generic brochure/contact form thank-you
│   ├── asia/
│   │   ├── page.tsx              ← "/asia" region landing page variant
│   │   └── brochure/
│   │       ├── route.ts          ← "/asia/brochure" GET — serves page.html as raw HTML
│   │       ├── page.html         ← standalone vanilla HTML/CSS/JS multi-step qualification quiz
│   │       └── thankyou-q/       ← "/asia/brochure/thankyou-q" positive-lead destination
│   ├── northamerica/              ← exact mirror of asia/ (page.tsx, brochure/route.ts, page.html, thankyou-q/)
│   ├── api/                       ← route handlers, see "API Endpoints"
│   ├── fonts/                     ← local Mugen Grotesk OTF (wordmark only)
│   └── globals.css                ← Tailwind v4 @theme tokens + custom utility classes
├── components/                     ← all shared React UI, flat, no subfolders — see "Components"
└── lib/
    ├── googleSheets.ts             ← Google Sheets lead logging (appendLead / appendBrochureLead)
    ├── metaCapi.ts                 ← Meta Conversions API (server-side Lead event)
    ├── useCurrency.ts               ← IP-geolocation currency/country/dial-code detection (ipapi.co)
    ├── useTranslation.tsx           ← i18n context/provider (browser-language detection)
    ├── CTAContext.tsx, VideoLoadContext.tsx  ← React contexts
    └── translations/{en,de,fr,it,es}.ts      ← locale string bundles

public/
└── asia/, brochure/, case-study/, features/, hero/, logos/, testimonials/, video/, video/posters/, video/social_media/
```

---

## Routing

Pure App Router, no `[locale]` segment. Routes:

| Route | Renders |
|-------|---------|
| `/` | Main landing page (CTA enabled) |
| `/no-cta` | Same landing page, CTA sections hidden |
| `/demo` | Internal design-reference page (not final, not linked) |
| `/thank-you` | Generic brochure/contact form thank-you |
| `/asia` | Asia-region landing page variant |
| `/asia/brochure` | Standalone HTML multi-step qualification quiz (vanilla JS, not React) |
| `/asia/brochure/thankyou-q` | Positive-lead thank-you (auto-downloads brochure PDF) |
| `/northamerica` | North America landing page variant (mirrors `/asia`) |
| `/northamerica/brochure` | Mirrors `/asia/brochure` exactly |
| `/northamerica/brochure/thankyou-q` | Mirrors `/asia/brochure/thankyou-q` |

**`/asia/brochure` and `/northamerica/brochure` are route handlers, not pages** — each `route.ts` does
`readFileSync` on a sibling `page.html` and returns it as raw `text/html`. The HTML hardcodes CSS
variables that mirror `globals.css`'s `@theme` block instead of importing Tailwind.

**i18n:** `useTranslation.tsx` reads `navigator.languages`, maps to `en|de|fr|it|es`, lazy-loads the
matching bundle from `src/lib/translations/*.ts`, falls back to `en`. No URL involvement.

---

## API Endpoints (`src/app/api/`)

| Method | Path | Handler |
|--------|------|---------|
| POST | `/api/send-email` | Main brochure/contact form. Sends HTML email via Resend to `CONTACT_RECEIVER_EMAIL` (falls back to `info@hypergrid.ai`, then a hardcoded sandbox owner email), appends lead to Google Sheets (`appendLead`), fires server-side Meta CAPI "Lead" event. |
| POST | `/api/asia-brochure-lead` | Appends a lead from the `/asia/brochure` quiz to Google Sheets ("Sheet2") via `appendBrochureLead()`. Requires `email` + `fullName`. |
| POST | `/api/northamerica-brochure-lead` | Identical to `asia-brochure-lead` — same `appendBrochureLead()`, same Sheet2 tab. |
| POST | `/api/meta-capi` | Thin wrapper exposing `sendLeadEvent()` to the client — used by the vanilla-JS brochure quiz pages, which can't import server lib code directly. |
| GET | `/api/places-autocomplete` | Google Places API (New) Autocomplete proxy for venue address lookup. Falls back to a hardcoded mock list of US bowling/FEC venues if `GOOGLE_MAPS_API_KEY` isn't set. |

**Convention:** every route wraps logic in try/catch, returns `NextResponse.json(...)`, logs errors with a
`[api/route-name]` prefix, 400 on missing required fields, generic 500 on failure. Non-critical steps
(Sheets append, Meta CAPI) are wrapped in their own try/catch and never block the HTTP response.

---

## Key Integrations

| Integration | File | Notes |
|---|---|---|
| Google Sheets | `src/lib/googleSheets.ts` | JWT service-account auth via `googleapis`. `Sheet1` = main site lead form (15 cols, `appendLead()`). `Sheet2` = brochure-quiz leads (22 cols, `appendBrochureLead()`, shared by `/asia/brochure` and `/northamerica/brochure`). Dedup-by-email, auto tab creation with headers, dropdown validation on "Lead Status" (`New/Contacted/Qualified/Disqualified/Follow Up/Processed/Duplicate`). Dates formatted `DD-Mon-YYYY HH:MM IST`. |
| Meta Conversions API | `src/lib/metaCapi.ts` | Server-side "Lead" event → `https://graph.facebook.com/v21.0/{PIXEL_ID}/events`. Pixel ID `1079278694629302` hardcoded (matches client-side Pixel init). Hashes email/phone with SHA-256. No-ops silently (console.warn) if `META_CAPI_TOKEN` unset. |
| Meta Pixel (client) | `src/components/LandingPage.tsx` | Inline `fbq` snippet, tracks `PageView`/`Subscribe`/`CompleteRegistration`. |
| Resend (email) | `src/app/api/send-email/route.ts` | From address `onboarding@resend.dev` (sandbox/unverified domain). |
| Google Places Autocomplete | `src/app/api/places-autocomplete/route.ts` | Venue address lookup. |
| ipapi.co | `src/lib/useCurrency.ts` | Client-side, unauthenticated, `AbortSignal.timeout(2000)`. Drives currency display (~40 ISO currencies) and default phone dial code. Cached 24h in `localStorage` key `hg_geo`. |
| LogRocket | `src/components/LogRocketInit.tsx` | Session replay, initialized at root layout. |
| lenis | `src/components/SmoothScroll.tsx` | Smooth-scroll wrapper. |
| framer-motion | — | Animation; explicitly listed in `next.config.ts`'s `experimental.optimizePackageImports`. |

**No Slack integration exists in this codebase** — if lead notifications to Slack are needed, it has not been built yet.

---

## Components (`src/components/`, flat, no subfolders)

- `LandingPage.tsx` — main orchestrator; composes NavBar, HeroSection, VideoSection, KeyFeaturesSection, MomentsSection, InstagramCarousel, ProofSection, ROICalculator, CaseStudy, BrochureForm, StickyFooterCTA, Footer; injects Meta Pixel script
- `HeroSection.tsx`, `NavBar.tsx`, `VideoSection.tsx`, `Footer.tsx`
- `KeyFeaturesSection.tsx` / `CardCarousel.tsx` — feature cards
- `MomentsSection.tsx` — "Moments AI" auto-editing feature section
- `InstagramCarousel.tsx` / `InstagramEmbed.tsx` — real Instagram Reels from partner venues
- `ProofSection.tsx` / `StatsSection.tsx` — social proof / stats
- `ROICalculator.tsx` — interactive revenue/ROI calculator, uses `useCurrency`
- `CaseStudy.tsx`, `BrochureForm.tsx` (hits `/api/send-email`)
- `SectionBrochureCTA.tsx`, `MobileBrochureCTA.tsx`, `StickyFooterCTA.tsx` — CTA placements
- `AisaLandingPage.tsx`, `AisaBrochureSection.tsx`, `AisaBrochureWidget.tsx` — Asia-region components
  (note: "Aisa" filename typo predates the `/aisa` → `/asia` route rename and was never cleaned up)
- `Typewriter.tsx`, `SlowConnectionToast.tsx`, `SmoothScroll.tsx`, `LogRocketInit.tsx`

---

## Styling

- **Tailwind CSS v4**, CSS-first config — no separate `tailwind.config.js`
- Design tokens in `src/app/globals.css` `@theme` block:
  - `--color-ink: #0A0A0A`, `--color-ink-soft: #5B6472`, `--color-ink-faint: #9AA3B2`
  - `--color-surface: #F8F8F8`, `--color-surface-2: #EEF1F5`, `--color-line: #E9EBEF`
  - `--color-accent: #1D6CEF` (primary brand blue), `--color-accent-deep: #144BC0`, `--color-accent-light: #5B93F5`
  - `--color-navy: #0A0A0A`, `--color-navy-2: #14161C`, `--color-metric-green: #18C896`
  - Fonts: `--font-sans`/`--font-display` = Urbanist (Google Font); `--font-mugen` = local Mugen Grotesk, reserved exclusively for the "HYPERGRID" wordmark
- Custom utility classes: `.text-gradient`, `.bg-gradient-accent`, `.glow-orb`, `.glass`, `.btn-glass-accent`, `.btn-glass-light`, `.hero-grid-bg`, `.hero-abyss`, `.grain-overlay`, `.page-grid-light`, `.grid-texture`, `.carousel-scroll`, `.marquee-track`, `.fade-up`, Lenis state classes, extensive `react-phone-number-input` overrides
- Aesthetic: light base, blue glass buttons, grid-textured backgrounds, LED-tile motif reinforcing the product's LED-floor identity
- The standalone `/asia/brochure` and `/northamerica/brochure` HTML pages duplicate the design tokens as raw CSS custom properties rather than importing Tailwind

---

## Conventions

- Path alias `@/*` → `./src/*`
- API routes: try/catch, `NextResponse.json(...)`, `console.error` with `[api/route-name]` prefix, 400 on missing fields, generic 500 on failure
- Non-critical integrations (Sheets, Meta CAPI) never block the HTTP response — wrapped in their own try/catch, commented inline as "never block the response"
- Soft-failure pattern: missing env var → log a warning, no-op (`{ sent: false }`), don't throw
- Region features are built by **duplicating** the prior region's route/component/API files rather than parameterizing by region (deliberate, not a cleanup target)
- Dates formatted in IST (`UTC+5:30`) as `DD-Mon-YYYY HH:MM IST` in both Sheets writers
- `"use client"` directive at top of any file needing state/effects
- ESLint flat config (`eslint-config-next` core-web-vitals + typescript), no custom rule overrides
- TypeScript strict mode, target ES2017, `moduleResolution: "bundler"`

---

## Build

```bash
npm run dev     # next dev
npm run build   # next build
npm run start   # next start
npm run lint    # eslint
```

No test script defined.

---

## Config Files

- **`next.config.ts`** — `compress: true`; AVIF/WebP images, `minimumCacheTTL: 31536000` (1yr, images are content-hashed); custom `deviceSizes`; `experimental.optimizePackageImports: ["framer-motion"]`
- **`vercel.json`** — long-term immutable cache headers for `/video/*`, `/hero/*`, `/features/*`, `/logos/*`, `/testimonials/*`, `/_next/static/*`; stale-while-revalidate for `/_next/image*`
- **`tsconfig.json`** — strict mode, `@/*` → `src/*`, Next TS plugin
- **`postcss.config.mjs`** — `@tailwindcss/postcss` only

---

## Locked Reusable Modules

These are standing specs. Whenever a task calls for one of these pieces again (a new
page/form needs a phone input, an address field, a CTA button, a new color, or a sheet-logged
form), **implement it exactly as specified here** — don't re-derive or restyle it. If the
user wants a variation, they'll say so on top of this baseline; update this section when they do.

### Standing Rule — Derive Missing Country/City from IP

Whenever a form, module, or Sheets row needs `country`/`city` and the visitor never supplied it
(no Places Autocomplete selection, no typed value), **derive it from IP geolocation** rather than
leaving it blank — this is already the working pattern in `/northamerica/brochure`
(`resolveCityCountry()`, `page.html` lines 463–471):
```js
function resolveCityCountry(){
  let city=S.f.city||'', country=S.f.country||'';
  if (!country && S.f.ccName) country=S.f.ccName;          // 2nd choice: phone-step country pick
  if (!country && IPGEO && IPGEO.countryName) country=IPGEO.countryName; // 3rd: IP geo
  if (!city && IPGEO && IPGEO.city) city=IPGEO.city;
  return {city, country};
}
```
Priority order to copy for any new form: **explicit user input → a previously-picked field in the
same flow (e.g. phone country) → IP geolocation (`ipapi.co`, Module-1/`useCurrency` style) → blank**.
Apply this same fallback logic any time a module or Sheet-logging call is about to send an empty
`country`/`city` field.

### Standing Rule — Mobile Is Default; Always Confirm Scope Across Viewports

Mobile view is the primary audience for this site. Whenever a requested change is phrased as
"for mobile," ask whether desktop (and any other stored/documented view, e.g. a `sm:`/`lg:`/`xl:`
variant already called out elsewhere in this file) should get the same change, since it's easy to
forget to mention the other viewports. **If the user doesn't specify a viewport at all, default to
implementing the change for mobile view only** — don't assume desktop unless told.

### Standing Rule — Number Ranges Get Spaced En/Hyphen

When writing a numeric range in UI copy (e.g. "7-6", "$50-100K", "15-25 m²"), always put spaces
around the separator: `7 - 6`, `$50 - 100K`, `15 - 25 m²` — not `7-6`/`$50-100K` jammed together.
Applies to budget-range labels, dimension ranges, and any other "X-Y" text written into JSX/HTML.

### Module 1 — Phone Number + Country Code

Reference implementation: `src/app/northamerica/brochure/page.html` (also present, kept in sync,
in `src/app/asia/brochure/page.html` and `src/components/BrochureForm.tsx`).

- **Data table** `COUNTRY_PHONE_SPECS` — `{ [countryName]: { code: '+XX', length: N | [N,N,...] } }`.
  Copy the exact table from `page.html` lines 282–320 (36 countries: India, United States, Canada,
  UAE, United Kingdom, Australia, Germany, France, Singapore, Saudi Arabia, Qatar, Kuwait, Oman,
  Bahrain, New Zealand, South Africa, Japan, China, Brazil, Mexico, Ireland, Netherlands, Spain,
  Italy, Thailand, Indonesia, Malaysia, Vietnam, Philippines, Cambodia, Myanmar, Hong Kong, Taiwan,
  South Korea, Nepal, Pakistan, Bolivia). `length` can be a single number or an array of allowed
  digit counts.
- **Reverse lookup** `PHONE_COUNTRY_BY_NAME` — lower-cased country name → `COUNTRY_PHONE_SPECS` key,
  built once via IIFE, plus manual aliases for `'united arab emirates'→'UAE'`,
  `'united states'→'United States'`, `'united kingdom'→'United Kingdom'`.
- **`COUNTRY_ALIASES`** — informal/alternate names → ISO-2 code, e.g.
  `uk/u.k./britain/great britain/england/scotland/wales/northern ireland → GB`,
  `usa/u.s./u.s.a./us/united states of america/america → US`, `holland → NL`, `czechia → CZ`.
- **`countryCode(name)`** — resolves a free-text country/place name to an ISO-2 code: alias table
  first, then a lazily-built `Intl.DisplayNames` region-name reverse map (A–Z × A–Z scan).
- **Default country code from IP**: on load, call `ipapi.co/json/`, read `country_name`, resolve
  it through `PHONE_COUNTRY_BY_NAME` (lower-cased), and preselect that country in the phone
  country-code `<select>`. See `page.html` line ~1049.
- **UI**: a `<select id="f-cc">` listing `"${code} ${name}"` built from `Object.keys(COUNTRY_PHONE_SPECS)`,
  paired with a `<input type="tel" id="f-phone">` national-number field (`page.html` lines 655–666).
  Validate the typed number's digit length against the selected country's `length` spec before
  allowing submission.
- In the React form (`BrochureForm.tsx`), the same table backs `react-phone-number-input`.

### Module 2 — Google Sheets Lead-Logging

File: `src/lib/googleSheets.ts`. JWT service-account auth via `googleapis`.

- `appendLead(lead: LeadRow)` → writes to `"Sheet1"` (main site lead form, 15 columns A–O).
- `appendBrochureLead(lead: BrochureLeadRow, sheetName: string = "Sheet2")` → writes to `"Sheet2"`
  by default (22 columns A–V), shared by `/asia/brochure` and `/northamerica/brochure`. The function
  already accepts a `sheetName` override.
- Both do dedup-by-email, auto-create the tab + header row if missing, and a dropdown validation
  rule on "Lead Status" (`New/Contacted/Qualified/Disqualified/Follow Up/Processed/Duplicate`).
  Dates are written as `DD-Mon-YYYY HH:MM IST`.
- **Standing instruction:** whenever this module is implemented/wired up for a new form or page,
  after wiring it, **ask the user** whether the new leads should append into the existing tab
  (pass the current `sheetName`) or go into a brand-new sheet/tab (pass a new `sheetName` and have
  the auto-create-header logic build it). Never choose silently.

### Module 3 — Places Autocomplete (venue address field)

Backend: `src/app/api/places-autocomplete/route.ts` — proxies Google Places Autocomplete (New),
falls back to a hardcoded mock venue list if `GOOGLE_MAPS_API_KEY` is unset.

Reference client implementation: `src/app/northamerica/brochure/page.html` lines 789–868
(`bindVenue()`, `lookup()`, `placeFromSuggestion()`, `applyPlace()`).

- **Markup** (`page.html` line 646): input is wrapped `<span class="sw">…</span>`; the suggestion
  list is `<ul class="sugg" id="sugg" role="listbox" hidden></ul>` as a sibling inside that same
  wrapper, plus a spinner `<svg id="addrSpin" class="sw-spin" hidden>`.
- **CSS** (`globals.css`-matching tokens, defined inline in `page.html` lines 144–152):
  ```css
  .sw { position: relative; display: block; }
  .sw-spin { position: absolute; right: 2px; top: 50%; transform: translateY(-50%);
    color: var(--accent); pointer-events: none; animation: spin .8s linear infinite; }
  .sugg { position: absolute; left: 0; right: 0; top: calc(100% + 4px); z-index: 99999;
    margin: 0; padding: 4px; list-style: none; background: var(--surface);
    border: 1.5px solid var(--line); border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,.12); max-height: 260px; overflow: auto; }
  .sugg li { padding: 9px 12px; border-radius: 8px; cursor: pointer; font-size: 14.5px;
    font-weight: 500; color: var(--ink); line-height: 1.35; display: flex;
    flex-direction: column; gap: 1px; }
  .sugg li:hover, .sugg li[aria-selected="true"] { background: var(--accent-soft); }
  .sugg li.sugg-credit { flex-direction: row; justify-content: flex-end; cursor: default;
    font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
    color: var(--muted); border-radius: 0; padding: 6px 10px 2px; background: transparent !important; }
  .sugg .sugg-sec { font-size: 12.5px; font-weight: 500; color: var(--muted); }
  ```
- **Placement logic** (`position()` fn, `page.html` lines 822–836): the list is `position: fixed`,
  left/width matched to the input's bounding rect, top set to `input.bottom + 6px` by default.
  It **flips above** the input (`openUp`) when the space below is less than the wanted dropdown
  height AND there's more room above than below — critically, available space below is clamped to
  the top of the step's `.nav` (Next/Back) row, not the raw viewport edge, so the dropdown never
  renders underneath/behind the Next button. Shows max 3 rows (`VISIBLE_ROWS=3`, `ROW_H=44px`) plus
  a 28px "Powered by Google" credit row, and re-positions on scroll/resize while open.
- **Behavior**: 200ms debounce, min 2 chars, one Places session token per search burst (reset after
  a selection), keyboard nav (↑/↓/Enter/Esc), click-to-select, close on blur (150ms delay to allow
  the mousedown-select to register first).
- Country for later steps is parsed from the suggestion's secondary text via `countryCode()`
  (Module 1) with a manual-entry fallback.

### Module 4 — CTA Button Style (dot/halftone pattern)

Default style for **every** CTA button going forward unless told otherwise. Two variants exist —
use the one matching the button's background:

**A. White/light CTA button (halftone dot overlay)** — e.g. `HeroSection.tsx` brochure CTAs:
```jsx
<a className="relative bg-white text-ink font-semibold ... !border !border-black/5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden">
  <div
    className="absolute inset-0 opacity-30 pointer-events-none"
    style={{
      backgroundImage: 'radial-gradient(circle, rgba(10,10,10,0.7) 1.5px, transparent 2px)',
      backgroundSize: '6px 6px',
      WebkitMaskImage: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 65%, black 100%)',
      maskImage: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 65%, black 100%)',
    }}
  />
  <motion.span className="relative z-10 flex items-center justify-center gap-2.5">
    {/* label + icon */}
  </motion.span>
</a>
```
Key points: wrapper needs `relative` + `overflow-hidden`; dot layer is `absolute inset-0`,
6×6px radial-gradient dots at `rgba(10,10,10,0.7)`, 30% opacity, masked so the pattern fades in
from the left and right edges (`black 0% → 0.05 alpha 35%–65% → black 100%`) leaving the center
mostly clear; label/icon content goes in a `relative z-10` span so it sits above the dot layer.

**B. Primary blue glass CTA button** — `.btn-glass-accent` (`globals.css` lines 86–117):
```css
.btn-glass-accent {
  position: relative; overflow: hidden;
  background: linear-gradient(180deg, #4f8bf5 0%, #1d6cef 52%, #1657cc 100%);
  border: 1px solid rgba(255,255,255,0.3);
  box-shadow: 0 0 22px rgba(29,108,239,0.2), 0 10px 26px rgba(29,108,239,0.19),
    inset 0 1px 0 rgba(255,255,255,0.55);
  transition: transform 0.15s ease-out, box-shadow 0.25s ease-out;
}
.btn-glass-accent::before { /* top gloss */
  content: ""; position: absolute; left:0; right:0; top:0; height:52%;
  background: linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0));
  pointer-events: none;
}
.btn-glass-accent:hover { box-shadow: 0 0 30px rgba(29,108,239,0.3), 0 12px 30px rgba(29,108,239,0.24), inset 0 1px 0 rgba(255,255,255,0.6); }
.btn-glass-accent:active { transform: scale(0.97); }
```
Secondary frosted variant: `.btn-glass-light` (`globals.css` lines 206–217) — `rgba(255,255,255,0.6)`
background, `blur(14px) saturate(140%)`, `border: 1px solid rgba(255,255,255,0.8)`,
`box-shadow: 0 6px 20px rgba(10,14,26,0.1)`, `:active { transform: scale(0.97) }`.

### Module 5 — Locked Color Palette

All current and future components must draw colors from this set only, in this proportion
(light base dominant, blue as the single accent, green reserved for metrics):

| Token | Hex | Role |
|---|---|---|
| `--color-ink` | `#0A0A0A` | Primary text, dark surfaces |
| `--color-ink-soft` | `#5B6472` | Secondary text |
| `--color-ink-faint` | `#9AA3B2` | Tertiary/muted text |
| `--color-surface` | `#F8F8F8` | Page background (light) |
| `--color-surface-2` | `#EEF1F5` | Card/section background |
| `--color-line` | `#E9EBEF` | Borders, dividers |
| `--color-accent` | `#1D6CEF` | Primary brand blue — CTAs, links, focus states |
| `--color-accent-deep` | `#144BC0` | Accent gradient end / hover-deepened accent |
| `--color-accent-light` | `#5B93F5` | Accent gradient start / lighter accent fill |
| `--color-navy` | `#0A0A0A` | Dark section background |
| `--color-navy-2` | `#14161C` | Dark section background (secondary) |
| `--color-metric-green` | `#18C896` | Reserved for positive metrics/stats only — not a general accent |

Gradients built from these tokens only:
- `.text-gradient` → `linear-gradient(120deg, #1D6CEF 0%, #5B93F5 100%)`
- `.bg-gradient-accent` → `radial-gradient(circle at 75% 15%, #5B93F5 0%, #1D6CEF 45%, #144BC0 100%)`

Do not introduce a new hex color for a new component — reuse one of the tokens above, or a
`rgba()` of one of them for opacity/glass effects (as `.glass`, `.btn-glass-*`, `.hero-grid-bg`
etc. already do).

### Module 6 — UTM Parameter Capture for Sheet-Logged Forms

Whenever a new page/form is going to log leads into Google Sheets (Module 2), it must capture
and forward UTM/attribution params exactly as `/northamerica/brochure` does — this is the
verified-working reference, copy it as-is:

```js
const UTM = (() => {
  const o = {};
  try {
    const q = new URLSearchParams(location.search);
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid']
      .forEach(k => { if (q.get(k)) o[k] = q.get(k); });
    if (document.referrer) o.referrer = document.referrer;
  } catch (e) {}
  return o;
})();
```

- When sending the lead to the API route, serialize UTM params as a query-string-style field:
  ```js
  const utmParams = Object.keys(UTM).length
    ? Object.entries(UTM).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    : 'direct';
  ```
  (`page.html` lines 481–483). Send this as a single string field in the POST body — don't
  reshape it into nested objects.
- Also spread `...UTM` directly into any client-side analytics/event payloads (see `page.html`
  line 563: `const data = { event, form:'hypergrid-brochure', session_id:SID, ts:..., ...UTM, ...props }`).
- Before considering a new sheet-logged page "done," verify each UTM param actually survives the
  flow end-to-end: append `?utm_source=test&utm_medium=test` (etc.) to the page URL, submit the
  form, and confirm the sheet row/column actually contains those values — don't assume the
  capture code alone is sufficient without checking the appended row.

### Module 7 — Meta Pixel: Client + Server-Side Pattern

Reference implementation: `src/app/northamerica/brochure/page.html` (mirrored in
`src/app/asia/brochure/page.html`), backed by `src/lib/metaCapi.ts` +
`src/app/api/meta-capi/route.ts`. **This whole site is driven by Meta ad traffic — every new
page/funnel must wire up Pixel tracking per this pattern, not skip it.**

This is a **split conversion strategy**, not a client/server *paired-dedup* pattern — there is no
shared `eventId` between the client `fbq` calls and the server CAPI call in the reference
implementation:

- **Client-side Pixel (`fbq`)** fires soft funnel-progress signals for *everyone*, regardless of
  lead quality:
  - `fbq('track', 'Subscribe')` — on landing on the brochure quiz (= clicking "Request Brochure")
  - `fbq('track', 'CompleteRegistration')` — on reaching the final step, for any lead type
  - `fbq('trackCustom', 'HG_LowIntentThankYou')` — negative/disqualified leads only
  - `fbq('trackCustom', 'HG_'+event, data)` — generic step telemetry (`form_view`, `step_view`,
    `step_complete`, `form_complete`, `form_exit`) sent on every step change, also mirrored to
    gtag/dataLayer and LogRocket.
- **Server-side CAPI "Lead" event** (`sendLeadEvent()` in `metaCapi.ts`, called via `/api/meta-capi`)
  is the **real, ad-optimization-grade conversion** — sent **once, server-side only, only for
  qualified/positive leads**, never mirrored client-side. This is deliberate: it can't double-fire
  and never fires for a disqualified visitor.
  - Pixel ID is hardcoded `1079278694629302` in both `metaCapi.ts` and the client `CONFIG.metaPixelId`
    — keep these in sync if it ever changes.
  - `sendLeadEvent` no-ops safely (console.warn) if `META_CAPI_TOKEN` isn't set — safe to deploy a
    new route before the token exists.
- **`eventId`/`fbc`/`fbp` passthrough already exists end-to-end** in `metaCapi.ts` and
  `api/meta-capi/route.ts` (accepted, forwarded, defaults to `randomUUID()` if omitted) — it's just
  not populated by the northamerica/asia caller today. **If a future page wants true client+server
  Lead dedup** (standard Meta pattern: same `event_id` on both the client `fbq('track','Lead',...)`
  and the server CAPI payload), generate the `eventId` client-side first, pass it to both the `fbq`
  call and the `/api/meta-capi` POST body — the server plumbing is ready for this, just unused.
- **Lead qualification** determines which branch fires: see the reference's `isPositiveLead()` logic
  (role + space + budget thresholds) — only positive leads get the server Lead event + redirect to
  `thankyou-q`; negative leads get the custom low-intent marker instead and are excluded from ad
  optimization.

### Module 8 — New Route Checklist: LogRocket Reminder

**Whenever a new route/page is created that wires up Meta Pixel + Google Sheets (i.e. a real lead-gen
page going live), explicitly remind the user to add LogRocket to it before considering it done.**
Two separate LogRocket projects are in play — pick the right one, don't assume:
- `ppo9zo/hyper-grid` — main React app project, initialized via `src/components/LogRocketInit.tsx`
  (`LogRocket.init("ppo9zo/hyper-grid")`, mounted first-child in `src/app/layout.tsx` `<body>`, no
  env-var gating, runs unconditionally client-side).
- `ppo9zo/meta-node-form` — used by the standalone vanilla-HTML brochure quiz pages
  (`/asia/brochure`, `/northamerica/brochure`) via a raw `<script>` tag, deliberately isolated from
  the main React app's sessions. If the new route is another standalone `page.html`-style quiz, use
  this project; if it's a normal React page under the main app, it already inherits
  `ppo9zo/hyper-grid` from the root layout — no action needed there, but still confirm with the user.

### Module 9 — Responsive Font Sizing Convention

No global type-scale token exists (no `font-size` in `@theme` — only color/spacing tokens are
there). Sizing is per-component Tailwind arbitrary values (`text-[Npx]`), **mobile-first, scaled up
at the `lg:` breakpoint (1024px)** by roughly +25–60%. Follow these observed bands for any new
component rather than inventing new sizes:

| Element | Pattern | Example |
|---|---|---|
| Section heading (h2-level) | `clamp()` fluid scaling, ~28-32px → 42-48px | `text-[clamp(32px,5.5vw,48px)]` |
| Hero subhead/value prop | discrete mobile→lg jump | `text-[24px] lg:text-[44px]` |
| Stat/number callout | 3-step scale | `text-[28px] lg:text-[36px] xl:text-[40px] font-black ... leading-none` |
| Body/paragraph text | mobile→lg jump | `text-[15px] sm:text-[16px] lg:text-[24px] text-ink-soft font-medium leading-relaxed` |
| Label/eyebrow (uppercase, tracked) | small, heavy tracking | `text-[13px] lg:text-[20px] font-semibold tracking-[0.26em] uppercase` |
| Button text | small-to-medium, little/no breakpoint jump | `text-[18px] lg:text-[22px] font-semibold` |

`sm:` is used for secondary mobile-vs-slightly-larger-mobile tweaks (not a true tier); `xl:` is
reserved for hero/stat elements wanting a third step; `md:` is rare. The one global CSS font-size
rule (`.PhoneInputInput`, `globals.css:423,429`) follows the same convention: `15px` base, `16px`
at `min-width:1024px`. New components should match whichever band they're closest to (heading,
body, label, button, stat) rather than picking an arbitrary new size.

---

## Project Intent (for open-ended questions / suggestions)

When asked open-ended questions, for feature suggestions, or prioritization advice on this project,
reason from this read of the product and audience — don't default to generic SaaS-landing-page
advice:

- **Product**: HyperGrid (by FOG Technologies) — an unmanned, multiplayer LED-floor game arena,
  sold as a capital equipment purchase to venue operators (not a consumer app).
- **Audience**: family entertainment center (FEC) / amusement-venue operators — multi-venue
  operators, single-venue operators, people building their first venue, and lower-intent "just
  exploring" visitors. The site explicitly distinguishes and qualifies between these.
- **Goal/funnel**: brochure-gated lead capture → qualify → route to sales. Landing sections
  (Hero, KeyFeatures, CaseStudy, ROICalculator) build credibility and ROI justification (stat
  callouts like "150+ venues," "15+ countries," payback period); the brochure quiz qualifies leads
  by role, venue floor space availability (15-25 m²), and investment budget (region-specific
  thresholds), then gates the real PDF brochure + sales handoff behind a positive-lead verdict.
- **Tone**: confident, ROI-driven, data-forward B2B sales copy — not playful/consumer-facing, even
  though the underlying product is a consumer entertainment attraction.
- **Implication for suggestions**: favor features that improve lead quality/qualification,
  conversion-rate and ROI-perception (stats, case studies, calculators), and ad-attribution
  fidelity (Pixel/CAPI, UTM capture) over generic polish. When suggesting new pages/funnels, assume
  traffic arrives from Meta ads and must be qualified before being treated as a real lead.

---

## Deployment & External Project Links

- **Live site:** https://hypergrid-fog.vercel.app/ (Vercel)
- **GitHub:** https://github.com/YashM8329/meta_landing_page
- **LogRocket — main app:** https://app.logrocket.com/ppo9zo/hyper-grid
- **LogRocket — brochure quiz pages:** https://app.logrocket.com/ppo9zo/meta-node-form
- Vercel/LogRocket plugins, connectors, or other tooling may be installed as needed to complete
  tasks involving deployment, logs, or session replay for this project.

---

## Environment Variables

| Variable | Used by | Notes |
|---|---|---|
| `RESEND_API_KEY` | `send-email/route.ts` | Resend email API key |
| `CONTACT_RECEIVER_EMAIL` | `send-email/route.ts` | Lead notification destination; falls back to `info@hypergrid.ai`, then a hardcoded sandbox email |
| `GOOGLE_MAPS_API_KEY` | `places-autocomplete/route.ts` | Google Places Autocomplete |
| `GOOGLE_SHEET_ID` | `googleSheets.ts` | Target spreadsheet ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `googleSheets.ts` | Sheets JWT auth |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | `googleSheets.ts` | `\n`-escaped in env, unescaped at runtime |
| `META_CAPI_TOKEN` | `metaCapi.ts` | Meta Conversions API access token |

No `.env.example` exists in the repo. `ipapi.co` is called unauthenticated (no env var).
