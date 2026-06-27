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
              className="w-[624px] h-auto object-contain -ml-4"
            />
          </motion.h1>

          <motion.div
            variants={item}
            className="flex flex-col text-[68px] font-black tracking-tight leading-[1.02] uppercase mb-8 text-white w-full text-left"
          >
            <span>ATTRACT.</span>
            <span>MAXIMUM</span>
            <span>REVENUE.</span>
            <span className="text-[#000000]">ZERO STAFF.</span>
          </motion.div>

          {/* CTA row — desktop only */}
          <motion.div variants={item} className="flex items-center gap-3">
            <a
              href="#brochure-form"
              className="btn-glass-accent text-white font-semibold text-[15px] px-7 py-3.5 rounded-lg flex items-center gap-2"
            >
              Request Brochure
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <button
              onClick={() => setIsOpen(true)}
              className="btn-glass-light text-ink font-semibold text-[15px] px-6 py-3.5 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              Watch Video
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4L12 8L6 12V4Z" fill="currentColor" />
              </svg>
            </button>
          </motion.div>

          {/* Stats row — desktop only */}
          <motion.div variants={item} className="flex items-center gap-4 mt-10 border-t border-white/10 pt-8 w-full">
            {[
              { value: "100+", label: "Locations" },
              { value: "10+", label: "Countries" },
              { value: "3 months", label: "ROI" },
            ].map(({ value, label }) => (
              <div 
                key={label}
                className="bg-white rounded-2xl py-3 px-5 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-w-[140px]"
              >
                <p className="text-[26px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">{value}</p>
                <p className="text-[11px] font-bold text-[#8A95A5] mt-1.5 leading-tight text-center">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: Hero Image (No play button overlay) */}
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

      {/* Mobile view of the Hero Section layout */}
      <div className="flex flex-col lg:hidden w-full relative z-10 px-6 gap-8">
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
              className="w-[364px] sm:w-[468px] h-auto object-contain -ml-2"
            />
          </motion.h1>

          <motion.div
            variants={item}
            className="flex flex-col text-[38px] sm:text-[56px] font-black tracking-tight leading-[1.02] uppercase mb-6 text-white w-full text-left"
          >
            <span>ATTRACT.</span>
            <span>MAXIMUM REVENUE.</span>
            <span></span>
            <span className="text-[#000000]">ZERO STAFF.</span>
          </motion.div>
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
              aria-label="Play gameplay video"
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
              <p className="text-[26px] sm:text-[22px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">100+</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">Venues</p>
            </div>

            <div className="col-span-3 bg-white rounded-2xl py-2.5 px-2 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <p className="text-[26px] sm:text-[22px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">10+</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">Countries</p>
            </div>

            <div className="col-span-6 bg-white rounded-xl py-2 px-3.5 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <p className="text-[26px] sm:text-[18px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">3 months</p>
              <p className="text-[10px] sm:text-[10px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">ROI</p>
            </div>

            {/* Row 2: Gameplay (col-6), Players (col-3), Age (col-3) */}
            <div className="col-span-6 bg-white rounded-xl py-2 px-3.5 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <p className="text-[20px] sm:text-[18px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">3-6 Min</p>
              <p className="text-[9px] sm:text-[10px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">Gameplay</p>
            </div>

            <div className="col-span-3 bg-white rounded-2xl py-2.5 px-2 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <p className="text-[20px] sm:text-[22px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">1-6</p>
              <p className="text-[9px] sm:text-[11px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">Players</p>
            </div>

            <div className="col-span-3 bg-white rounded-2xl py-2.5 px-2 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <p className="text-[26px] sm:text-[22px] font-black text-[#0A0A0A] tracking-tighter leading-none text-center">4+</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-[#8A95A5] mt-1 leading-tight text-center">Age</p>
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
