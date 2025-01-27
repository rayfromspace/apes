"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flag, Circle } from "lucide-react";

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

interface ProjectTimelineProps {
  project: Project;
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
  // For now, we'll just show project creation and last update
  const events = [
    {
      date: new Date(project.created_at),
      title: 'Project Created',
      description: `${project.title} was created`,
      icon: Flag,
    },
    {
      date: new Date(project.updated_at),
      title: 'Last Update',
      description: 'Project was updated',
      icon: Circle,
    },
  ];

  return (
    <Card className="p-6">
      <ScrollArea className="h-[300px] pr-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          {/* Timeline events */}
          <div className="space-y-8 relative">
            {events.map((event, index) => (
              <div key={index} className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center relative z-10">
                  <event.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
