"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Code, 
  HelpCircle, 
  Lightbulb, 
  Users2, 
  ArrowRight,
  Clock,
  CheckCircle2,
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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from "@/lib/auth/store";

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
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card 
          className={cn(
            "relative overflow-hidden transition-all hover:shadow-md cursor-pointer",
            className
          )}
          onClick={onClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {label}
                </p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              {icon}
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {hoverContent}
      </HoverCardContent>
    </HoverCard>
  );
}

function ProjectsHoverContent({ projects = [] }) {
  const router = useRouter();
  
  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Active Investments</h4>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-sm">{project.name}</p>
              <Badge variant="secondary" className="text-xs">
                {project.investment_type || 'Investment'}
              </Badge>
            </div>
            <Badge variant="outline">{project.status}</Badge>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No active investments</p>
      )}
      <Button
        variant="link"
        className="p-0 h-auto font-semibold"
        onClick={() => router.push('/investments')}
      >
        View all investments
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function ConnectionsHoverContent({ connections = [] }) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Your Network</h4>
      {connections.length > 0 ? (
        connections.map((connection) => (
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
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No connections yet</p>
      )}
      <Button
        variant="link"
        className="p-0 h-auto font-semibold"
      >
        Manage connections
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function DeadlinesHoverContent({ deadlines = [] }) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Upcoming Deadlines</h4>
      {deadlines.length > 0 ? (
        deadlines.map((deadline, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{deadline.title}</p>
              <p className="text-xs text-muted-foreground">{deadline.investment}</p>
            </div>
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
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
      )}
      <Button
        variant="link"
        className="p-0 h-auto font-semibold"
      >
        View all deadlines
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function TasksHoverContent({ tasks = [] }) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Recent Tasks</h4>
      {tasks.length > 0 ? (
        tasks.map((task, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.investment}</p>
            </div>
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs",
                task.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              )}
            >
              {task.status}
            </Badge>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No recent tasks</p>
      )}
      <Button
        variant="link"
        className="p-0 h-auto font-semibold"
      >
        View all tasks
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
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
  const [stats, setStats] = useState({
    activeInvestments: 0,
    connections: 0,
    upcomingDeadlines: 0,
    completedTasks: 0,
  });
  const [detailedData, setDetailedData] = useState({
    projects: [],
    connections: [],
    deadlines: [],
    tasks: []
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Get active investments count and data
      const { data: projects, count: activeInvestmentsCount, error: projectsError } = await supabase
        .from('investments')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .or(`investor_id.eq.${user.id},team_members.user_id.eq.${user.id}`)
        .limit(3);

      if (projectsError) throw projectsError;

      // Get connections count and data
      const { data: connections, count: connectionsCount, error: connectionsError } = await supabase
        .from('team_members')
        .select(`
          *,
          user:users (
            id,
            name,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .limit(3);

      if (connectionsError) throw connectionsError;

      // Get upcoming deadlines count and data
      const { data: deadlines, count: deadlinesCount, error: deadlinesError } = await supabase
        .from('milestones')
        .select(`
          *,
          investment:investments (
            name
          )
        `)
        .gte('due_date', new Date().toISOString())
        .lte('due_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        .eq('completed', false)
        .or(`investment_id.in.(select id from investments where investor_id.eq.${user.id}),investment_id.in.(select investment_id from team_members where user_id.eq.${user.id})`)
        .limit(3);

      if (deadlinesError) throw deadlinesError;

      // Get completed tasks count and recent tasks
      const { data: tasks, count: tasksCount, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          investment:investments (
            name
          )
        `)
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (tasksError) throw tasksError;

      setStats({
        activeInvestments: activeInvestmentsCount || 0,
        connections: connectionsCount || 0,
        upcomingDeadlines: deadlinesCount || 0,
        completedTasks: tasksCount || 0,
      });

      setDetailedData({
        projects: projects || [],
        connections: connections || [],
        deadlines: deadlines || [],
        tasks: tasks || []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time subscriptions
    const projectsChannel = supabase
      .channel('investments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'investments',
        },
        () => fetchStats()
      )
      .subscribe();

    const milestonesChannel = supabase
      .channel('milestones_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'milestones',
        },
        () => fetchStats()
      )
      .subscribe();

    const tasksChannel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `assigned_to=eq.${user?.id}`,
        },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(milestonesChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Lightbulb className="h-8 w-8 text-blue-500" />}
          label="Active Investments"
          value={stats.activeInvestments.toString()}
          className="bg-blue-50 dark:bg-blue-950"
          hoverContent={<ProjectsHoverContent projects={detailedData.projects} />}
          onClick={() => router.push('/investments')}
        />

        <MetricCard
          icon={<Users2 className="h-8 w-8 text-green-500" />}
          label="Connections"
          value={stats.connections.toString()}
          className="bg-green-50 dark:bg-green-950"
          hoverContent={<ConnectionsHoverContent connections={detailedData.connections} />}
          onClick={() => setIsConnectionsDialogOpen(true)}
        />

        <MetricCard
          icon={<Clock className="h-8 w-8 text-yellow-500" />}
          label="Upcoming Deadlines"
          value={stats.upcomingDeadlines.toString()}
          className="bg-yellow-50 dark:bg-yellow-950"
          hoverContent={<DeadlinesHoverContent deadlines={detailedData.deadlines} />}
          onClick={() => setIsDeadlinesDialogOpen(true)}
        />

        <MetricCard
          icon={<CheckCircle2 className="h-8 w-8 text-purple-500" />}
          label="Completed Tasks"
          value={stats.completedTasks.toString()}
          className="bg-purple-50 dark:bg-purple-950"
          hoverContent={<TasksHoverContent tasks={detailedData.tasks} />}
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
    </>
  );
}