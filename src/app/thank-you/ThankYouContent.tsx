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

      <h1 className="text-[clamp(26px,4.5vw,40px)] font-extrabold tracking-[-0.03em] text-ink leading-[1.25] max-w-[680px] mb-10">
        Thank you for your interest in HyperGrid. Our team will contact you within 24hours
      </h1>

      <Link
        href="/"
        className="inline-flex items-center gap-2 h-[52px] px-8 rounded-full bg-accent text-white text-[15px] font-semibold tracking-[-0.01em] hover:bg-accent-deep transition-colors duration-150"
      >
        {t.form.backHome}
      </Link>
    </motion.main>
  );
}
