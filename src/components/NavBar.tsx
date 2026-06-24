"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function NavBar() {
  const [visible, setVisible] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroThreshold = window.innerHeight * 0.7; // 70% of screen height is hero section
      const lastScrollY = lastScrollYRef.current;
      const diff = currentScrollY - lastScrollY;
      
      if (currentScrollY < heroThreshold) {
        // Always hide when in the hero section
        setVisible(false);
      } else if (diff > 5) {
        // Scrolling down -> hide navbar
        setVisible(false);
      } else if (diff < -5) {
        // Scrolling up -> show navbar
        setVisible(true);
      }
      
      lastScrollYRef.current = currentScrollY;
    };

    // Check initial position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Site navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      {/* Mobile: centred pill */}
      <div className="lg:hidden mx-auto max-w-[460px] h-[56px] flex items-center justify-center border-b border-white/20 bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(10,14,26,0.08)]">
        <Image
          src="/hero/hypergrid-logo.png"
          alt="HYPERGRID"
          width={110}
          height={26}
          priority
          className="h-6 w-auto object-contain brightness-0"
        />
      </div>

      {/* Desktop: full-width bar */}
      <div className="hidden lg:block border-b border-white/20 bg-white/75 backdrop-blur-lg shadow-[0_8px_32px_rgba(10,14,26,0.05)]">
        <div className="max-w-[1440px] mx-auto w-full h-[64px] flex items-center justify-between px-6 xl:px-0">
          <Image
            src="/hero/hypergrid-logo.png"
            alt="HYPERGRID"
            width={130}
            height={30}
            priority
            className="h-7 w-auto object-contain brightness-0"
          />
          <div className="flex items-center gap-8">
            {[
              { href: "#features", label: "Features" },
              { href: "#moments-ai", label: "Moments AI" },
              { href: "#proof", label: "Testimonials" },
              { href: "#roi", label: "ROI" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-[14px] font-medium text-ink-soft hover:text-ink transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </div>
          <a
            href="#brochure-form"
            className="btn-glass-accent text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg flex items-center gap-1.5"
          >
            Get Brochure
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
