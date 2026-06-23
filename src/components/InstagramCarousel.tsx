"use client";

import { useEffect, useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ensure the track has enough items to exceed the screen width
  let trackItems = items;
  if (items.length > 0) {
    while (trackItems.length < 8) {
      trackItems = [...trackItems, ...items];
    }
  }

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || items.length === 0) return;

    let isPaused = false;
    let timeoutId: NodeJS.Timeout;
    let animationFrameId: number;
    let lastTimestamp = 0;

    // Calculate width of one full set of items (including gaps)
    const getTrackWidth = () => {
      if (container.children.length > trackItems.length) {
        const startEl = container.children[0] as HTMLElement;
        const dupEl = container.children[trackItems.length] as HTMLElement;
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

    const handleTouchStart = () => {
      pauseAndResetTimeout();
    };

    const handleMouseDown = () => {
      pauseAndResetTimeout();
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", pauseAndResetTimeout, { passive: true });
    container.addEventListener("wheel", pauseAndResetTimeout, { passive: true });
    container.addEventListener("mousedown", handleMouseDown);

    // Hover state pausing (desktop)
    const handleMouseEnter = () => {
      isPaused = true;
      clearTimeout(timeoutId); // don't auto-resume while hovered
    };
    const handleMouseLeave = () => {
      isPaused = false;
    };
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isPaused) {
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
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [trackItems.length, items.length]);

  return (
    <section
      id={sectionId}
      className="min-h-0 lg:py-12 relative flex flex-col justify-center pt-6 pb-7 overflow-hidden"
      aria-label={title}
    >
      <div className="px-6 lg:px-16 xl:px-24 mb-6">
        {eyebrow && (
          <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">{eyebrow}</p>
        )}
        <h2 className="text-[clamp(30px,8.5vw,48px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">
          {title}
        </h2>
      </div>

      <div className="marquee-container py-4">
        <div ref={scrollRef} className="marquee-scroll items-start">
          {trackItems.map((item, i) => (
            <div key={item.url + "-" + i} className="shrink-0 w-[260px] md:w-[300px]">
              <InstagramEmbed url={item.url} account={item.account} caption={item.caption} />
            </div>
          ))}
          {/* Duplicated set for seamless loop */}
          {trackItems.map((item, i) => (
            <div key={item.url + "-dup-" + i} className="shrink-0 w-[260px] md:w-[300px]" aria-hidden="true">
              <InstagramEmbed url={item.url} account={item.account} caption={item.caption} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
