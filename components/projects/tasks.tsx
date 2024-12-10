"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle 
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  dueDate: string;
  assignedTo: string;
}

interface ProjectTasksProps {
  projectId: string;
  canEdit: boolean;
}

export function ProjectTasks({ projectId, canEdit }: ProjectTasksProps) {
  // Demo tasks - replace with real data
  const tasks: Task[] = [
    {
      id: "1",
      title: "Design System Implementation",
      description: "Implement the new design system across all components",
      status: "in_progress",
      dueDate: "2024-12-20",
      assignedTo: "user1",
    },
    {
      id: "2",
      title: "API Integration",
      description: "Integrate the payment processing API",
      status: "todo",
      dueDate: "2024-12-25",
      assignedTo: "user2",
    },
    {
      id: "3",
      title: "User Testing",
      description: "Conduct user testing sessions",
      status: "completed",
      dueDate: "2024-12-15",
      assignedTo: "user3",
    },
  ];

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'blocked':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Task Management */}
        {canEdit && (
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        )}
        
        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className="flex items-start gap-4 p-4 rounded-lg border bg-card"
            >
              <Checkbox 
                checked={task.status === 'completed'}
                disabled={!canEdit}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  </div>
                  {getStatusIcon(task.status)}
                </div>
                
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    Assigned to: User Name
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
