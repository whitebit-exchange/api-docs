const isProduction = process.env.NODE_ENV === "production";

export const PROTOCOL_HTTPS = "https://";
export const PROTOCOL_WSS = "wss://";

export const URL_TYPE_API = "api" as const;
export const URL_TYPE_WS = "ws" as const;
export const URL_TYPE_MAIN = "main" as const;

export type UrlType = typeof URL_TYPE_API | typeof URL_TYPE_WS | typeof URL_TYPE_MAIN;

export { type Region, REGIONS, DEFAULT_REGION, REGION_GLOBAL, REGION_EU } from "@/config/regions";
