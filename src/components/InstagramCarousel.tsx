"use client";

import { useEffect, useRef } from "react";
import InstagramEmbed from "./InstagramEmbed";

export interface ReelItem {
  videoSrc: string;
  account: string;
  caption: string;
  likes?: string;
  comments?: string;
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

    // Start in the middle (at the start of the original set)
    requestAnimationFrame(() => {
      container.scrollLeft = trackWidth;
    });

    const handleResize = () => {
      trackWidth = getTrackWidth();
    };
    window.addEventListener("resize", handleResize);

    // Infinite scroll wrapping logic for triple track
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      if (scrollLeft >= trackWidth * 2) {
        container.scrollLeft = scrollLeft - trackWidth;
      } else if (scrollLeft <= trackWidth - 10) {
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
  }, [trackItems.length, items.length]);

  return (
    <section
      id={sectionId}
      className="min-h-0 lg:py-12 relative flex flex-col justify-center pt-6 pb-7 overflow-hidden"
      aria-label={title}
    >
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0">
        <div className="mb-6">
          {eyebrow && (
            <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">{eyebrow}</p>
          )}
          <h2 className="text-[clamp(30px,8.5vw,48px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">
            {title}
          </h2>
        </div>

        <div className="marquee-container py-4">
          <div ref={scrollRef} className="marquee-scroll items-start">
            {/* Left duplicate set for seamless scroll left */}
            {trackItems.map((item, i) => (
              <div key={item.videoSrc + "-left-" + i} className="shrink-0 w-[260px] md:w-[300px]" aria-hidden="true">
                <InstagramEmbed videoSrc={item.videoSrc} account={item.account} caption={item.caption} likes={item.likes} comments={item.comments} />
              </div>
            ))}
            {/* Original set */}
            {trackItems.map((item, i) => (
              <div key={item.videoSrc + "-" + i} className="shrink-0 w-[260px] md:w-[300px]">
                <InstagramEmbed videoSrc={item.videoSrc} account={item.account} caption={item.caption} likes={item.likes} comments={item.comments} />
              </div>
            ))}
            {/* Right duplicate set for seamless scroll right */}
            {trackItems.map((item, i) => (
              <div key={item.videoSrc + "-right-" + i} className="shrink-0 w-[260px] md:w-[300px]" aria-hidden="true">
                <InstagramEmbed videoSrc={item.videoSrc} account={item.account} caption={item.caption} likes={item.likes} comments={item.comments} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
