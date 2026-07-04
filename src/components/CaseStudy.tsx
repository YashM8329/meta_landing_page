"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCurrency } from "@/lib/useCurrency";

// Lucide icon approximations
const GamepadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" />
    <line x1="18" y1="11" x2="18.01" y2="11" />
    <rect x="2" y="6" width="20" height="12" rx="3" />
  </svg>
);

const TrendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
    <path d="M15 9h4v4" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
    <path d="M12 2a6 6 0 0 1 6 6v1a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

interface ChainData {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  pricePerPlayUsd: number;
  revenuePerMonthUsd: number;
  paybackMonths: number;
  avgPlays: number;
  avgRevenueUsd: number;
  roiSummary: string;
  weeksData: { label: string; revUsd: number; plays: number }[];
}

const CHAINS_DATA: ChainData[] = [
  {
    id: "texas",
    name: "Texas FEC Chain",
    shortName: "Texas",
    subtitle: "#1 game every single week.",
    pricePerPlayUsd: 5,
    revenuePerMonthUsd: 24800,
    paybackMonths: 3,
    avgPlays: 1110,
    avgRevenueUsd: 5720,
    roiSummary: "3x",
    weeksData: [
      { label: "Week 1", revUsd: 4530, plays: 906 },
      { label: "Week 2", revUsd: 6115, plays: 1223 },
      { label: "Week 3", revUsd: 5895, plays: 1179 },
      { label: "Week 4", revUsd: 7425, plays: 1485 },
      { label: "Week 5", revUsd: 4175, plays: 835 },
      { label: "Week 6", revUsd: 5225, plays: 1050 },
      { label: "Week 7", revUsd: 5455, plays: 1091 },
    ],
  },
  {
    id: "uk",
    name: "UK FEC Chain",
    shortName: "UK",
    subtitle: "Consistently outperforming expectations.",
    pricePerPlayUsd: 6,
    revenuePerMonthUsd: 14100,
    paybackMonths: 4,
    avgPlays: 542,
    avgRevenueUsd: 3252,
    roiSummary: "2.5x",
    weeksData: [
      { label: "Week 1", revUsd: 3528, plays: 588 },
      { label: "Week 2", revUsd: 3474, plays: 579 },
      { label: "Week 3", revUsd: 2838, plays: 473 },
      { label: "Week 4", revUsd: 3168, plays: 528 },
    ],
  },
  {
    id: "new-york",
    name: "New york FEC Chain",
    shortName: "New york",
    subtitle: "High density traffic, record payback.",
    pricePerPlayUsd: 5,
    revenuePerMonthUsd: 28500,
    paybackMonths: 2,
    avgPlays: 1420,
    avgRevenueUsd: 7000,
    roiSummary: "4x",
    weeksData: [
      { label: "Week 1", revUsd: 2830, plays: 566 },
      { label: "Week 2", revUsd: 6875, plays: 1375 },
      { label: "Week 3", revUsd: 8765, plays: 1753 },
      { label: "Week 4", revUsd: 5750, plays: 1150 },
      { label: "Week 5", revUsd: 6575, plays: 1315 },
      { label: "Week 6", revUsd: 7245, plays: 1449 },
      { label: "Week 7", revUsd: 8005, plays: 1601 },
    ],
  },
];

