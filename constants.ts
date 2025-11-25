const isProduction = process.env.NODE_ENV === "production";

export const PROTOCOL_HTTPS = "https://";
export const PROTOCOL_WSS = "wss://";

export { type Region, REGIONS, DEFAULT_REGION, REGION_GLOBAL, REGION_EU } from "@/config/regions";
