"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/store";
import { useRouter } from "next/navigation";
import Projects from "@/components/dashboard/projects";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Notifications } from "@/components/dashboard/notifications";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Schedule } from "@/components/dashboard/schedule";
import { DashboardStats } from "@/components/dashboard/stats/stats";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardPage() {
  const { user, isLoading, initialize } = useAuth();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="grid gap-6 min-w-0">
      {/* Schedule Section - Full Width */}
      <div className="w-full min-w-0">
        <Schedule />
      </div>

      {/* Content Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 min-w-0">
        {/* Main Content - First Two Columns */}
        <div className="space-y-6 lg:col-span-2 min-w-0">
          {/* Stats Section */}
          <DashboardStats showProjectStats={false} />

          {/* Active Projects Section */}
          <Projects />

          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Sidebar - Third Column */}
        <div className="space-y-6 min-w-0">
          <Notifications />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
