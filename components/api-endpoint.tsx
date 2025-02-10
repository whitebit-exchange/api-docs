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

  return (
    <div className={cn(
      "flex flex-row items-center gap-2 my-6 p-3 rounded-lg border transition-colors",
      methodBackgrounds[method]
    )}>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <MethodLabel method={method} className="text-sm md:text-base" />
        <code className="text-base md:text-lg overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-gray-900 dark:text-gray-100">{renderPath(basePath)}</span>
          {queryString && (
            <>
              <span className="text-amber-600 dark:text-amber-500 font-medium">?{queryString}</span>
            </>
          )}
        </code>
      </div>
      <CopyToClipboard getValue={() => path} className="ml-auto" />
    </div>
  );
}
