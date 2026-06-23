"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";


export interface CarouselCard {
  label: string;
  sublabel?: string;
  gradient: string;
  accentGlow?: string;
  /** Optional feature image shown in the lower portion of the card */
  image?: string;
}

function CardContent({ card }: { card: CarouselCard }) {
  return (
    <>
      {/* Base gradient background (always present) */}
      {!card.image && <div className="absolute inset-0 grid-texture-dark opacity-50" />}

      {/* Feature image — fills lower ~65% of card */}
      {card.image && (
        <>
          {/* Image occupies the full card, anchored to bottom */}
          <div className="absolute inset-0">
            <Image
              src={card.image}
              alt={card.label}
              fill
              unoptimized
              className="object-cover object-bottom"
              sizes="(min-width: 1024px) 25vw, 70vw"
            />
          </div>
          {/* Re-apply the card gradient as a tint so colours stay on-brand */}
          <div
            className="absolute inset-0"
            style={{ background: card.gradient, mixBlendMode: "multiply", opacity: 0.45 }}
          />
        </>
      )}

      {/* Accent glow at bottom */}
      {card.accentGlow && (
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[70%] h-32"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${card.accentGlow} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Strong top gradient so label stays readable regardless of image content */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: card.image ? "55%" : "50%",
          background: card.image
            ? "linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
        }}
      />

      {/* Text */}
      <div className="absolute top-0 left-0 right-0 px-5 pt-5">
        <p className="font-extrabold text-white text-[24px] leading-[1.05] tracking-[-0.01em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          {card.label}
        </p>
        {card.sublabel && (
          <p className="text-white/80 text-[13px] font-medium mt-1.5 leading-snug drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            {card.sublabel}
          </p>
        )}
      </div>
    </>
  );
}

export default function CardCarousel({ cards }: { cards: CarouselCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cardEls = Array.from(track.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        let best = { index: activeIndex, ratio: 0 };
        entries.forEach((entry) => {
          const idx = cardEls.indexOf(entry.target as HTMLElement);
          if (idx >= 0 && entry.intersectionRatio > best.ratio) {
            best = { index: idx, ratio: entry.intersectionRatio };
          }
        });
        if (best.ratio > 0) setActiveIndex(best.index);
      },
      { root: track, threshold: [0.5] }
    );
    cardEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement;
    if (!card) return;
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const offset =
      cardRect.left - trackRect.left + track.scrollLeft - (trackRect.width - cardRect.width) / 2;
    track.scrollTo({ left: offset, behavior: "smooth" });
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
  };
  const cardItem: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <>
      {/* ── Mobile carousel ── */}
      <div className="lg:hidden">
        <motion.div
          ref={trackRef}
          className="carousel-scroll"
          role="region"
          aria-label="Swipeable cards"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.label}
              variants={cardItem}
              className="carousel-snap rounded-[12px] overflow-hidden relative shadow-[0_16px_40px_rgba(10,14,26,0.2)]"
              style={{ width: "66vw", maxWidth: "240px", aspectRatio: "3/4", background: card.gradient }}
              aria-label={card.label}
            >
              <CardContent card={card} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile dots */}
        <div className="flex justify-center gap-1.5 mt-4" role="tablist" aria-label="Carousel position">
          {cards.map((card, i) => (
            <button
              key={card.label}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`View ${card.label}`}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                i === activeIndex ? "w-6 bg-gradient-accent" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Desktop grid ── */}
      <motion.div
        className="hidden lg:grid gap-4"
        style={{ gridTemplateColumns: `repeat(${Math.min(cards.length, 4)}, 1fr)` }}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.label}
            variants={cardItem}
            className="rounded-[12px] overflow-hidden relative shadow-[0_16px_40px_rgba(10,14,26,0.2)]"
            style={{ aspectRatio: "3/4", background: card.gradient }}
            aria-label={card.label}
          >
            <CardContent card={card} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
