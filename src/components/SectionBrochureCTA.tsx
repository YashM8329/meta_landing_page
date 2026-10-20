"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/useTranslation";
import { useCTA } from "@/lib/CTAContext";

/**
 * Inline "Request Brochure" button shown beside a section heading, desktop
 * only (md:flex). Used on /asia in place of a global sticky CTA — each
 * named section gets its own reachable CTA instead of relying on one bar
 * pinned to the viewport.
 */
export default function SectionBrochureCTA({ href }: { href?: string }) {
  const { t } = useTranslation();
  const { showCTA } = useCTA();

  if (!href || !showCTA) return null;

  return (
    <a
      href={href}
      className="hidden md:inline-flex btn-glass-accent text-white font-semibold text-[15px] px-5 py-2.5 rounded-lg items-center gap-2 flex-none"
    >
      <motion.span
        className="flex items-center gap-2"
        animate={{ scale: [1, 1, 1.05, 1, 1] }}
        transition={{ times: [0, 0.14, 0.2, 0.26, 1], duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {t.hero.requestBrochure}
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.span>
    </a>
  );
}
