"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface NavModeToggleProps {
  isExpanded: boolean;
}

export function NavModeToggle({ isExpanded }: NavModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center gap-3 rounded-lg text-sm transition-all hover:bg-accent"
    >
      <div className="relative h-4 w-4">
        <Sun className={cn(
          "h-4 w-4 rotate-0 scale-100 transition-all",
          isDark && "-rotate-90 scale-0"
        )} />
        <Moon className={cn(
          "absolute top-0 h-4 w-4 rotate-90 scale-0 transition-all",
          isDark && "rotate-0 scale-100"
        )} />
      </div>
      {isExpanded && (
        <span className="transition-all duration-300">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
