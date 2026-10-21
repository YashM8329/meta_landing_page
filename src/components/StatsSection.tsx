"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/lib/useTranslation";

/* Standalone white-background stats section, used on /asia and /northamerica
   in place of the stats normally shown inside HeroSection (see showSeparateStats
   prop on HeroSection). Card styling is intentionally neutral (no accent border/
   glow) so it reads clearly on a white background without competing with the
   Request Brochure CTA. */

const cardClass =
  "bg-surface-2 border border-line rounded-2xl py-4 px-3 flex flex-col justify-center items-center shadow-[0_4px_16px_rgba(10,10,10,0.06)] hover:shadow-[0_6px_20px_rgba(10,10,10,0.1)] transition-shadow duration-300";

export default function StatsSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  const stats = [
    { value: "150+", label: t.hero.stats.venues },
    { value: "15+", label: t.hero.stats.countries },
    { value: t.hero.stats.avgPaybackValue, label: t.hero.stats.avgPayback },
    { value: t.hero.stats.gameplayValue, label: t.hero.stats.gameplay },
    { value: "1-6", label: t.hero.stats.players },
    { value: "4+", label: t.hero.stats.age },
  ];

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="max-w-[1100px] mx-auto w-full px-6">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className={cardClass}>
              <p className="text-[22px] lg:text-[28px] font-black text-ink tracking-tighter leading-none text-center whitespace-nowrap">
                {value}
              </p>
              <p className="text-[11px] lg:text-[13px] font-bold text-ink-soft mt-1.5 leading-tight text-center whitespace-nowrap">
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
