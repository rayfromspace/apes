"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTaskStore, Task } from "@/lib/stores/tasks"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  due_date: z.date({
    required_error: "Due date is required",
  }),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["todo", "in_progress", "completed"]),
})

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean, refresh?: boolean) => void
  task?: Task | null
  projectId: string
  initialStatus?: "todo" | "in_progress" | "completed"
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  projectId,
  initialStatus = "todo"
}: TaskDialogProps) {
  const { createTask } = useTaskStore()

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      due_date: task ? new Date(task.due_date) : new Date(),
      priority: task?.priority || "medium",
      status: task?.status || initialStatus,
    },
  })

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        due_date: new Date(task.due_date),
        priority: task.priority,
        status: task.status,
      })
    } else {
      form.reset({
        title: "",
        due_date: new Date(),
        priority: "medium",
        status: initialStatus,
      })
    }
  }, [task, initialStatus])

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    try {
      const formattedValues = {
        title: values.title,
        due_date: format(values.due_date, "yyyy-MM-dd"),
        status: values.status || initialStatus,
        project_id: projectId,
        priority: values.priority,
      };
      
      console.log('Submitting task with values:', formattedValues);
      
      const newTask = await createTask(formattedValues);
      console.log('Create task response:', newTask);
      
      if (newTask) {
        console.log('Task created successfully:', newTask);
        onOpenChange(false, true);
      } else {
        console.error('Failed to create task: no task returned');
        form.setError("root", { 
          message: "Failed to create task. Please try again." 
        });
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
      form.setError("root", { 
        message: error instanceof Error ? error.message : "Failed to save task" 
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4">
            {form.formState.errors.root && (
              <div className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                {task ? "Update Task" : "Create Task"}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
