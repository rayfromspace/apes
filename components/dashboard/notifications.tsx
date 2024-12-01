"use client";

import { useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Investment",
      description: "Your project 'DeFi Platform' received a new investment of 1000 USDC",
      type: "success",
      timestamp: "2024-01-20T10:30:00Z",
      read: false,
      actionUrl: "/projects/defi-1",
    },
    {
      id: "2",
      title: "Milestone Approaching",
      description: "Project milestone 'Beta Launch' is due in 3 days",
      type: "warning",
      timestamp: "2024-01-20T09:15:00Z",
      read: false,
      actionUrl: "/projects/defi-1/milestones",
    },
    // Add more notifications as needed
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const getTypeStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
      case "error":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
      default:
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Notifications</CardTitle>
        <Bell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardDescription className="px-6">
        Stay updated with your project activities
      </CardDescription>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "relative rounded-lg border p-4 transition-colors",
                  getTypeStyles(notification.type),
                  notification.read && "opacity-60"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
