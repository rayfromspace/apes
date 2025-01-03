import { Clock, Link2 } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Task } from "./task-board"
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-lg border bg-card p-3 space-y-3 cursor-pointer hover:border-primary/50"
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <span className="font-medium">{task.title}</span>
          <Badge 
            variant={task.priority === "High" ? "destructive" : "secondary"}
            className="capitalize"
          >
            {task.priority}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{task.dateRange}</span>
          <Button variant="ghost" size="icon" className="ml-auto h-6 w-6">
            <Link2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex -space-x-2">
        {task.assignees.map((assignee, i) => (
          <Avatar key={i} className="border-2 border-background h-6 w-6">
            <AvatarFallback className="text-xs">{assignee}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  )
}
