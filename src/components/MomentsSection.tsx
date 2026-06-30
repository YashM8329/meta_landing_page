"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Typewriter from "./Typewriter";

const steps = [
  {
    n: "1",
    label: "Camera recording",
    sublabel: "Dual cameras record the action",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 lg:w-7 lg:h-7">
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    n: "2",
    label: "Instant QR Delivery",
    sublabel: "Players scan post-game",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 lg:w-7 lg:h-7">
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
    label: "Downloadable reels",
    sublabel: "Watermarked video goes viral",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 lg:w-7 lg:h-7">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    ),
  },
];

export default function MomentsSection({ cards }: { cards?: any } = {}) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch from browser extensions that inject around <video> tags.
  // Video src is set directly in JSX once mounted — no IntersectionObserver delay.
  useEffect(() => { setMounted(true); }, []);

  // Start playback as soon as the video element is in the DOM
  useEffect(() => {
    if (!mounted) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, [mounted]);

  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section
      id="moments-ai"
      className="min-h-0 lg:py-16 relative flex flex-col justify-center pt-8 pb-7 overflow-hidden"
      aria-label="Moments AI"
    >
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Title, Subtitle, and Horizontal Steps */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div {...rise()} className="mb-2 text-left">
              <h2 className="text-[clamp(32px,7vw,48px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink mb-0">
                Moments{" "}
                <Typewriter words={["Photos", "Videos"]} className="text-accent" />
              </h2>
              <p className="text-[16px] sm:text-[18px] font-medium text-ink-soft tracking-tight mt-3 max-w-[580px]">
                Turn player social reach into free marketing. Shared videos act as geo-branded ads driving new footfall to your FEC.
              </p>
            </motion.div>

            {/* Horizontal Timeline Steps */}
            <motion.div 
              {...rise(0.05)} 
              className="flex items-start justify-between w-full mt-5 md:mt-12 gap-2 lg:gap-6"
            >
              {steps.map((s, idx) => (
                <div key={s.n} className="flex-1 flex items-start">
                  <div className="flex flex-col items-center text-center w-full">
                    {/* Icon Square Wrapper */}
                    <div className="w-16 h-16 rounded-[18px] lg:w-24 lg:h-24 lg:rounded-[24px] bg-slate-900/5 border border-line text-ink flex items-center justify-center mb-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:bg-slate-900/10 hover:shadow-md transition-all duration-300">
                      {s.icon}
                    </div>
                    {/* Caption Labels */}
                    <p className="text-[13px] lg:text-[16px] font-bold text-ink leading-tight">
                      {s.label}
                    </p>
                    {/* <p className="text-[12px] lg:text-[14px] font-medium text-ink-soft leading-normal mt-0.5">
                      {s.sublabel}
                    </p> */}
                  </div>

                  {/* Flow Arrow (skip for final card) */}
                  {idx < steps.length - 1 && (
                    <div className="text-ink-faint flex items-center justify-center pt-5 lg:pt-9 px-1 sm:px-2 md:px-4 self-start">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 lg:w-6 lg:h-6">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Video in Classic Phone Frame mockup */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <motion.div
              {...rise(0.12)}
              className="relative mx-auto w-full max-w-[310px] sm:max-w-[325px] aspect-[9/18.5] rounded-[40px] bg-black pt-[44px] pb-[54px] px-[12px] ring-1 ring-white/10"
            >
              {/* Top Speaker Slot */}
              <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-16 h-1.5 bg-zinc-850 rounded-full" />

              {/* Inner Screen Viewport (Rectangular/Sharp corners) */}
              <div className="relative w-full h-full bg-slate-900 overflow-hidden border border-zinc-900/60">
                {mounted && (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/video/moments-reel.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}
                
                {/* Vignette bottom-glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Glassmorphic Download & Share Button Overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4 z-20">
                  <button className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#1D6CEF] to-[#2f74e6] text-white py-3 rounded-full text-[15px] font-extrabold tracking-wide shadow-[0_8px_24px_rgba(29,108,239,0.4)] border border-white/20">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download & Share</span>
                  </button>
                </div>
              </div>

              {/* Bottom Home Button */}
              <div className="absolute bottom-[9px] left-1/2 -translate-x-1/2 w-9 h-9 rounded-full border border-zinc-800 bg-black flex items-center justify-center">
                <div className="w-[30px] h-[30px] rounded-full border border-zinc-900 bg-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
