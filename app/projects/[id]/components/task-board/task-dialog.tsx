"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTaskStore, Task } from "@/lib/stores/tasks"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.date({
    required_error: "Due date is required",
  }),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["todo", "in_progress", "completed"]),
})

interface TaskDialogProps {
  task?: Task
  open: boolean
  onOpenChange: (open: boolean, success?: boolean) => void
  projectId: string
  initialStatus?: Task['status']
}

export function TaskDialog({ 
  task, 
  open, 
  onOpenChange, 
  projectId,
  initialStatus = "todo"
}: TaskDialogProps) {
  const { createTask, updateTask } = useTaskStore()

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      due_date: new Date(),
      priority: "medium",
      status: initialStatus,
    },
  })

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || "",
        due_date: new Date(task.due_date),
        priority: task.priority,
        status: task.status,
      })
    } else {
      form.reset({
        title: "",
        description: "",
        due_date: new Date(),
        priority: "medium",
        status: initialStatus,
      })
    }
  }, [task, initialStatus])

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    try {
      if (task) {
        const updatedTask = await updateTask(task.id, {
          ...values,
          due_date: format(values.due_date, "yyyy-MM-dd"),
        })
        if (updatedTask) {
          onOpenChange(false, true)
        } else {
          form.setError("root", { 
            message: "Failed to update task. Please try again." 
          });
        }
      } else {
        const formattedValues = {
          ...values,
          title: values.title.trim(),
          description: values.description?.trim(),
          due_date: format(values.due_date, "yyyy-MM-dd"),
          status: values.status || initialStatus,
          project_id: projectId,
        };
        
        console.log('Submitting task with values:', formattedValues);
        
        try {
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
        } catch (createError) {
          console.error('Error creating task:', createError);
          form.setError("root", { 
            message: createError instanceof Error ? createError.message : "Failed to create task" 
          });
        }
      }
    } catch (error) {
      console.error("Failed to save task:", error);
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
          <DialogDescription>
            {task ? "Make changes to your task here." : "Add a new task to your project."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input placeholder="Task title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a description..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
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
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
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
              <Button type="submit">
                {task ? "Save Changes" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
