"use client";

export default function MobileBrochureCTA() {
  const handleClick = () => {
    const el = document.getElementById("brochure-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full px-6 mt-8 md:hidden flex justify-center select-none">
      <button 
        onClick={handleClick}
        className="relative w-full max-w-[340px] h-[52px] text-white font-bold text-[15px] rounded-lg flex items-center justify-center gap-2 overflow-hidden shadow-lg bg-gradient-to-r from-[#1D6CEF] via-[#2f74e6] to-[#1D6CEF] active:scale-[0.98] transition-all duration-150 border border-white/10"
      >
        {/* Halftone pattern matching the main form button */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1.5px, transparent 2px)',
            backgroundSize: '6px 6px',
            WebkitMaskImage: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 65%, black 100%)',
            maskImage: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 65%, black 100%)',
          }}
        />
        <span className="relative z-10 flex items-center gap-2">
          Request the brochure
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </div>
  );
}
