"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
  animated?: boolean;
}

const variantStyles = {
  default: "bg-primary",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500"
};

const sizeStyles = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3"
};

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  variant = 'default',
  className,
  animated = false
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      <Progress
        value={percentage}
        className={cn(
          sizeStyles[size],
          animated && "transition-all duration-500",
          className
        )}
        indicatorClassName={variantStyles[variant]}
      />
      {showLabel && (
        <p className="text-sm text-muted-foreground mt-1">
          {percentage.toFixed(1)}%
        </p>
      )}
    </div>
  );
}
