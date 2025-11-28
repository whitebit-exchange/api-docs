import { Region, REGIONS, DEFAULT_REGION } from "@/config/regions";
import { PROTOCOL_HTTPS, PROTOCOL_WSS } from "@/constants";

export function getApiUrl(path: string, region?: Region): string {
  const effectiveRegion = region || DEFAULT_REGION;
  const baseUrl = REGIONS[effectiveRegion].apiBaseUrl;
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  if (path.startsWith(PROTOCOL_HTTPS)) {
    return path;
  }
  
  return `${baseUrl}${cleanPath}`;
}

export function getWebSocketUrl(path: string, region?: Region): string {
  const effectiveRegion = region || DEFAULT_REGION;
  const baseUrl = REGIONS[effectiveRegion].wsBaseUrl;
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  if (path.startsWith(PROTOCOL_WSS)) {
    return path;
  }
  
  return `${baseUrl}${cleanPath}`;
}

export function getMainSiteUrl(path: string, region?: Region): string {
  const effectiveRegion = region || DEFAULT_REGION;
  const baseUrl = REGIONS[effectiveRegion].mainSiteUrl;
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  if (path.startsWith(PROTOCOL_HTTPS)) {
    return path;
  }
  
  return `${baseUrl}${cleanPath}`;
}
