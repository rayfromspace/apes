"use client";

import { useAuth } from '@/lib/auth';
import { useProject } from '@/lib/projects';
import { checkProjectAccess } from '@/lib/auth/access-control';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProjectDashboardStats } from '@/components/dashboard/project-stats';
import { ProjectTimeline } from '@/components/projects/timeline';
import { ProjectTeam } from '@/components/projects/team';
import { ProjectTasks } from '@/components/projects/tasks';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from 'next/navigation';

interface ProjectDashboardProps {
  params: {
    projectId: string;
  };
}

export default function ProjectDashboardPage({ params }: ProjectDashboardProps) {
  const { user } = useAuth();
  const { project, isLoading, error } = useProject(params.projectId);
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !project) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Unable to load project. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Check project access
  const access = checkProjectAccess(user, project.members || []);

  // If no access, redirect to project preview
  if (!access.canView) {
    router.push(`/projects/${params.projectId}`);
    return null;
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        {/* Project Header */}
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>

        {/* Project Stats */}
        <ProjectDashboardStats project={project} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Project Timeline */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Timeline & Milestones</h2>
              <ProjectTimeline project={project} />
            </div>

            {/* Tasks Section */}
            {access.canView && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Tasks</h2>
                <ProjectTasks 
                  projectId={project.id} 
                  canEdit={access.canEdit} 
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Team Members */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Team</h2>
              <ProjectTeam 
                project={project}
                canManageTeam={access.role === 'founder' || access.role === 'cofounder'}
              />
            </div>

            {/* Project Activity */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Activity</h2>
              <ActivityFeed projectId={project.id} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
