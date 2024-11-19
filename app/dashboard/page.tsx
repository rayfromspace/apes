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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, John!</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </div>
        <ContentCreation />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectsOverview />
        <Timeline />
        <NotificationFeed />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TaskBoard className="md:col-span-2 md:row-span-2" />
        <AccountOverview />
      </div>
    </div>
  )
}