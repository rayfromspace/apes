"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { Project, ProjectCategory, ProjectVisibility } from "@/types/project";
import { UserRole } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { NewProjectDialog } from "./new-project-dialog";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/lib/stores/project-store";
import { useAuth } from "@/lib/auth";

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

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group relative hover:shadow-lg transition-shadow">
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
            <Badge variant="outline" className="text-xs">{project.category}</Badge>
            <Badge variant="secondary" className="text-xs">{project.visibility}</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-1" />
          </div>
          <div className="pt-2">
            <div className="text-sm text-muted-foreground">
              Funding: ${project.current_funding.toLocaleString()} / ${project.funding_goal.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardProjects() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const projects = useProjectStore((state) => state.projects);
  
  // Get user's active projects (projects where they are a member or founder)
  const activeProjects = projects.filter(project => {
    if (!user) return false;

    return project.founder_id === user.id || 
           (project.members || []).some(member => 
             member.userId === user.id && 
             ['founder', 'cofounder', 'board_member', 'team_member'].includes(member.role || '')
           );
  });

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/${projectId}`);
  };

  // Calculate remaining project slots
  const remainingSlots = MAX_ACTIVE_PROJECTS - activeProjects.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Display active project cards */}
      {activeProjects.map((project) => (
        <div
          key={project.id}
          onClick={() => handleProjectClick(project.id)}
          className="cursor-pointer"
        >
          <ProjectCard project={project} />
        </div>
      ))}

      {/* Display create project card if user has less than 3 active projects */}
      {remainingSlots > 0 && (
        <CreateProjectCard onClick={() => setIsDialogOpen(true)} />
      )}

      {/* Fill remaining slots with empty cards */}
      {Array.from({ length: remainingSlots - 1 }).map((_, index) => (
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