"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/useTranslation";

export default function ThankYouContent() {
  const { t } = useTranslation();

  return (
    <motion.main
      className="min-h-dvh bg-white flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Checkmark icon */}
      <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-8 shadow-[0_12px_32px_rgba(29,108,239,0.35)]">
        <svg width="36" height="36" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M7 14L12 19L21 9" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-[clamp(26px,4.5vw,40px)] font-extrabold tracking-[-0.03em] text-ink leading-[1.25] max-w-[680px] mb-4">
        {t.form.followUp}
      </h1>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <a
          href="/brochure/hypergrid-brochure.pdf"
          download="HyperGrid Brochure - FOG.pdf"
          className="inline-flex items-center gap-2 h-[52px] px-8 rounded-full border border-line text-ink text-[15px] font-semibold tracking-[-0.01em] hover:bg-ink/5 transition-colors duration-150"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5" />
            <path d="M4 18v1.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V18" />
          </svg>
          Download Brochure
        </a>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-[52px] px-8 rounded-full bg-accent text-white text-[15px] font-semibold tracking-[-0.01em] hover:bg-accent-deep transition-colors duration-150"
        >
          {t.form.backHome}
        </Link>
      </div>
    </motion.main>
  );
}
