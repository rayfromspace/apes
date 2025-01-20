"use client";

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ProjectApi, type Project } from '@/lib/api/project-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { NewProjectDialog } from '@/components/dashboard/dialogs/new-project-dialog';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ProjectListProps {
  status?: string;
  category?: string;
  visibility?: string;
  showCreateCard?: boolean;
}

function ProjectCard({ project, onClick }: { project: Project; onClick?: () => void }) {
  return (
    <Card 
      className={cn(
        "group relative hover:shadow-lg transition-shadow min-w-[100px] w-[180px]",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6 space-y-4 h-[380px] flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{project.name}</h3>
          <Badge variant={project.visibility === 'public' ? 'default' : 'secondary'}>
            {project.visibility}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{project.description}</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{project.type}</Badge>
            <Badge variant="outline">{project.status}</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tasks</span>
              <span>{project.completed_tasks}/{project.active_tasks + project.completed_tasks}</span>
            </div>
            <Progress 
              value={(project.completed_tasks / (project.active_tasks + project.completed_tasks)) * 100} 
              className="h-1" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <Card 
      className="group relative hover:shadow-lg transition-shadow cursor-pointer min-w-[100px] w-[180px]" 
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

function ProjectCardSkeleton() {
  return (
    <Card className="min-w-[320px] w-[320px]">
      <CardContent className="p-6 space-y-4 h-[300px]">
        <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex justify-between mt-auto">
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectList({ status, category, visibility, showCreateCard = true }: ProjectListProps) {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const router = useRouter();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', { status, category, visibility }],
    queryFn: () => ProjectApi.listProjects({ status, category, visibility }),
  });

  const handleProjectCreated = async () => {
    await refetch();
    setShowNewProjectDialog(false);
  };

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Failed to load projects</p>
        <Button variant="ghost" onClick={() => refetch()}>
          Try again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your projects and collaborations
          </p>
        </div>
        <Button onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="relative">
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <div className="flex flex-wrap gap-4">
            {showCreateCard && (
              <CreateProjectCard onClick={() => setShowNewProjectDialog(true)} />
            )}
            
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))
            ) : data?.data?.length ? (
              data.data.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => router.push(`/projects/${project.id}`)}
                />
              ))
            ) : (
              <Card className="p-6 text-center w-full">
                <p className="text-muted-foreground">No projects found</p>
              </Card>
            )}
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
