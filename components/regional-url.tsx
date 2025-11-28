"use client";

import React from "react";
import { useRegion } from "@/lib/region-context";
import { getApiUrl, getWebSocketUrl, getMainSiteUrl } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { URL_TYPE_API, URL_TYPE_WS, URL_TYPE_MAIN, type UrlType } from "@/constants";

interface RegionalUrlProps {
  type: UrlType;
  path: string;
  children?: React.ReactNode;
  className?: string;
}

export function RegionalUrl({ type, path, children, className }: RegionalUrlProps) {
  const { region } = useRegion();

  const getUrl = () => {
    switch (type) {
      case URL_TYPE_API:
        return getApiUrl(path, region);
      case URL_TYPE_WS:
        return getWebSocketUrl(path, region);
      case URL_TYPE_MAIN:
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
