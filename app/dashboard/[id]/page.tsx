"use client";

import { useAuth } from '@/lib/auth';
import { useProject } from '@/lib/projects';
import { checkProjectAccess, getPublicProjectData } from '@/lib/auth/access-control';
import FounderDashboard from '@/components/projects/dashboard/founder-dashboard';
import CoFounderDashboard from '@/components/projects/dashboard/cofounder-dashboard';
import BoardMemberDashboard from '@/components/projects/dashboard/board-member-dashboard';
import { ProjectPreview } from '@/components/projects/preview';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import { DashboardStats } from '@/components/dashboard/stats';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

interface ProjectDashboardProps {
  params: {
    id: string;
  };
}

export default function ProjectDashboardPage({ params }: ProjectDashboardProps) {
  const { user } = useAuth();
  const { project, isLoading, error } = useProject(params.id);
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
    router.push(`/projects/${params.id}`);
    return null;
  }

  // Render appropriate dashboard based on role
  switch (access.role) {
    case "founder":
      return <FounderDashboard project={project} />;
    case "cofounder":
      return <CoFounderDashboard project={project} />;
    case "board_member":
      return <BoardMemberDashboard project={project} />;
    default:
      // For team members and other roles
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6">
            {/* Project Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <p className="text-muted-foreground">{project.description}</p>
                
                {/* Project Stats */}
                <DashboardStats showProjectStats projectId={project.id} />
                
                {/* Tasks and Deadlines */}
                {access.canView && (
                  <>
                    <h2 className="text-2xl font-bold mt-8">Your Tasks</h2>
                    {/* Add TaskList component here */}
                  </>
                )}
              </div>
              
              <div className="space-y-6">
                {/* Project Activity */}
                <ActivityFeed projectId={project.id} />
                
                {/* Team Members */}
                {access.canView && (
                  <div className="bg-card rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Team Members</h3>
                    {/* Add TeamMembers component here */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
  }
}
