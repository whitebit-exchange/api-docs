"use client";

import React from "react";
import { useRegionConfig } from "@/lib/region-context";
import { RegionSegmentedControl } from "@/components/region-segmented-control";
import { cn } from "@/lib/utils";

interface InlineRegionSelectorProps {
  className?: string;
  showBaseUrl?: boolean;
}

export function InlineRegionSelector({ 
  className,
  showBaseUrl = true
}: InlineRegionSelectorProps) {
  const config = useRegionConfig();

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <span className="text-sm text-muted-foreground">Base URL</span>
      <span className="text-sm">(</span>
      <RegionSegmentedControl size="sm" />
      <span className="text-sm">)</span>
      {showBaseUrl && (
        <>
          <span className="text-sm text-muted-foreground">:</span>
          <a 
            href={config.apiBaseUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="regional-link"
          >
            {config.apiBaseUrl}
          </a>
        </>
      )}
    </div>
  );
}
