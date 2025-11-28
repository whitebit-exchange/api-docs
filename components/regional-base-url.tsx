"use client";

import React from "react";
import { useRegionConfig } from "@/lib/region-context";

/**
 * Returns the API base URL as a clickable link.
 */
export function RegionalBaseUrl() {
  const config = useRegionConfig();
  return (
    <a 
      href={config.apiBaseUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="regional-link"
    >
      {config.apiBaseUrl}
    </a>
  );
}
