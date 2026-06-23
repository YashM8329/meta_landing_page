"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard exponential easeOut
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      autoResize: true,
    });

    // RAF loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Save Lenis instance globally for ease of access if needed
    (window as any).lenis = lenis;

    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      // Find the closest anchor tag
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      // Check if it's an internal anchor link
      if (href && href.startsWith("#")) {
        // If it's just "#", do nothing or scroll to top
        if (href === "#") {
          e.preventDefault();
          lenis.scrollTo(0);
          return;
        }

        const targetEl = document.querySelector(href) as HTMLElement | null;
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, {
            offset: 0,
            duration: 1.2,
            immediate: false,
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      delete (window as any).lenis;
    };
  }, []);

  return null;
}
