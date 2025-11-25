"use client";

import React, { useMemo, useState } from "react";
import { useRegion } from "@/lib/region-context";
import { Region } from "@/config/regions";
import { cn } from "@/lib/utils";
import { Alert } from "@/components/alert";

type DisclaimerVariant = "availability" | "modification" | "requirement" | "restriction";
type DisclaimerSeverity = "info" | "warning" | "critical";

interface RegionalDisclaimerProps {
  regions: Region[] | { include?: Region[]; exclude?: Region[] };
  variant: DisclaimerVariant;
  severity?: DisclaimerSeverity;
  title?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  persistState?: boolean;
  showAfter?: string;
  showBefore?: string;
  className?: string;
}

const variantStyles: Record<DisclaimerVariant, { icon: string }> = {
  availability: { icon: "ℹ️" },
  modification: { icon: "⚠️" },
  requirement: { icon: "📋" },
  restriction: { icon: "🚫" },
};

const severityMap: Record<DisclaimerSeverity, "info" | "warning" | "error"> = {
  info: "info",
  warning: "warning",
  critical: "error",
};

export function RegionalDisclaimer({
  regions,
  variant,
  severity = "info",
  title,
  children,
  collapsible = false,
  defaultCollapsed = false,
  persistState = false,
  showAfter,
  showBefore,
  className,
}: RegionalDisclaimerProps) {
  const { region } = useRegion();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  React.useEffect(() => {
    if (persistState && typeof window !== "undefined") {
      const key = `disclaimer-${variant}-${region}`;
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    }
  }, [persistState, variant, region]);

  // Determine if this disclaimer should be visible
  const isVisible = useMemo(() => {
    // Time-based visibility
    if (showAfter || showBefore) {
      const now = new Date();
      if (showAfter && now < new Date(showAfter)) return false;
      if (showBefore && now > new Date(showBefore)) return false;
    }

    // Region-based visibility
    if (Array.isArray(regions)) {
      return regions.includes(region);
    } else {
      // Object with include/exclude
      if (regions.include) {
        return regions.include.includes(region);
      }
      if (regions.exclude) {
        return !regions.exclude.includes(region);
      }
      return true; // Default to visible if no conditions
    }
  }, [regions, region, showAfter, showBefore]);

  if (!isVisible) {
    return null;
  }

  const variantStyle = variantStyles[variant];
  const alertType = severityMap[severity];

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    if (persistState && typeof window !== "undefined") {
      const key = `disclaimer-${variant}-${region}`;
      localStorage.setItem(key, String(!isCollapsed));
    }
  };

  const regionBadge = (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 ml-2">
      {region}
    </span>
  );

  const headerContent = (
    <>
      {title && <span className="font-semibold">{title}</span>}
      {!title && variantStyle.icon && <span>{variantStyle.icon}</span>}
      {regionBadge}
    </>
  );

  return (
    <div className={cn("my-4", className)} role="region" aria-label={`Regional disclaimer for ${region}`}>
      <Alert
        type={alertType}
        header={collapsible ? (
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 w-full text-left cursor-pointer hover:opacity-80 transition-opacity"
            aria-expanded={!isCollapsed}
            aria-controls={`disclaimer-content-${variant}`}
          >
            {headerContent}
            <span className="ml-auto text-xs">
              {isCollapsed ? "▼" : "▲"}
            </span>
          </button>
        ) : headerContent}
        message={!collapsible || !isCollapsed ? (
          <div id={`disclaimer-content-${variant}`}>
            {children}
          </div>
        ) : null}
        className={cn(
          collapsible && isCollapsed && "cursor-pointer",
        )}
      />
    </div>
  );
}
