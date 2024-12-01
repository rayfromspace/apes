import { DashboardProjects } from "@/components/dashboard/projects";
import { DashboardStats } from "@/components/dashboard/stats";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Notifications } from "@/components/dashboard/notifications";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-6">
        <QuickActions />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <DashboardStats />
            <DashboardProjects />
          </div>
          <div className="space-y-6">
            <Notifications />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}