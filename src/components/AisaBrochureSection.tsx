"use client";

import { useTranslation } from "@/lib/useTranslation";

/**
 * Brochure-form slot for /asia: a single "Request Brochure" button linking
 * to /asia/brochure (the standalone node-based brochure flow), rather than
 * the flow embedded inline.
 */
export default function AisaBrochureSection() {
  const { t } = useTranslation();
  return (
    <section id="brochure-form" className="min-h-0 lg:py-16 relative flex flex-col items-center justify-center pt-10 pb-12" aria-label="Request brochure">
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0 flex flex-col items-center text-center">
        <h2 className="text-[clamp(30px,6vw,48px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink mb-8">
          {t.form.heading}
        </h2>
        <a
          href="/asia/brochure"
          className="btn-glass-accent text-white font-semibold text-[18px] lg:text-[20px] px-10 py-4 rounded-xl inline-flex items-center gap-2.5"
        >
          {t.hero.requestBrochure}
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
