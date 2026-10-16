"use client";

import { useTranslation } from "@/lib/useTranslation";
import AisaBrochureWidget from "@/components/AisaBrochureWidget";

/**
 * Same outer layout/left-column context panel as BrochureForm, used on the
 * homepage's regular brochure form — but the right column is the embedded
 * multi-step HyperGrid brochure flow (AisaBrochureWidget) instead of the
 * single-step React form. Used only on /aisa.
 */
export default function AisaBrochureSection() {
  const { t } = useTranslation();

  return (
    <section id="brochure-form" className="min-h-0 lg:py-10 relative flex flex-col justify-center pt-6 pb-8" aria-label="Request brochure form">
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0 md:grid md:grid-cols-2 md:gap-8 lg:gap-16 md:items-start">
        {/* Left column: context (identical to BrochureForm) */}
        <div className="hidden md:flex flex-col">
          <h2 className="text-[48px] xl:text-[56px] leading-[0.95] font-extrabold tracking-[-0.03em] text-ink mb-6">
            {t.form.heading}
          </h2>
          <div className="flex flex-col gap-9 mt-3">
            {([
              <svg key="analytics" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/><path d="M15 9h4v4"/></svg>,
              <svg key="specs" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth="1" opacity="0.4"/></svg>,
              <svg key="handshake" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>,
            ] as const).map((icon, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">{icon}</span>
                <span className="text-[15px] md:text-[18px] lg:text-[22px] font-medium text-ink">{t.form.benefits[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column (or full width on mobile): embedded brochure flow */}
        <div>
          <div className="md:hidden mb-7">
            <h2 className="text-[clamp(30px,8.5vw,42px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">{t.form.heading}</h2>
          </div>
          <AisaBrochureWidget />
        </div>
      </div>
    </section>
  );
}
