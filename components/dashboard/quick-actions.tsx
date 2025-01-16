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
  Wallet,
  Activity,
  Coins,
} from "lucide-react";
import { CreatePostDialog } from "./dialogs/create-post-dialog";
import { CreateProposalDialog } from "./dialogs/create-proposal-dialog";
import { UserAnalyticsDialog } from "./dialogs/user-analytics-dialog";
import { NFTContractsDialog } from "./dialogs/nft-contracts-dialog";
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
  const [contractsDialogOpen, setContractsDialogOpen] = useState(false);

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
      id: "contracts",
      title: "NFT Contracts",
      description: "View work & equity contracts",
      icon: Wallet,
      onClick: () => setContractsDialogOpen(true),
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
        router.push("/value-stake");
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common actions you can take on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 text-left flex items-start hover:bg-muted/50"
                onClick={action.onClick}
              >
                <action.icon className={`h-5 w-5 ${action.color} mr-2 mt-0.5`} />
                <div>
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
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
      <NFTContractsDialog
        open={contractsDialogOpen}
        onOpenChange={setContractsDialogOpen}
      />
    </div>
  );
}
