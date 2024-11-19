"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

interface ProjectTasksProps {
  id: string
  fullView?: boolean
}

const tasks = [
  {
    title: "Implement user authentication",
    status: "In Progress",
    priority: "High",
    assignee: "Alex R.",
  },
  {
    title: "Design product catalog",
    status: "Todo",
    priority: "Medium",
    assignee: "Emma W.",
  },
  {
    title: "Setup payment gateway",
    status: "Review",
    priority: "High",
    assignee: "Sarah C.",
  },
]

const priorityColors = {
  High: "bg-red-500/10 text-red-500",
  Medium: "bg-yellow-500/10 text-yellow-500",
  Low: "bg-green-500/10 text-green-500",
}

export function ProjectTasks({ id, fullView }: ProjectTasksProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.slice(0, fullView ? undefined : 3).map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-accent rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{task.title}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{task.assignee}</span>
                  <Badge
                    variant="secondary"
                    className={priorityColors[task.priority as keyof typeof priorityColors]}
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>
              <Badge variant="outline">{task.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}