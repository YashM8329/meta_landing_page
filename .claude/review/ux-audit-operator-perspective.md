# UX Audit — Operator / Investor / GameZone Owner Perspective
_Generated: 2026-08-14_
_Lens: Busy business decision-maker, clicked an ad, likely on mobile, evaluating a €65k investment_

23 observations across 10 surfaces.

---

## Surface: HeroSection

- **[CRITICAL] No pricing signal anywhere above the fold.** An operator's first mental question is "what does this cost?" The hero shows 150+ venues, 15+ countries, fastest ROI — but zero price anchoring. Without it, many operators self-disqualify or bounce before they even scroll, assuming it's out of budget. A single "Starting from X" or "Request pricing" line resolves this.
- **[CRITICAL] "Request Brochure" is a passive CTA for an active buyer.** Operators evaluating a major attraction purchase want to feel like they're initiating a deal, not subscribing to a newsletter. Labels like "Get Pricing & Specs" or "Talk to a Sales Rep" carry far more intent weight for this audience.
- **[MINOR] Stats row omits the single most persuasive number for operators: revenue per sqm.** Venues care deeply about floor-space productivity. "150+ venues", "15+ countries" and "fastest ROI" are good, but Revenue/sqm (shown in ROI calc) is missing from the hero stats — the one metric that reframes the entire investment conversation.
- **[MINOR] "Watch Video" competes for attention with the primary CTA.** For a time-pressed operator, a second button at the same visual weight on the hero creates decision paralysis. The video button should be clearly subordinate (ghost/text-only style) so the conversion path is unambiguous.

---

## Surface: BrochureForm

