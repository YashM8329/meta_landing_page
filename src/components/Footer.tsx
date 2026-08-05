"use client";

import Image from "next/image";
import { useTranslation } from "@/lib/useTranslation";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full hero-abyss py-16 relative overflow-hidden border-t border-white/10">
      {/* white LED grid lines + film grain matching HeroSection */}
      <div className="hero-grid-dark" />
      <div className="grain-overlay" />

      {/* Mobile-only overlay to reduce gradient brightness and improve logo contrast */}
      <div className="absolute inset-0 bg-[#030714]/10 lg:hidden pointer-events-none z-0" />

      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-0 flex flex-col items-center justify-center relative z-10">
        {/* Radial glow background behind the logo */}
        <div className="absolute w-[300px] h-[100px] bg-accent/25 rounded-full blur-[50px] pointer-events-none -translate-y-4" />

        {/* Eyebrow: [line] MANUFACTURED BY [line] */}
        <div className="flex items-center justify-center gap-4 w-full max-w-[420px] mb-5 select-none">
          {/* Left glowing line */}
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#1D6CEF]/40 to-[#5B93F5] relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-white blur-[0.5px]" />
          </div>

          {/* Text */}
          <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.3em] text-[#D0E2FF] uppercase font-sans">
            {t.footer.manufacturedBy}
          </span>

          {/* Right glowing line */}
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[#5B93F5] via-[#1D6CEF]/40 to-transparent relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-white blur-[0.5px]" />
          </div>
        </div>

        {/* FOG Logo */}
        <div className="relative hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer">
          {/* Shadow glow on the logo itself */}
          <div className="absolute inset-0 bg-[#1D6CEF]/10 blur-[15px] rounded-lg pointer-events-none" />
          <Image
            src="/logos/fog-logo.png"
            alt="FOG Technologies"
            width={140}
            height={45}
            className="h-10 w-auto object-contain relative z-10 filter drop-shadow-[0_0_10px_rgba(91,147,245,0.35)]"
          />
        </div>
      </div>
    </footer>
  );
}
