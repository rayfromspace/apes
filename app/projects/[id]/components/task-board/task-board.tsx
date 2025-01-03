'use client'

import { useState } from "react"
import { Plus, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { TaskColumn } from "./task-column"
import { TaskDialog } from "./task-dialog"
import { TaskCard } from "./task-card"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

export interface Task {
  id: string
  title: string
  status: "todo" | "doing" | "done"
  priority: "High" | "Low"
  assignees: string[]
  dateRange: string
  description?: string
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    status: "todo",
    priority: "Low",
    assignees: ["UN"],
    dateRange: "Nov 24 - Nov 30",
  },
  {
    id: "2",
    title: "Design new landing page",
    status: "todo",
    priority: "Low",
    assignees: ["UN", "DA"],
    dateRange: "Nov 24 - Nov 30",
  },
  {
    id: "3",
    title: "Design new landing page",
    status: "todo",
    priority: "Low",
    assignees: ["UN", "DA"],
    dateRange: "Nov 24 - Nov 30",
  },
  {
    id: "4",
    title: "Design new landing page",
    status: "doing",
    priority: "High",
    assignees: ["UN", "DA"],
    dateRange: "Nov 24 - Nov 30",
  },
  {
    id: "5",
    title: "Design new landing page",
    status: "done",
    priority: "Low",
    assignees: ["UN"],
    dateRange: "Nov 24 - Nov 30",
  },
]

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const todoTasks = tasks.filter(task => task.status === "todo")
  const doingTasks = tasks.filter(task => task.status === "doing")
  const doneTasks = tasks.filter(task => task.status === "done")

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id)
        const newIndex = tasks.findIndex((task) => task.id === over.id)

        const updatedTasks = arrayMove(tasks, oldIndex, newIndex)
        const activeTask = updatedTasks[newIndex]
        activeTask.status = over.data.current.columnId as Task['status']

        return updatedTasks
      })
    }

    setActiveId(null)
  }

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Button onClick={() => setIsNewTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add task
        </Button>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskColumn 
            id="todo"
            title="To do" 
            tasks={todoTasks}
            count={todoTasks.length}
            onTaskClick={setSelectedTask}
          />
          <TaskColumn 
            id="doing"
            title="Doing" 
            tasks={doingTasks}
            count={doingTasks.length}
            onTaskClick={setSelectedTask}
          />
          <TaskColumn 
            id="done"
            title="Done" 
            tasks={doneTasks}
            count={doneTasks.length}
            onTaskClick={setSelectedTask}
          />
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard 
              task={tasks.find(task => task.id === activeId)!}
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog 
        open={isNewTaskOpen} 
        onOpenChange={setIsNewTaskOpen}
      />

      {selectedTask && (
        <TaskDialog 
          task={selectedTask}
          open={Boolean(selectedTask)}
          onOpenChange={() => setSelectedTask(null)}
        />
      )}
    </div>
  )
}
