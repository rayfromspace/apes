"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "./project-creation/project-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/lib/stores/project-store";
import { ProjectCard } from "@/components/projects/project-card";
import { useAuth } from "@/lib/auth";
import { Project, ProjectCategory, ProjectVisibility } from "@/types/project";
import { UserRole } from "@/types/user";

// Demo projects for development
const DEMO_PROJECTS: Project[] = [
  {
    id: "1",
    title: "DeFi Trading Platform",
    description: "A decentralized trading platform with advanced analytics and automated trading strategies.",
    category: "technology",
    visibility: "public",
    progress: 75,
    funding_goal: 100000,
    current_funding: 75000,
    founder_id: "1",
    skills: ["React", "Solidity", "TypeScript"],
    start_date: "2024-01-01",
    end_date: "2024-06-30",
    image_url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
  },
  {
    id: "2",
    title: "AI Content Creator",
    description: "An AI-powered platform for generating and optimizing content across multiple channels.",
    category: "technology",
    visibility: "public",
    progress: 45,
    funding_goal: 75000,
    current_funding: 25000,
    founder_id: "2",
    skills: ["Python", "Machine Learning", "NLP"],
    start_date: "2024-02-01",
    end_date: "2024-08-31",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  },
];

interface DashboardProjectsProps {
  showMyProjectsOnly?: boolean;
  showAnalytics?: boolean;
}

function CreateProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <Card 
      className="col-span-1 cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={onClick}
    >
      <CardContent className="p-6 space-y-4">
        <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Create New Project</h3>
          <p className="text-sm text-muted-foreground">
            Start a new project and invite team members
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardProjects({ showMyProjectsOnly = false, showAnalytics = false }: DashboardProjectsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const projects = useProjectStore((state) => state.projects);

  // Use demo projects if no projects in store
  const allProjects = projects.length > 0 ? projects : DEMO_PROJECTS;
  
  const filteredProjects = showMyProjectsOnly
    ? allProjects.filter(project => project.founder_id === user?.id)
    : allProjects;

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/${projectId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            {showMyProjectsOnly ? "Your projects" : "All projects"} and their progress
          </p>
        </div>
        {user?.role === "founder" && (
          <ProjectDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </ProjectDialog>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div key={project.id} onClick={() => handleProjectClick(project.id)} className="cursor-pointer">
            <ProjectCard
              project={project}
              showAnalytics={showAnalytics}
            />
          </div>
        ))}
        {user?.role === "founder" && (
          <ProjectDialog>
            <CreateProjectCard onClick={() => setIsDialogOpen(true)} />
          </ProjectDialog>
        )}
      </div>
    </div>
  );
}