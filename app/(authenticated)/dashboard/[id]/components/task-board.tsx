'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  visibility: 'public' | 'private';
  status: 'active' | 'completed' | 'archived';
  founder_id: string;
  created_at: string;
  updated_at: string;
  team_members?: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      email: string;
      name?: string;
      avatar_url?: string;
    };
  }>;
}

interface TaskBoardProps {
  project: Project;
  userRole: string | null;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: {
    name: string;
    avatar?: string;
  };
}

export function TaskBoard({ project, userRole }: TaskBoardProps) {
  const canEdit = userRole === 'founder' || userRole === 'admin';
  
  // For now, we'll use some demo tasks
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design System',
      description: 'Create a unified design system',
      status: 'todo',
      priority: 'high',
      assignee: {
        name: 'Alice',
      },
    },
    {
      id: '2',
      title: 'API Integration',
      description: 'Integrate with external APIs',
      status: 'in_progress',
      priority: 'medium',
      assignee: {
        name: 'Bob',
      },
    },
    {
      id: '3',
      title: 'Testing',
      description: 'Write unit tests',
      status: 'review',
      priority: 'low',
      assignee: {
        name: 'Charlie',
      },
    },
    {
      id: '4',
      title: 'Documentation',
      description: 'Update documentation',
      status: 'done',
      priority: 'medium',
    },
  ]);

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' },
  ];

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-100';
      case 'medium':
        return 'text-yellow-500 bg-yellow-100';
      case 'low':
        return 'text-green-500 bg-green-100';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Task Board</h2>
        {canEdit && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary">
                {tasks.filter((task) => task.status === column.id).length}
              </Badge>
            </div>

            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge 
                            variant="secondary"
                            className={getPriorityColor(task.priority)}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>

                        {task.assignee && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.avatar} />
                              <AvatarFallback>
                                {task.assignee.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {task.assignee.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
