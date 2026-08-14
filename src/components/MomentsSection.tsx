"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Typewriter from "./Typewriter";
import MobileBrochureCTA from "./MobileBrochureCTA";
import { useTranslation } from "@/lib/useTranslation";
import { useVideoLoad } from "@/lib/VideoLoadContext";

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
    label: "Scan QR post game",
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
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  // Merge translated labels into the icon-only steps array
  const translatedSteps = steps.map((s, i) => ({
    ...s,
    label: t.moments.steps[i]?.label ?? s.label,
    desc: t.moments.steps[i]?.desc ?? s.desc,
  }));
  const videoRef = useRef<HTMLVideoElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSoundToast, setShowSoundToast] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const { reportStalling, reportPlaying } = useVideoLoad();
  const MOMENTS_VIDEO_ID = "moments-reel";

  // Prevent hydration mismatch from browser extensions that inject around <video> tags.
  useEffect(() => {
    setMounted(true);
    setIsTouchDevice(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
    return () => { reportPlaying(MOMENTS_VIDEO_ID); };
  }, []);

  // Handle playback & audio control based on isMuted state
  useEffect(() => {
    if (!mounted) return;
    const v = videoRef.current;
    if (!v) return;

    v.muted = isMuted;
    const promise = v.play();
    if (promise !== undefined) {
      promise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          // If browser autoplay policy delays unmuted audio until user interaction,
          // listen for user gesture to play audio
          if (!isMuted) {
            const handleGesture = () => {
              if (videoRef.current && !videoRef.current.muted) {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
              }
              window.removeEventListener("pointerdown", handleGesture);
              window.removeEventListener("touchstart", handleGesture);
            };
            window.addEventListener("pointerdown", handleGesture, { once: true });
            window.addEventListener("touchstart", handleGesture, { once: true });
          }
        });
    }
  }, [mounted, isMuted]);

  const toggleMute = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);

      setShowSoundToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setShowSoundToast(false);
      }, 1000);
    }
  };

  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section
      id="moments-ai"
      className="min-h-0 lg:py-10 relative flex flex-col justify-center pt-8 pb-7 overflow-hidden"
      aria-label="Moments AI"
    >
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Title, Subtitle, and Horizontal Steps */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div {...rise()} className="mb-2 text-left">
              <h2 className="text-[clamp(32px,7vw,48px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink mb-0">
                {t.moments.headingPrefix}{" "}
                <Typewriter words={t.moments.headingWords as unknown as string[]} className="text-accent" />
              </h2>
              <p className="text-[16px] sm:text-[18px] lg:text-[26px] font-medium text-ink-soft tracking-tight mt-3 max-w-[700px]">
                {t.moments.subtitle}
              </p>
            </motion.div>

            {/* Horizontal Timeline Steps (Responsive across Mobile and Desktop) */}
            <motion.div 
              {...rise(0.05)} 
              className="flex items-start justify-between w-full mt-4 md:mt-12 gap-0 md:gap-0"
            >
              {translatedSteps.map((s, idx) => (
                <div key={s.n} className="flex-1 flex items-start gap-1 md:gap-2">
                  <div className="flex flex-col items-center w-full">
                    {/* Step bubble (desktop only) */}
                    <div className="hidden md:flex w-6 h-6 lg:w-9 lg:h-9 rounded-full bg-[#1D6CEF] items-center justify-center text-white text-[11px] lg:text-[16px] font-extrabold mb-3.5 shadow-sm">
                      {s.n}
                    </div>
                    {/* Card container */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 rounded-xl md:rounded-2xl bg-white border border-line flex items-center justify-center shadow-[0_8px_30px_rgba(10,14,26,0.03)] hover:shadow-lg transition-shadow duration-300 mb-2 md:mb-4">
                      {/* Scaled icons on mobile */}
                      <div className="scale-[1.3] md:scale-100 flex items-center justify-center">
                        {s.icon}
                      </div>
                    </div>
                    {/* Label */}
                    <p className="text-[16px] sm:text-[13px] md:text-[16px] lg:text-[24px] font-extrabold text-ink leading-tight text-center">
                      {s.label}
                    </p>
                  </div>

                  {/* Dotted Arrow */}
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

            {/* Connecting U-line under the steps (mobile view only) */}
            <div className="relative w-full h-12 mt-2 lg:hidden">
              <div className="absolute top-0 left-[16.6%] right-[16.6%] h-6 border-b-2 border-x-2 border-[#1D6CEF]/30 rounded-b-2xl" />
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

              {/* Inner Screen Viewport - Instagram Style click to toggle mute */}
              <div 
                className="relative w-full h-full bg-slate-900 overflow-hidden border border-zinc-900/60 cursor-pointer group select-none"
                onClick={toggleMute}
              >
                {!isPlaying && !hasError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 pointer-events-none">
                    <svg className="animate-spin text-white/60" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Loading video">
                      <circle cx="20" cy="20" r="16" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                      <path d="M20 4a16 16 0 0116 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                {hasError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 pointer-events-none gap-2">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-white/50 text-[11px] font-medium">Video unavailable</p>
                  </div>
                )}
                {mounted && (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/video/moments-reel.mp4"
                    poster="/video/posters/moments-reel.jpg"
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    onPlay={() => { setIsPlaying(true); setHasError(false); reportPlaying(MOMENTS_VIDEO_ID); }}
                    onPlaying={() => { setIsPlaying(true); setHasError(false); reportPlaying(MOMENTS_VIDEO_ID); }}
                    onPause={() => setIsPlaying(false)}
                    onWaiting={() => { setIsPlaying(false); reportStalling(MOMENTS_VIDEO_ID); }}
                    onStalled={() => { setIsPlaying(false); reportStalling(MOMENTS_VIDEO_ID); }}
                    onError={() => { setIsPlaying(false); setHasError(true); reportPlaying(MOMENTS_VIDEO_ID); }}
                  />
                )}
                
                {/* Vignette bottom-glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Mute indicator + tap hint — visible only when muted */}
                <AnimatePresence>
                  {isMuted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-20 right-3 z-20 flex flex-col items-center gap-1 pointer-events-none"
                    >
                      <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-lg">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" fillOpacity="0.3" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      </div>
                      <span className="text-white text-[9px] font-semibold leading-tight bg-black/50 backdrop-blur-sm rounded px-1.5 py-0.5 whitespace-nowrap">
                        {isTouchDevice ? t.moments.tapToUnmute : t.moments.clickToUnmute}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Animated Center Toast overlay on mute/unmute */}
                <AnimatePresence>
                  {showSoundToast && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/75 backdrop-blur-md border border-white/20 flex items-center justify-center text-white z-30 pointer-events-none shadow-2xl"
                    >
                      {isMuted ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" fillOpacity="0.2" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" fillOpacity="0.2" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* In-video UI chip — reads as part of the video content, not a page button */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4 z-20 pointer-events-none select-none">
                  <div className="w-full flex items-center justify-center gap-2.5 bg-white/15 backdrop-blur-md text-white py-3 rounded-full text-[15px] font-extrabold tracking-wide border border-white/20 opacity-80">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>{t.moments.downloadShare}</span>
                  </div>
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
