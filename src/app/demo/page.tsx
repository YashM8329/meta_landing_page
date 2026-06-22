/* DESIGN DEMO — not the final page.
   Matches the crypto-wallet reference: white/grey base, #1D6CEF blue, soft blue
   glows, rounded cards, circular icon buttons, dark contrast pills, soft shadows.
   Hero is rendered twice (Urbanist vs Inter) for a direct font comparison. */

const BLUE = "#1D6CEF";

/* ---------- tiny line icons (stroke, minimal) ---------- */
function Icon({ name, size = 20, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "link":
      return (<svg {...common}><path d="M9 12a3 3 0 0 1 3-3h3a3 3 0 0 1 0 6h-1" /><path d="M15 12a3 3 0 0 1-3 3H9a3 3 0 0 1 0-6h1" /></svg>);
    case "pulse":
      return (<svg {...common}><path d="M3 12h3l2 6 4-12 2 6h7" /></svg>);
    case "up":
      return (<svg {...common}><path d="M12 19V5M5 12l7-7 7 7" /></svg>);
    case "down":
      return (<svg {...common}><path d="M12 5v14M5 12l7 7 7-7" /></svg>);
    case "swap":
      return (<svg {...common}><path d="M7 4 4 7l3 3" /><path d="M4 7h13" /><path d="m17 20 3-3-3-3" /><path d="M20 17H7" /></svg>);
    case "wallet":
      return (<svg {...common}><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M16 12h2" /></svg>);
    case "arrow-ur":
      return (<svg {...common}><path d="M7 17 17 7M9 7h8v8" /></svg>);
    case "arrow-r":
      return (<svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
    case "arrow-l":
      return (<svg {...common}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
    case "plus":
      return (<svg {...common}><path d="M12 5v14M5 12h14" /></svg>);
    case "home":
      return (<svg {...common}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>);
    case "search":
      return (<svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>);
    case "grid":
      return (<svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>);
    case "pie":
      return (<svg {...common}><path d="M12 3a9 9 0 1 0 9 9h-9V3z" /></svg>);
    default:
      return null;
  }
}

/* ---------- Hero card (reference left screen) ---------- */
function HeroDemo({ fontVar, fontLabel }: { fontVar: string; fontLabel: string }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-[#9aa3b2] mb-2 px-1">Hero · {fontLabel}</p>
      <div
        className="relative rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(10,14,26,0.18)]"
        style={{ height: 560, fontFamily: fontVar }}
      >
        {/* base gradient: blue glow top → black bottom */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg,#d8e6ff 0%,#6aa0f5 26%,#1d3f8f 52%,#050811 100%)" }}
        />
        {/* radial blue glow */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 64% 26%, rgba(29,108,239,0.85) 0%, transparent 55%)" }}
        />

        {/* dashed arrows */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 560" fill="none" aria-hidden="true">
          <path d="M150 110 q-50 10 -60 70" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeDasharray="4 5" />
          <path d="M270 320 q40 -10 30 -70" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="4 5" />
        </svg>

        {/* floating frosted circles */}
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{ width: 150, height: 150, left: 36, top: 150, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1d3f8f]">
            <Icon name="pulse" />
          </div>
        </div>
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{ width: 130, height: 130, right: 30, top: 92, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.35)" }}
        >
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#1d3f8f]">
            <Icon name="link" />
          </div>
        </div>

        {/* bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-6 pt-16" style={{ background: "linear-gradient(to top, rgba(5,8,17,0.92) 30%, transparent 100%)" }}>
          <p className="text-[13px] font-medium text-white/60 mb-2">HyperGrid</p>
          <h2 className="text-white text-[34px] leading-[1.05] font-bold tracking-[-0.02em] mb-5">
            World&apos;s best
            <br />
            social attraction
          </h2>

          {/* progress dashes */}
          <div className="flex items-center gap-1.5 mb-6">
            <span className="h-1 w-5 rounded-full bg-white/25" />
            <span className="h-1 w-5 rounded-full bg-white/25" />
            <span className="h-1 w-5 rounded-full bg-white/25" />
            <span className="h-1 w-9 rounded-full bg-white" />
          </div>

          {/* control row */}
          <div className="flex items-center gap-3">
            <button className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center text-white shrink-0" aria-label="Back">
              <Icon name="arrow-l" />
            </button>
            <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black shrink-0" aria-label="Next">
              <Icon name="arrow-r" />
            </button>
            <div className="flex-1 h-14 rounded-full flex items-center justify-between px-5 text-white" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <span className="text-[15px] font-semibold">Request</span>
              <span className="text-white/50 tracking-widest text-[13px]">›››</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  const urbanist = "var(--font-urbanist)";
  const inter = "var(--font-inter)";

  return (
    <main className="min-h-dvh bg-[#F8F8F8] px-4 py-8" style={{ fontFamily: urbanist }}>
      <div className="max-w-[400px] mx-auto">
        <p className="text-[12px] font-semibold tracking-[0.18em] text-[#9aa3b2] uppercase mb-1">Design demo</p>
        <h1 className="text-[26px] font-bold text-black tracking-[-0.02em] mb-8">
          HyperGrid — new design language
        </h1>

        <div className="flex flex-col gap-10">
          {/* Hero — both fonts */}
          <HeroDemo fontVar={urbanist} fontLabel="Urbanist" />
          <HeroDemo fontVar={inter} fontLabel="Inter" />

          {/* Revenue card (balance-card style) */}
          <div>
            <p className="text-[12px] font-medium text-[#9aa3b2] mb-2 px-1">Revenue card</p>
            <div
              className="rounded-[26px] p-5 text-white shadow-[0_18px_44px_rgba(29,108,239,0.32)] relative overflow-hidden"
              style={{ background: `radial-gradient(circle at 75% 15%, #5b93f5 0%, ${BLUE} 45%, #144bc0 100%)` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center font-bold text-[14px]">FX</div>
                  <span className="text-[15px] font-semibold">FOG Technologies</span>
                </div>
                <button className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white" aria-label="Add">
                  <Icon name="plus" size={18} />
                </button>
              </div>

              <p className="text-[13px] text-white/70 mb-1">Revenue / month</p>
              <p className="text-[40px] font-bold leading-none tracking-[-0.02em] mb-2" style={{ fontVariantNumeric: "tabular-nums" }}>
                $18,000
              </p>
              <p className="text-[13px] text-white/80 mb-6 flex items-center gap-1">
                <Icon name="arrow-ur" size={14} /> $5,720 / week avg
              </p>

              <div className="flex items-center justify-between">
                {[
                  { i: "up", l: "Send" },
                  { i: "down", l: "Receive" },
                  { i: "swap", l: "Swap" },
                  { i: "wallet", l: "Brochure" },
                ].map((b) => (
                  <div key={b.l} className="flex flex-col items-center gap-1.5">
                    <button className="w-12 h-12 rounded-full bg-white/18 border border-white/25 flex items-center justify-center text-white" style={{ backdropFilter: "blur(8px)" }} aria-label={b.l}>
                      <Icon name={b.i} size={20} color="white" />
                    </button>
                    <span className="text-[10px] text-white/70">{b.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features — dark asset pills */}
          <div>
            <p className="text-[12px] font-medium text-[#9aa3b2] mb-2 px-1">Features</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Unmanned", sub: "Fully unattended", icon: "pulse" },
                { name: "Multiplayer", sub: "1–6 players", icon: "grid" },
              ].map((f) => (
                <div key={f.name} className="rounded-[20px] bg-black p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(29,108,239,0.2)", color: "#6aa0f5" }}>
                    <Icon name={f.icon} size={20} />
                  </div>
                  <div>
                    <p className="text-white text-[14px] font-semibold leading-tight">{f.name}</p>
                    <p className="text-white/50 text-[11px]">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue movement chart card */}
          <div>
            <p className="text-[12px] font-medium text-[#9aa3b2] mb-2 px-1">Revenue movement</p>
            <div className="rounded-[26px] bg-white p-5 shadow-[0_10px_30px_rgba(10,14,26,0.06)]">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[16px] font-semibold text-black">Revenue movement</span>
                <button className="w-9 h-9 rounded-full border border-[#ececec] flex items-center justify-center text-black" aria-label="Expand">
                  <Icon name="arrow-ur" size={16} />
                </button>
              </div>
              <svg viewBox="0 0 320 90" className="w-full" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BLUE} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 60 L45 52 L90 58 L135 40 L180 48 L225 30 L270 38 L320 24" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0 60 L45 52 L90 58 L135 40 L180 48 L225 30 L270 38 L320 24 L320 90 L0 90 Z" fill="url(#area)" />
                {[[45,52],[135,40],[225,30],[320,24]].map(([x,y]) => (
                  <circle key={x} cx={x} cy={y} r="3.5" fill="white" stroke={BLUE} strokeWidth="2" />
                ))}
              </svg>
            </div>
          </div>

          {/* Bottom nav sample */}
          <div className="rounded-full bg-white shadow-[0_8px_24px_rgba(10,14,26,0.08)] px-7 py-3 flex items-center justify-between">
            <button className="w-11 h-11 rounded-full bg-black flex items-center justify-center text-white" aria-label="Home"><Icon name="home" /></button>
            <button className="text-[#b3b9c4]" aria-label="Search"><Icon name="search" /></button>
            <button className="text-[#b3b9c4]" aria-label="Gallery"><Icon name="grid" /></button>
            <button className="text-[#b3b9c4]" aria-label="Stats"><Icon name="pie" /></button>
          </div>
        </div>

        <p className="text-[11px] text-[#9aa3b2] text-center mt-10">
          Demo only · palette #1D6CEF · #000 · #FFF · #F8F8F8
        </p>
      </div>
    </main>
  );
}
