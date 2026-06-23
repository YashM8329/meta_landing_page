"use client";

import { motion, useReducedMotion } from "framer-motion";
import CardCarousel, { CarouselCard } from "./CardCarousel";
import Typewriter from "./Typewriter";

const steps = [
  { n: "1", text: "Two cameras record gameplay" },
  { n: "2", text: "Scan the QR after gameplay" },
  { n: "3", text: "Download and share on social" },
];

export default function MomentsSection({ cards }: { cards: CarouselCard[] }) {
  const reduce = useReducedMotion();
  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section
      id="moments-ai"
      className="min-h-dvh relative flex flex-col justify-center pt-24 pb-28 overflow-hidden [@media(max-height:900px)]:justify-start"
      aria-label="Moments AI"
    >
      <div className="lg:max-w-7xl lg:mx-auto lg:px-16 xl:px-24 w-full">
        <motion.div {...rise()} className="px-6 lg:px-0 mb-5">
          <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">AI Powered</p>
          <h2 className="text-[clamp(30px,8.5vw,48px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">
            Moments{" "}
            <Typewriter words={["Videos", "Photos"]} className="text-accent" />
          </h2>
        </motion.div>

        {/* Steps */}
        <motion.div {...rise(0.05)} className="px-6 lg:px-0 mb-6 grid gap-2.5 lg:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="flex items-center gap-3 rounded-[12px] border border-line bg-white px-4 py-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-md bg-accent text-white font-bold text-[15px] flex items-center justify-center">
                {s.n}
              </span>
              <span className="text-[15px] font-medium text-ink">{s.text}</span>
            </div>
          ))}
        </motion.div>

        <div className="lg:px-0">
          <CardCarousel cards={cards} />
        </div>
      </div>
    </section>
  );
}
