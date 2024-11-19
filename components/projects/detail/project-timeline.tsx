"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectTimelineProps {
  id: string
}

const timeline = [
  {
    date: "March 15, 2024",
    title: "Beta Launch",
    description: "Launch beta version to early adopters",
    status: "upcoming",
  },
  {
    date: "February 1, 2024",
    title: "Development Milestone",
    description: "Complete core features implementation",
    status: "completed",
  },
  {
    date: "January 15, 2024",
    title: "Project Started",
    description: "Initial team formation and planning",
    status: "completed",
  },
]

export function ProjectTimeline({ id }: ProjectTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timeline.map((event, index) => (
            <div key={index} className="flex gap-4">
              <div className="relative flex flex-col items-center">
                <div className={`h-3 w-3 rounded-full ${
                  event.status === "completed" ? "bg-primary" : "bg-muted"
                }`} />
                {index !== timeline.length - 1 && (
                  <div className="h-full w-px bg-border" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{event.title}</p>
                  <Badge variant={event.status === "completed" ? "default" : "secondary"}>
                    {event.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}