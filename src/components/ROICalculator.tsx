"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCurrency } from "@/lib/useCurrency";
import MobileBrochureCTA from "./MobileBrochureCTA";

/* Defaults + assumptions: 4,500 players/month, $65k install, 25 sqm. */
const DEFAULT_PLAYERS = 4500;
const INSTALL_COST_USD = 65_000;
const FOOTPRINT_SQM = 25;

interface SliderConfig {
  defaultPrice: number;
  minPrice: number;
  maxPrice: number;
  stepPrice: number;
}

const SLIDER_CONFIGS: Record<string, SliderConfig> = {
  USD: { defaultPrice: 4.5, minPrice: 3.0, maxPrice: 6.0, stepPrice: 0.5 },
  GBP: { defaultPrice: 3.5, minPrice: 2.0, maxPrice: 5.0, stepPrice: 0.5 },
  EUR: { defaultPrice: 4.5, minPrice: 3.0, maxPrice: 6.0, stepPrice: 0.5 },
  INR: { defaultPrice: 250, minPrice: 100, maxPrice: 500, stepPrice: 50 },
  IDR: { defaultPrice: 64000, minPrice: 30000, maxPrice: 100000, stepPrice: 500 },
  VND: { defaultPrice: 50000, minPrice: 25000, maxPrice: 100000, stepPrice: 500 },
  PHP: { defaultPrice: 100, minPrice: 50, maxPrice: 300, stepPrice: 50 },
  SGD: { defaultPrice: 6.0, minPrice: 4.0, maxPrice: 10.0, stepPrice: 0.5 },
  AUD: { defaultPrice: 6.0, minPrice: 4.0, maxPrice: 10.0, stepPrice: 0.5 },
  ZAR: { defaultPrice: 30, minPrice: 15, maxPrice: 60, stepPrice: 5 },
};

const AVAILABLE_COUNTRIES = [
  { country: "United States", code: "USD", symbol: "$", rate: 1 },
  { country: "United Kingdom", code: "GBP", symbol: "£", rate: 0.79 },
  { country: "Europe", code: "EUR", symbol: "€", rate: 0.92 },
  { country: "India", code: "INR", symbol: "₹", rate: 83 },
  { country: "Indonesia", code: "IDR", symbol: "Rp", rate: 16400 },
  { country: "Vietnam", code: "VND", symbol: "₫", rate: 25400 },
  { country: "Philippines", code: "PHP", symbol: "₱", rate: 58 },
  { country: "Singapore", code: "SGD", symbol: "S$", rate: 1.35 },
  { country: "Australia", code: "AUD", symbol: "A$", rate: 1.53 },
  { country: "Canada", code: "CAD", symbol: "C$", rate: 1.36 },
  { country: "New Zealand", code: "NZD", symbol: "NZ$", rate: 1.63 },
  { country: "United Arab Emirates", code: "AED", symbol: "AED ", rate: 3.67 },
  { country: "South Africa", code: "ZAR", symbol: "R", rate: 18.5 },
  { country: "Japan", code: "JPY", symbol: "¥", rate: 149 },
  { country: "South Korea", code: "KRW", symbol: "₩", rate: 1330 },
  { country: "Malaysia", code: "MYR", symbol: "RM ", rate: 4.47 },
  { country: "Thailand", code: "THB", symbol: "฿", rate: 35 },
  { country: "Saudi Arabia", code: "SAR", symbol: "SAR ", rate: 3.75 },
  { country: "Qatar", code: "QAR", symbol: "QR ", rate: 3.64 },
];

function getSliderConfig(code: string, rate: number): SliderConfig {
  if (SLIDER_CONFIGS[code]) {
    return SLIDER_CONFIGS[code];
  }
  const isLowIncome = ["INR", "IDR", "VND", "PHP", "THB", "MYR", "ZAR"].includes(code);
  const defaultUsd = isLowIncome ? 2.5 : 4.5;
  const localDefault = Math.round(defaultUsd * rate);
  
  let step = 0.5;
  let min = Math.round(1.5 * rate);
  let max = Math.round(6.0 * rate);
  
  if (localDefault >= 1000) {
    step = 500;
    const cleanDefault = Math.round(localDefault / 500) * 500;
    const cleanMin = Math.round((defaultUsd * 0.6 * rate) / 500) * 500;
    const cleanMax = Math.round((defaultUsd * 1.5 * rate) / 500) * 500;
    return { defaultPrice: cleanDefault, minPrice: cleanMin, maxPrice: cleanMax, stepPrice: step };
  } else if (localDefault >= 100) {
    step = 50;
    const cleanDefault = Math.round(localDefault / 50) * 50;
    const cleanMin = Math.round((defaultUsd * 0.6 * rate) / 50) * 50;
    const cleanMax = Math.round((defaultUsd * 1.5 * rate) / 50) * 50;
    return { defaultPrice: cleanDefault, minPrice: cleanMin, maxPrice: cleanMax, stepPrice: step };
  }
  
  return { defaultPrice: localDefault, minPrice: min, maxPrice: max, stepPrice: step };
}

