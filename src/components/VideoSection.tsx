"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* S2 — Full gameplay video (9:16), full-height section.
   Reusing the hero reel for now; swap in a dedicated longer 9:16 video later.
   Tap the video to toggle mute/unmute (Instagram-style). */

export default function VideoSection() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [pulse, setPulse] = useState(0); // increments each tap to retrigger icon

  // Guarantee muted by default (React doesn't always reflect the `muted` attribute)
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    if (!next) v.play().catch(() => {});
    setMuted(next);
    setPulse((p) => p + 1);
  };

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section
      id="gameplay-video"
      className="snap-start min-h-dvh relative flex flex-col px-6 pt-16 pb-28 overflow-hidden"
      aria-label="Gameplay video"
    >
      <motion.h2
        {...rise(0)}
        className="relative z-10 text-[clamp(30px,8.5vw,40px)] leading-[1.02] font-extrabold tracking-[-0.025em] text-ink mb-6"
      >
        World&apos;s best active<br />social attraction
      </motion.h2>

      <motion.div
        {...rise(0.12)}
        className="relative z-10 flex-1 rounded-[13px] overflow-hidden shadow-[0_20px_50px_rgba(10,14,26,0.18)] min-h-0"
      >
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute inset-0 w-full h-full cursor-pointer"
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/video/hypergrid-reel.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />

          {/* transient mute/unmute icon (fades out) */}
          <AnimatePresence>
            <motion.span
              key={pulse}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1] }}
              transition={{ duration: 0.9, times: [0, 0.15, 0.6, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(10,14,26,0.5)", backdropFilter: "blur(6px)" }}
            >
              {muted ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 9H7l4-3.5v13L7 15H4V9Z" fill="#fff" />
                  <path d="M16 9l5 6M21 9l-5 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 9H7l4-3.5v13L7 15H4V9Z" fill="#fff" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </motion.div>
    </section>
  );
}
