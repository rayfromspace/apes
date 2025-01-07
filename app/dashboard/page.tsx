"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/store";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardProjects } from "@/components/dashboard/projects";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Notifications } from "@/components/dashboard/notifications";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Schedule } from "@/components/dashboard/schedule";
import { DashboardStats } from "@/components/dashboard/stats/stats";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardPage() {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        {/* Schedule Section - Full Width */}
        <div className="w-full">
          <Schedule />
        </div>

        {/* Content Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Main Content - First Two Columns */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats Section */}
            <DashboardStats showProjectStats={false} />

            {/* Active Projects Section */}
            <DashboardProjects />

            {/* Quick Actions */}
            <QuickActions />
          </div>

          {/* Sidebar - Third Column */}
          <div className="space-y-6">
            <Notifications />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
