"use client";

import { useAuth } from "@/lib/auth";
import { UserRole } from "@/types/user";
import { DashboardProjects } from "@/components/dashboard/projects";
import { DashboardStats } from "@/components/dashboard/stats";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Notifications } from "@/components/dashboard/notifications";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Schedule } from "@/components/dashboard/schedule";

export default function DashboardPage() {
  const { user } = useAuth();
  const userRole = user?.role || 'team_member';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-6">
        {/* User Stats Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <DashboardStats />
            
            {/* Active Projects Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Active Projects</h2>
              <DashboardProjects showMyProjectsOnly={true} />
            </div>
          </div>
          
          <div className="space-y-6">
            <Notifications />
            <ActivityFeed />
          </div>
        </div>

        {/* Schedule Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Schedule />
          </div>
          
          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* All Projects Section (for specific roles) */}
        {['founder', 'cofounder', 'board_member'].includes(userRole) && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">All Projects</h2>
            <DashboardProjects showMyProjectsOnly={false} showAnalytics={true} />
          </div>
        )}
      </div>
    </div>
  );
}