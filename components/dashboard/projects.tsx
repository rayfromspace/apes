"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Loader2 } from "lucide-react";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { NewProjectDialog } from './dialogs/new-project-dialog';
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const MAX_ACTIVE_PROJECTS = 3;

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
      <CardContent className="p-4 space-y-4">
        <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
          {project.image_url && (
            <img
              src={project.image_url}
              alt={project.title}
              className="object-cover w-full h-full"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg truncate">{project.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs capitalize">{project.type}</Badge>
            <Badge variant="secondary" className="text-xs">{project.category}</Badge>
          </div>
          <div className="pt-2 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Created {new Date(project.created_at).toLocaleDateString()}
            </div>
            <div className="flex -space-x-2">
              {project.team_members?.map((member: any) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarFallback>
                    {member.users?.email?.[0].toUpperCase()}
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
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const loadProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
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
        .or(`founder_id.eq.${user.id},team_members.user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading projects:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user, supabase]);

  // Set up real-time subscription for project updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `founder_id=eq.${user.id}`
        },
        () => {
          loadProjects(); // Reload projects when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

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

  const remainingSlots = MAX_ACTIVE_PROJECTS - projects.length;

  return (
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
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}