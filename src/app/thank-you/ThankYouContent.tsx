"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";

export default function ThankYouContent() {
  const { t } = useTranslation();

  return (
    <main className="min-h-dvh bg-white flex flex-col items-center justify-center px-6 text-center">
      {/* Checkmark icon */}
      <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-8 shadow-[0_12px_32px_rgba(29,108,239,0.35)]">
        <svg width="36" height="36" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M7 14L12 19L21 9" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-[clamp(32px,7vw,56px)] font-extrabold tracking-[-0.03em] text-ink leading-[1.05] mb-4">
        {t.form.successHeading}
      </h1>

      <p className="text-[17px] text-ink-soft leading-relaxed max-w-[480px] mb-10">
        {t.form.successMessage}
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 h-[52px] px-8 rounded-full bg-accent text-white text-[15px] font-semibold tracking-[-0.01em] hover:bg-accent-deep transition-colors duration-150"
      >
        {t.form.backHome}
      </Link>
    </main>
  );
}
