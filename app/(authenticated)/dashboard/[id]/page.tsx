'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/lib/auth/store';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Calendar, 
  MessageSquare, 
  Users2, 
  Wallet 
} from 'lucide-react';

// Import components
import { ProjectHeader } from "./components/project-header";
import { ProjectStats } from "./components/project-stats";
import { RecentRequests } from "./components/recent-requests";
import { TaskCalendar } from "./components/task-calendar";
import { ProjectMilestones } from "./components/project-milestones";
import { TaskBoard } from "./components/task-board";
import { TeamPage } from "./components/team";
import { BudgetPage } from "./components/budget";
import { QuickActions } from "@/app/(authenticated)/projects/[id]/components/quick-actions";
import { ProjectCalendar } from "./components/project-calendar";
import { ProjectMessages } from "./components/project-messages";

interface ProjectDashboardProps {
  params: {
    id: string;
  };
}

interface Project {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  type: string;
  visibility: 'public' | 'private';
  status: 'draft' | 'active' | 'completed' | 'archived';
  founder_id: string;
  created_at: string;
  updated_at: string;
  team_members?: Array<{
    id: string;
    role: string;
    user_id: string;
  }>;
  team_profiles?: Array<{
    id: string;
    email: string;
    username: string;
    full_name: string;
    avatar_url: string;
    user_metadata?: {
      name?: string;
      avatar_url?: string;
    };
  }>;
}

export default function ProjectDashboardPage({ params }: ProjectDashboardProps) {
  const { user, initialize } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Initialize auth
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    async function fetchProject() {
      if (!user) {
        console.log('No user found');
        return;
      }

      try {
        console.log('Fetching project:', params.id);
        
        // First, get the project and team members
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            *,
            team_members (
              id,
              role,
              user_id
            )
          `)
          .eq('id', params.id)
          .single();

        if (projectError) throw projectError;
        
        if (!projectData) {
          throw new Error('Project not found');
        }

        // Then, get the profiles for all team members
        if (projectData.team_members && projectData.team_members.length > 0) {
          const userIds = projectData.team_members.map(member => member.user_id);
          
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds);

          if (profilesError) throw profilesError;

          // Combine the data
          setProject({
            ...projectData,
            title: projectData.name, // Map name to title for compatibility
            category: projectData.category || '',
            type: projectData.type || '',
            visibility: projectData.visibility || 'private',
            team_profiles: profilesData || []
          });
        } else {
          setProject({
            ...projectData,
            title: projectData.name, // Map name to title for compatibility
            category: projectData.category || '',
            type: projectData.type || '',
            visibility: projectData.visibility || 'private',
          });
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [params.id, user]);

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message || 'Unable to load project. Please try again later.'}
        </AlertDescription>
      </Alert>
    );
  }

  // Check if user has access
  const hasAccess = user.id === project.founder_id || 
    project.team_members?.some(member => member.user_id === user.id);

  const userRole = project.team_members?.find(member => member.user_id === user.id)?.role || 
    (user.id === project.founder_id ? 'founder' : null);

  if (!hasAccess) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ProjectHeader project={project} />
      <Tabs defaultValue="overview" className="flex-1">
        <TabsList className="w-full justify-center sm:justify-start border-b rounded-none h-auto px-6 sm:px-4 py-0 bg-transparent flex gap-2 sm:gap-0">
          <TabsTrigger 
            value="overview" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <LayoutDashboard className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="task-board"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <KanbanSquare className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Task Board</span>
          </TabsTrigger>
          <TabsTrigger 
            value="calendar"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <Calendar className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger 
            value="message"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <MessageSquare className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Message</span>
          </TabsTrigger>
          <TabsTrigger 
            value="team"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <Users2 className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger 
            value="budget"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <Wallet className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Budget</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex-1 space-y-4 p-4 m-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <TaskCalendar project={project} />
              <ProjectStats project={project} />
              <RecentRequests project={project} />
            </div>
            <div className="md:w-[300px] relative">
              <div className="sticky top-4">
                <ProjectMilestones project={project} />
              </div>
            </div>
          </div>
          <QuickActions project={project} userRole={userRole} />
        </TabsContent>
        <TabsContent value="task-board" className="flex-1 m-0 p-0">
          <TaskBoard project={project} userRole={userRole} />
        </TabsContent>
        <TabsContent value="calendar" className="flex-1 m-0 p-4">
          <ProjectCalendar project={project} />
        </TabsContent>
        <TabsContent value="message" className="flex-1 m-0 p-4">
          <ProjectMessages project={project} />
        </TabsContent>
        <TabsContent value="team" className="flex-1 m-0 p-0">
          <TeamPage project={project} userRole={userRole} />
        </TabsContent>
        <TabsContent value="budget" className="flex-1 m-0 p-0">
          <BudgetPage project={project} userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
