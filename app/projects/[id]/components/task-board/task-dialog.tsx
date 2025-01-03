"use client"

import { CalendarIcon, Link2, Plus, Trash2, X } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { Task } from "./task-board"

interface TaskDialogProps {
  task?: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDialog({ task, open, onOpenChange }: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-5 w-5 rounded-md border border-primary"
            />
            <DialogTitle className="text-xl font-medium">
              {task?.title || "New task"}
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Link2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium">Assignee</label>
                <div className="flex items-center gap-2">
                  {task ? (
                    <>
                      {task.assignees.map((assignee, i) => (
                        <Avatar key={i} className="h-8 w-8">
                          <AvatarFallback>{assignee}</AvatarFallback>
                        </Avatar>
                      ))}
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="h-8">
                      No assignee
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Due date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {task?.dateRange || "No due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Priority</label>
                <Button variant="outline" className="h-8">
                  Set priority
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Add a more detailed description..." />
            </div>
          </div>
          <Tabs defaultValue="comments">
            <TabsList>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="space-y-4 pt-4">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">John Doe</span>
                    <span className="text-sm text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Just a couple of days back, I had an amazing experience that I can't stop thinking about! It was one of those moments that really made me appreciate life.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Textarea placeholder="Add a comment..." className="flex-1" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
