"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddTaskDialog } from "./add-task-dialog"
import { cn } from "@/lib/utils"

const initialTasks = {
  "To Do": [
    {
      title: "Update user documentation",
      priority: "low",
      project: "E-commerce Platform",
      assignee: {
        name: "John Doe",
        avatar: "/avatars/01.png",
        initials: "JD",
      },
    },
    {
      title: "Design new landing page",
      priority: "high",
      project: "Marketing Website",
      assignee: {
        name: "Sarah Smith",
        avatar: "/avatars/02.png",
        initials: "SS",
      },
    },
  ],
  "In Progress": [
    {
      title: "Implement authentication",
      priority: "high",
      project: "Mobile App MVP",
      assignee: {
        name: "Mike Johnson",
        avatar: "/avatars/03.png",
        initials: "MJ",
      },
    },
    {
      title: "Create API endpoints",
      priority: "medium",
      project: "E-commerce Platform",
      assignee: {
        name: "Lisa Brown",
        avatar: "/avatars/04.png",
        initials: "LB",
      },
    },
  ],
  "Review": [
    {
      title: "Code review: Payment integration",
      priority: "medium",
      project: "E-commerce Platform",
      assignee: {
        name: "David Wilson",
        avatar: "/avatars/05.png",
        initials: "DW",
      },
    },
  ],
  "Done": [
    {
      title: "Setup CI/CD pipeline",
      priority: "high",
      project: "Mobile App MVP",
      assignee: {
        name: "Emma Smith",
        avatar: "/avatars/06.png",
        initials: "ES",
      },
    },
  ],
}

const priorityColors = {
  low: "bg-green-500/10 text-green-500",
  medium: "bg-yellow-500/10 text-yellow-500",
  high: "bg-red-500/10 text-red-500",
}

interface TaskBoardProps {
  className?: string;
}

export function TaskBoard({ className }: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addTask = (newTask: any) => {
    setTasks(prev => ({
      ...prev,
      "To Do": [...prev["To Do"], newTask]
    }))
  }

  return (
    <Card className={cn("max-h-[600px]", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Task Board</CardTitle>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(tasks).map(([status, items]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-muted-foreground">
                  {status}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {items.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {items.map((task, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-2">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {task.project}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className={priorityColors[task.priority as keyof typeof priorityColors]}
                        >
                          {task.priority}
                        </Badge>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar} />
                          <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <AddTaskDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onAddTask={addTask}
      />
    </Card>
  )
}