"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useVideoLoad } from "@/lib/VideoLoadContext";

interface Props {
  videoSrc: string;
  account: string;
  caption: string;
  likes?: string;
  comments?: string;
  gameZone?: string;
}

export default function InstagramEmbed({ videoSrc, account, caption, likes = "1.2K", comments = "84", gameZone }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  // isPlaying = video is actively playing frames (not paused by user, not buffering)
  const [isPlaying, setIsPlaying] = useState(false);
  // isBuffering = video is loading/stalling (distinct from user-paused)
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const id = useId();
  const { reportStalling, reportPlaying } = useVideoLoad();

  // Prevent hydration mismatch from browser extensions that inject around <video> tags
  useEffect(() => { setMounted(true); }, []);

  // Play when in view, pause when out of view, and only load video when close to viewport.
  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          setIsBuffering(true);
          setIsPausedByUser(false);
          reportStalling(id);
          // Play video after a brief tick to allow source assignment to settle if newly intersected
          setTimeout(() => {
            const video = videoRef.current;
            if (video && entry.isIntersecting) {
              video.play().catch(() => {});
            }
          }, 50);
        } else {
          const video = videoRef.current;
          if (video) {
            video.pause();
          }
          setIsPlaying(false);
          setIsBuffering(false);
          setIsPausedByUser(false);
          reportPlaying(id);
        }
      },
      { threshold: 0.05, rootMargin: "150px" }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      reportPlaying(id);
    };
  }, [mounted, id, reportStalling, reportPlaying]);

  const handleVideoPress = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setIsPausedByUser(false);
      video.play().catch(() => {});
    } else {
      video.pause();
      setIsPausedByUser(true);
      setIsPlaying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-[16px] overflow-hidden border border-white/10 bg-slate-950 aspect-[9/16] w-full group select-none"
    >
      {/* HTML5 Video element — only loaded when intersecting the viewport */}
      {mounted && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          src={hasIntersected ? videoSrc : undefined}
          poster={videoSrc.replace(/^\/video\//, "/video/posters/").replace(/\.mp4$/, ".jpg")}
          loop
          muted
          playsInline
          preload="none"
          onClick={handleVideoPress}
          onPlay={() => { setIsPlaying(true); setIsBuffering(false); reportPlaying(id); }}
          onPlaying={() => { setIsPlaying(true); setIsBuffering(false); reportPlaying(id); }}
          onPause={() => { setIsPlaying(false); setIsBuffering(false); }}
          onWaiting={() => { setIsPlaying(false); setIsBuffering(true); reportStalling(id); }}
          onStalled={() => { setIsPlaying(false); setIsBuffering(true); reportStalling(id); }}
          onCanPlayThrough={() => { setIsBuffering(false); }}
          onError={() => { setIsPlaying(false); setIsBuffering(false); reportPlaying(id); }}
        />
      )}

      {/* Loading spinner — only while buffering, not while user-paused */}
      {isBuffering && !isPausedByUser && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 pointer-events-none">
          <svg className="animate-spin text-white/60" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Loading video">
            <circle cx="20" cy="20" r="16" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
            <path d="M20 4a16 16 0 0116 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Paused-by-user indicator — play icon, not a spinner */}
      {isPausedByUser && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <polygon points="6 3 20 12 6 21 6 3" />
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
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />

      {/* Instagram Reels Template UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 z-15 pointer-events-none">
        <div className="flex items-end justify-between w-full gap-4">
          {/* Bottom Left: Account Info, Location Tag & Caption */}
          <div className="flex flex-col gap-2 text-white max-w-[70%] pb-2 pointer-events-auto text-left">
            {/* Account Info (Avatar + Name + Follow Button) */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex-shrink-0 flex items-center justify-center p-[1.5px]">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[9px] font-bold text-white uppercase">
                  {account ? account.slice(0, 2) : "HG"}
                </div>
              </div>
              <span className="font-semibold text-[13px] tracking-tight truncate max-w-[90px] md:max-w-[110px]">
                {account || "hypergrid.ai"}
              </span>
              {/* <button className="text-[10px] font-bold border border-white/40 px-2.5 py-0.5 rounded-full hover:bg-white/10 transition-colors shrink-0">
                Follow
              </button> */}
            </div>

            {/* Game Zone Name (styled like location badge) */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-white/15 px-2 py-0.5 rounded-[4px] w-fit backdrop-blur-sm border border-white/10">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-light">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="truncate max-w-[120px] md:max-w-[150px]">{gameZone || "FOG Arena"}</span>
            </div>

            {/* Caption */}
            {/* <p className="text-[11.5px] text-white/90 leading-snug line-clamp-2 drop-shadow-sm font-medium">
              {caption}
            </p> */}
          </div>

          {/* Bottom Right: Action bar — decorative only, matches Reels chrome */}
          <div className="flex flex-col items-center gap-4 text-white pb-2 pointer-events-none select-none" aria-hidden="true">
            {/* Like */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold mt-0.5">{likes}</span>
            </div>

            {/* Comments */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold mt-0.5">{comments}</span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="-rotate-12 translate-x-[2px] -translate-y-[1px]">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </div>
            </div>

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
