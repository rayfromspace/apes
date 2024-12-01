"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  GitCommit,
  MessageSquare,
  DollarSign,
  Users,
  Star,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type:
    | "project_created"
    | "project_updated"
    | "comment_added"
    | "funding_received"
    | "team_joined"
    | "project_starred";
  projectId: string;
  projectTitle: string;
  description: string;
  timestamp: Date;
}

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "project_created":
      return <Activity className="h-4 w-4" />;
    case "project_updated":
      return <GitCommit className="h-4 w-4" />;
    case "comment_added":
      return <MessageSquare className="h-4 w-4" />;
    case "funding_received":
      return <DollarSign className="h-4 w-4" />;
    case "team_joined":
      return <Users className="h-4 w-4" />;
    case "project_starred":
      return <Star className="h-4 w-4" />;
  }
};

export function ProfileActivity() {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  // Simulated data fetch
  useState(() => {
    const fetchActivities = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActivities([
          {
            id: "1",
            type: "project_created",
            projectId: "1",
            projectTitle: "DeFi Trading Platform",
            description: "Created a new project",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          },
          // Add more demo activities
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((activity) => {
    return filter === "all" || activity.type === filter;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[200px]" />
        </div>
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 py-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activity</SelectItem>
            <SelectItem value="project_created">Created Projects</SelectItem>
            <SelectItem value="project_updated">Project Updates</SelectItem>
            <SelectItem value="comment_added">Comments</SelectItem>
            <SelectItem value="funding_received">Funding</SelectItem>
            <SelectItem value="team_joined">Team Changes</SelectItem>
            <SelectItem value="project_starred">Starred Projects</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-muted-foreground">
              No activity found. Start by creating or contributing to projects.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/projects/create")}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <Card
              key={activity.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => router.push(`/projects/${activity.projectId}`)}
            >
              <CardContent className="flex items-start gap-4 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {activity.projectTitle}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {activity.description}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
