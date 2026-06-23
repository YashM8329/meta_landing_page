"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";


interface Testimonial {
  quote: string;
  name: string;
  title: string;
  logo: string;
  logoAlt: string;
  photo: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "The unattended setup makes it super easy to manage, and strong visual presence makes it a real centrepiece for our venue.",
    name: "Ron Mroz",
    title: "Chief Product Officer, TEEG",
    logo: "/logos/1-Timezone.png",
    logoAlt: "Timezone",
    photo: "/testimonials/ron-mroz.jpg",
    initials: "RM",
  },
  {
    quote: "It's a winner! Active-attraction energy, arcade simplicity, repeat play that drives performance.",
    name: "Mark Estate",
    title: "CEO, LAI Games",
    logo: "/logos/4-lai-games.png",
    logoAlt: "LAI Games",
    photo: "/testimonials/mark-estate.jpg",
    initials: "ME",
  },
  {
    quote: "It naturally draws a wide mix of guests, from families to teens, and creates a social, competitive energy that keeps people playing.",
    name: "Prakash Vivekanand",
    title: "Managing Director, ASI",
    logo: "/logos/7-ASI.png",
    logoAlt: "ASI",
    photo: "/testimonials/prakash-vivekanand.jpg",
    initials: "PV",
  },
];

const logos = [
  { src: "/logos/1-Timezone.png", alt: "Timezone" },
  { src: "/logos/2-Mainevent.png", alt: "Main Event" },
  { src: "/logos/3-Funcity.png", alt: "Fun City" },
  { src: "/logos/4-lai-games.png", alt: "LAI Games" },
  { src: "/logos/5-Bandai_Namco.png", alt: "Bandai Namco" },
  { src: "/logos/6-the-fun-company.png", alt: "The Fun Company" },
  { src: "/logos/7-ASI.png", alt: "ASI" },
  { src: "/logos/8-playdxb.png", alt: "Play DXB" },
];

function TestimonialCardInner({ t, className = "" }: { t: Testimonial; className?: string }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className={`relative rounded-[12px] overflow-hidden shadow-[0_16px_40px_rgba(10,14,26,0.18)] ${className}`}
      style={{ aspectRatio: "4/5" }}>
      {imgOk ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={t.photo}
          alt={t.name}
          onError={() => setImgOk(false)}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-start justify-center pt-12"
          style={{ background: "linear-gradient(160deg,#1d3f8f 0%,#1d6cef 60%,#5b93f5 100%)" }}
        >
          <span className="text-white/90 font-extrabold text-[64px] tracking-tight">{t.initials}</span>
        </div>
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(5,8,16,0.97) 0%, rgba(5,8,16,0.93) 32%, rgba(5,8,16,0.6) 56%, rgba(5,8,16,0.15) 76%, transparent 92%)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <p className="text-white font-bold text-[17px] leading-tight">{t.name}</p>
            <p className="text-white/75 text-[12.5px] mt-0.5">{t.title}</p>
          </div>
          <span className="bg-white rounded-md h-9 px-2.5 flex items-center shrink-0">
            <span className="relative h-5 w-[82px]">
              <Image src={t.logo} alt={t.logoAlt} fill unoptimized sizes="100px" className="object-contain" />
            </span>
          </span>
        </div>
        <p className="text-white text-[15px] leading-snug">&ldquo;{t.quote}&rdquo;</p>
      </div>
    </div>
  );
}

function MobileTestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="carousel-snap relative rounded-[12px] overflow-hidden shadow-[0_16px_40px_rgba(10,14,26,0.18)]"
      style={{ width: "80vw", maxWidth: "310px" }}
    >
      <TestimonialCardInner t={t} />
    </div>
  );
}

export default function ProofSection() {
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
      { root: track, threshold: [0.5] }
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

  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section
      id="proof"
      className="lg:min-h-0 lg:py-20 min-h-dvh relative flex flex-col justify-center pt-24 pb-28 overflow-hidden [@media(max-height:900px)]:justify-start"
      aria-label="Operator testimonials"
    >
      <div className="max-w-[1400px] mx-auto lg:px-16 xl:px-24 w-full">
        <motion.h2 {...rise()} className="px-6 lg:px-0 mb-6 text-[clamp(30px,8.5vw,48px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">
          Loved by operators
        </motion.h2>

        {/* Mobile: horizontal scroll carousel */}
        <div className="lg:hidden">
          <div ref={trackRef} className="carousel-scroll" role="region" aria-label="Testimonials">
            {testimonials.map((t) => (
              <MobileTestimonialCard key={t.name} t={t} />
            ))}
          </div>
          <div className="flex justify-center gap-1.5 mt-3 mb-8" role="tablist">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`View testimonial from ${t.name}`}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  i === activeIndex ? "w-6 bg-gradient-accent" : "w-1.5 bg-line"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 3-column grid */}
        <motion.div {...rise(0.05)} className="hidden lg:grid lg:grid-cols-3 gap-6 mb-8">
          {testimonials.map((t) => (
            <TestimonialCardInner key={t.name} t={t} />
          ))}
        </motion.div>

        {/* Logo grid */}
        <motion.div {...rise(0.08)} className="px-6 lg:px-0 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {logos.map((logo) => (
            <div key={logo.src} className="h-[64px] rounded-[12px] bg-white border border-line flex items-center justify-center px-5">
              <div className="relative h-8 w-full">
                <Image src={logo.src} alt={logo.alt} fill unoptimized sizes="150px" className="object-contain" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
