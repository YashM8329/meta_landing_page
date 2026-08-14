# UX Audit — HyperGrid Landing Page
_Generated: 2026-08-14_

18 observations across 9 surfaces.

---

## Surface: InstagramEmbed / InstagramCarousel

- **Missing feedback state:** Spinner shows whenever `isPlaying` is false — including the paused state after a user intentionally taps to pause. There is no distinction between "loading" and "paused by user", so the spinner misleadingly appears on a user-paused video.
- **Missing slow-connection feedback:** If a video stalls for an extended period, the spinner is the only signal. No message or timeout fallback communicates that the connection is slow. User has no way to know if the video will ever load.
- **Edge case — preload=none + intersection:** Videos start with `src={hasIntersected ? videoSrc : undefined}`. On very slow connections, assigning the src and immediately calling `.play()` after 50ms may succeed (play() resolves) before any frames are buffered, causing `isPlaying = true` but a blank black frame until data arrives. Spinner disappears prematurely.
- **Inconsistency:** Action bar buttons (Like, Comment, Share, Options) have `onClick` handlers on the heart/comment/send icons but no affordance or feedback — pressing them does nothing. On a landing page these are purely decorative, but they look interactive and raise tap expectations.
- **Missing state:** Mute toggle icon in `InstagramEmbed` does not reset when the video is re-assigned (e.g. if component remounts). `isMuted` defaults to `true` but video `muted` attribute is always `muted` — the toggle visually tracks state but the actual audio never plays regardless.

---

## Surface: MomentsSection

- **Missing feedback state:** `isTouchDevice` initialises to `true` on the server and during SSR, meaning desktop users see "Tap to unmute" for a brief flash on hydration before it corrects to "Click to unmute". No layout shift, but semantically wrong for that instant.
- **Edge case — video loading:** The `isPlaying` spinner in `MomentsSection` sits behind the video element in z-order (`z-10` on overlay, video renders on top). If the video element itself is transparent before playback, the spinner is visible. If the video has a black poster, the spinner is hidden. Depends on browser behaviour — no explicit `poster` is set.

---

## Surface: HeroSection

- **Missing feedback state:** Video modal sets `videoLoaded = false` on close, but the `<video>` element is only rendered when `isOpen` is true (inside `AnimatePresence`). Every modal open starts a fresh network fetch — no caching benefit from keeping the element mounted. On slow connections, the spinner shows every single open.
- **Edge case — video error:** No `onError` handler on the modal `<video>`. If the video fails to load (404, network drop), the spinner never clears and the user sees an infinite spinner with no way to dismiss other than closing the modal.
- **Missing state:** Close button (`×`) has no `aria-label` fallback visible on screen — relies purely on the SVG icon for sighted users. Keyboard/screen-reader users get `aria-label={t.hero.closeVideo}` which is correct, but the icon-only button is invisible to a screen reader without the label.

---

## Surface: BrochureForm

- **Missing feedback state:** Country field has no loading state while the IP-based default country is being resolved. During that window the field shows empty — user may start typing a wrong country before the auto-fill lands, and their input gets overwritten silently.
- **Edge case — venueStatus expand/collapse:** When switching between "existing" and "other" (without going back to blank first), the old panel exits and the new one enters simultaneously via `AnimatePresence`. Both panels share `venueOptions` state — suggestions from the previous panel could briefly appear in the new one.
- **Edge case — form submit with expanded panel:** If user selects "new" (no sub-panel) after having typed in "existing" sub-field, `form.venueLocation` is still populated. The validation clears it (no error for "new"), but the data is silently submitted. Server receives a venue location for a user who said "new venue".
- **Missing feedback:** Submit success route is a hard `router.push("/thank-you")`. If that navigation fails (e.g. network drop after POST succeeds), the user sees no confirmation — they remain on the form page with no indication anything happened.

---

## Surface: NavBar

- **Missing state:** Mobile NavBar only shows the logo with no CTA. A user who scrolls up on mobile to re-orient has no action available in the nav — no "Get Brochure" link.
- **Inconsistency:** Nav link `#proof` maps to the section `id="proof"` but the displayed label is "Testimonials" — a mismatch if the anchor ever drifts or is refactored.

---

## Surface: StickyFooterCTA

- **Missing feedback state:** StickyFooterCTA is always visible — it does not hide when the BrochureForm section is in the viewport. On mobile, it overlaps the form fields at the bottom of the screen.
- **Inconsistency:** CTA label uses `t.form.submit` ("Get Your Free Brochure") rather than a nav-style short label like "Get Brochure". On mobile the button is long — may truncate on narrow devices.

---

## Surface: ROICalculator

- **Edge case — zero players:** Slider minimum is 2,500. No path for a small venue with fewer monthly players. `paybackMonths` formula handles `monthlyUsd > 0` but the lower bound of the slider prevents testing realistic small-venue numbers.

---

## Surface: ThankYouContent

- **Missing state:** No loading or transition state between form submit and the thank-you page. Users on slow connections see the form button spinner until `router.push` completes, then a blank page flash before the thank-you renders.

---

## Surface: InstagramCarousel (container)

- **Missing feedback state (global):** No site-level slow-connection indicator. If multiple carousel videos stall simultaneously on a slow connection, each card shows its own individual spinner with no unified message. The user has no single signal that it's a connection issue rather than broken content.
