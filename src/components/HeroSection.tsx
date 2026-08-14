"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { useTranslation } from "@/lib/useTranslation";

export default function HeroSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lenis = (window as any).lenis;
      if (isOpen) {
        if (lenis) lenis.stop();
        document.body.style.overflow = "hidden";
      } else {
        if (lenis) lenis.start();
        document.body.style.overflow = "";
        setVideoLoaded(false);
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        const lenis = (window as any).lenis;
        if (lenis) lenis.start();
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22, filter: reduce ? "blur(0px)" : "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="hero"
      className="min-h-[100svh] lg:min-h-dvh relative hero-abyss flex flex-col justify-center overflow-hidden py-[28px] mb-[0px] lg:mb-0"
      aria-label="Hero"
    >
      {/* white LED grid lines + film grain */}
      <div className="hero-grid-dark" />
      <div className="grain-overlay" />

      {/* drifting glow */}
      <motion.div
        aria-hidden
        className="glow-orb"
        style={{ width: 460, height: 460, top: "10%", left: "30%", background: "rgba(111,155,239,0.35)" }}
        animate={reduce ? undefined : { x: [0, 24, 0], y: [0, -5, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Desktop view of the Hero Section layout */}
      <div className="hidden lg:flex max-w-[1440px] mx-auto w-full relative z-10 items-center justify-between px-6 xl:px-0 gap-16">
        {/* Left Column: Text column */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-start w-full lg:flex-1 lg:max-w-[660px] text-left"
        >
          <motion.p
            variants={item}
            className="text-[13px] lg:text-[20px] font-semibold tracking-[0.26em] text-white/55 uppercase mb-1"
          >
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="mb-6 relative z-10 flex justify-start w-full"
          >
            <Image
              src="/hero/hypergrid-logo.png"
              alt="HYPERGRID"
              width={624}
              height={117}
              priority
              className="w-[480px] lg:w-[680px] h-auto object-contain -ml-4"
            />
          </motion.h1>

          <motion.p
            variants={item}
            className="text-[24px] lg:text-[44px] font-medium text-white/100 leading-snug lg:leading-[1.18] mb-8 text-left max-w-[660px]"
            dangerouslySetInnerHTML={{ __html: t.hero.mobileDescription }}
          />

          <motion.div variants={item} className="flex items-center gap-4">
            <a
              href="#brochure-form"
              className="btn-glass-accent text-white font-semibold text-[18px] lg:text-[22px] px-8 py-4 rounded-xl flex items-center gap-2.5"
            >
              <motion.span
                className="flex items-center justify-center gap-2.5"
                animate={{ scale: [1, 1, 1.05, 1, 1] }}
                transition={{
                  times: [0, 0.14, 0.20, 0.26, 1.0],
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {t.hero.requestBrochure}
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.span>
            </a>
            <button
              onClick={() => setIsOpen(true)}
              className="btn-glass-light text-ink font-semibold text-[17px] lg:text-[21px] px-7 py-4 rounded-xl flex items-center gap-2.5 cursor-pointer"
            >
              {t.hero.watchVideo}
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4L12 8L6 12V4Z" fill="currentColor" />
              </svg>
            </button>
          </motion.div>

          {/* Stats row — desktop only */}
          <motion.div variants={item} className="flex items-stretch gap-5 mt-10 border-t border-white/10 pt-8 w-full">
            {[
              { value: "150+", label: t.hero.stats.venues },
              { value: "15+", label: t.hero.stats.countries },
              { value: t.hero.stats.fastestROIValue, label: t.hero.stats.fastestROI },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-white rounded-2xl py-4 px-5 flex flex-col justify-center items-center shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-w-[160px]"
              >
                <p className="text-[28px] lg:text-[36px] xl:text-[40px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center whitespace-nowrap">{value}</p>
                <p className="text-[13px] lg:text-[16px] font-bold text-[#8A95A5] mt-2 leading-tight text-center whitespace-nowrap">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: Hero Image */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 w-full lg:flex-1 lg:max-w-[884px]"
        >
          <motion.div variants={item} className="relative">
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Image
                src="/hero/hypergrid-hero.png"
                alt="HyperGrid — interactive LED-floor arcade attraction"
                width={1300}
                height={797}
                priority
                className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] scale-100 relative top-0"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Tablet view of the Hero Section layout (stacked vertically so image is below tagline with original size) */}
      <div className="hidden md:flex lg:hidden max-w-[1024px] mx-auto w-full relative z-10 flex-col items-start justify-start px-6 gap-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-start w-full text-left"
        >
          <motion.p
            variants={item}
            className="text-[16px] font-semibold tracking-[0.26em] text-white/55 uppercase mb-1"
          >
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="mb-4 relative z-10 flex justify-start w-full"
          >
            <Image
              src="/hero/hypergrid-logo.png"
              alt="HYPERGRID"
              width={624}
              height={117}
              priority
              className="w-[480px] h-auto object-contain -ml-3"
            />
          </motion.h1>

          <motion.p
            variants={item}
            className="text-[26px] font-medium text-white/100 leading-snug mb-4 text-left max-w-[720px]"
            dangerouslySetInnerHTML={{ __html: t.hero.mobileDescription }}
          />

          {/* Hero Image placed directly below the tagline with original/large size */}
          <motion.div variants={item} className="w-full my-4 flex justify-center">
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-[760px]"
            >
              <Image
                src="/hero/hypergrid-hero.png"
                alt="HyperGrid — interactive LED-floor arcade attraction"
                width={1300}
                height={797}
                priority
                className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] scale-100"
              />
            </motion.div>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-4 mt-2">
            <a
              href="#brochure-form"
              className="btn-glass-accent text-white font-semibold text-[18px] px-8 py-4 rounded-xl flex items-center gap-2.5"
            >
              <motion.span
                className="flex items-center justify-center gap-2.5"
                animate={{ scale: [1, 1, 1.05, 1, 1] }}
                transition={{
                  times: [0, 0.14, 0.20, 0.26, 1.0],
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {t.hero.requestBrochure}
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.span>
            </a>
            <button
              onClick={() => setIsOpen(true)}
              className="btn-glass-light text-ink font-semibold text-[17px] px-7 py-4 rounded-xl flex items-center gap-2.5 cursor-pointer"
            >
              {t.hero.watchVideo}
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4L12 8L6 12V4Z" fill="currentColor" />
              </svg>
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={item} className="flex items-stretch gap-4 mt-8 border-t border-white/10 pt-6 w-full justify-between">
            {[
              { value: "150+", label: t.hero.stats.venues },
              { value: "15+", label: t.hero.stats.countries },
              { value: t.hero.stats.fastestROIValue, label: t.hero.stats.fastestROI },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-white rounded-3xl py-5 px-6 flex flex-col justify-center items-center shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-black/5 flex-1 min-w-[160px]"
              >
                <p className="text-[34px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center whitespace-nowrap">{value}</p>
                <p className="text-[15px] font-bold text-[#8A95A5] mt-2 leading-tight text-center whitespace-nowrap">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile view of the Hero Section layout */}
      <div className="flex flex-col md:hidden w-full relative z-10 px-6 gap-8">
        {/* Text column */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-start w-full text-left"
        >
          <motion.p
            variants={item}
            className="text-[13px] font-semibold tracking-[0.26em] text-white/55 uppercase mb-0"
          >
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="mb-6 relative z-10 flex justify-start w-full"
          >
            <Image
              src="/hero/hypergrid-logo.png"
              alt="HYPERGRID"
              width={624}
              height={117}
              priority
              className="w-[364px] sm:w-[468px] h-auto object-contain -ml-2"
            />
          </motion.h1>


          <motion.p
            variants={item}
            className="text-[20px] sm:text-[18px] font-medium text-white/100 leading-snug mb-6 text-left"
            dangerouslySetInnerHTML={{ __html: t.hero.mobileDescription }}
          />
        </motion.div>

        {/* Hero Image Area with play button */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 w-full"
        >
          <motion.div variants={item} className="relative">
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Image
                src="/hero/hypergrid-hero.png"
                alt="HyperGrid — interactive LED-floor arcade attraction"
                width={1300}
                height={797}
                priority
                className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] scale-105 sm:scale-110 relative -top-3"
              />
            </motion.div>

            {/* Play Button Overlay for Mobile only */}
            <button
              onClick={() => setIsOpen(true)}
              className="absolute bottom-[12%] left-[0%] z-20 flex items-center justify-center w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 text-white shadow-[0_0_30px_rgba(29,108,239,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
              aria-label={t.hero.playVideo}
            >
              <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping opacity-85 pointer-events-none" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 rounded-full border border-[#1D6CEF]/50 animate-ping opacity-60 pointer-events-none" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
              <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-30 pointer-events-none" style={{ animationDuration: '2s', animationDelay: '1.2s' }} />
              <div className="absolute inset-1.5 rounded-full bg-[#1D6CEF]/40 blur-sm opacity-90 group-hover:bg-[#1D6CEF]/65 transition-colors duration-300" />
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white relative z-10 sm:w-[20px] sm:h-[20px] translate-x-0.5 transition-transform duration-300 group-hover:scale-105"
              >
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            </button>
          </motion.div>

          {/* Mobile-only Stats Grid matching mockup */}
          <motion.div
            variants={item}
            className="grid grid-cols-12 gap-2 mt-4 w-full"
          >
            {/* Row 1: Venues (col-3), Countries (col-3), ROI (col-6) */}
            <div className="col-span-3 bg-white rounded-2xl py-2.5 px-2 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <p className="text-[26px] sm:text-[22px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">150+</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">{t.hero.stats.venues}</p>
            </div>

            <div className="col-span-3 bg-white rounded-2xl py-2.5 px-2 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <p className="text-[26px] sm:text-[22px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">15+</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">{t.hero.stats.countries}</p>
            </div>

            <div className="col-span-6 bg-white rounded-xl py-2 px-3.5 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <p className="text-[26px] sm:text-[18px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">{t.hero.stats.avgPaybackValue}</p>
              <p className="text-[10px] sm:text-[10px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">{t.hero.stats.avgPayback}</p>
            </div>

            {/* Row 2: Gameplay (col-6), Players (col-3), Age (col-3) */}
            <div className="col-span-6 bg-white rounded-xl py-2 px-3.5 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <p className="text-[26px] sm:text-[18px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">{t.hero.stats.gameplayValue}</p>
              <p className="text-[10px] sm:text-[10px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">{t.hero.stats.gameplay}</p>
            </div>

            <div className="col-span-3 bg-white rounded-2xl py-2.5 px-2 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <p className="text-[26px] sm:text-[22px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">1-6</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">{t.hero.stats.players}</p>
            </div>

            <div className="col-span-3 bg-white rounded-2xl py-2.5 px-2 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <p className="text-[26px] sm:text-[22px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">4+</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">{t.hero.stats.age}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Video Reel Modal Pop-up */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[960px] aspect-video rounded-2xl overflow-hidden bg-black shadow-[0_30px_70px_rgba(0,0,0,0.8)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-50 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white transition-colors duration-200 cursor-pointer"
                aria-label={t.hero.closeVideo}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                  <svg className="animate-spin text-white/60" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Loading video">
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                    <path d="M20 4a16 16 0 0116 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
              )}
              <video
                src="/video/hypergrid-reel.mp4"
                className="w-full h-full object-contain"
                autoPlay
                controls
                playsInline
                onCanPlay={() => setVideoLoaded(true)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
