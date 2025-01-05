"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Code, 
  HelpCircle, 
  Lightbulb, 
  Users2, 
  ArrowRight,
  Clock,
  AlertCircle,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { GoalsDialog } from "../dialogs/goals-dialog";
import { ConnectionsDialog } from "../dialogs/connections-dialog";
import { DeadlinesDialog } from "../dialogs/deadlines-dialog";
import { TasksDialog } from "../dialogs/tasks-dialog";

// Demo data for hover states
const ACTIVE_PROJECTS = [
  {
    id: "1",
    name: "DeFi Trading Platform",
    role: "Founder",
    status: "In Progress",
    progress: 75,
  },
  {
    id: "2",
    name: "AI Content Creator",
    role: "Board Member",
    status: "Active",
    progress: 45,
  },
];

const RECENT_CONNECTIONS = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://avatar.vercel.sh/sarah",
    role: "AI Engineer",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    name: "Alex Thompson",
    avatar: "https://avatar.vercel.sh/alex",
    role: "Product Designer",
    timestamp: "5 hours ago",
  },
];

const UPCOMING_DEADLINES = [
  {
    title: "Smart Contract Audit",
    project: "DeFi Trading Platform",
    date: "Today",
    priority: "high",
  },
  {
    title: "UI/UX Review",
    project: "AI Content Creator",
    date: "Tomorrow",
    priority: "medium",
  },
];

const PENDING_TASKS = [
  {
    title: "Review Pull Request",
    project: "DeFi Trading Platform",
    priority: "high",
    dueDate: "Today",
  },
  {
    title: "Update Documentation",
    project: "AI Content Creator",
    priority: "medium",
    dueDate: "Tomorrow",
  },
];

const GOALS = [
  {
    id: "1",
    title: "Launch MVP",
    status: "In Progress",
    deadline: "2024-03-01",
    progress: 75,
  },
  {
    id: "2",
    title: "Secure Seed Funding",
    status: "Not Started",
    deadline: "2024-06-30",
    progress: 0,
  },
];

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
  hoverContent: React.ReactNode;
  onClick?: () => void;
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  className, 
  hoverContent,
  onClick 
}: MetricCardProps) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Card 
          className={cn(
            "cursor-pointer transition-all duration-200", 
            "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
            className
          )}
          onClick={onClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              {icon}
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent 
        align="start" 
        className="w-80 p-0"
        side="bottom"
      >
        {hoverContent}
      </HoverCardContent>
    </HoverCard>
  );
}

function ProjectsHoverContent() {
  return (
    <div className="space-y-3 p-4">
      <h4 className="font-semibold text-sm">Your Active Projects</h4>
      {ACTIVE_PROJECTS.map((project) => (
        <div key={project.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium text-sm">{project.name}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {project.role}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {project.progress}% Complete
              </span>
            </div>
          </div>
          <Badge variant="outline">{project.status}</Badge>
        </div>
      ))}
    </div>
  );
}

function ConnectionsHoverContent() {
  return (
    <div className="space-y-3 p-4">
      <h4 className="font-semibold text-sm">Recent Connections</h4>
      {RECENT_CONNECTIONS.map((connection, i) => (
        <div key={connection.id} className="flex items-center gap-3">
          <UserAvatar 
            user={{
              id: connection.id,
              name: connection.name,
              avatar: connection.avatar,
              role: connection.role
            }}
            showHoverCard={true}
            size="md"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{connection.name}</p>
            <p className="text-xs text-muted-foreground">{connection.role}</p>
          </div>
          <span className="text-xs text-muted-foreground">{connection.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

function DeadlinesHoverContent() {
  return (
    <div className="space-y-3 p-4">
      <h4 className="font-semibold text-sm">Upcoming Deadlines</h4>
      {UPCOMING_DEADLINES.map((deadline, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">{deadline.title}</p>
            <p className="text-xs text-muted-foreground">{deadline.project}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs",
                deadline.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              )}
            >
              {deadline.date}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function TasksHoverContent() {
  return (
    <div className="space-y-3 p-4">
      <h4 className="font-semibold text-sm">Pending Tasks</h4>
      {PENDING_TASKS.map((task, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">{task.title}</p>
            <p className="text-xs text-muted-foreground">{task.project}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs",
                task.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              )}
            >
              {task.dueDate}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function GoalsHoverContent() {
  return (
    <div className="space-y-3 p-4">
      <h4 className="font-semibold text-sm">Your Current Goals</h4>
      {GOALS.map((goal) => (
        <div key={goal.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium text-sm">{goal.title}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Due: {goal.deadline}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {goal.progress}% Complete
              </span>
            </div>
          </div>
          <Badge variant="outline">{goal.status}</Badge>
        </div>
      ))}
    </div>
  );
}

interface DashboardStatsProps {
  showProjectStats?: boolean;
  projectId?: string;
}

export function DashboardStats({ showProjectStats = false, projectId }: DashboardStatsProps) {
  const [isGoalsDialogOpen, setIsGoalsDialogOpen] = useState(false);
  const [isConnectionsDialogOpen, setIsConnectionsDialogOpen] = useState(false);
  const [isDeadlinesDialogOpen, setIsDeadlinesDialogOpen] = useState(false);
  const [isTasksDialogOpen, setIsTasksDialogOpen] = useState(false);
  const router = useRouter();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Star className="h-4 w-4" />}
          label="Goals"
          value={`${GOALS.length} Active`}
          className="bg-blue-50 dark:bg-blue-950"
          hoverContent={<GoalsHoverContent />}
          onClick={() => setIsGoalsDialogOpen(true)}
        />
        <MetricCard
          icon={<Users2 className="h-4 w-4" />}
          label="Connections"
          value="12"
          className="bg-green-50 dark:bg-green-950"
          hoverContent={<ConnectionsHoverContent />}
          onClick={() => setIsConnectionsDialogOpen(true)}
        />
        <MetricCard
          icon={<Clock className="h-4 w-4" />}
          label="Deadlines"
          value="4"
          className="bg-orange-50 dark:bg-orange-950"
          hoverContent={<DeadlinesHoverContent />}
          onClick={() => setIsDeadlinesDialogOpen(true)}
        />
        <MetricCard
          icon={<AlertCircle className="h-4 w-4" />}
          label="Tasks"
          value="6"
          className="bg-purple-50 dark:bg-purple-950"
          hoverContent={<TasksHoverContent />}
          onClick={() => setIsTasksDialogOpen(true)}
        />
      </div>

      <GoalsDialog 
        open={isGoalsDialogOpen} 
        onOpenChange={setIsGoalsDialogOpen}
      />
      <ConnectionsDialog 
        open={isConnectionsDialogOpen} 
        onOpenChange={setIsConnectionsDialogOpen}
      />
      <DeadlinesDialog 
        open={isDeadlinesDialogOpen} 
        onOpenChange={setIsDeadlinesDialogOpen}
      />
      <TasksDialog 
        open={isTasksDialogOpen} 
        onOpenChange={setIsTasksDialogOpen}
      />
    </div>
  );
}