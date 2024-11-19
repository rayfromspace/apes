"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: "1",
    user: {
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&q=60",
    },
    action: "completed",
    task: "Frontend Development",
    time: "2 hours ago",
    type: "task",
  },
  {
    id: "2",
    user: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&q=60",
    },
    action: "commented on",
    task: "UI Design Review",
    time: "4 hours ago",
    type: "comment",
  },
  {
    id: "3",
    user: {
      name: "Michael Park",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&q=60",
    },
    action: "started",
    task: "API Integration",
    time: "5 hours ago",
    type: "task",
  },
]

export function TeamActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user.name}{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>{" "}
                  {activity.task}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.time}
                </p>
              </div>
              <div className="ml-auto">
                <Badge variant="outline">{activity.type}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}