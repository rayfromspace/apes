"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Users, Clock, TrendingUp } from "lucide-react";

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

interface ProjectDashboardStatsProps {
  project: Project;
}

export function ProjectDashboardStats({ project }: ProjectDashboardStatsProps) {
  // Calculate days since creation
  const daysSinceCreation = Math.floor(
    (new Date().getTime() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const stats = [
    {
      title: "Project Status",
      value: project.status.charAt(0).toUpperCase() + project.status.slice(1),
      icon: Target,
      description: "Current state",
    },
    {
      title: "Team Members",
      value: (project.team_members?.length || 0) + 1, // +1 for founder
      icon: Users,
      description: "Active contributors",
    },
    {
      title: "Project Age",
      value: `${daysSinceCreation} days`,
      icon: Clock,
      description: "Since creation",
    },
    {
      title: "Category",
      value: project.category,
      icon: TrendingUp,
      description: project.type,
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
