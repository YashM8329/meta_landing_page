"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import InstagramEmbed from "./InstagramEmbed";

export interface ReelItem {
  url: string;
  account: string;
  caption: string;
}

interface Props {
  items: ReelItem[];
  eyebrow?: string;
  title: string;
  sectionId?: string;
}

export default function InstagramCarousel({ items, eyebrow, title, sectionId }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        let best = { index: activeIndex, ratio: 0 };
        entries.forEach((entry) => {
          const idx = cards.indexOf(entry.target as HTMLElement);
          if (idx >= 0 && entry.intersectionRatio > best.ratio) best = { index: idx, ratio: entry.intersectionRatio };
        });
        if (best.ratio > 0) setActiveIndex(best.index);
      },
      { root: track, threshold: [0.4] }
    );
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement;
    if (!card) return;
    const tr = track.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    track.scrollTo({ left: cr.left - tr.left + track.scrollLeft - (tr.width - cr.width) / 2, behavior: "smooth" });
  };

  return (
    <section
      id={sectionId}
      className="snap-start min-h-dvh relative flex flex-col justify-center pt-24 pb-28 overflow-hidden [@media(max-height:900px)]:justify-start"
      aria-label={title}
    >
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 mb-6"
      >
        {eyebrow && (
          <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">{eyebrow}</p>
        )}
        <h2 className="text-[clamp(30px,8.5vw,42px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">
          {title}
        </h2>
      </motion.div>

      <div ref={trackRef} className="carousel-scroll items-start" role="region" aria-label="Instagram reels">
        {items.map((item, i) => (
          <div key={item.url + i} className="carousel-snap" style={{ width: "82vw", maxWidth: "320px" }}>
            <InstagramEmbed url={item.url} account={item.account} caption={item.caption} />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1.5 mt-4" role="tablist" aria-label="Carousel position">
        {items.map((item, i) => (
          <button
            key={item.url + i}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`View reel ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              i === activeIndex ? "w-6 bg-gradient-accent" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
