'use client'

import { useEffect, useState } from "react"
import { Plus } from 'lucide-react'
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
import { useTaskStore, Task } from "@/lib/stores/tasks"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export function TaskBoard() {
  const params = useParams()
  const projectId = params.id as string
  const { tasks, fetchTasks, reorderTasks } = useTaskStore()
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [initialStatus, setInitialStatus] = useState<Task['status']>("todo")

  useEffect(() => {
    fetchTasks(projectId)
  }, [projectId, fetchTasks])

  useEffect(() => {
    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchTasks(projectId)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [projectId, fetchTasks])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const todoTasks = tasks.filter(task => task.status === "todo")
  const inProgressTasks = tasks.filter(task => task.status === "in_progress")
  const completedTasks = tasks.filter(task => task.status === "completed")

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over) return

    const activeTask = tasks.find(task => task.id === active.id)
    const overColumn = over.data?.current?.columnId

    if (activeTask && overColumn && activeTask.status !== overColumn) {
      await reorderTasks(projectId, activeTask.id, overColumn)
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const getActiveTask = () => {
    return tasks.find(task => task.id === activeId)
  }

  const handleAddTask = (status: Task['status']) => {
    setInitialStatus(status)
    setIsNewTaskOpen(true)
  }

  return (
    <div className="px-4 md:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button onClick={() => handleAddTask("todo")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TaskColumn
            id="todo"
            title="To Do"
            count={todoTasks.length}
            tasks={todoTasks}
            onTaskClick={setSelectedTask}
            onAddClick={handleAddTask}
          />
          <TaskColumn
            id="in_progress"
            title="In Progress"
            count={inProgressTasks.length}
            tasks={inProgressTasks}
            onTaskClick={setSelectedTask}
            onAddClick={handleAddTask}
          />
          <TaskColumn
            id="completed"
            title="Completed"
            count={completedTasks.length}
            tasks={completedTasks}
            onTaskClick={setSelectedTask}
            onAddClick={handleAddTask}
          />
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard
              task={getActiveTask()}
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={isNewTaskOpen}
        onOpenChange={(open, success) => {
          console.log('TaskDialog onOpenChange:', { open, success });
          setIsNewTaskOpen(open);
          if (!open && success) {
            console.log('Refreshing tasks after successful creation');
            fetchTasks(projectId);
          }
        }}
        projectId={projectId}
        initialStatus={initialStatus}
      />

      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open, success) => {
            console.log('Edit TaskDialog onOpenChange:', { open, success });
            setSelectedTask(null);
            if (!open && success) {
              console.log('Refreshing tasks after successful edit');
              fetchTasks(projectId);
            }
          }}
          projectId={projectId}
        />
      )}
    </div>
  )
}
