"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectsOverview } from "@/components/dashboard/projects-overview"
import { Timeline } from "@/components/dashboard/timeline"
import { TaskBoard } from "@/components/dashboard/task-board"
import { CalendarView } from "@/components/dashboard/calendar-view"
import { NotificationFeed } from "@/components/dashboard/notification-feed"
import { ContentCreation } from "@/components/dashboard/content-creation"
import { AccountOverview } from "@/components/dashboard/account-overview"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectsOverview />
        <Timeline />
        <NotificationFeed />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TaskBoard />
        <div className="space-y-6">
          <CalendarView />
          <ContentCreation />
        </div>
        <div className="space-y-6">
          <AccountOverview />
        </div>
      </div>
    </div>
  )
}