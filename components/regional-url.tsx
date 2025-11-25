"use client";

import React from "react";
import { useRegion } from "@/lib/region-context";
import { getApiUrl, getWebSocketUrl, getMainSiteUrl } from "@/lib/urls";
import { cn } from "@/lib/utils";

interface RegionalUrlProps {
  type: "api" | "ws" | "main";
  path: string;
  children?: React.ReactNode;
  className?: string;
}

export function RegionalUrl({ type, path, children, className }: RegionalUrlProps) {
  const { region } = useRegion();

  const getUrl = () => {
    switch (type) {
      case "api":
        return getApiUrl(path, region);
      case "ws":
        return getWebSocketUrl(path, region);
      case "main":
        return getMainSiteUrl(path, region);
      default:
        return path;
    }
  };

  const url = getUrl();

  if (children) {
    return (
      <a 
        href={url}
        className={cn("regional-link", className)}
      >
        {children}
      </a>
    );
  }

  return <code className={className}>{url}</code>;
}
