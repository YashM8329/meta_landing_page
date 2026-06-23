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
  if (v >= 1_000_000) return `${symbol}${Math.round(v / 100_000) / 10}M`;
  if (v >= 1_000) return `${symbol}${Math.round(v / 1_000)}K`;
  return `${symbol}${v}`;
}

export default function ROICalculator() {
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const reduce = useReducedMotion();
  const { symbol, rate, code } = useCurrency();

  const monthlyUsd = players * price;
  const installLocal = formatMoney(INSTALL_COST_USD, symbol, rate);
  const paybackMonths = monthlyUsd > 0 ? INSTALL_COST_USD / monthlyUsd : 0;

  const metrics = [
    { label: "Revenue / month",       value: formatMoney(monthlyUsd, symbol, rate) },
    { label: "5-year revenue",         value: formatMoney(monthlyUsd * 60, symbol, rate) },
    { label: "Revenue / sqm / month", value: formatMoney(monthlyUsd / FOOTPRINT_SQM, symbol, rate) },
    { label: "Payback period",         value: `${Math.round(paybackMonths)} mo` },
  ];

  const onPlayers = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPlayers(Number(e.target.value)), []);
  const onPrice   = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value)), []);

  return (
    <section
      id="roi"
      className="snap-start min-h-dvh relative flex flex-col justify-center pt-24 pb-28 px-6 lg:px-16 xl:px-24 overflow-hidden [@media(max-height:900px)]:justify-start"
      aria-label="Revenue and ROI calculator"
    >
      <div className="lg:max-w-7xl lg:mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">Revenue calculator</p>
          <h2 className="text-[clamp(30px,8.5vw,48px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">
            Superb Revenue &amp; ROI
          </h2>
          {/* Currency indicator — shows when non-USD */}
          {code !== "USD" && (
            <p className="text-[13px] text-ink-faint mt-1">
              Showing in <span className="font-semibold text-ink-soft">{code}</span> · approximate conversion
            </p>
          )}
        </motion.div>

        {/* Desktop: 2-col layout — sliders left, metrics right */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Sliders */}
          <div className="rounded-[12px] border border-line bg-white p-5 shadow-[0_12px_36px_rgba(10,14,26,0.08)]">
            <p className="text-[14px] font-semibold text-ink mb-5 lg:mb-6">Adjust your estimates</p>

            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="slider-players" className="text-[13px] font-semibold text-ink-soft">
                  Players / month
                </label>
                <span className="text-[15px] font-bold text-accent tnum">
                  {players.toLocaleString()}
                </span>
              </div>
              <input
                id="slider-players"
                type="range"
                min={500}
                max={15000}
                step={100}
                value={players}
                onChange={onPlayers}
                aria-valuetext={`${players} players per month`}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-accent bg-line"
              />
            </div>

            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="slider-price" className="text-[13px] font-semibold text-ink-soft">
                  Price / play
                </label>
                <span className="text-[15px] font-bold text-accent tnum">
                  {symbol}{Math.round(price * rate)}
                </span>
              </div>
              <input
                id="slider-price"
                type="range"
                min={1}
                max={15}
                step={1}
                value={price}
                onChange={onPrice}
                aria-valuetext={`${symbol}${Math.round(price * rate)} per play`}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-accent bg-line"
              />
            </div>

            {/* Install cost note */}
            <p className="text-[12px] text-ink-faint mt-6 border-t border-line pt-4">
              Based on a{" "}
              <span className="font-semibold text-ink-soft">{installLocal} install cost</span>
              {" "}and{" "}
              <span className="font-semibold text-ink-soft">25 sqm footprint</span>.
            </p>
          </div>

          {/* Metrics */}
          <div className="flex flex-col gap-2.5 mt-4 lg:mt-0">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between rounded-[10px] bg-surface border border-line px-4 py-3.5 lg:flex-1"
              >
                <span className="text-[13px] font-semibold text-ink-soft">{m.label}</span>
                <span className="text-[24px] lg:text-[28px] font-extrabold tnum leading-none text-accent">
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
