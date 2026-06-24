"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCurrency } from "@/lib/useCurrency";

/* Defaults + assumptions: 4,500 players/month, $4/play, $65k install, 25 sqm. */
const DEFAULT_PLAYERS = 4500;
const DEFAULT_PRICE = 4;
const INSTALL_COST_USD = 65_000;
const FOOTPRINT_SQM = 25;

function formatMoney(usd: number, symbol: string, rate: number): string {
  const v = Math.round(usd * rate);
  if (v >= 1_000_000) {
    const millions = Math.round(v / 1_000_000);
    return `${symbol}${millions}M`;
  }
  return `${symbol}${v.toLocaleString()}`;
}

export default function ROICalculator() {
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const reduce = useReducedMotion();
  const { symbol, rate, code, countryName } = useCurrency();

  const monthlyUsd = players * price;
  const installLocal = formatMoney(INSTALL_COST_USD, symbol, rate);
  const paybackMonths = monthlyUsd > 0 ? INSTALL_COST_USD / monthlyUsd : 0;

  const metrics = [
    { label: "Revenue / month",       value: formatMoney(monthlyUsd, symbol, rate) },
    { label: "7-year revenue",         value: formatMoney(monthlyUsd * 84, symbol, rate) },
    { label: "Revenue / sqm / month", value: formatMoney(monthlyUsd / FOOTPRINT_SQM, symbol, rate) },
    { label: "Payback period",         value: `${Math.round(paybackMonths)} months` },
  ];

  const onPlayers = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPlayers(Number(e.target.value)), []);
  const onPrice   = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value)), []);

  return (
    <section
      id="roi"
      className="min-h-0 lg:py-12 relative flex flex-col justify-center pt-6 pb-7 overflow-hidden"
      aria-label="Revenue and ROI calculator"
    >
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          {/* <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">Revenue calculator</p> */}
          <h2 className="text-[clamp(30px,8.5vw,48px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">
            Calculate Revenue &amp; ROI
          </h2>
          {/* Currency indicator — shows when non-USD */}
          {code !== "USD" && (
            <p className="text-[13px] text-ink-faint mt-1">
              Showing in <span className="font-semibold text-ink-soft">{code}</span>{countryName ? <> based on your location in <span className="font-semibold text-ink-soft">{countryName}</span></> : ""} · approximate conversion
            </p>
          )}
        </motion.div>

        {/* Desktop: 2-col layout — sliders left, metrics right */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Sliders */}
          <div className="rounded-[12px] border border-line bg-white p-5 shadow-[0_12px_36px_rgba(10,14,26,0.08)]">
            <p className="text-[20px] font-semibold text-ink mb-5 lg:mb-6">Adjust your estimates</p>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-0">
                <label htmlFor="slider-players" className="text-[17px] font-semibold text-ink-soft">
                  Players / month
                </label>
              </div>
              <div className="relative pt-7 pb-2">
                {/* Bubble */}
                <div
                  className="absolute top-0 -translate-x-1/2 bg-accent text-white px-3 py-1 rounded-[6px] text-[13px] font-bold shadow-sm pointer-events-none"
                  style={{
                    left: `calc(${((players - 2500) / (10000 - 2500)) * 100}% - ${(((players - 2500) / (10000 - 2500)) * 100 / 100) * 18}px + 9px)`,
                  }}
                >
                  {players.toLocaleString()}{players === 10000 ? "+" : ""}
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[3px] border-[4px] border-transparent border-t-accent" />
                </div>
                <input
                  id="slider-players"
                  type="range"
                  min={2500}
                  max={10000}
                  step={500}
                  value={players}
                  onChange={onPlayers}
                  aria-valuetext={`${players} players per month`}
                  style={{
                    background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((players - 2500) / (10000 - 2500)) * 100}%, var(--color-line) ${((players - 2500) / (10000 - 2500)) * 100}%, var(--color-line) 100%)`,
                  }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none
                             [&::-webkit-slider-runnable-track]:bg-transparent
                             [&::-webkit-slider-thumb]:appearance-none
                             [&::-webkit-slider-thumb]:w-[18px]
                             [&::-webkit-slider-thumb]:h-[18px]
                             [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-accent
                             [&::-webkit-slider-thumb]:border-[3px]
                             [&::-webkit-slider-thumb]:border-white
                             [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.15)]
                             
                             [&::-moz-range-track]:bg-transparent
                             [&::-moz-range-thumb]:w-[18px]
                             [&::-moz-range-thumb]:h-[18px]
                             [&::-moz-range-thumb]:rounded-full
                             [&::-moz-range-thumb]:bg-accent
                             [&::-moz-range-thumb]:border-[3px]
                             [&::-moz-range-thumb]:border-white
                             [&::-moz-range-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-0">
                <label htmlFor="slider-price" className="text-[17px] font-semibold text-ink-soft">
                  Price / play
                </label>
              </div>
              <div className="relative pt-7 pb-2">
                {/* Bubble */}
                <div
                  className="absolute top-0 -translate-x-1/2 bg-accent text-white px-3 py-1 rounded-[6px] text-[13px] font-bold shadow-sm pointer-events-none"
                  style={{
                    left: `calc(${((price - 3) / (6 - 3)) * 100}% - ${(((price - 3) / (6 - 3)) * 100 / 100) * 18}px + 9px)`,
                  }}
                >
                  {symbol}{(price * rate).toLocaleString(undefined, {
                    minimumFractionDigits: (price * rate) % 1 === 0 ? 0 : 2,
                    maximumFractionDigits: 2
                  })}
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[3px] border-[4px] border-transparent border-t-accent" />
                </div>
                <input
                  id="slider-price"
                  type="range"
                  min={3}
                  max={6}
                  step={0.5}
                  value={price}
                  onChange={onPrice}
                  aria-valuetext={`${symbol}${price * rate} per play`}
                  style={{
                    background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((price - 3) / (6 - 3)) * 100}%, var(--color-line) ${((price - 3) / (6 - 3)) * 100}%, var(--color-line) 100%)`,
                  }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none
                             [&::-webkit-slider-runnable-track]:bg-transparent
                             [&::-webkit-slider-thumb]:appearance-none
                             [&::-webkit-slider-thumb]:w-[18px]
                             [&::-webkit-slider-thumb]:h-[18px]
                             [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-accent
                             [&::-webkit-slider-thumb]:border-[3px]
                             [&::-webkit-slider-thumb]:border-white
                             [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.15)]
                             
                             [&::-moz-range-track]:bg-transparent
                             [&::-moz-range-thumb]:w-[18px]
                             [&::-moz-range-thumb]:h-[18px]
                             [&::-moz-range-thumb]:rounded-full
                             [&::-moz-range-thumb]:bg-accent
                             [&::-moz-range-thumb]:border-[3px]
                             [&::-moz-range-thumb]:border-white
                             [&::-moz-range-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                />
              </div>
            </div>

            {/* Install cost note */}
            {/* <p className="text-[12px] text-ink-faint mt-6 border-t border-line pt-4">
              Based on a{" "}
              <span className="font-semibold text-ink-soft">{installLocal} install cost</span>
              {" "}and{" "}
              <span className="font-semibold text-ink-soft">25 sqm footprint</span>.
            </p> */}
          </div>

          {/* Metrics */}
          <div className="flex flex-col gap-2.5 mt-4 lg:mt-0">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between rounded-[12px] border border-line bg-white px-5 py-4 lg:flex-1"
              >
                <span className="text-[15px] sm:text-[20px] font-semibold text-ink-soft">{m.label}</span>
                <span className="text-[22px] sm:text-[28px] lg:text-[32px] font-extrabold text-accent tnum leading-none">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
