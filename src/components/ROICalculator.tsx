"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* Defaults + assumptions: 4,500 players/month, $4/play, $65k install, 25 sqm. */
const DEFAULT_PLAYERS = 4500;
const DEFAULT_PRICE = 4;
const INSTALL_COST = 65000;
const FOOTPRINT_SQM = 25;

function currency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

export default function ROICalculator() {
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const reduce = useReducedMotion();

  const monthly = players * price;
  const metrics = [
    { label: "Revenue / month", value: currency(monthly) },
    { label: "5-year revenue", value: currency(monthly * 60) },
    { label: "Revenue / sqm / month", value: currency(monthly / FOOTPRINT_SQM) },
    { label: "Payback period", value: `${(monthly > 0 ? INSTALL_COST / monthly : 0).toFixed(1)} mo` },
  ];

  const onPlayers = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPlayers(Number(e.target.value)), []);
  const onPrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value)), []);

  return (
    <section
      id="roi"
      className="snap-start min-h-dvh relative flex flex-col justify-center pt-24 pb-28 px-6 overflow-hidden [@media(max-height:900px)]:justify-start"
      aria-label="Revenue and ROI calculator"
    >
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">Revenue calculator</p>
        <h2 className="text-[clamp(30px,8.5vw,42px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">
          Superb Revenue &amp; ROI
        </h2>
      </motion.div>

      <div className="rounded-[12px] border border-line bg-white p-5 shadow-[0_12px_36px_rgba(10,14,26,0.08)]">
        {/* sliders */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="slider-players" className="text-[13px] font-semibold text-ink-soft">Players / month</label>
            <span className="text-[15px] font-bold text-accent tnum">{players.toLocaleString()}</span>
          </div>
          <input id="slider-players" type="range" min={500} max={15000} step={100} value={players} onChange={onPlayers}
            aria-valuetext={`${players} players per month`}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-accent bg-line" />
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="slider-price" className="text-[13px] font-semibold text-ink-soft">Price / play</label>
            <span className="text-[15px] font-bold text-accent tnum">${price.toFixed(2)}</span>
          </div>
          <input id="slider-price" type="range" min={1} max={15} step={0.5} value={price} onChange={onPrice}
            aria-valuetext={`$${price.toFixed(2)} per play`}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-accent bg-line" />
        </div>

        {/* metrics — full-width stacked rows */}
        <div className="flex flex-col gap-2.5">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between rounded-[10px] bg-surface border border-line px-4 py-3.5">
              <span className="text-[13px] font-semibold text-ink-soft">{m.label}</span>
              <span className="text-[24px] font-extrabold tnum leading-none text-accent">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
