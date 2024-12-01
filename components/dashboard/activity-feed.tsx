"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  MessageSquareIcon,
  GitCommitIcon,
  DollarSignIcon,
  UserPlusIcon,
} from "lucide-react";

interface Activity {
  id: string;
  type: "comment" | "update" | "join" | "investment" | "milestone";
  user: {
    name: string;
    avatar?: string;
  };
  project?: {
    name: string;
    id: string;
  };
  content: string;
  timestamp: string;
}

const activityIcons = {
  comment: MessageSquareIcon,
  update: GitCommitIcon,
  join: UserPlusIcon,
  investment: DollarSignIcon,
  milestone: CalendarIcon,
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchActivities = async () => {
      try {
        // Simulated API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const demoActivities: Activity[] = [
          {
            id: "1",
            type: "comment",
            user: { name: "John Doe", avatar: "/avatars/john.jpg" },
            project: { name: "DeFi Platform", id: "defi-1" },
            content: "Left a comment on the latest update",
            timestamp: "2024-01-20T10:30:00Z",
          },
          {
            id: "2",
            type: "investment",
            user: { name: "Sarah Smith", avatar: "/avatars/sarah.jpg" },
            project: { name: "Green Energy", id: "green-1" },
            content: "Invested 5000 USDC",
            timestamp: "2024-01-20T09:15:00Z",
          },
          // Add more demo activities as needed
        ];
        setActivities(demoActivities);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recent Activity</h2>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>
                    {activity.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{activity.user.name}</p>
                    {activity.project && (
                      <span className="text-sm text-muted-foreground">
                        in {activity.project.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
