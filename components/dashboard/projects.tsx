"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { NewProjectDialog } from './dialogs/new-project-dialog';
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";
import { ProjectCard as MainProjectCard } from "@/components/projects/list/project-card";

const MAX_ACTIVE_PROJECTS = 3;
const POLLING_INTERVAL = 60000; // 1 minute in milliseconds

function CreateProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <Card className="group relative hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Plus className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Create New Project</h3>
          <p className="text-sm text-muted-foreground">Start a new project and build your team</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardProjects() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const loadProjects = async (isManualRefresh = false) => {
    if (!user) return;
    if (isManualRefresh) {
      setRefreshing(true);
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Get projects where user is founder or team member
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          *,
          team_members (
            id,
            role,
            user_id,
            users (
              id,
              email,
              raw_user_meta_data->name,
              raw_user_meta_data->avatar_url
            )
          ),
          founder:founder_id (
            id,
            email,
            raw_user_meta_data->name,
            raw_user_meta_data->avatar_url
          )
        `)
        .or(`founder_id.eq.${session.user.id},team_members.user_id.eq.${session.user.id}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(MAX_ACTIVE_PROJECTS);

      if (error) {
        console.error('Error loading projects:', error);
        return;
      }

      // Transform the data to match the project card structure
      const transformedProjects = projectsData.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category || 'Other',
        visibility: project.visibility || 'private',
        status: project.status || 'active',
        created_at: project.created_at,
        updated_at: project.updated_at,
        founder: project.founder,
        founder_id: project.founder_id,
        current_funding: project.current_funding || 0,
        funding_goal: project.funding_goal || 0,
        required_skills: project.required_skills || [],
        team_members: project.team_members || [],
        image_url: project.image_url,
        progress: project.progress || 0,
        role: project.founder_id === session.user.id 
          ? 'founder'
          : project.team_members?.find(m => m.user_id === session.user.id)?.role || 'member'
      }));

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      if (isManualRefresh) {
        setRefreshing(false);
      }
    }
  };

  // Handle dialog close and project refresh
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      loadProjects();
    }
  };

  // Initial load
  useEffect(() => {
    loadProjects();
  }, [user]);

  // Set up real-time subscription for project changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('project_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `founder_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Project change detected:', payload);
          loadProjects();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_members',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Team member change detected:', payload);
          loadProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/${projectId}`);
  };

  const handleProjectCreated = (project: Project) => {
    setProjects(prevProjects => [project, ...prevProjects].slice(0, MAX_ACTIVE_PROJECTS));
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Your Projects</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage your projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => loadProjects(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => router.push('/explore')}
          >
            Explore Projects
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project Slots - Show active projects or empty slots */}
        {Array.from({ length: MAX_ACTIVE_PROJECTS }).map((_, index) => {
          const project = projects[index];
          
          if (project) {
            return (
              <MainProjectCard 
                key={project.id} 
                project={project}
                onClick={() => handleProjectClick(project.id)}
              />
            );
          }

          if (index === projects.length && projects.length < MAX_ACTIVE_PROJECTS) {
            return (
              <CreateProjectCard 
                key={`create-${index}`} 
                onClick={() => setIsDialogOpen(true)} 
              />
            );
          }

          return (
            <Card key={`empty-${index}`} className="opacity-50">
              <CardContent className="p-6 min-h-[300px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Project Slot Available</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <NewProjectDialog 
        open={isDialogOpen} 
        onOpenChange={handleDialogChange}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}