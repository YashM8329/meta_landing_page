"use client";

import { motion, useReducedMotion } from "framer-motion";
import CardCarousel, { CarouselCard } from "./CardCarousel";

const specs = [
  {
    label: "Area",
    value: "25 sqm",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#1D6CEF" strokeWidth="1.7" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="#1D6CEF" strokeWidth="1.1" opacity="0.5" />
      </svg>
    ),
  },
  {
    label: "Power",
    value: "2.5 kW",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="#1D6CEF" strokeWidth="1.7" strokeLinejoin="round" />
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
      className="snap-start min-h-dvh relative flex flex-col justify-center pt-24 pb-28 overflow-hidden [@media(max-height:900px)]:justify-start"
      aria-label="Key Features"
    >
      <motion.h2
        {...rise()}
        className="px-6 mb-6 text-[clamp(32px,9vw,44px)] leading-[0.98] font-extrabold tracking-[-0.03em] text-ink"
      >
        Key Features
      </motion.h2>

      <CardCarousel cards={cards} />

      {/* Specs — 1 row × 2 */}
      <motion.div {...rise(0.05)} className="px-6 mt-6 grid grid-cols-2 gap-3">
        {specs.map((s) => (
          <div key={s.label} className="rounded-[12px] border border-line bg-white px-4 py-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              {s.icon}
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{s.label}</span>
            </div>
            <p className="text-[24px] font-extrabold tracking-[-0.02em] text-ink tnum">{s.value}</p>
          </div>
        ))}
      </motion.div>

    </section>
  );
}
