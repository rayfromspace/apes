"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const statusStyles: Record<StatusType, string> = {
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-0.5",
  lg: "text-base px-3 py-1"
};

export function StatusBadge({ 
  status, 
  label, 
  size = 'md',
  animated = false 
}: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        statusStyles[status],
        sizeStyles[size],
        animated && "animate-pulse",
        "font-medium"
      )}
    >
      {label}
    </Badge>
  );
}
