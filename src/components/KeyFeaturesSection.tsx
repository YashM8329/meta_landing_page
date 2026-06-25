"use client";

import { motion, useReducedMotion } from "framer-motion";
import CardCarousel, { CarouselCard } from "./CardCarousel";

const specs = [
  {
    label: "Area",
    value: "25 sqm",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  },
  {
    label: "Gameplay",
    value: "3-6 mins",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    label: "Age",
    value: "4+ years",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Players",
    value: "1 - 6",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function KeyFeaturesSection({ cards }: { cards: CarouselCard[] }) {
  const reduce = useReducedMotion();
  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section
      id="features"
      className="min-h-0 lg:py-16 relative flex flex-col justify-center pt-8 pb-7 overflow-hidden"
      aria-label="Key Features"
    >
      <div className="max-w-[1440px] mx-auto w-full px-6">
        <motion.h2
          {...rise()}
          className="mb-8 text-[clamp(32px,9vw,48px)] leading-[0.98] font-extrabold tracking-[-0.03em] text-ink"
        >
          Key Features
        </motion.h2>

        <div className="w-full">
          <CardCarousel cards={cards} />
        </div>

        {/* Specs Grid */}
        {/* <motion.div 
          {...rise(0.05)} 
          className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full"
        >
          {specs.map((s) => (
            <div 
              key={s.label} 
              className="group rounded-[18px] border border-line bg-white/70 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_15px_45px_rgba(29,108,239,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Row: Icon + Label */}
              {/* <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                  {s.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint">
                  {s.label}
                </span>
              </div> */}
              
              {/* Bottom Value */}
              {/* <p className="text-[26px] font-black tracking-tight text-ink tnum mt-4">
                {s.value}
              </p> */}
            {/* </div> */}
          {/* ))} */}
        {/* </motion.div> */}
      </div>
    </section>
  );
}
