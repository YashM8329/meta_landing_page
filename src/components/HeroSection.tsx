"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";

export default function HeroSection() {
  const reduce = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

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
      className="min-h-[100svh] lg:min-h-dvh relative hero-abyss flex flex-col justify-start lg:justify-center overflow-hidden py-[28px] mb-[0px] lg:mb-0"
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

      <div className="max-w-[1440px] mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 xl:px-0 gap-0 lg:gap-16">
        {/* Text column */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-start w-full lg:flex-1 lg:max-w-[540px] text-left"
        >
          <motion.p
            variants={item}
            className="text-[13px] font-semibold tracking-[0.26em] text-white/55 uppercase mb-0"
          >
            FOG Technologies
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
              className="w-[364px] sm:w-[468px] md:w-[624px] h-auto object-contain -ml-[10px] sm:-ml-[24px] md:-ml-[32px]"
            />
          </motion.h1>

          {/* Subtitle / Eyebrow */}
          {/* <motion.p
            variants={item}
            className="text-[12px] sm:text-[14px] font-extrabold tracking-[0.2em] text-[#5b87f5] uppercase mb-5 w-full text-left"
          >
            WORLD&apos;S BEST ACTIVE SOCIAL ATTRACTION
          </motion.p> */}

          {/* Big Stacked Action Headlines */}
          <motion.div
            variants={item}
            className="flex flex-col text-[38px] sm:text-[56px] md:text-[68px] font-black tracking-tight leading-[1.02] uppercase mb-2 lg:mb-8 text-white w-full text-left"
          >
            <span>PLAY.</span>
            <span>COMPETE.</span>
            <span>CREATE</span>
            <span className="text-[#000000]">MOMENTS.</span>
          </motion.div>

          {/* CTA row — desktop only */}
          <motion.div variants={item} className="hidden lg:flex items-center gap-3">
            <a
              href="#brochure-form"
              className="btn-glass-accent text-white font-semibold text-[15px] px-7 py-3.5 rounded-lg flex items-center gap-2"
            >
              Request Brochure
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#gameplay-video"
              className="btn-glass-light text-ink font-semibold text-[15px] px-6 py-3.5 rounded-lg flex items-center gap-2"
            >
              Watch Video
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4L12 8L6 12V4Z" fill="currentColor" />
              </svg>
            </a>
          </motion.div>

          {/* Stats row — desktop only */}
          <motion.div variants={item} className="hidden lg:flex items-center gap-8 mt-10 border-t border-white/10 pt-8">
            {[
              { value: "100+", label: "Locations" },
              { value: "10+", label: "Countries" },
              { value: "3 months", label: "ROI" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-[26px] font-extrabold text-white leading-none tnum">{value}</p>
                <p className="text-[12px] text-white/50 font-medium mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

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
                unoptimized
                className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] scale-105 sm:scale-110 lg:scale-100 relative -top-3 lg:top-0"
              />
            </motion.div>

            {/* Premium Play Button Overlay at red circle location (Static, aligned with grid below) */}
            <button
              onClick={() => setIsOpen(true)}
              className="absolute bottom-[12%] left-[0%] z-20 flex items-center justify-center w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 text-white shadow-[0_0_30px_rgba(29,108,239,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
              aria-label="Play gameplay video"
            >
              {/* Wave 1: Close, bright white/blue wave */}
              <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping opacity-85 pointer-events-none" style={{ animationDuration: '2s' }} />
              {/* Wave 2: Middle, larger brand blue wave */}
              <div className="absolute inset-0 rounded-full border border-[#1D6CEF]/50 animate-ping opacity-60 pointer-events-none" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
              {/* Wave 3: Outer, faint white wave stretching far */}
              <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-30 pointer-events-none" style={{ animationDuration: '2s', animationDelay: '1.2s' }} />
              
              {/* Inner radial gradient glow */}
              <div className="absolute inset-1.5 rounded-full bg-[#1D6CEF]/40 blur-sm opacity-90 group-hover:bg-[#1D6CEF]/65 transition-colors duration-300" />
              
              {/* Play icon */}
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
            className="lg:hidden grid grid-cols-3 gap-2 sm:gap-3 -mt-3 w-full"
          >
            {/* Card 1: Venues */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col gap-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#ECEFFC] text-[#4f64b4] flex items-center justify-center flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#8A95A5]">VENUES</span>
              </div>
              <p className="text-[16px] sm:text-[20px] font-black text-[#0A0A0A] tracking-tight mt-0.5">100+</p>
            </div>

            {/* Card 2: Countries */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col gap-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#ECEFFC] text-[#4f64b4] flex items-center justify-center flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <span className="text-[8px] sm:text-[9.5px] font-extrabold uppercase tracking-wider text-[#8A95A5]">COUNTRIES</span>
              </div>
              <p className="text-[16px] sm:text-[20px] font-black text-[#0A0A0A] tracking-tight mt-0.5">10+</p>
            </div>

            {/* Card 3: Players */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col gap-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#ECEFFC] text-[#4f64b4] flex items-center justify-center flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#8A95A5]">PLAYERS</span>
              </div>
              <p className="text-[16px] sm:text-[20px] font-black text-[#0A0A0A] tracking-tight mt-0.5">1-6</p>
            </div>

            {/* Card 4: Gameplay */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col gap-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#ECEFFC] text-[#4f64b4] flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                </div>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#8A95A5]">GAMEPLAY</span>
              </div>
              <p className="text-[16px] sm:text-[20px] font-black text-[#0A0A0A] tracking-tight mt-0.5">3-6 mins</p>
            </div>

            {/* Card 5: Age */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col gap-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#ECEFFC] text-[#4f64b4] flex items-center justify-center flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#8A95A5]">AGE</span>
              </div>
              <p className="text-[16px] sm:text-[20px] font-black text-[#0A0A0A] tracking-tight mt-0.5">4+ years</p>
            </div>

            {/* Card 6: Area */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col gap-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#ECEFFC] text-[#4f64b4] flex items-center justify-center flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 3v18" strokeWidth="1.5" opacity="0.6" />
                    <path d="M3 9h18" strokeWidth="1.5" opacity="0.6" />
                  </svg>
                </div>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#8A95A5]">AREA</span>
              </div>
              <p className="text-[16px] sm:text-[20px] font-black text-[#0A0A0A] tracking-tight mt-0.5">25 sqm</p>
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
                aria-label="Close video pop-up"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <video
                src="/video/hypergrid-reel.mp4"
                className="w-full h-full object-contain"
                autoPlay
                controls
                playsInline
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
