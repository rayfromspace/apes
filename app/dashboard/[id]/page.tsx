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

interface ProjectDashboardProps {
  params: {
    id: string;
  };
}

export default function ProjectDashboardPage({ params }: ProjectDashboardProps) {
  const { user } = useAuth();
  const { project, isLoading, error } = useProject(params.id);

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

  // If no access, show public preview
  if (!access.canView) {
    const publicData = getPublicProjectData(project);
    return <ProjectPreview project={publicData} />;
  }

  // Render appropriate dashboard based on role and permissions
  switch (access.role) {
    case "founder":
      return (
        <div className="container mx-auto p-6">
          <FounderDashboard 
            project={project}
            permissions={{
              canManageFunds: access.canManageFunds,
              canManageTeam: access.canManageTeam,
              canVote: access.canVote
            }}
          />
        </div>
      );

    case "cofounder":
      return (
        <div className="container mx-auto p-6">
          <CoFounderDashboard 
            project={project}
            permissions={{
              canManageFunds: access.canManageFunds,
              canManageTeam: access.canManageTeam,
              canVote: access.canVote
            }}
          />
        </div>
      );

    case "board_member":
      return (
        <div className="container mx-auto p-6">
          <BoardMemberDashboard 
            project={project}
            permissions={{
              canManageFunds: access.canManageFunds,
              canVote: access.canVote
            }}
          />
        </div>
      );

    default:
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to view this project's dashboard.
          </AlertDescription>
        </Alert>
      );
  }
}
