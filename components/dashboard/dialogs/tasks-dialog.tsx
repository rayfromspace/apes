"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "completed";
  project?: string;
  assignee?: string;
}

// Demo tasks for development
const DEMO_TASKS: Task[] = [
  {
    id: "1",
    title: "Review Project Proposal",
    description: "Review and provide feedback on the latest project proposal",
    dueDate: "2024-01-15",
    priority: "high",
    status: "todo",
    project: "DeFi Trading Platform",
    assignee: "Sarah Chen",
  },
  {
    id: "2",
    title: "Prepare Investor Presentation",
    description: "Create slides for Q1 investor meeting",
    dueDate: "2024-01-18",
    priority: "high",
    status: "in_progress",
    assignee: "Alex Thompson",
  },
];

interface TasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TasksDialog({ open, onOpenChange }: TasksDialogProps) {
  const [activeTab, setActiveTab] = useState("todo");
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignee: "",
  });

  const handleAddTask = () => {
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority as "high" | "medium" | "low",
      status: "todo",
      assignee: newTask.assignee,
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      assignee: "",
    });
  };

  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tasks</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="todo" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>

          {["todo", "in_progress", "completed"].map((status) => (
            <TabsContent key={status} value={status}>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {tasks
                    .filter(task => task.status === status)
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((task) => (
                      <div key={task.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge>
                              <Clock className="w-3 h-3 mr-1" />
                              {format(new Date(task.dueDate), "MMM d, yyyy")}
                            </Badge>
                            <Badge variant={
                              task.priority === "high" ? "destructive" : 
                              task.priority === "medium" ? "default" : 
                              "secondary"
                            }>
                              {task.priority}
                            </Badge>
                            {task.project && (
                              <Badge variant="outline">{task.project}</Badge>
                            )}
                            {task.assignee && (
                              <Badge variant="secondary">{task.assignee}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {status !== "completed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, status === "todo" ? "in_progress" : "completed")}
                            >
                              {status === "todo" ? "Start" : "Complete"}
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}

          <TabsContent value="add">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full p-2 border rounded-md"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  placeholder="Enter assignee name"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleAddTask}
                disabled={!newTask.title || !newTask.description || !newTask.dueDate}
              >
                Add Task
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
