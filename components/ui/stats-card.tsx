"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  onClick?: () => void;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
  className,
  onClick
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "p-6 hover:shadow-md transition-shadow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-medium">{label}</h3>
        </div>
        {trend && (
          <div className={cn(
            "text-xs",
            trend.value > 0 ? "text-green-600" : "text-red-600"
          )}>
            {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}
