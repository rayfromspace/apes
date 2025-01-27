"use client";

import * as React from "react";
import { Project } from "@/types/project";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Calendar,
  FileText,
  MoreVertical,
  Users,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/lib/stores/project-store";
import { formatDate, cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const placeholderImage = 'https://via.placeholder.com/400';

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const router = useRouter();
  const deleteProject = useProjectStore((state) => state.deleteProject);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(project.id);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/${project.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/${project.id}/edit`);
  };

  const fundingProgress = (project.current_funding / project.funding_goal) * 100;

  return (
    <div 
      className={cn(
        "group relative hover:shadow-lg transition-shadow h-[400px] w-[240px]",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <Card className="h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative w-full h-[180px] bg-muted overflow-hidden">
            <img
              src={project.image_url || placeholderImage}
              alt={project.image_url ? `${project.name} cover` : "Project placeholder"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute right-4 top-4 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleView}>
                  <FileText className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleDelete}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardHeader>
            <div className="space-y-1">
              <CardTitle>{project.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{project.category}</Badge>
                <Badge variant="secondary">{project.visibility}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Funding Progress</span>
                <span className="font-medium">
                  ${project.current_funding?.toLocaleString() ?? '0'} / ${project.funding_goal?.toLocaleString() ?? '0'}
                </span>
              </div>
              <Progress value={fundingProgress} className="h-2" />
            </div>
          </CardContent>
        </CardContent>
      </Card>
    </div>
  );
}
