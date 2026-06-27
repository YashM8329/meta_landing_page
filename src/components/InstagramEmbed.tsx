"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  videoSrc: string;
  account: string;
  caption: string;
  likes?: string;
  comments?: string;
}

export default function InstagramEmbed({ videoSrc, account, caption, likes = "1.2K", comments = "84" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch from browser extensions that inject around <video> tags
  useEffect(() => { setMounted(true); }, []);

  // Play when in view, pause when out of view.
  // Depends on `mounted` so it runs after the <video> element is in the DOM.
  useEffect(() => {
    if (!mounted) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [mounted]);

  const handleVideoPress = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-[16px] overflow-hidden border border-white/10 bg-slate-950 aspect-[9/16] w-full group select-none"
    >
      {/* HTML5 Video element — only rendered client-side to avoid extension hydration conflicts */}
      {mounted && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          src={videoSrc}
          loop
          muted
          playsInline
          preload="none"
          onClick={handleVideoPress}
        />
      )}

      {/* Play/Pause icon indicator when paused */}
      {!isPlaying && (
        <div 
          onClick={handleVideoPress}
          className="absolute inset-0 flex items-center justify-center bg-black/20 z-20 cursor-pointer transition-opacity duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transform scale-100 hover:scale-105 transition-transform duration-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Mute indicator overlay */}
      <div 
        onClick={() => {
          const video = videoRef.current;
          if (!video) return;
          const nextMuted = !video.muted;
          video.muted = nextMuted;
          setIsMuted(nextMuted);
        }}
        className="absolute top-4 right-4 z-25 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center cursor-pointer text-white transition-opacity duration-300 opacity-80 hover:opacity-100"
      >
        {isMuted ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </div>

      {/* Top vignetting/gradient */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10" />

      {/* Bottom vignetting/gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />

      {/* Instagram Reels Template UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 z-15 pointer-events-none">
        <div className="flex items-end justify-end w-full">
          {/* Bottom Right: Action bar (Likes, Comments, Share, Music Vinyl) */}
          <div className="flex flex-col items-center gap-4 text-white pb-2 pointer-events-auto">
            {/* Like */}
            <button className="flex flex-col items-center group/btn cursor-pointer">
              <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1" className="group-hover/btn:scale-110 transition-transform">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold mt-0.5">{likes}</span>
            </button>

            {/* Comments */}
            <button className="flex flex-col items-center group/btn cursor-pointer">
              <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1" className="group-hover/btn:scale-110 transition-transform">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold mt-0.5">{comments}</span>
            </button>

            {/* Share */}
            <button className="flex flex-col items-center group/btn cursor-pointer">
              <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:scale-110 transition-transform -rotate-12 translate-x-[2px] -translate-y-[1px]">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
            </button>

            {/* Options */}
            <button className="flex flex-col items-center group/btn cursor-pointer">
              <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </div>
            </button>

            {/* Vinyl record spinning */}
            <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center overflow-hidden animate-spin-slow shadow-md cursor-pointer mt-1">
              <img src="/logos/logo.png" alt="FOG Audio" className="w-4.5 h-4.5 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
