"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, AlertCircle } from "lucide-react";
import { format, isToday, isBefore } from "date-fns";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  assignees: Array<{
    name: string;
    avatar: string;
  }>;
  status: 'todo' | 'in-progress' | 'review' | 'done';
}

const DEMO_TASKS: Task[] = [
  {
    id: "1",
    title: "Implement Smart Contract Tests",
    description: "Write comprehensive test suite for core smart contracts",
    project: "DeFi Trading Platform",
    priority: "high",
    dueDate: new Date(),
    assignees: [
      { name: "Alex Thompson", avatar: "https://avatar.vercel.sh/alex" },
      { name: "Sarah Chen", avatar: "https://avatar.vercel.sh/sarah" },
    ],
    status: "in-progress",
  },
  {
    id: "2",
    title: "Design User Dashboard",
    description: "Create responsive dashboard layout with key metrics",
    project: "AI Content Creator",
    priority: "medium",
    dueDate: new Date(Date.now() + 86400000), // tomorrow
    assignees: [
      { name: "Elena Martinez", avatar: "https://avatar.vercel.sh/elena" },
    ],
    status: "todo",
  },
];

function TaskCard({ task }: { task: Task }) {
  const getPriorityStyles = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'low':
        return 'text-green-500 bg-green-50 dark:bg-green-950/20';
    }
  };

  const getStatusStyles = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'text-slate-500 bg-slate-50 dark:bg-slate-950/20';
      case 'in-progress':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'review':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-950/20';
      case 'done':
        return 'text-green-500 bg-green-50 dark:bg-green-950/20';
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{task.title}</h3>
          <Badge variant="secondary" className={cn("capitalize", getPriorityStyles(task.priority))}>
            {task.priority}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">{task.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{task.project}</span>
          <Badge variant="outline" className={cn("capitalize", getStatusStyles(task.status))}>
            {task.status.replace('-', ' ')}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {task.assignees.map((assignee, i) => (
              <Avatar key={i} className="border-2 border-background">
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback>{assignee.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={cn(
              "font-medium",
              isToday(task.dueDate) ? "text-yellow-500" :
              isBefore(task.dueDate, new Date()) ? "text-red-500" :
              "text-muted-foreground"
            )}>
              {isToday(task.dueDate) ? "Today" : format(task.dueDate, "MMM d")}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function TasksList() {
  return (
    <div className="space-y-4">
      {DEMO_TASKS.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}