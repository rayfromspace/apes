'use client';

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
  type: string;
  visibility: 'public' | 'private';
  status: 'active' | 'completed' | 'archived';
  founder_id: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

const MAX_PROJECTS = 3;

function ProjectCard({ project, onClick }: { project: Project; onClick?: () => void }) {
  return (
    <Card 
      className={cn(
        "group relative hover:shadow-lg transition-shadow w-[240px] sm:w-[240px] sm:min-w-[240px] flex-shrink-0",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0 space-y-4 h-[300px] flex flex-col">
        <div className="relative w-full h-[140px] bg-muted overflow-hidden rounded-t-lg">
          <img
            src={project.image_url || '/images/project-cover-placeholder.svg'}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <Badge variant={project.visibility === 'public' ? 'default' : 'secondary'}>
              {project.visibility}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{project.description}</p>
          <div className="space-y-4 mt-auto">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{project.type}</Badge>
              <Badge variant="outline">{project.status}</Badge>
            </div>
            <Progress value={75} className="h-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <Card 
      className="group relative hover:shadow-lg transition-shadow w-[240px] sm:w-[240px] sm:min-w-[240px] flex-shrink-0 cursor-pointer" 
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center h-[300px] text-center space-y-4">
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
    <Card className="opacity-50 w-[240px] sm:w-[240px] sm:min-w-[240px] flex-shrink-0">
      <CardContent className="p-6 h-[300px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Project slot available</p>
      </CardContent>
    </Card>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user, initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  async function fetchProjects() {
    if (!user) {
      console.log('No user found');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching projects for user:', user.id);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('founder_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      console.log('Projects found:', data);
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleProjectCreated = (project: Project) => {
    setProjects(prev => [project, ...prev]);
    setShowNewProjectDialog(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your active projects and create new ones
          </p>
        </div>
        {loading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading
          </Button>
        ) : (
          <Button onClick={() => fetchProjects()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>

      <div className="relative w-full">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <div className="flex gap-4 p-1 min-w-full w-full">
            <div className="flex gap-4 flex-nowrap">
              <CreateProjectCard onClick={() => setShowNewProjectDialog(true)} />
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => router.push(`/projects/${project.id}`)}
                />
              ))}
              {Array.from({ length: Math.max(0, MAX_PROJECTS - projects.length) }).map((_, i) => (
                <EmptyProjectSlot key={i} />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}