"use client";

import AisaBrochureWidget from "@/components/AisaBrochureWidget";
import { useTranslation } from "@/lib/useTranslation";

/**
 * Brochure-form slot for /asia: unlike BrochureForm (used on the regular
 * homepage), this has no left context panel — the node-based brochure
 * (AisaBrochureWidget) fills the whole section by itself, under a centered
 * "Request Brochure" heading on both breakpoints.
 */
export default function AisaBrochureSection() {
  const { t } = useTranslation();
  return (
    <section id="brochure-form" className="min-h-0 lg:py-10 relative flex flex-col justify-center pt-6 pb-8" aria-label="Request brochure form">
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0">
        <h2 className="text-[clamp(30px,6vw,48px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink text-center mb-6 lg:mb-8">
          {t.form.heading}
        </h2>
        <AisaBrochureWidget />
      </div>
    </section>
  );
}
