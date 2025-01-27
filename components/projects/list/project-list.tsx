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

const placeholderImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dy=".3em">Project Cover</text></svg>`;

function ProjectCard({ project, onClick }: { project: Project; onClick?: () => void }) {
  return (
    <Card 
      className={cn(
        "group relative hover:shadow-lg transition-shadow w-[240px]",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0 space-y-4 h-[400px] flex flex-col">
        <div className="relative w-full h-[180px] bg-muted overflow-hidden">
          <img
            src={project.image_url || placeholderImage}
            alt={project.image_url ? `${project.name} cover` : "Project placeholder"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-6 space-y-4 flex-1">
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
        </div>
      </CardContent>
    </Card>
  );
}

function CreateProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <Card 
      className="group relative hover:shadow-lg transition-shadow w-[240px] cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-0 h-[400px] flex flex-col">
        <div className="relative w-full h-[180px] bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Create New Project</h3>
            <p className="text-sm text-muted-foreground">Start a new project and build your team</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card className="w-[240px]">
      <CardContent className="p-0 h-[400px] flex flex-col">
        <div className="w-full h-[180px] bg-muted animate-pulse" />
        <div className="p-6 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex justify-between mt-4">
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="mt-4">
            <div className="h-2 w-full bg-muted rounded animate-pulse" />
          </div>
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

      <div className="w-full overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {showCreateCard && (
            <div className="w-full">
              <CreateProjectCard onClick={() => setShowNewProjectDialog(true)} />
            </div>
          )}
          
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full">
                <ProjectCardSkeleton />
              </div>
            ))
          ) : data?.data?.length ? (
            data.data.map((project) => (
              <div key={project.id} className="w-full">
                <ProjectCard
                  project={project}
                  onClick={() => router.push(`/projects/${project.id}`)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full w-full">
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No projects found</p>
              </Card>
            </div>
          )}
        </div>
      </div>

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