- **[CRITICAL] No indication of what happens after submission.** Operators submitting a lead form are professionals expecting a defined follow-up process. There is no "We'll contact you within 24 hours" or "A sales rep will reach out" message near the submit button. Without it, high-value operators assume the form goes into a void and may not submit.
- **[CRITICAL] No "number of venues" or "chain vs single" field.** An operator running 12 Timezone locations is a completely different sales conversation from someone with one independent arcade. The form captures none of this. Sales team cannot prioritize or route leads, and chain operators feel the form wasn't built for them.
- **[CRITICAL] Country field silently overwrites typed input with IP-resolved value.** If the IP lookup resolves after the user has started typing a different country (e.g. they're a UK operator based temporarily in Dubai), their typed input is overwritten with no warning. Data submitted may be wrong, leading to wrong sales routing.
- **[CRITICAL] "New venue" option silently submits stale venueLocation.** If a user selects "existing", types a location, then switches to "new" (no sub-panel required), `form.venueLocation` remains populated and gets submitted to the server. The sales team receives a venue location for someone who said they don't have an existing venue — corrupted lead data.
- **[MINOR] "Venue status" label is B2C language.** "Do you have an existing venue?" is fine for consumers. Operators read it as a qualification question ("will I be rejected if I say no?"). Reframing as "Tell us about your setup" or separating into "Existing FEC / New Build / Adding to existing venue" better matches operator mental models.
- **[MINOR] Form has no privacy/data assurance copy.** Operators, especially in regulated markets (EU, GCC), are cautious about submitting contact details without knowing how data is used. A single line — "Your details go directly to the HyperGrid sales team. No spam." — removes hesitation.
- **[MINOR] No "best time to contact" or "preferred contact method" field.** Operators are busy. A CEO filling this form on a Tuesday morning doesn't want a call at 9am Friday. Without this, the sales team cold-calls at random and conversion drops.

---

## Surface: ROICalculator

- **[CRITICAL] Slider minimum of 2,500 players/month is unrealistic for most operator prospects.** A new gamezone, or a small FEC in a secondary market, may have 800–1,500 players/month. They cannot test their actual numbers, see the payback period spike, and mentally rule themselves out — even though HyperGrid might still be viable at lower throughput. The slider should start at 500 or have a typed input fallback.
- **[CRITICAL] ROI section has no exit CTA.** After an operator sees their potential payback period — the "aha moment" — there is no CTA directly below to capture that intent. `MobileBrochureCTA` renders but it's below the section on mobile; on desktop there is nothing. Operators who want to act immediately must scroll to find the form.
- **[MINOR] No install cost input.** The €65,000 figure is hardcoded and invisible. Operators in different markets (or negotiating a different config) cannot adjust it, so the payback calculation feels like a black box. Even a collapsed "Advanced: adjust install cost" input would increase trust in the numbers.
- **[MINOR] "7-year revenue" metric is an odd horizon for this audience.** Operators think in 1–3 year payback windows and annual returns. A 7-year projection looks speculative and undermines the credibility of the shorter-term numbers. Replace with "Annual revenue" or "Year 1 revenue" to stay in the operator's planning frame.

---

## Surface: CaseStudy

- **[CRITICAL] All three case studies are anonymised ("Texas FEC Chain", "UK FEC Chain", "New York FEC Chain").** Operators are sophisticated buyers. Anonymous case studies read as unverifiable marketing. Named venues like "Timezone, Austin" or even "Major US FEC Chain (NDA)" with an industry logo carry dramatically more weight. If NDA prevents naming, at least show a recognisable operator logo alongside the data.
- **[MINOR] No context on HyperGrid's contribution vs overall venue.** The weekly revenue figures could be the whole venue's revenue for all an operator knows. Adding "HyperGrid unit only" or "per-unit revenue" as a sub-label removes ambiguity and makes the numbers more credible, not less.
- **[MINOR] Tab labels "Texas / UK / New York" communicate geography, not insight.** Operators comparing case studies want to know which scenario matches them. Labels like "High-traffic FEC", "Mid-size chain", "Single venue" would help self-identification.

---

## Surface: ProofSection (Testimonials)

- **[CRITICAL] All three testimonials are from C-suite/CEO of large chains (TEEG, LAI Games, ASI).** These are credibility signals for investors, but operators running a single gamezone or a small FEC chain will not identify with them. There are no testimonials from an owner-operator running 1–3 venues — exactly the buyer persona most likely to be clicking an ad. The social proof doesn't match the likely audience.
- **[MINOR] Testimonial quotes focus on product experience, not business outcomes.** "Creates social, competitive energy" is nice. "We hit payback in 4 months" is what closes deals. At least one quote should lead with a hard business metric.

---

## Surface: NavBar

- **[CRITICAL] Mobile navbar (scroll-up) shows only logo — no CTA.** An operator who has scrolled down, explored the page, and scrolled back up to re-orient has no action available from the nav on mobile. Desktop shows "Get Brochure" at all times. This discrepancy means mobile operators — the dominant traffic source from Meta ads — have no persistent conversion entry point after the hero.

---

## Surface: KeyFeaturesSection

- **[MINOR] Feature cards lead with operator-facing benefits but lack any pricing/ROI tie-in.** "Fully Unattended" is excellent — but operators reading it immediately think "what's the staffing saving?" No card bridges from feature to financial outcome. A micro-stat like "Save 2 staff hours/day" or "Zero maintenance calls in first year" under each card would close that gap.
- **[MINOR] No installation/logistics feature card.** "Installed in under 2 days" appears in an Instagram caption but not in the features section. Operators care deeply about installation disruption (closed floor = lost revenue). This is a major differentiator that's buried.

---

## Surface: Footer

- **[MINOR] Footer has no contact info, social links, or legal links.** Investors and enterprise operators performing due diligence expect a company address, email, or at minimum a privacy policy link. The current footer is brand-only. This raises legitimacy questions for first-time visitors doing background checks.
- **[MINOR] No "About FOG Technologies" link or company credibility anchor.** Enterprise buyers want to know who is behind the product before signing. The footer logo links nowhere and offers no company context.

---

## Surface: ThankYouPage

- **[CRITICAL] No expectation-setting after form submission.** The thank-you page confirms submission but gives zero information about what happens next: no timeframe, no who will contact them, no what to expect. An operator who submitted at 11pm on a Friday has no idea if they'll hear back in 2 hours or 2 weeks. This uncertainty kills warm leads. Add: "A member of our team will be in touch within 1 business day."

---

## Surface: InstagramCarousel (Locations)

- **[MINOR] No physical footprint callout next to venue reels.** Each reel shows a gamezone account and country, but not the floor size or configuration. Operators evaluating floor-space ROI cannot see at a glance whether the featured installations are comparable to their own space.
