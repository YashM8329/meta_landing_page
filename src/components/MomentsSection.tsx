"use client";

import { motion, useReducedMotion } from "framer-motion";
import CardCarousel, { CarouselCard } from "./CardCarousel";
import Typewriter from "./Typewriter";

const steps = [
  {
    n: "1",
    text: "Two cameras record gameplay",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    n: "2",
    text: "Scan the QR after gameplay",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="15" width="6" height="6" rx="1" />
        <rect x="3" y="15" width="6" height="6" rx="1" />
        <path d="M9 9h.01M15 9h.01M9 15h.01" />
      </svg>
    ),
  },
  {
    n: "3",
    text: "Download and share on social",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    ),
  },
];

export default function MomentsSection({ cards }: { cards: CarouselCard[] }) {
  const reduce = useReducedMotion();
  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section
      id="moments-ai"
      className="min-h-0 lg:py-16 relative flex flex-col justify-center pt-8 pb-10 overflow-hidden"
      aria-label="Moments AI"
    >
      <div className="max-w-[1440px] mx-auto w-full px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Title and Steps */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div {...rise()} className="mb-6 lg:mb-8 text-left">
              {/* <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">AI Powered</p> */}
              <h2 className="text-[clamp(32px,7vw,48px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink">
                Moments{" "}
                <Typewriter words={["Videos", "Photos"]} className="text-accent" />
              </h2>
            </motion.div>

            {/* Steps */}
            <motion.div {...rise(0.05)} className="flex flex-col gap-3.5 w-full">
              {steps.map((s) => (
                <div key={s.n} className="flex items-center gap-4 rounded-[12px] border border-line bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    {s.icon}
                  </span>
                  <span className="text-[15px] font-semibold text-ink leading-snug">{s.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: One Video Space */}
          <div className="lg:col-span-7 flex justify-center w-full">
            <motion.div
              {...rise(0.12)}
              className="relative rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(10,14,26,0.15)] aspect-[9/16] w-full max-w-[320px] md:max-w-[340px] bg-slate-900 border border-line"
            >
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/video/moments-reel.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <p className="text-[12px] font-semibold tracking-wider uppercase text-white/70 mb-1">Instant Share</p>
                <h3 className="text-[18px] font-bold leading-tight">Your Gameplay, Auto-Delivered</h3>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
