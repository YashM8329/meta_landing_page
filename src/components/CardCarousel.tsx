"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export interface CarouselCard {
  label: string;
  sublabel?: string;
  gradient: string;
  accentGlow?: string;
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
            style={{ background: card.gradient, mixBlendMode: "multiply", opacity: 0.20 }}
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
          height: card.image ? "50%" : "50%",
          background: card.image
            ? "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)"
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ensure the track has enough cards to exceed the screen width
  let trackCards = cards;
  if (cards.length > 0) {
    while (trackCards.length < 8) {
      trackCards = [...trackCards, ...cards];
    }
  }

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || cards.length === 0) return;

    let isPaused = false;
    let timeoutId: NodeJS.Timeout;
    let animationFrameId: number;
    let lastTimestamp = 0;

    // Calculate width of one full set of cards (including gaps)
    const getTrackWidth = () => {
      if (container.children.length > trackCards.length) {
        const startEl = container.children[0] as HTMLElement;
        const dupEl = container.children[trackCards.length] as HTMLElement;
        if (startEl && dupEl) {
          return dupEl.offsetLeft - startEl.offsetLeft;
        }
      }
      return container.scrollWidth / 2;
    };

    let trackWidth = getTrackWidth();

    const handleResize = () => {
      trackWidth = getTrackWidth();
    };
    window.addEventListener("resize", handleResize);

    // Infinite scroll wrapping logic
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      if (scrollLeft >= trackWidth) {
        container.scrollLeft = scrollLeft - trackWidth;
      } else if (scrollLeft <= 0) {
        container.scrollLeft = scrollLeft + trackWidth;
      }
    };
    container.addEventListener("scroll", handleScroll);

    // Pause on user interaction and resume after 3 seconds of idleness
    const pauseAndResetTimeout = () => {
      isPaused = true;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        isPaused = false;
      }, 3000);
    };

    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;

    const handleTouchStart = () => {
      pauseAndResetTimeout();
    };

    const handleMouseDown = (e: MouseEvent) => {
      isPaused = true;
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeftStart = container.scrollLeft;
      container.style.cursor = "grabbing";
    };

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.style.cursor = "grab";
      isPaused = false;
    };

    const handleMouseUp = () => {
      isDown = false;
      container.style.cursor = "grab";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5; // scroll speed multiplier
      container.scrollLeft = scrollLeftStart - walk;
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", pauseAndResetTimeout, { passive: true });
    container.addEventListener("wheel", pauseAndResetTimeout, { passive: true });
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    // Set initial cursor style
    container.style.cursor = "grab";

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isPaused && !isDown) {
        // Increment scroll position smoothly (speed = 0.04px per millisecond)
        container.scrollLeft += 0.04 * delta;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", pauseAndResetTimeout);
      container.removeEventListener("wheel", pauseAndResetTimeout);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [trackCards.length, cards.length]);

  return (
    <div className="marquee-container select-none">
      <div ref={scrollRef} className="marquee-scroll">
        {trackCards.map((card, i) => (
          <div
            key={card.label + "-" + i}
            className="rounded-[12px] overflow-hidden relative shadow-[0_16px_40px_rgba(10,14,26,0.2)] shrink-0 w-[240px] md:w-[280px]"
            style={{ aspectRatio: "3/4", background: card.gradient }}
            aria-label={card.label}
          >
            <CardContent card={card} />
          </div>
        ))}
        {/* Duplicated set for seamless loop */}
        {trackCards.map((card, i) => (
          <div
            key={card.label + "-dup-" + i}
            className="rounded-[12px] overflow-hidden relative shadow-[0_16px_40px_rgba(10,14,26,0.2)] shrink-0 w-[240px] md:w-[280px]"
            style={{ aspectRatio: "3/4", background: card.gradient }}
            aria-hidden="true"
          >
            <CardContent card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}
