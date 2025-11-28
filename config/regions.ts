export type Region = "GLOBAL" | "EU";

// Region name constants to avoid magic strings
export const REGION_GLOBAL: Region = "GLOBAL";
export const REGION_EU: Region = "EU";

export interface RegionConfig {
  apiBaseUrl: string;
  wsBaseUrl: string;
  mainSiteUrl: string;
  displayName: string;
  shortName: string;
}

export const REGIONS: Record<Region, RegionConfig> = {
  [REGION_GLOBAL]: {
    apiBaseUrl: "https://whitebit.com",
    wsBaseUrl: "wss://api.whitebit.com",
    mainSiteUrl: "https://whitebit.com",
    displayName: "WhiteBIT Global",
    shortName: "Global",
  },
  [REGION_EU]: {
    apiBaseUrl: "https://whitebit.eu",
    wsBaseUrl: "wss://api.whitebit.eu",
    mainSiteUrl: "https://whitebit.eu",
    displayName: "WhiteBIT EU",
    shortName: "EU",
  },
};

export const DEFAULT_REGION: Region = REGION_GLOBAL;
