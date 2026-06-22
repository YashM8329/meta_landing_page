"use client";

import { motion } from "framer-motion";

export default function StickyFooterCTA() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="relative max-w-[460px] mx-auto px-4 pb-4 pt-2"
      >
        <a
          href="#brochure-form"
          className="btn-glass-accent flex items-center justify-center gap-2 text-white font-semibold text-[16px] h-[54px] rounded-lg w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Request brochure — scroll to form"
        >
          Request Brochure
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 3L13 8L8 13M3 8H13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </motion.div>
    </div>
  );
}
