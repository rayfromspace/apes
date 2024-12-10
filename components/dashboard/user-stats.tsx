"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { 
  Activity, 
  CheckCircle2, 
  Users, 
  Star 
} from "lucide-react";

export function UserDashboardStats() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Active Projects",
      value: "3",
      icon: Activity,
      description: "Current projects you're involved in",
    },
    {
      title: "Tasks Completed",
      value: "28",
      icon: CheckCircle2,
      description: "Tasks completed this month",
    },
    {
      title: "Team Collaborations",
      value: "12",
      icon: Users,
      description: "Teams you're working with",
    },
    {
      title: "Achievement Score",
      value: "92",
      icon: Star,
      description: "Based on your contributions",
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
