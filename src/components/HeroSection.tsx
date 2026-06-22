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
      className="snap-start min-h-dvh relative hero-abyss flex flex-col items-center justify-center text-center px-6 pt-16 pb-28 overflow-hidden"
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

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center w-full"
      >
        <motion.p
          variants={item}
          className="text-[13px] font-semibold tracking-[0.26em] text-white/55 uppercase mb-3"
        >
          FOG Technologies
        </motion.p>

        <motion.h1
          variants={item}
          className="font-mugen font-extrabold text-[clamp(36px,12vw,62px)] leading-[0.9] tracking-[-0.01em] text-white"
        >
          HYPERGRID
        </motion.h1>

        {/* Product render (transparent PNG): outer = entrance, inner = gentle float */}
        <motion.div variants={item} className="w-full mt-6">
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
