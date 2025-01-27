"use client";

import { DashboardStats } from "@/components/dashboard/stats";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Notifications } from "@/components/dashboard/notifications";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ProjectList } from "@/components/projects/list/project-list";

export default function FounderDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2 min-w-0">
            <DashboardStats />
            <div className="w-full overflow-hidden">
              <ProjectList showCreateCard={true} status="active" />
            </div>
          </div>
          <div className="space-y-6">
            <Notifications />
            <ActivityFeed />
          </div>
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
