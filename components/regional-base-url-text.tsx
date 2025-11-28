"use client";

import React from "react";
import { useRegionConfig } from "@/lib/region-context";

/**
 * Returns the API base URL as plain text (not a link) for use within code blocks.
 */
export function RegionalBaseUrlText() {
  const config = useRegionConfig();
  return <>{config.apiBaseUrl}</>;
}
