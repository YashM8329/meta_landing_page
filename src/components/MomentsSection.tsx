"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Typewriter from "./Typewriter";
import MobileBrochureCTA from "./MobileBrochureCTA";

const steps = [
  {
    n: "1",
    label: "Camera Records",
    desc: "We capture epic player moments",
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-20 md:h-20 object-contain">
        {/* Camera base / body */}
        <rect x="18" y="24" width="34" height="22" rx="4" fill="url(#camBody)" />
        {/* Top handle */}
        <path d="M26 24V20C26 19.4477 26.4477 19 27 19H41C41.5523 19 42 19.4477 42 20V24" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />
        {/* Battery/attachment on back */}
        <rect x="46" y="27" width="5" height="15" rx="1.5" fill="#3f3f46" />
        {/* Lens cylinder */}
        <rect x="8" y="27" width="10" height="16" rx="2" fill="#18181b" />
        {/* Lens rim / reflection */}
        <circle cx="13" cy="35" r="6" fill="url(#lensGlass)" />
        <circle cx="11" cy="33" r="2" fill="#fff" opacity="0.8" />
        {/* Red REC text and dot below */}
        <circle cx="24" cy="41" r="2" fill="#ef4444" className="animate-pulse" />
        <text x="29" y="43" fill="#ffffff" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">REC</text>

        <defs>
          <linearGradient id="camBody" x1="18" y1="24" x2="52" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>
          <radialGradient id="lensGlass" cx="13" cy="35" r="6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="70%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </radialGradient>
        </defs>
      </svg>
    ),
  },
  {
    n: "2",
    label: "Instant QR",
    desc: "Players scan to get their video instantly",
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-20 md:h-20 object-contain text-accent">
        {/* Corner Brackets */}
        <path d="M12 18V12H18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M52 18V12H46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 46V52H18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M52 46V52H46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* QR Code grid representation */}
        <rect x="18" y="18" width="8" height="8" stroke="#18181b" strokeWidth="2.5" fill="none" />
        <rect x="21" y="21" width="2" height="2" fill="#18181b" />
        <rect x="38" y="18" width="8" height="8" stroke="#18181b" strokeWidth="2.5" fill="none" />
        <rect x="41" y="21" width="2" height="2" fill="#18181b" />
        <rect x="18" y="38" width="8" height="8" stroke="#18181b" strokeWidth="2.5" fill="none" />
        <rect x="21" y="41" width="2" height="2" fill="#18181b" />
        
        {/* Random code bits */}
        <rect x="30" y="20" width="4" height="2.5" fill="#18181b" />
        <rect x="30" y="25" width="2.5" height="4" fill="#18181b" />
        <rect x="20" y="30" width="4" height="2.5" fill="#18181b" />
        <rect x="27" y="30" width="2.5" height="2.5" fill="#18181b" />
        <rect x="32" y="30" width="6" height="4" fill="#18181b" />
        <rect x="40" y="30" width="2.5" height="6" fill="#18181b" />
        <rect x="30" y="38" width="4" height="2.5" fill="#18181b" />
        <rect x="36" y="38" width="2.5" height="8" fill="#18181b" />
        <rect x="30" y="43" width="4" height="2.5" fill="#18181b" />
        <rect x="41" y="41" width="4" height="2.5" fill="#18181b" />
        <rect x="41" y="46" width="2.5" height="4" fill="#18181b" />
        <rect x="45" y="44" width="2.5" height="2.5" fill="#18181b" />
      </svg>
    ),
  },
  {
    n: "3",
    label: "Download & Share",
    desc: "They download and share with the world",
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-20 md:h-20 object-contain text-accent">
        {/* Tray */}
        <path d="M16 38V44C16 46.2091 17.7909 48 20 48H44C46.2091 48 48 46.2091 48 44V38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        {/* Up Arrow */}
        <path d="M32 40V16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <polyline points="22 26 32 16 42 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Title, Subtitle, and Horizontal Steps */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div {...rise()} className="mb-2 text-left">
              <h2 className="text-[clamp(32px,7vw,48px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink mb-0">
                Gameplay{" "}
                <Typewriter words={["Photos", "Videos"]} className="text-accent" />
              </h2>
              <p className="text-[16px] sm:text-[18px] font-medium text-ink-soft tracking-tight mt-3 max-w-[580px]">
                Turn player social reach into free marketing.
              </p>
            </motion.div>            {/* Horizontal Timeline Steps (Responsive across Mobile and Desktop) */}
            <motion.div 
              {...rise(0.05)} 
              className="flex items-start justify-between w-full mt-4 md:mt-12 gap-0 md:gap-0"
            >
              {steps.map((s, idx) => (
                <div key={s.n} className="flex-1 flex items-start gap-1 md:gap-2">
                  <div className="flex flex-col items-center w-full">
                    {/* Step bubble (desktop only) */}
                    <div className="hidden md:flex w-6 h-6 rounded-full bg-[#1D6CEF] items-center justify-center text-white text-[11px] font-extrabold mb-3.5 shadow-sm">
                      {s.n}
                    </div>
                    {/* Card container */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 rounded-xl md:rounded-2xl bg-white border border-line flex items-center justify-center shadow-[0_8px_30px_rgba(10,14,26,0.03)] hover:shadow-lg transition-shadow duration-300 mb-2 md:mb-4">
                      {/* Scaled icons on mobile (2x visual boost vs previous scale-0.7) */}
                      <div className="scale-[1.3] md:scale-100 flex items-center justify-center">
                        {s.icon}
                      </div>
                    </div>
                    {/* Label */}
                    <p className="text-[16px] sm:text-[13px] md:text-[16px] font-extrabold text-ink leading-tight text-center">
                      {s.label}
                    </p>
                    {/* Accent divider line */}
                    {/* <div className="w-5 md:w-6 h-0.5 bg-[#1D6CEF] mx-auto mt-2 mb-2.5 md:mb-3 rounded-full" /> */}
                    {/* Description */}
                    {/* <p className="text-[9.5px] sm:text-[11.5px] md:text-[13px] font-semibold text-ink-soft leading-normal max-w-[85px] sm:max-w-[120px] md:max-w-[170px] mx-auto">
                      {s.desc}
                    </p> */}
                  </div>
                         {/* Dotted Arrow (centered on mobile, padded on desktop) */}
                  {idx < steps.length - 1 && (
                    <div className="flex text-[#1D6CEF] items-center justify-center h-20 sm:h-24 md:h-36 px-0.5 md:px-1 flex-shrink-0 md:pt-10">
                      <svg width="40" height="14" viewBox="0 0 40 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 sm:w-8 md:w-12 h-auto">
                        <path d="M2 7H30" stroke="#1D6CEF" strokeWidth="2.5" strokeDasharray="3.5 3.5" strokeLinecap="round" />
                        <path d="M30 7L24 2M30 7L24 12" stroke="#1D6CEF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
        
            {/* Connecting U-line under the steps (visible on both mobile and desktop) */}
            <div className="relative w-full h-12 mt-2">
              {/* U-shaped connection path */}
              <div className="absolute top-0 left-[16.6%] right-[16.6%] h-6 border-b-2 border-x-2 border-[#1D6CEF]/30 rounded-b-2xl" />
              {/* Animated Central Arrow Circle pointing down to the preview phone frame */}
              <motion.div 
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#1D6CEF] flex items-center justify-center text-white shadow-md z-10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </motion.div>
            </div>
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
      <MobileBrochureCTA />
    </section>
  );
}
