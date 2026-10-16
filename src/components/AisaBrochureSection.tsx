"use client";

import AisaBrochureWidget from "@/components/AisaBrochureWidget";

/**
 * Brochure-form slot for /asia: unlike BrochureForm (used on the regular
 * homepage), this has no left context panel and no "Request Brochure"
 * heading on either breakpoint — the node-based brochure (AisaBrochureWidget)
 * fills the whole section by itself.
 */
export default function AisaBrochureSection() {
  return (
    <section id="brochure-form" className="min-h-0 lg:py-10 relative flex flex-col justify-center pt-6 pb-8" aria-label="Request brochure form">
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0">
        <AisaBrochureWidget />
      </div>
    </section>
  );
}
