import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { TaskCard } from "./task-card"
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { Task } from "@/lib/stores/tasks"

interface TaskColumnProps {
  id: string
  title: string
  count: number
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddClick: (status: Task['status']) => void
}

export function TaskColumn({ id, title, count, tasks, onTaskClick, onAddClick }: TaskColumnProps) {
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
        <Button variant="ghost" size="icon" onClick={() => onAddClick(id as Task['status'])}>
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
          onClick={() => onAddClick(id as Task['status'])}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add task
        </Button>
      </div>
    </div>
  )
}
