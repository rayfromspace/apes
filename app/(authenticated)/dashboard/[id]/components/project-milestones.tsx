'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
}

interface ProjectMilestonesProps {
  project: Project;
}

export function ProjectMilestones({ project }: ProjectMilestonesProps) {
  // For now, we'll show some demo milestones
  const milestones = [
    {
      title: "Project Setup",
      description: "Initial project setup and configuration",
      status: "completed",
      dueDate: new Date(project.created_at),
    },
    {
      title: "Team Formation",
      description: "Assemble the core team",
      status: "in_progress",
      dueDate: new Date(),
    },
    {
      title: "First Release",
      description: "Launch initial version",
      status: "pending",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {milestones.map((milestone, index) => {
            const isCompleted = milestone.status === 'completed';
            const isInProgress = milestone.status === 'in_progress';
            
            return (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-3 top-8 h-full w-0.5 bg-border" />
                )}
                
                <div className="flex items-start gap-4">
                  {/* Status Indicator */}
                  <div 
                    className={cn(
                      "mt-1 h-6 w-6 rounded-full border-2",
                      isCompleted && "bg-primary border-primary",
                      isInProgress && "bg-primary/20 border-primary",
                      !isCompleted && !isInProgress && "bg-background border-muted"
                    )}
                  />
                  
                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{milestone.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {milestone.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                    
                    {isInProgress && (
                      <Progress value={60} className="mt-2" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
