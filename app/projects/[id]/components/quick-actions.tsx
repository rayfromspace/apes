"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Banknote, CalendarPlus, Files, Laptop } from 'lucide-react'

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  onClick?: () => void;
  href?: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: "software-used",
    title: "Tech stack",
    description: "List of software being used in project",
    icon: Laptop,
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
    id: "boardmember",
    title: "Boardmember",
    description: "View board members",
    icon: Users,
    href: "/team",
    color: "text-purple-500",
  },
  {
    id: "request-expense",
    title: "Request expense",
    description: "Request expense",
    icon: Banknote,
    color: "text-orange-500",
  },
  {
    id: "request-meeting",
    title: "Request meeting",
    description: "Request meeting",
    icon: CalendarPlus,
    color: "text-emerald-500",
  },
  {
    id: "all-files",
    title: "Files and documents",
    description: "Files and documents",
    icon: Files,
    color: "text-cyan-500",
  },
];

// Helper function for className concatenation
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

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
                onClick={action.href ? () => router.push(action.href) : action.onClick}
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
