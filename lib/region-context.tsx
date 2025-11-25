"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Region, REGIONS, DEFAULT_REGION, RegionConfig, REGION_GLOBAL, REGION_EU } from "@/config/regions";

interface RegionContextValue {
  region: Region;
  config: RegionConfig;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextValue | undefined>(undefined);

const STORAGE_KEY = "whitebit-docs-region";

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<Region>(DEFAULT_REGION);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    // Check query parameter first
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryRegion = params.get("region")?.toUpperCase();
      
      if (queryRegion === REGION_EU || queryRegion === REGION_GLOBAL) {
        setRegionState(queryRegion as Region);
        localStorage.setItem(STORAGE_KEY, queryRegion);
        setIsInitialized(true);
        return;
      }

      // Check localStorage
      const storedRegion = localStorage.getItem(STORAGE_KEY);
      if (storedRegion === REGION_EU || storedRegion === REGION_GLOBAL) {
        setRegionState(storedRegion as Region);
        setIsInitialized(true);
        return;
      }

      setRegionState(DEFAULT_REGION);
      setIsInitialized(true);
    } else {
      // SSR: Initialize immediately with default to prevent hydration mismatch
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const setRegion = useCallback((newRegion: Region) => {
    setRegionState(newRegion);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newRegion);
    }
  }, []);

  const config = REGIONS[region];

  return (
    <RegionContext.Provider value={{ region, config, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion(): RegionContextValue {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}

export function useRegionConfig(): RegionConfig {
  const { config } = useRegion();
  return config;
}
