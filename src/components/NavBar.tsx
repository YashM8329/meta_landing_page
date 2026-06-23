"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
      {/* Mobile: centred pill */}
      <div className="lg:hidden glass max-w-[460px] mx-auto h-[56px] flex items-center justify-center border-x-0 border-t-0">
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
      <div className="hidden lg:block glass border-x-0 border-t-0">
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
