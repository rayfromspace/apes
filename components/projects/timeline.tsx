"use client";

import { Project } from "@/types/project";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProjectTimelineProps {
  project: Project;
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
  const milestones = project.milestones || [];
  
  return (
    <Card className="p-6">
      <div className="space-y-8">
        {milestones.map((milestone, index) => {
          const isCompleted = milestone.status === 'completed';
          const isInProgress = milestone.status === 'in_progress';
          
          return (
            <div key={milestone.id} className="relative">
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
                      {new Date(milestone.dueDate).toLocaleDateString()}
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
    </Card>
  );
}
