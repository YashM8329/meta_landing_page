"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";

// Each video registers itself with a unique id. When it starts buffering it
// calls reportStalling(id), when it's playing it calls reportPlaying(id).
// The context accumulates stalling ids and exposes how long any stall has
// been active, so the toast can decide when to appear.

interface VideoLoadContextValue {
  reportStalling: (id: string) => void;
  reportPlaying: (id: string) => void;
  stallingCount: number;
}

const VideoLoadContext = createContext<VideoLoadContextValue>({
  reportStalling: () => {},
  reportPlaying: () => {},
  stallingCount: 0,
});

export function VideoLoadProvider({ children }: { children: React.ReactNode }) {
  // Set of video ids currently stalling
  const stallingRef = useRef<Set<string>>(new Set());
  const [stallingCount, setStallingCount] = useState(0);

  const reportStalling = useCallback((id: string) => {
    if (!stallingRef.current.has(id)) {
      stallingRef.current.add(id);
      setStallingCount(stallingRef.current.size);
    }
  }, []);

  const reportPlaying = useCallback((id: string) => {
    if (stallingRef.current.has(id)) {
      stallingRef.current.delete(id);
      setStallingCount(stallingRef.current.size);
    }
  }, []);

  return (
    <VideoLoadContext.Provider value={{ reportStalling, reportPlaying, stallingCount }}>
      {children}
    </VideoLoadContext.Provider>
  );
}

export function useVideoLoad() {
  return useContext(VideoLoadContext);
}
