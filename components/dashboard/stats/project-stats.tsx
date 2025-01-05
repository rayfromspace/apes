"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/types/project";
import { 
  Target, 
  Users, 
  Clock, 
  TrendingUp 
} from "lucide-react";

interface ProjectDashboardStatsProps {
  project: Project;
}

export function ProjectDashboardStats({ project }: ProjectDashboardStatsProps) {
  const stats = [
    {
      title: "Project Progress",
      value: `${project.progress}%`,
      icon: Target,
      description: "Overall completion",
      showProgress: true,
    },
    {
      title: "Team Members",
      value: project.members?.length.toString() || "0",
      icon: Users,
      description: "Active contributors",
    },
    {
      title: "Time Remaining",
      value: "45 days",
      icon: Clock,
      description: "Until next milestone",
    },
    {
      title: "Funding Progress",
      value: `$${(project.current_funding || 0).toLocaleString()}`,
      icon: TrendingUp,
      description: `of $${(project.funding_goal || 0).toLocaleString()} goal`,
      showProgress: true,
      progress: ((project.current_funding || 0) / (project.funding_goal || 1)) * 100,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.showProgress && (
                <Progress 
                  value={typeof stat.progress === 'number' ? stat.progress : project.progress} 
                  className="mt-3"
                />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
