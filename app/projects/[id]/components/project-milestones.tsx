'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Diamond } from 'lucide-react'

const milestones = [
  {
    title: "Project kickoff",
    date: "2 days ago",
    status: "completed",
  },
  {
    title: "Design phase",
    date: "In progress",
    status: "current",
  },
  {
    title: "Development",
    date: "Upcoming",
    status: "upcoming",
  },
  {
    title: "Testing",
    date: "Upcoming",
    status: "upcoming",
  },
]

export function ProjectMilestones() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestones</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[14px] before:w-[2px] before:bg-muted">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-4">
              <div
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                  milestone.status === "completed"
                    ? "border-primary bg-primary text-primary-foreground"
                    : milestone.status === "current"
                    ? "border-primary bg-background text-primary"
                    : "border-muted bg-background"
                }`}
              >
                <Diamond className="h-4 w-4" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="font-medium">{milestone.title}</div>
                <div className="text-sm text-muted-foreground">
                  {milestone.date}
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            Add milestone
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
