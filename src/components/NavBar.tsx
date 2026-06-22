"use client";

import { useEffect, useState } from "react";

export default function NavBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const videoSection = document.getElementById("gameplay-video");
    if (!videoSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show navbar only once S2 has scrolled above the viewport top
        const scrolledPast =
          !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        setVisible(scrolledPast);
      },
      { threshold: 0 }
    );

    observer.observe(videoSection);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Site navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="glass max-w-[460px] mx-auto h-[56px] flex items-center justify-center border-x-0 border-t-0">
        <span className="font-mugen font-extrabold text-[20px] tracking-[-0.01em] text-ink">
          HYPER<span className="text-accent">GRID</span>
        </span>
      </div>
    </nav>
  );
}
