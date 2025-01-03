import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { TaskCard } from "./task-card"
import type { Task } from "./task-board"
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

interface TaskColumnProps {
  id: string
  title: string
  count: number
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function TaskColumn({ id, title, count, tasks, onTaskClick }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      columnId: id
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          <span className="text-muted-foreground">{count}</span>
        </div>
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div 
        ref={setNodeRef}
        className="space-y-4 min-h-[200px]"
      >
        <SortableContext 
          items={tasks} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add task
        </Button>
      </div>
    </div>
  )
}
