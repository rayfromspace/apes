"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, Users } from "lucide-react"

interface ProjectTimelineProps {
  id: string
}

const timelineItems = [
  {
    date: "2024-03-15",
    events: [
      {
        time: "9:00 AM",
        title: "Team Meeting",
        description: "Weekly progress review",
        type: "meeting",
        icon: Users,
      },
      {
        time: "2:00 PM",
        title: "Client Call",
        description: "Demo new features",
        type: "call",
        icon: MessageSquare,
      },
    ],
  },
  {
    date: "2024-03-16",
    events: [
      {
        time: "10:00 AM",
        title: "Sprint Planning",
        description: "Plan next sprint tasks",
        type: "meeting",
        icon: Users,
      },
    ],
  },
]

export function ProjectTimeline({ id }: ProjectTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {timelineItems.map((day, index) => (
            <div key={index} className="relative">
              <div className="flex items-center mb-4">
                <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="font-medium">
                  {new Date(day.date).toLocaleDateString()}
                </span>
              </div>
              <div className="space-y-4">
                {day.events.map((event, eventIndex) => {
                  const Icon = event.icon
                  return (
                    <div key={eventIndex} className="flex gap-4">
                      <Badge variant="secondary">{event.time}</Badge>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{event.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}