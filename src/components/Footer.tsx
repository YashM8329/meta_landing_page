"use client";

import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();


  return (
    <footer className="w-full hero-abyss py-12 relative overflow-hidden border-t border-white/10">
      {/* white LED grid lines + film grain matching HeroSection */}
      <div className="hero-grid-dark" />
      <div className="grain-overlay" />

      {/* Mobile-only overlay to reduce gradient brightness and improve logo contrast */}
      <div className="absolute inset-0 bg-[#030714]/10 lg:hidden pointer-events-none z-0" />

      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-0 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        {/* Left half: FOG Logo */}
        <div className="flex flex-col items-center md:items-start gap-3">
          {/* <p className="text-[15px] text-white/50 font-medium">
            Manufactured by
          </p> */}
          <Image
            src="/logos/fog-logo.png"
            alt="FOG Technologies"
            width={120}
            height={40}
            className="w-auto h-9 object-contain"
          />
        </div>


      </div>
    </footer>
  );
}
