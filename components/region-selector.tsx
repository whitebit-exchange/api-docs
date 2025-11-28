"use client";

import React from "react";
import { useRegion } from "@/lib/region-context";
import { Region, REGIONS } from "@/config/regions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface RegionSelectorProps {
  className?: string;
  showLabel?: boolean;
}

export function RegionSelector({ className, showLabel = true }: RegionSelectorProps) {
  const { region, setRegion } = useRegion();

  const handleRegionChange = (value: string) => {
    setRegion(value as Region);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showLabel && (
        <label htmlFor="region-select" className="text-sm font-medium">
          Region:
        </label>
      )}
      <Select value={region} onValueChange={handleRegionChange}>
        <SelectTrigger id="region-select" className="w-auto min-w-[60px] px-1.5 py-0.5 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(REGIONS).map(([key, config]) => (
            <SelectItem key={key} value={key} className="py-1">
              {config.shortName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
