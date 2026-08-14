"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useVideoLoad } from "@/lib/VideoLoadContext";
import { useTranslation } from "@/lib/useTranslation";

// Shows a toast after videos have been stalling for DELAY_MS without recovering.
// Auto-dismisses when all videos resume. Can also be manually dismissed — stays
// dismissed for the rest of the session.
const DELAY_MS = 4000;

export default function SlowConnectionToast() {
  const { stallingCount } = useVideoLoad();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (dismissed) return;

    if (stallingCount > 0) {
      // Start the delay timer if not already running
      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          setVisible(true);
        }, DELAY_MS);
      }
    } else {
      // All videos recovered — clear timer and hide toast
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setVisible(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [stallingCount, dismissed]);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0a0e1a]/90 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white text-[13px] font-medium whitespace-nowrap select-none"
        >
          {/* Wifi-off icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 shrink-0" aria-hidden="true">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>

          <span className="text-white/85">{t.slowConnection.message}</span>

          {/* Dismiss button */}
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="ml-1 w-5 h-5 flex items-center justify-center rounded-full text-white/50 hover:text-white transition-colors duration-150 cursor-pointer"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
