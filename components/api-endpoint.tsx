"use client";

import { MethodLabel } from "@/components/method-label";
import { CopyToClipboard } from "nextra/components";
import { cn } from "@/lib/utils";
import { useRegion } from "@/lib/region-context";
import { getApiUrl } from "@/lib/urls";
import { Region } from "@/config/regions";
import { PROTOCOL_HTTPS } from "@/constants";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

interface ApiEndpointProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  regionOverride?: Region;
  showRegionBadge?: boolean;
  regionalPaths?: Partial<Record<Region, string>>;
  regionalNotes?: Partial<Record<Region, string>>;
  fullUrl?: boolean;
  deprecated?: boolean;
}

const methodBackgrounds: Record<ApiEndpointProps["method"], string> = {
  GET: "bg-green-50/50 dark:bg-green-900/20",
  POST: "bg-blue-50/50 dark:bg-blue-900/20",
  PUT: "bg-yellow-50/50 dark:bg-yellow-900/20",
  DELETE: "bg-red-50/50 dark:bg-red-900/20",
  PATCH: "bg-purple-50/50 dark:bg-purple-900/20",
};

export function ApiEndpoint({
  method,
  path,
  regionOverride,
  showRegionBadge = false,
  regionalPaths,
  regionalNotes,
  fullUrl = true,
  deprecated = false,
}: ApiEndpointProps) {
  const { region, config } = useRegion();
  const effectiveRegion = regionOverride ?? region;

  // Get the effective path (use regional path if available)
  const effectivePath = useMemo(() => {
    if (regionalPaths?.[effectiveRegion]) {
      return regionalPaths[effectiveRegion]!;
    }
    return path;
  }, [path, regionalPaths, effectiveRegion]);

  // Construct full URL if needed
  const fullEndpointUrl = useMemo(() => {
    // If path already contains a full HTTPS URL, return as-is (security: only allow HTTPS)
    if (effectivePath.startsWith(PROTOCOL_HTTPS)) {
      return effectivePath;
    }

    if (fullUrl) {
      return getApiUrl(effectivePath, effectiveRegion);
    }

    return effectivePath;
  }, [effectivePath, fullUrl, effectiveRegion]);

  // Split the path into base path and query parameters for display
  const [basePath, queryString] = fullEndpointUrl.split('?');

  // Parse dynamic path parameters
  const renderPath = (pathPart: string) => {
    const methodTextColors: Record<ApiEndpointProps["method"], string> = {
      GET: "text-green-700 dark:text-green-400",
      POST: "text-blue-700 dark:text-blue-400",
      PUT: "text-yellow-700 dark:text-yellow-400",
      DELETE: "text-red-700 dark:text-red-400",
      PATCH: "text-purple-700 dark:text-purple-400",
    };

    return pathPart.split(/({[^}]+})/).map((part, index) => {
      if (part.match(/^{[^}]+}$/)) {
        return (
          <span key={index} className={cn("font-medium", methodTextColors[method])}>
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Parse query parameters with formatting
  const renderQueryParams = (queryStr: string) => {
    if (!queryStr) return null;

    // Split by & but keep the & symbol for display
    return queryStr.split('&').map((param, index) => {
      const [key, value] = param.split('=').map((part) => part.trim());

      return (
        <span key={index} className="inline">
          {index > 0 && <span className="text-gray-500">&</span>}
          <span className="whitespace-nowrap inline-block text-amber-600 dark:text-amber-500 font-medium">
            <span>{key}</span>
            {value && (
              <>
                <span>{'='}{value}</span>
              </>
            )}
          </span>
        </span>
      );
    });
  };

  // Check if there are regional differences
  const hasRegionalDifferences = regionalPaths !== undefined || regionalNotes !== undefined;

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start gap-2 my-6 p-3 rounded-lg border transition-colors relative",
      methodBackgrounds[method],
      deprecated && "opacity-75"
    )}>
      <div className="flex flex-col sm:flex-row items-start gap-2 w-full">
        <div className="flex items-center gap-2">
          <MethodLabel method={method} className="text-sm md:text-base" />
          {showRegionBadge && (
            <Badge variant="outline" className="text-xs">
              {config.shortName}
            </Badge>
          )}
          {hasRegionalDifferences && !showRegionBadge && (
            <span className="text-xs text-muted-foreground" title="This endpoint has region-specific behavior">
              ⚠️
            </span>
          )}
          {deprecated && (
            <Badge variant="destructive" className="text-xs">
              Deprecated
            </Badge>
          )}
        </div>
        <code className="text-base md:text-lg w-full break-all">
          <span className="text-gray-900 dark:text-gray-100">{renderPath(basePath)}</span>
          {queryString && (
            <>
              <span className="text-amber-600 dark:text-amber-500 font-medium">?</span>
              {renderQueryParams(queryString)}
            </>
          )}
        </code>
        {regionalNotes?.[effectiveRegion] && (
          <div className="text-xs text-muted-foreground mt-1">
            {regionalNotes[effectiveRegion]}
          </div>
        )}
      </div>
      <CopyToClipboard
        getValue={() => fullEndpointUrl}
        className="absolute sm:relative right-3 top-3 sm:right-auto sm:top-auto sm:self-start"
      />
    </div>
  );
}
