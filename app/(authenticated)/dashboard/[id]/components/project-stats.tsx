'use client';

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
    users: {
      id: string;
      email: string;
      raw_user_meta_data: {
        name?: string;
        avatar_url?: string;
      };
    };
  }>;
}

interface ProjectStatsProps {
  project: Project;
}

export function ProjectStats({ project }: ProjectStatsProps) {
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
      showProgress: true,
      progress: project.status === 'completed' ? 100 : project.status === 'active' ? 60 : 0,
    },
    {
      title: "Team Size",
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
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                  {stat.showProgress && (
                    <Progress 
                      value={stat.progress} 
                      className="mt-3"
                    />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
