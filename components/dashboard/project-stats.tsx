"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users2, Clock, Target, TrendingUp } from "lucide-react";

interface ProjectDashboardStatsProps {
  project: {
    id: string;
    title: string;
    description: string;
    status: string;
    progress: number;
    team_size: number;
    deadline?: string;
    target_amount?: number;
    current_amount?: number;
  };
}

export function ProjectDashboardStats({ project }: ProjectDashboardStatsProps) {
  const stats = [
    {
      title: "Team Members",
      value: project.team_size,
      icon: Users2,
      description: "Active contributors"
    },
    {
      title: "Time Remaining",
      value: project.deadline ? 
        new Date(project.deadline).toLocaleDateString() : 
        "No deadline",
      icon: Clock,
      description: "Project deadline"
    },
    {
      title: "Target Amount",
      value: project.target_amount ? 
        `$${project.target_amount.toLocaleString()}` : 
        "Not set",
      icon: Target,
      description: "Funding goal"
    },
    {
      title: "Current Amount",
      value: project.current_amount ? 
        `$${project.current_amount.toLocaleString()}` : 
        "$0",
      icon: TrendingUp,
      description: "Funds raised"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
      
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">
              Overall Progress
            </CardTitle>
            <Badge variant={project.status === "active" ? "default" : "secondary"}>
              {project.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {project.progress}%
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={project.progress} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
}
