"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/store";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";
import { NewProjectDialog } from "./dialogs/new-project-dialog";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  visibility: 'public' | 'private';
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  founder: {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
  };
  team_members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      email: string;
      name: string;
      avatar_url?: string;
    };
  }>;
}

const MAX_PROJECTS = 3;

function ProjectCard({ project, onClick }: { project: Project; onClick?: () => void }) {
  return (
    <Card 
      className={cn(
        "group relative hover:shadow-lg transition-shadow",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <Badge variant={project.visibility === 'public' ? 'default' : 'secondary'}>
            {project.visibility}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {[project.founder, ...project.team_members.map(m => m.user)].slice(0, 3).map((member, i) => (
              <Avatar key={member.id} className="border-2 border-background">
                <AvatarFallback>
                  {member.name?.charAt(0) || member.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {project.team_members.length + 1} members
          </span>
        </div>
        <Progress value={75} className="h-1" />
      </CardContent>
    </Card>
  );
}

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

function EmptyProjectSlot() {
  return (
    <Card className="opacity-50">
      <CardContent className="p-6 min-h-[300px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Project Slot Available</p>
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
        router.push('/auth/login');
        return;
      }

      // Get projects where user is founder
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          *,
          founder:user_profiles!founder_id (
            id,
            full_name as name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(MAX_PROJECTS);

      if (error) {
        console.error('Error loading projects:', error);
        return;
      }

      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      if (isManualRefresh) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleProjectCreated = (project: Project) => {
    setProjects(prev => [project, ...prev].slice(0, MAX_PROJECTS));
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Active Projects</h2>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => loadProjects(true)}
          disabled={refreshing}
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Project Slots - Show active projects or empty slots */}
        {Array.from({ length: MAX_PROJECTS }).map((_, index) => {
          const project = projects[index];
          
          if (project) {
            return (
              <ProjectCard 
                key={project.id} 
                project={project}
                onClick={() => handleProjectClick(project.id)}
              />
            );
          }

          if (index === projects.length) {
            return (
              <CreateProjectCard 
                key={`create-${index}`} 
                onClick={() => setIsDialogOpen(true)} 
              />
            );
          }

          return <EmptyProjectSlot key={`empty-${index}`} />;
        })}
      </div>

      <NewProjectDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}