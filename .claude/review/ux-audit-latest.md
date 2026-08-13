# UX Audit — HyperGrid Landing Page
Generated: 2026-08-13

21 observations across 9 surfaces.

---

## Surface: BrochureForm

- **Missing feedback state — venue conditional fields cause layout jump on selection**: When the user selects "I'm planning a new venue" or "Other" from the Venue Status dropdown, a new sub-field box (`bg-accent/5` container) appears inline below the `<select>`. This expands the form height mid-page, shifting all content below it downward. The page does not scroll or compensate — the user's eye position jumps. The same happens for "I have an existing venue" (shows venue location field). This is a layout-shift UX issue on every status change.

- **Missing feedback state — phone error persists after fix**: The phone field validates on `onBlur` only (`validatePhoneField`). Once an error is shown, fixing the number does not clear the red state until the field is blurred again. A user who corrects a mistake while the field is focused sees no improvement signal.

- **Missing feedback state — country dropdown has no "no results" state**: If the user types something that matches no country (e.g., a misspelling), the dropdown simply closes (empty `countryOptions` array hides the `<ul>`). There is no "No countries found" message — the user doesn't know if the filter is running or if their input is just wrong.

- **Edge case — autocomplete dropdown renders upward and may clip on mobile**: Both venue input dropdowns (venueStatusOther and venueLocation) use `bottom-full mb-1` positioning — they open upward above the input. On mobile, when the form keyboard is open and these fields are in the lower half of the viewport, the upward dropdown is partially or fully off-screen, making suggestions invisible.

- **Edge case — blur-before-click race on autocomplete**: Both venue autocomplete lists dismiss on `onBlur` with a 200ms `setTimeout`. On some mobile browsers, the blur fires before the `onClick` registers on the list item, closing the dropdown before the tap completes. The user taps a suggestion and nothing happens.

- **Inconsistency — venue dropdown opens downward for country, upward for venue**: The country autocomplete list uses `absolute` positioning without `bottom-full` (opens downward), while both venue fields open upward. The direction inconsistency is jarring, especially when both are visible at the same time on larger phones.

- **Inconsistency — "Tap to submit" button pulse animation runs on disabled state**: The submit button's `motion.div` has a `scale` pulse animating continuously (every 3.5s). When `submitting=true`, the button is `disabled` and shows a spinner, but the `motion.div` animation continues underneath (it's swapped in `JSX` via a ternary). The pulse stops only because the element unmounts — but if the submit call is instant, the animation visually "jumps" as it restarts.

- **Roughness — no minimum character hint for name**: The full name field accepts a single character (e.g., "A") and shows no validation error until submit. A user entering initials or a nickname will only discover the issue at submit time.

- **Roughness — "Other" venue field placeholder says "Search for a place" which implies location search, but "other" could mean anything**: The placeholder `t.form.fields.venueLocationOtherPlaceholder` is mapped to a Google Places autocomplete. This mismatch is confusing — "Other" was chosen specifically because it's not a venue, but the field still tries to look up places.

---

## Surface: HeroSection

- **Missing feedback state — video modal has no buffering/loading state**: When the user clicks "Watch Video", the modal opens immediately and the `<video>` begins loading. On slow connections, the video area is pure black with no spinner, progress indicator, or skeleton. The user doesn't know if the video is coming or if something broke.

- **Inconsistency — mobile hero play button is `w-11 h-11` (44px), which is at the minimum Apple touch target size**: At 44px, the play button is exactly at the Apple HIG minimum touch target. Combined with its absolute position at `bottom-[12%] left-[0%]`, the button sits near the edge of the image. It is easy to miss or accidentally scroll past without activating.

- **Inconsistency — desktop and tablet stat cards show different venue counts**: Desktop shows `150+` venues; mobile shows `100+` venues. These are different hardcoded values for the same metric on the same page.

- **Roughness — "Watch Video" button missing on tablet layout**: The tablet layout (md:flex lg:hidden) includes a "Watch Video" button in the CTA row, but the mobile layout (flex md:hidden) only exposes the floating play button overlaid on the hero image. If a user on a mobile device misses the tiny play button, they have no other affordance to open the video.

---

## Surface: NavBar

- **Missing feedback state — no active section highlighting**: The navbar links (Features, Moments AI, Testimonials, ROI) are plain anchor links with no active state. As the user scrolls through sections, the nav gives no visual feedback about which section they're currently in. Standard on single-page sites.

- **Roughness — navbar is invisible until user scrolls past 70% of the hero, then requires scrolling up to reveal it**: A user who lands on the page and immediately scrolls down past the hero has no persistent navigation. They must reverse-scroll to make the navbar appear. On long pages this is disorienting.

---

## Surface: MomentsSection

- **Inconsistency — "Tap to unmute" hint is hardcoded English and not translated**: The string `"Tap to unmute"` at line 288 is a hardcoded string literal, not pulled from the translation system (`t.*`). All other visible text on the page is translated for DE/FR/IT/ES visitors. This one string will display in English regardless of locale.

- **Roughness — "Tap to unmute" copy assumes touch input**: The hint says "Tap" but this phone mockup is visible on desktop too, where users click (not tap). The label is technically inaccurate on mouse devices.

---

## Surface: InstagramCarousel (Locations section)

- **Edge case — typos in venue `gameZone` data visible to users**: The `venueReels` data in `page.tsx` contains typos that display in the carousel UI: `"Reunioun Island"` (Reunion Island), `"Aurstralia"` (Australia), `"Surfurs Paradise"` (Surfers Paradise). These appear in the published Instagram embed cards.

---

## Surface: ROICalculator

- **Edge case — players slider minimum is 2,500 with no way to enter a lower value**: The players slider has `min={2500}`. A venue operator with fewer than 2,500 players per month (a realistic scenario for a new or small venue) cannot accurately model their situation. The calculator implicitly excludes smaller operators.

---

## Surface: CaseStudy

- **Roughness — tab selector shows only location name ("Texas", "UK", "New York") with no visual distinction between them beyond text**: The three tab cards are identical in appearance except for the location label. There's no flag, icon, or visual shorthand. On small screens where the cards compress, the distinction relies entirely on reading small text.

---

## Surface: ThankYouPage

- **Missing feedback state — page content is English-only, not translated**: The thank-you page (`/thank-you`) has hardcoded English strings: "Brochure on its way!", "Thanks for your interest in HyperGrid…", "Back to Home". A user who arrived via the German or French locale will see an English confirmation page, breaking the i18n experience at the most critical conversion moment.
