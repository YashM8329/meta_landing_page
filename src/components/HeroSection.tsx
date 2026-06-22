"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export default function HeroSection() {
  const reduce = useReducedMotion();

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
      className="snap-start min-h-dvh relative hero-abyss flex flex-col lg:flex-row items-center justify-center lg:justify-between text-center lg:text-left px-6 lg:px-16 xl:px-24 pt-20 pb-28 lg:py-16 overflow-hidden gap-6 lg:gap-16"
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
        animate={reduce ? undefined : { x: [0, 24, 0], y: [0, -18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Text column */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center lg:items-start w-full lg:flex-1 lg:max-w-[540px]"
      >
        <motion.p
          variants={item}
          className="text-[13px] font-semibold tracking-[0.26em] text-white/55 uppercase mb-3"
        >
          FOG Technologies
        </motion.p>

        <motion.h1
          variants={item}
          className="font-mugen font-extrabold text-[clamp(36px,12vw,72px)] leading-[0.88] tracking-[-0.01em] text-white mb-4"
        >
          HYPERGRID
        </motion.h1>

        {/* Subtitle — desktop only */}
        <motion.p
          variants={item}
          className="hidden lg:block text-[17px] text-white/60 leading-relaxed max-w-[420px] mb-8"
        >
          The world&apos;s first unmanned, multiplayer LED-floor arena. A turnkey active attraction that earns revenue from day one.
        </motion.p>

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
            { value: "88+", label: "Games outperformed" },
            { value: "2.6 mo", label: "Avg payback" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-[26px] font-extrabold text-white leading-none tnum">{value}</p>
              <p className="text-[12px] text-white/50 font-medium mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Product image column */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full lg:flex-1 lg:max-w-[680px]"
      >
        <motion.div variants={item}>
          <motion.div
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/hero/hypergrid-hero.png"
              alt="HyperGrid — interactive LED-floor arcade attraction"
              width={1300}
              height={797}
              priority
              unoptimized
              className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
