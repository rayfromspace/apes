"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {sidebar && (
        <aside className="hidden md:flex w-64 flex-col fixed inset-y-0">
          {sidebar}
        </aside>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1",
        sidebar ? "md:pl-64" : "",
        className
      )}>
        {/* Header */}
        {header && (
          <header className="sticky top-0 z-40 border-b bg-background">
            {header}
          </header>
        )}
        
        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
