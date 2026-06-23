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
      className="min-h-dvh relative flex flex-col justify-center pt-24 pb-28 overflow-hidden [@media(max-height:900px)]:justify-start"
      aria-label="Key Features"
    >
      <div className="lg:max-w-7xl lg:mx-auto lg:px-16 xl:px-24 w-full">
        <motion.h2
          {...rise()}
          className="px-6 lg:px-0 mb-6 text-[clamp(32px,9vw,48px)] leading-[0.98] font-extrabold tracking-[-0.03em] text-ink"
        >
          Key Features
        </motion.h2>

        <div className="lg:px-0 px-0">
          <CardCarousel cards={cards} />
        </div>

        {/* Specs */}
        <motion.div {...rise(0.05)} className="px-6 lg:px-0 mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {specs.map((s) => (
            <div key={s.label} className="rounded-[12px] border border-line bg-white px-4 py-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                {s.icon}
                <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{s.label}</span>
              </div>
              <p className="text-[24px] font-extrabold tracking-[-0.02em] text-ink tnum">{s.value}</p>
            </div>
          ))}
          {/* Filler cards on desktop so specs row matches the 4-col grid above */}
          <div className="hidden lg:flex rounded-[12px] border border-line bg-white px-4 py-3.5 items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="#1D6CEF" strokeWidth="1.7" />
              <path d="M12 7v5l3 3" stroke="#1D6CEF" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Setup</p>
              <p className="text-[24px] font-extrabold tracking-[-0.02em] text-ink tnum">1 day</p>
            </div>
          </div>
          <div className="hidden lg:flex rounded-[12px] border border-line bg-white px-4 py-3.5 items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#1D6CEF" strokeWidth="1.7" strokeLinecap="round" />
              <circle cx="9" cy="7" r="4" stroke="#1D6CEF" strokeWidth="1.7" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#1D6CEF" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Players</p>
              <p className="text-[24px] font-extrabold tracking-[-0.02em] text-ink tnum">1–6</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
