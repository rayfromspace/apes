"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Loader2, RefreshCw, Briefcase } from "lucide-react";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { NewProjectDialog } from './dialogs/new-project-dialog';
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

function ProjectCard({ project, onClick }: { project: Project; onClick?: () => void }) {
  return (
    <Card 
      className="group relative hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-video w-full relative overflow-hidden">
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Briefcase className="h-12 w-12 text-primary/40" />
            </div>
          )}
        </div>
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-lg truncate">{project.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">{project.type}</Badge>
            <Badge variant="secondary" className="text-xs">{project.category}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Created {new Date(project.created_at).toLocaleDateString()}
            </div>
            <div className="flex -space-x-2">
              {project.team_members?.map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarFallback>
                    {member.user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
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

      console.log('Loading projects for user:', session.user.id);
      
      // Get projects where user is founder
      const { data: founderProjects, error: founderError } = await supabase
        .from('projects')
        .select(`
          *,
          team_members (
            id,
            role,
            user_id,
            users (
              email
            )
          )
        `)
        .eq('founder_id', session.user.id)
        .order('created_at', { ascending: false });

      console.log('Founder projects:', founderProjects);

      if (founderError) {
        console.error('Error loading founder projects:', founderError);
        return;
      }

      // Get projects where user is team member
      const { data: memberProjects, error: memberError } = await supabase
        .from('projects')
        .select(`
          *,
          team_members (
            id,
            role,
            user_id,
            users (
              email
            )
          )
        `)
        .neq('founder_id', session.user.id)
        .eq('team_members.user_id', session.user.id)
        .order('created_at', { ascending: false });

      console.log('Member projects:', memberProjects);

      if (memberError) {
        console.error('Error loading member projects:', memberError);
        return;
      }

      // Combine and deduplicate projects
      const allProjects = [...(founderProjects || []), ...(memberProjects || [])];
      const uniqueProjects = Array.from(new Map(allProjects.map(p => [p.id, p])).values());
      
      console.log('All projects:', uniqueProjects);
      setProjects(uniqueProjects);
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

  useEffect(() => {
    loadProjects();
  }, [user]);

  // Set up real-time subscription
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
        },
        () => {
          console.log('Project change detected, reloading...');
          loadProjects();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_members',
        },
        () => {
          console.log('Team member change detected, reloading...');
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
    router.push(`/projects/${projectId}`);
  };

  const handleProjectCreated = (project: Project) => {
    setProjects(prevProjects => [project, ...prevProjects]);
  };

  const remainingSlots = MAX_ACTIVE_PROJECTS - projects.length;

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
            onClick={() => router.push('/projects')}
          >
            View All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={() => handleProjectClick(project.id)}
          />
        ))}

        {/* Create Project Card */}
        {remainingSlots > 0 && (
          <CreateProjectCard onClick={() => setIsDialogOpen(true)} />
        )}

        {/* Empty Slots */}
        {remainingSlots > 1 && Array.from({ length: remainingSlots - 1 }).map((_, index) => (
          <Card key={`empty-${index}`} className="opacity-50">
            <CardContent className="p-6 min-h-[300px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Project Slot Available</p>
            </CardContent>
          </Card>
        ))}

        <NewProjectDialog 
          open={isDialogOpen} 
          onOpenChange={handleDialogChange}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    </div>
  );
}