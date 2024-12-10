"use client";

import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardProjects } from "@/components/dashboard/projects";
import { DashboardStats } from "@/components/dashboard/stats";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Notifications } from "@/components/dashboard/notifications";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Schedule } from "@/components/dashboard/schedule";

export default function DashboardPage() {
  const { user } = useAuth();

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
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Active Projects</h2>
                <p className="text-muted-foreground">Your ongoing projects and collaborations</p>
              </div>
              <DashboardProjects />
            </div>

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