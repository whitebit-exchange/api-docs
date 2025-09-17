import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps {
  /**
   * Optional: Header/title for the alert
   */
  header?: React.ReactNode;
  /**
   * The message or content to display inside the alert.
   */
  message: React.ReactNode;
  /**
   * Optional: Alert type for styling (info, success, warning, error)
   */
  type?: "info" | "success" | "warning" | "error";
  /**
   * Optional: Custom className for the alert container
   */
  className?: string;
  /**
   * Optional: Show alert only after this ISO date/time (in user's local time)
   */
  showAfter?: string; // ISO string, e.g. "2025-06-02T12:00:00Z"
  /**
   * Optional: Show alert only before this ISO date/time (in user's local time)
   */
  showBefore?: string; // ISO string, e.g. "2025-06-30T23:59:59Z"
}

const typeStyles: Record<string, string> = {
  info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800",
  success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800",
  warning: "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800",
  error: "bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800",
};

const typeEmojis: Record<string, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️️",
  error: "❌",
};

export const Alert: React.FC<AlertProps> = ({
  header,
  message,
  type = "info",
  className,
  showAfter,
  showBefore,
}) => {
  const now = new Date();
  // If showAfter is set, only show the alert after this time (in UTC)
  if (showAfter) {
    const showAt = new Date(showAfter);
    if (now.getTime() < showAt.getTime()) return null;
  }
  // If showBefore is set, only show the alert before this time (in UTC)
  if (showBefore) {
    const hideAt = new Date(showBefore);
    if (now.getTime() > hideAt.getTime()) return null;
  }
  return (
    <div
      className={cn(
        "mt-4 relative rounded-md border px-4 py-3 flex items-start gap-2",
        typeStyles[type] || typeStyles.info,
        className
      )}
      role="alert"
    >
      <span
        className="mr-2 text-xl"
        aria-hidden="true"
      >
        {typeEmojis[type] || typeEmojis.info}
      </span>
      <div className="flex-1">
        {header && <div className="font-semibold mb-1">{header}</div>}
        <div>{message}</div>
      </div>
    </div>
  );
};
