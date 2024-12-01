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
  BarChart,
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: "new-project",
    title: "Create Project",
    description: "Start a new project",
    icon: PlusCircle,
    href: "/projects/create",
    color: "text-green-500",
  },
  {
    id: "new-proposal",
    title: "New Proposal",
    description: "Submit a proposal",
    icon: FileText,
    href: "/proposals/create",
    color: "text-blue-500",
  },
  {
    id: "team",
    title: "Team",
    description: "Manage your team",
    icon: Users,
    href: "/team",
    color: "text-purple-500",
  },
  {
    id: "schedule",
    title: "Schedule",
    description: "View calendar",
    icon: Calendar,
    href: "/calendar",
    color: "text-orange-500",
  },
  {
    id: "investments",
    title: "Investments",
    description: "Track investments",
    icon: Wallet,
    href: "/investments",
    color: "text-emerald-500",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "View insights",
    icon: BarChart,
    href: "/analytics",
    color: "text-cyan-500",
  },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto flex-col items-start gap-2 p-4 hover:bg-muted/50"
                onClick={() => router.push(action.href)}
              >
                <div className="flex w-full items-center gap-2">
                  <Icon className={cn("h-5 w-5", action.color)} />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {action.description}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function for className concatenation
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
