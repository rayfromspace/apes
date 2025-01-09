"use client";

import * as React from "react";
import { addDays, eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ContributionDay {
  date: Date;
  count: number;
}

interface ContributionGraphProps {
  data: ContributionDay[];
  className?: string;
}

export function ContributionGraph({ data, className }: ContributionGraphProps) {
  const today = new Date();
  const startDate = subDays(today, 364); // Last 365 days

  const days = eachDayOfInterval({
    start: startDate,
    end: today,
  });

  const getContributionLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  const getContributionCount = (date: Date): number => {
    const contribution = data.find((d) => isSameDay(new Date(d.date), date));
    return contribution?.count || 0;
  };

  const weeks = React.useMemo(() => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [days]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm text-muted-foreground">Contribution Activity</div>
      <div className="flex gap-2">
        <div className="grid grid-flow-col gap-[3px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-flow-row gap-[3px]">
              {week.map((day, dayIndex) => {
                const count = getContributionCount(day);
                const level = getContributionLevel(count);
                return (
                  <TooltipProvider key={dayIndex}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "h-[10px] w-[10px] rounded-sm",
                            level === 0 && "bg-muted hover:bg-muted/80",
                            level === 1 && "bg-emerald-100 hover:bg-emerald-200",
                            level === 2 && "bg-emerald-300 hover:bg-emerald-400",
                            level === 3 && "bg-emerald-500 hover:bg-emerald-600",
                            level === 4 && "bg-emerald-700 hover:bg-emerald-800"
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {count} contributions on {format(day, "MMM d, yyyy")}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-end gap-[3px] text-xs text-muted-foreground">
          <div>Mon</div>
          <div>Wed</div>
          <div>Fri</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div>Less</div>
        <div className="flex gap-1">
          <div className="h-[10px] w-[10px] rounded-sm bg-muted" />
          <div className="h-[10px] w-[10px] rounded-sm bg-emerald-100" />
          <div className="h-[10px] w-[10px] rounded-sm bg-emerald-300" />
          <div className="h-[10px] w-[10px] rounded-sm bg-emerald-500" />
          <div className="h-[10px] w-[10px] rounded-sm bg-emerald-700" />
        </div>
        <div>More</div>
      </div>
    </div>
  );
}
