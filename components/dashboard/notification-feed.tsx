import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, MessageSquare, Users, Star } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "mention",
    message: "Sarah mentioned you in E-commerce Platform discussion",
    time: "5 minutes ago",
    icon: MessageSquare,
  },
  {
    id: 2,
    type: "team",
    message: "New team member joined Mobile App MVP",
    time: "1 hour ago",
    icon: Users,
  },
  {
    id: 3,
    type: "update",
    message: "Your project received a new 5-star rating",
    time: "2 hours ago",
    icon: Star,
  },
]

const typeStyles = {
  mention: "bg-blue-500/10 text-blue-500",
  team: "bg-green-500/10 text-green-500",
  update: "bg-yellow-500/10 text-yellow-500",
}

export function NotificationFeed() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Notifications</CardTitle>
        <Bell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start space-x-4 rounded-lg p-3 hover:bg-accent transition-colors"
            >
              <div className={`p-2 rounded-full ${
                typeStyles[notification.type as keyof typeof typeStyles]
              }`}>
                <notification.icon className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}