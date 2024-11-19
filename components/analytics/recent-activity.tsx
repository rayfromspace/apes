"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: { name: "John Doe", image: "/avatars/01.png", initials: "JD" },
    action: "invested in",
    target: "Project Alpha",
    amount: "$1,000",
    time: "2 hours ago"
  },
  {
    user: { name: "Sarah Smith", image: "/avatars/02.png", initials: "SS" },
    action: "created",
    target: "New Project Beta",
    time: "4 hours ago"
  },
  {
    user: { name: "Mike Johnson", image: "/avatars/03.png", initials: "MJ" },
    action: "completed",
    target: "Task Milestone",
    time: "6 hours ago"
  }
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity, i) => (
        <div key={i} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={activity.user.image} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name} {activity.action} {activity.target}
              {activity.amount && <span className="font-bold"> ({activity.amount})</span>}
            </p>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}