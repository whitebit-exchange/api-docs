import { MethodLabel } from "@/components/method-label";
import { CopyToClipboard } from "nextra/components";
import { cn } from "@/lib/utils";

interface ApiEndpointProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
}

const methodBackgrounds: Record<ApiEndpointProps["method"], string> = {
  GET: "bg-green-50/50 dark:bg-green-900/20",
  POST: "bg-blue-50/50 dark:bg-blue-900/20",
  PUT: "bg-yellow-50/50 dark:bg-yellow-900/20",
  DELETE: "bg-red-50/50 dark:bg-red-900/20",
  PATCH: "bg-purple-50/50 dark:bg-purple-900/20",
};

export function ApiEndpoint({ method, path }: ApiEndpointProps) {
  // Split the path into base path and query parameters
  const [basePath, queryString] = path.split('?');

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

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start gap-2 my-6 p-3 rounded-lg border transition-colors relative",
      methodBackgrounds[method]
    )}>
      <div className="flex flex-col sm:flex-row items-start gap-2 w-full">
        <MethodLabel method={method} className="text-sm md:text-base" />
        <code className="text-base md:text-lg w-full break-all">
          <span className="text-gray-900 dark:text-gray-100">{renderPath(basePath)}</span>
          {queryString && (
            <>
              <span className="text-amber-600 dark:text-amber-500 font-medium">?</span>
              {renderQueryParams(queryString)}
            </>
          )}
        </code>
      </div>
      <CopyToClipboard
        getValue={() => path}
        className="absolute sm:relative right-3 top-3 sm:right-auto sm:top-auto sm:self-start"
      />
    </div>
  );
}