function formatMoney(usd: number, symbol: string, rate: number): string {
  const v = Math.round(usd * rate);
  if (v >= 1_000_000) {
    const millions = Number((v / 1_000_000).toFixed(1));
    return `${symbol}${millions}M`;
  }
  return `${symbol}${v.toLocaleString()}`;
}

export default function ROICalculator() {
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const reduce = useReducedMotion();
  const { symbol, rate, code, countryName } = useCurrency();

  const [selectedCode, setSelectedCode] = useState<string>("");
  const activeCode = selectedCode || code || "USD";

  const hasAutoCodeInList = AVAILABLE_COUNTRIES.some((c) => c.code === code);
  const dropdownOptions = [...AVAILABLE_COUNTRIES];
  if (code && code !== "USD" && !hasAutoCodeInList) {
    dropdownOptions.push({
      country: countryName || code,
      code: code,
      symbol: symbol,
      rate: rate,
    });
  }

  const activeCurrency = dropdownOptions.find((c) => c.code === activeCode) || {
    country: countryName || "United States",
    code: code || "USD",
    symbol: symbol || "$",
    rate: rate || 1,
  };

  const config = getSliderConfig(activeCurrency.code, activeCurrency.rate);

  const [price, setPrice] = useState(config.defaultPrice);
  const [lastCode, setLastCode] = useState("");

  if (activeCurrency.code !== lastCode) {
    setLastCode(activeCurrency.code);
    setPrice(config.defaultPrice);
  }

  const priceInUsd = price / activeCurrency.rate;
  const monthlyUsd = players * priceInUsd;
  const installLocal = formatMoney(INSTALL_COST_USD, activeCurrency.symbol, activeCurrency.rate);
  const paybackMonths = monthlyUsd > 0 ? INSTALL_COST_USD / monthlyUsd : 0;

  const metrics = [
    { label: "Revenue / month",       value: formatMoney(monthlyUsd, activeCurrency.symbol, activeCurrency.rate) },
    { label: "7-year revenue",         value: formatMoney(monthlyUsd * 84, activeCurrency.symbol, activeCurrency.rate) },
    { label: "Revenue / sqm / month", value: formatMoney(monthlyUsd / FOOTPRINT_SQM, activeCurrency.symbol, activeCurrency.rate) },
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
            Revenue &amp; ROI
          </h2>
          {/* Currency indicator dropdown */}
          <p className="text-[13px] text-ink-faint mt-2 flex flex-wrap items-center gap-1.5 select-none">
            <span>Showing in </span>
            <span className="font-bold text-ink-soft bg-[#0a0e1a]/5 px-1.5 py-0.5 rounded text-[12px]">
              {activeCurrency.code} ({activeCurrency.symbol.trim()})
            </span>
            <span>based on location:</span>
            <select
              value={activeCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="bg-transparent text-accent font-semibold hover:text-accent/80 outline-none cursor-pointer border-b border-dashed border-accent/40 pb-0.5"
            >
              {dropdownOptions.map((c) => (
                <option key={c.code} value={c.code} className="text-ink">
                  {c.country}
                </option>
              ))}
            </select>
          </p>
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
                    left: `calc(${((price - config.minPrice) / (config.maxPrice - config.minPrice)) * 100}% - ${(((price - config.minPrice) / (config.maxPrice - config.minPrice)) * 100 / 100) * 18}px + 9px)`,
                  }}
                >
                  {activeCurrency.symbol}{price.toLocaleString(undefined, {
                    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
                    maximumFractionDigits: 2
                  })}
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[3px] border-[4px] border-transparent border-t-accent" />
                </div>
                <input
                  id="slider-price"
                  type="range"
                  min={config.minPrice}
                  max={config.maxPrice}
                  step={config.stepPrice}
                  value={price}
                  onChange={onPrice}
                  aria-valuetext={`${activeCurrency.symbol}${price} per play`}
                  style={{
                    background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((price - config.minPrice) / (config.maxPrice - config.minPrice)) * 100}%, var(--color-line) ${((price - config.minPrice) / (config.maxPrice - config.minPrice)) * 100}%, var(--color-line) 100%)`,
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
      <MobileBrochureCTA />
    </section>
  );
}
