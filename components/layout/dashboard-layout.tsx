"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/auth/protected-route";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
  sidebar?: ReactNode;
  header?: ReactNode;
}

export function DashboardLayout({
  children,
  className,
  sidebar,
  header,
}: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        {sidebar}

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 min-w-0",
          className
        )}>
          {/* Header */}
          {header && (
            <header className="sticky top-0 z-40 border-b bg-background">
              {header}
            </header>
          )}
          
          {/* Content */}
          <div className="container mx-auto px-4 py-8 min-w-0">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
