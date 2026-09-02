"use client";

import React, { createContext, useContext } from "react";

interface CTAContextType {
  showCTA: boolean;
}

const CTAContext = createContext<CTAContextType>({ showCTA: true });

export function CTAProvider({
  showCTA = true,
  children,
}: {
  showCTA?: boolean;
  children: React.ReactNode;
}) {
  return (
    <CTAContext.Provider value={{ showCTA }}>
      {children}
    </CTAContext.Provider>
  );
}

export function useCTA() {
  return useContext(CTAContext);
}
