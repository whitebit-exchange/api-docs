"use client";

import React from "react";
import { useRegion } from "@/lib/region-context";
import { Region, REGIONS, REGION_GLOBAL, REGION_EU } from "@/config/regions";
import { cn } from "@/lib/utils";

interface RegionSegmentedControlProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

export function RegionSegmentedControl({ 
  className, 
  size = "sm",
  showTooltip = false 
}: RegionSegmentedControlProps) {
  const { region, setRegion } = useRegion();

  const sizeClasses = {
    sm: "h-7 text-xs px-2",
    md: "h-8 text-sm px-3",
    lg: "h-9 text-sm px-4",
  };

  const handleRegionChange = (newRegion: Region) => {
    if (newRegion !== region) {
      setRegion(newRegion);
    }
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-md border border-input bg-background p-0.5",
        className
      )}
      role="tablist"
      aria-label="Select API region"
      title={showTooltip ? "Switch between Global and EU API endpoints" : undefined}
      data-region-toggle="true"
    >
      <button
        type="button"
        role="tab"
        aria-selected={region === REGION_GLOBAL}
        aria-controls="region-panel"
        onClick={() => handleRegionChange(REGION_GLOBAL)}
        className={cn(
          "rounded-sm px-2 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          sizeClasses[size],
          region === REGION_GLOBAL
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {REGIONS[REGION_GLOBAL].shortName}
      </button>
      <div className="h-4 w-px bg-border mx-0.5" aria-hidden="true" />
      <button
        type="button"
        role="tab"
        aria-selected={region === REGION_EU}
        aria-controls="region-panel"
        onClick={() => handleRegionChange(REGION_EU)}
        className={cn(
          "rounded-sm px-2 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          sizeClasses[size],
          region === REGION_EU
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {REGIONS[REGION_EU].shortName}
      </button>
    </div>
  );
}
