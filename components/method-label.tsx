import { cn } from "@/lib/utils";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface MethodLabelProps {
  method: Method;
  className?: string;
}

const methodColors: Record<Method, string> = {
  GET: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  POST: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PUT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  PATCH: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export function MethodLabel({ method, className }: MethodLabelProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 text-xs font-medium rounded-md",
        methodColors[method],
        className
      )}
    >
      {method}
    </span>
  );
}
