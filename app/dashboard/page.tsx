"use client";

import { useAuth } from "@/lib/auth";
import { UserRole } from "@/types/user";
import FounderDashboard from "@/components/projects/dashboard/founder-dashboard";
import CoFounderDashboard from "@/components/projects/dashboard/cofounder-dashboard";
import BoardMemberDashboard from "@/components/projects/dashboard/board-member-dashboard";
import { DashboardProjects } from "@/components/dashboard/projects";
import { DashboardStats } from "@/components/dashboard/stats";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Notifications } from "@/components/dashboard/notifications";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  const { user } = useAuth();
  const userRole = (user?.role as UserRole) || "team_member";

  // Render role-specific dashboard if available
  if (userRole === "founder") {
    return <FounderDashboard />;
  }

  if (userRole === "cofounder") {
    return <CoFounderDashboard />;
  }

  if (userRole === "board_member") {
    return <BoardMemberDashboard />;
  }

  // Default dashboard for team members and investors
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-6">
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
        <QuickActions />
      </div>
    </div>
  );
}