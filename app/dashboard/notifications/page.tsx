import { NotificationList } from "@/components/notifications/notification-list"
import { NotificationFilters } from "@/components/notifications/notification-filters"

export default function NotificationsPage() {
  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <NotificationFilters />
      </div>
      <NotificationList />
    </div>
  )
}