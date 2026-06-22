"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT_ID = "instagram-embed-script";

function loadAndProcess() {
  const process = () => window.instgrm?.Embeds?.process();
  if (document.getElementById(SCRIPT_ID)) {
    process();
    return;
  }
  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.src = "https://www.instagram.com/embed.js";
  s.async = true;
  s.onload = process;
  document.body.appendChild(s);
}

interface Props {
  url: string;
  account: string;
  caption: string;
}

/**
 * Lazy, non-interactive Instagram embed:
 * - Facade (no network) until scrolled near; then mounts the real embed.
 * - Natural height (no internal scroll), and a transparent overlay blocks clicks.
 */
export default function InstagramEmbed({ url, account, caption }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) loadAndProcess();
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative rounded-[12px] overflow-hidden border border-line bg-white shadow-[0_10px_30px_rgba(10,14,26,0.08)]"
    >
      {!inView ? (
        <div
          className="relative flex flex-col justify-end p-4"
          style={{ aspectRatio: "4/5", background: "linear-gradient(160deg,#0a1838 0%,#11317a 60%,#1d6cef 100%)" }}
          aria-label={`Instagram reel from ${account}`}
        >
          <div className="absolute inset-0 grid-texture-dark opacity-40" />
          <div className="absolute top-4 left-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeOpacity="0.85" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="4.5" stroke="white" strokeOpacity="0.85" strokeWidth="1.6" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="white" fillOpacity="0.85" />
            </svg>
          </div>
          <div className="relative z-10">
            <p className="text-white font-bold text-[15px] leading-snug">{account}</p>
            <p className="text-white/60 text-[12.5px] mt-1 line-clamp-2">{caption}</p>
          </div>
        </div>
      ) : (
        /* Cropped: header (profile + "View profile") and footer (likes/comment/
           "view more") are clipped off; the video plays inline on tap. */
        <div className="ig-crop" style={{ height: 400 }}>
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ margin: 0, width: "100%", minWidth: "unset", border: "none", boxShadow: "none" }}
          />
        </div>
      )}
    </div>
  );
}
