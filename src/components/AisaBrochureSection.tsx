"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/useTranslation";

/**
 * Brochure-form slot for /asia: a single "Request Brochure" button linking
 * to /asia/brochure (the standalone node-based brochure flow), styled
 * identically to the other Request Brochure CTAs on the page (HeroSection's
 * desktop button).
 */
export default function AisaBrochureSection() {
  const { t } = useTranslation();
  return (
    <section id="brochure-form" className="min-h-0 lg:py-16 relative flex items-center justify-center pt-10 pb-12" aria-label="Request brochure">
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0 flex justify-center">
        <a
          href="/asia/brochure"
          className="btn-glass-accent text-white font-semibold text-[18px] px-8 py-4 rounded-xl flex items-center gap-2.5"
        >
          <motion.span
            className="flex items-center justify-center gap-2.5"
            animate={{ scale: [1, 1, 1.05, 1, 1] }}
            transition={{
              times: [0, 0.14, 0.20, 0.26, 1.0],
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {t.hero.requestBrochure}
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </a>
      </div>
    </section>
  );
}
