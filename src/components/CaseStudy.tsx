"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCurrency } from "@/lib/useCurrency";

/* Texas FEC earnings — 7 weeks, plus average (bold first row). */
const ROWS_DATA = [
  { label: "Average", plays: 1110, revUsd: 5720, avg: true },
  { label: "Week 1", plays: 906, revUsd: 4530 },
  { label: "Week 2", plays: 1223, revUsd: 6115 },
  { label: "Week 3", plays: 1179, revUsd: 5895 },
  { label: "Week 4", plays: 1485, revUsd: 7425 },
  { label: "Week 5", plays: 835, revUsd: 4175 },
  { label: "Week 6", plays: 1050, revUsd: 5225 },
  { label: "Week 7", plays: 1091, revUsd: 5455 },
];

export default function CaseStudy() {
  const reduce = useReducedMotion();
  const { symbol, rate, code } = useCurrency();

  const formatMoney = (usd: number): string => {
    const v = Math.round(usd * rate);
    if (v >= 1_000_000) return `${symbol}${Math.round(v / 1_000_000)}M`;
    if (v >= 1_000) return `${symbol}${Math.round(v / 1_000)}K`;
    return `${symbol}${v}`;
  };

  const formatPrice = (usd: number): string => {
    const v = Math.round(usd * rate);
    return `${symbol}${v.toLocaleString()}`;
  };

  const localPricePlay = formatPrice(5);
  const localRevenueMonth = formatMoney(24800);
  const paybackMonths = Math.round(65000 / 24800); // 2.62 rounded to 3

  /* Monthly = weekly avg × 4.33; price/play $5; ROI on $65k install. */
  const summary = [
    { label: "Price / play", value: localPricePlay },
    { label: "Revenue / month", value: localRevenueMonth },
    { label: "Payback (ROI)", value: `${paybackMonths} mo` },
  ];

  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section
      id="case-study"
      className="min-h-0 lg:py-12 relative flex flex-col justify-center pt-6 pb-7 overflow-hidden"
      aria-label="Texas FEC case study"
    >
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0">
        <motion.div {...rise()} className="mb-4">
          <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">Case study</p>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <h2 className="text-[clamp(30px,8.5vw,48px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">
              Texas FEC Chain
            </h2>
            {code !== "USD" && (
              <p className="text-[13px] text-ink-faint mt-1">
                Showing in <span className="font-semibold text-ink-soft">{code}</span> · approximate conversion
              </p>
            )}
          </div>
        </motion.div>

        {/* Desktop: 2-col layout — context left, table right */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Left column: context + summary */}
          <div>
            <motion.p {...rise(0.04)} className="text-[15px] text-ink-soft leading-relaxed mb-3">
              Tracked over <span className="font-semibold text-ink">7 straight weeks</span> at a top Texas family
              entertainment center.
            </motion.p>
            <motion.p {...rise(0.06)} className="text-[22px] lg:text-[26px] font-extrabold tracking-[-0.02em] text-accent leading-tight mb-5 lg:mb-8">
              #1 of 88+ games — every single week.
            </motion.p>

            {/* Summary stats */}
            <motion.div {...rise(0.12)} className="flex flex-col gap-2.5">
              {summary.map((s) => (
                <div key={s.label} className="flex items-center justify-between rounded-[12px] border border-line bg-white px-5 py-4">
                  <span className="text-[14px] font-semibold text-ink-soft">{s.label}</span>
                  <span className="text-[28px] lg:text-[32px] font-extrabold text-accent tnum leading-none">{s.value}</span>
                </div>
              ))}
            </motion.div>

            <p className="text-[12px] text-ink-faint mt-4">
              Source: FOG Technologies sell-sheet · Texas FEC earnings. Monthly = weekly avg × 4.33; payback on a {formatMoney(65000)} install basis.
            </p>
          </div>

          {/* Right column: week-on-week table */}
          <motion.div {...rise(0.08)} className="mt-5 lg:mt-0 rounded-[12px] border border-line bg-white overflow-hidden shadow-[0_10px_30px_rgba(10,14,26,0.06)]">
            {ROWS_DATA.map((r, i) => {
              const localRev = Math.round(r.revUsd * rate);
              const formattedRev = `${symbol}${localRev.toLocaleString()}`;
              return (
                <div
                  key={r.label}
                  className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-line" : ""} ${r.avg ? "bg-accent/5" : ""}`}
                >
                  <span className={`text-[14px] ${r.avg ? "font-extrabold text-ink" : "font-semibold text-ink-soft"}`}>
                    {r.label}
                  </span>
                  <div className="flex items-center gap-5">
                    <span className={`text-[14px] tnum ${r.avg ? "font-extrabold text-ink" : "font-medium text-ink"}`}>
                      {r.plays.toLocaleString()} <span className="text-ink-faint font-normal">plays</span>
                    </span>
                    <span className={`text-[14px] tnum text-right w-[80px] ${r.avg ? "font-extrabold text-accent" : "font-semibold text-ink"}`}>
                      {formattedRev}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
