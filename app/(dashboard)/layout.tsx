"use client";

import { useAuth } from "@/lib/auth";
import Navigation from "@/components/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && <Navigation />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
