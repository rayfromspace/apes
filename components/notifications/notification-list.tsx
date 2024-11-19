"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bell, MessageSquare, Users, Briefcase, Star } from "lucide-react"

const notifications = [
  {
    id: "1",
    type: "project",
    title: "New Project Update",
    description: "Alex Thompson updated the project timeline",
    time: "2 minutes ago",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&q=60",
    name: "Alex Thompson",
    read: false,
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    description: "Sarah Chen sent you a message about the design review",
    time: "1 hour ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&q=60",
    name: "Sarah Chen",
    read: false,
  },
  {
    id: "3",
    type: "team",
    title: "Team Invitation",
    description: "You've been invited to join Digital Marketing Team",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "investment",
    title: "Investment Update",
    description: "Your investment in Project X has yielded 5% returns",
    time: "1 day ago",
    read: true,
  }
]

const getIcon = (type: string) => {
  switch (type) {
    case "project":
      return <Briefcase className="h-4 w-4" />
    case "message":
      return <MessageSquare className="h-4 w-4" />
    case "team":
      return <Users className="h-4 w-4" />
    case "investment":
      return <Star className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export function NotificationList() {
  const [readNotifications, setReadNotifications] = useState<string[]>([])

  const markAsRead = (id: string) => {
    setReadNotifications((prev) => [...prev, id])
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`p-4 ${
            notification.read || readNotifications.includes(notification.id)
              ? "bg-muted/50"
              : "bg-background"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="mt-1">
              {notification.avatar ? (
                <Avatar>
                  <AvatarImage src={notification.avatar} alt={notification.name} />
                  <AvatarFallback>{notification.name[0]}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  {getIcon(notification.type)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
                {!notification.read && !readNotifications.includes(notification.id) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {notification.time}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}