export default function CaseStudy() {
  const reduce = useReducedMotion();
  const { symbol, rate } = useCurrency();
  const [activeTab, setActiveTab] = useState(0);

  const activeChain = CHAINS_DATA[activeTab];

  const formatPrice = (usd: number): string => {
    const v = Math.round(usd * rate);
    return `${symbol}${v.toLocaleString()}`;
  };

  const formatMonthRev = (usd: number): string => {
    const v = Math.round(usd * rate);
    if (v >= 1_000_000) {
      const millions = Number((v / 1_000_000).toFixed(1));
      return `${symbol}${millions}M`;
    }
    return `${symbol}${v.toLocaleString()}`;
  };

  const formatWeekRev = (usd: number): string => {
    const v = Math.round(usd * rate);
    if (v >= 1_000_000) {
      const millions = Number((v / 1_000_000).toFixed(1));
      return `${symbol}${millions}M`;
    }
    return `${symbol}${v.toLocaleString()}`;
  };

  const formatAvgRev = (usd: number): string => {
    const v = Math.round(usd * rate);
    if (v >= 1_000_000) {
      const millions = Number((v / 1_000_000).toFixed(1));
      return `${symbol}${millions}M`;
    }
    return `${symbol}${v.toLocaleString()}`;
  };

  const summary = [
    { label: "Price / play", value: formatPrice(activeChain.pricePerPlayUsd) },
    { label: "Revenue / month", value: formatMonthRev(activeChain.revenuePerMonthUsd) },
    { label: "Payback (ROI)", value: `${activeChain.paybackMonths} months` },
  ];

  const maxWeeklyRev = Math.max(...activeChain.weeksData.map((w) => w.revUsd));

  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section
      id="case-study"
      className="min-h-0 lg:py-12 relative flex flex-col justify-center pt-6 pb-7 overflow-hidden animate-fade-up"
      aria-label="FEC Case Studies"
    >
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0">
        {/* Eyebrow and Title */}
        <motion.div {...rise()} className="mb-6">
          {/* <p className="text-[11px] font-extrabold tracking-[0.2em] text-accent uppercase mb-2">Case Studies</p> */}
          <h2 className="text-[clamp(32px,5.5vw,48px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink mb-3">
            Proven Performance. <br className="md:hidden" /> Across Locations.
          </h2>
          <p className="text-[15px] sm:text-[16px] text-ink-soft font-medium leading-relaxed max-w-[450px]">
            Explore real-world results from top-performing FECs.
          </p>
        </motion.div>

        {/* Tab Cards Selection */}
        <motion.div {...rise(0.04)} className="grid grid-cols-3 gap-3 mb-8 max-w-[640px]">
          {CHAINS_DATA.map((chain, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={chain.id}
                onClick={() => setActiveTab(idx)}
                className={`flex flex-col items-center justify-center py-6 px-3 rounded-2xl transition-all duration-300 border text-center cursor-pointer select-none ${
                  isActive
                    ? "border-accent bg-white shadow-sm ring-1 ring-accent/15"
                    : "border-line bg-white/50 hover:bg-white text-ink-soft"
                }`}
              >
                <span className={`text-[16px] sm:text-[20px] font-extrabold leading-none transition-colors duration-200 ${isActive ? "text-accent" : "text-ink"}`}>
                  {chain.shortName}
                </span>
                <span className="text-[10px] sm:text-[11px] text-ink-soft mt-2 leading-none font-semibold">
                  FEC Chain
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Mobile View Card Container */}
        <div className="block lg:hidden">
          <motion.div
            key={`mobile-card-${activeTab}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white rounded-[24px] border border-line overflow-hidden shadow-[0_8px_30px_rgba(10,14,26,0.04)]"
          >
            {/* Inner Padding container */}
            <div className="p-6">
              <h3 className="text-[22px] font-extrabold tracking-[-0.02em] text-ink">
                {activeChain.name}
              </h3>
              <p className="text-[14px] font-semibold text-accent mt-1 mb-6">
                {activeChain.subtitle}
              </p>

              {/* Three Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center mb-6">
                {/* Metric 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 bg-accent/5 flex items-center justify-center rounded-full text-accent mb-2">
                    <GamepadIcon className="w-5 h-5" />
                  </div>
                  <span className="text-[17px] font-extrabold text-accent leading-none">
                    {formatPrice(activeChain.pricePerPlayUsd)}
                  </span>
                  <span className="text-[11px] font-semibold text-ink-soft mt-1.5 leading-tight">
                    Price / play
                  </span>
                </div>

                {/* Metric 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 bg-accent/5 flex items-center justify-center rounded-full text-accent mb-2">
                    <TrendIcon className="w-5 h-5" />
                  </div>
                  <span className="text-[17px] font-extrabold text-accent leading-none">
                    {formatMonthRev(activeChain.revenuePerMonthUsd)}
                  </span>
                  <span className="text-[11px] font-semibold text-ink-soft mt-1.5 leading-tight">
                    Revenue / month
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 bg-accent/5 flex items-center justify-center rounded-full text-accent mb-2">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <span className="text-[17px] font-extrabold text-accent leading-none">
                    {activeChain.paybackMonths} months
                  </span>
                  <span className="text-[11px] font-semibold text-ink-soft mt-1.5 leading-tight">
                    Payback (ROI)
                  </span>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-t border-line my-6" />

              {/* Week-on-week Table */}
              <div className="flex flex-col gap-4 mb-6">
                {activeChain.weeksData.map((week) => {
                  const widthPct = (week.revUsd / maxWeeklyRev) * 100;
                  return (
                    <div key={week.label} className="flex items-center justify-between gap-4">
                      <span className="text-[13px] font-semibold text-ink-soft w-14 shrink-0">
                        {week.label}
                      </span>
                      <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                      <span className="text-[13px] font-extrabold text-ink w-[96px] text-right tnum">
                        {formatWeekRev(week.revUsd)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Tinted Container */}
            <div className="bg-[#F8FAFC] border-t border-line p-6">
              {/* Summary Stats Row */}
              <div className="grid grid-cols-3 gap-2 text-center mb-6">
                {/* Summary Stat 1 */}
                <div className="flex flex-col items-center">
                  <UsersIcon className="w-8 h-8 text-accent mb-2 filter drop-shadow-[0_0_4px_rgba(29,108,239,0.25)]" />
                  <span className="text-[20px] sm:text-[22px] font-black text-ink leading-tight">
                    {activeChain.avgPlays.toLocaleString()}
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-bold text-ink-soft mt-1">
                    Avg. Plays
                  </span>
                </div>

                {/* Summary Stat 2 */}
                <div className="flex flex-col items-center">
                  <TrendIcon className="w-8 h-8 text-accent mb-2 filter drop-shadow-[0_0_4px_rgba(29,108,239,0.25)]" />
                  <span className="text-[20px] sm:text-[22px] font-black text-ink leading-tight">
                    {formatAvgRev(activeChain.avgRevenueUsd)}
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-bold text-ink-soft mt-1">
                    Avg. Revenue
                  </span>
                </div>

                {/* Summary Stat 3 */}
                <div className="flex flex-col items-center">
                  <TrophyIcon className="w-8 h-8 text-accent mb-2 filter drop-shadow-[0_0_4px_rgba(29,108,239,0.25)]" />
                  <span className="text-[20px] sm:text-[22px] font-black text-ink leading-tight">
                    {activeChain.roiSummary}
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-bold text-ink-soft mt-1">
                    ROI in {activeChain.paybackMonths} months
                  </span>
                </div>
              </div>

              {/* View Full Report Button */}
              <a
                href="#brochure-form"
                className="relative w-full h-[52px] text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 overflow-hidden shadow-lg bg-gradient-to-r from-[#1D6CEF] via-[#2f74e6] to-[#1D6CEF] active:scale-[0.98] transition-all duration-150 border border-white/10 select-none cursor-pointer"
              >
                {/* Halftone pattern overlay */}
                <div 
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1.5px, transparent 2px)',
                    backgroundSize: '6px 6px',
                    WebkitMaskImage: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 65%, black 100%)',
                    maskImage: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 65%, black 100%)',
                  }}
                />
                <motion.span 
                  className="relative z-10 flex items-center justify-center gap-2"
                  animate={{ scale: [1, 1, 1.05, 1, 1] }}
                  transition={{
                    times: [0, 0.14, 0.20, 0.26, 1.0],
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  View full report
                  <ExternalLinkIcon className="w-4 h-4" />
                </motion.span>
              </a>
            </div>
          </motion.div>

          {/* Dots Indicator */}
          {/* <div className="flex justify-center gap-2 mt-6">
            {CHAINS_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeTab === idx ? "bg-accent w-5" : "bg-ink-faint/30"
                }`}
                aria-label={`Go to case study ${idx + 1}`}
              />
            ))}
          </div> */}
        </div>

        {/* Desktop: 2-col layout — context left, table right */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Left column: context + summary */}
          <div>
            <motion.p
              key={`desktop-sub-${activeTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[22px] lg:text-[26px] font-extrabold tracking-[-0.02em] text-accent leading-tight mb-5 lg:mb-8"
            >
              {activeChain.subtitle}
            </motion.p>

            {/* Summary stats */}
            <motion.div {...rise(0.12)} className="flex flex-col gap-2.5">
              {summary.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between rounded-[12px] border border-line bg-white px-5 py-4"
                >
                  <span className="text-[15px] sm:text-[20px] font-semibold text-ink-soft">
                    {s.label}
                  </span>
                  <span className="text-[22px] sm:text-[28px] lg:text-[32px] font-extrabold text-accent tnum leading-none">
                    {s.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column: week-on-week table */}
          <motion.div
            {...rise(0.08)}
            className="mt-5 lg:mt-0 rounded-[12px] border border-line bg-white overflow-hidden shadow-[0_10px_30px_rgba(10,14,26,0.06)]"
          >
            {activeChain.weeksData.map((r, i) => {
              const formattedRev = formatPrice(r.revUsd);
              return (
                <div
                  key={r.label}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <span className="text-[14px] font-semibold text-ink-soft">
                    {r.label}
                  </span>
                  <div className="flex items-center gap-5">
                    <span className="text-[14px] tnum font-medium text-ink">
                      {r.plays.toLocaleString()} <span className="text-ink-faint font-normal">plays</span>
                    </span>
                    <span className="text-[14px] tnum text-right w-[80px] font-semibold text-ink">
                      {formattedRev}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* Extra Average Row for Desktop consistency */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-line bg-accent/5">
              <span className="text-[14px] font-extrabold text-ink">
                Average
              </span>
              <div className="flex items-center gap-5">
                <span className="text-[14px] tnum font-extrabold text-ink">
                  {activeChain.avgPlays.toLocaleString()} <span className="text-ink-faint font-normal">plays</span>
                </span>
                <span className="text-[14px] tnum text-right w-[80px] font-extrabold text-accent">
                  {formatPrice(activeChain.avgRevenueUsd)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
