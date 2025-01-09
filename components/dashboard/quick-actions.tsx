"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  FileText,
  Users,
  Calendar,
  Wallet,
  Activity,
  Coins,
} from "lucide-react";
import { CreatePostDialog } from "./dialogs/create-post-dialog";
import { CreateProposalDialog } from "./dialogs/create-proposal-dialog";
import { UserAnalyticsDialog } from "./dialogs/user-analytics-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/store";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  onClick?: () => void;
  color: string;
}

export function QuickActions() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: "new-post",
      title: "Create Post",
      description: "Share a new post",
      icon: PlusCircle,
      onClick: () => setPostDialogOpen(true),
      color: "text-green-500",
    },
    {
      id: "new-proposal",
      title: "New Proposal",
      description: "Submit a proposal",
      icon: FileText,
      onClick: () => setProposalDialogOpen(true),
      color: "text-blue-500",
    },
    {
      id: "team",
      title: "Team",
      description: "Manage your team",
      icon: Users,
      onClick: () => router.push("/team"),
      color: "text-purple-500",
    },
    {
      id: "calendar",
      title: "Calendar",
      description: "View schedule",
      icon: Calendar,
      onClick: () => router.push("/calendar"),
      color: "text-orange-500",
    },
    {
      id: "staking",
      title: "Value Staking",
      description: "Manage your stakes",
      icon: Coins,
      onClick: () => {
        if (!isAuthenticated) {
          toast.error("Please sign in to access staking");
          return;
        }
        router.push("/staking/dashboard");
      },
      color: "text-pink-500",
    },
    {
      id: "analytics",
      title: "My Activity",
      description: "View your activity stats",
      icon: Activity,
      onClick: () => setAnalyticsDialogOpen(true),
      color: "text-cyan-500",
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4 hover:bg-muted/50"
              onClick={action.onClick}
            >
              <action.icon className={cn("h-5 w-5", action.color)} />
              <div className="text-left">
                <div className="font-semibold">{action.title}</div>
                <div className="text-sm text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      <CreatePostDialog 
        open={postDialogOpen} 
        onOpenChange={setPostDialogOpen} 
      />
      <CreateProposalDialog
        open={proposalDialogOpen}
        onOpenChange={setProposalDialogOpen}
      />
      <UserAnalyticsDialog 
        open={analyticsDialogOpen}
        onOpenChange={setAnalyticsDialogOpen}
      />
    </>
  );
}

// Helper function for className concatenation
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
