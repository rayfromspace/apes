"use client";

import { Project } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Calendar, FileText, Users, Wallet } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProjectPreviewProps {
  project: Project;
}

export function ProjectPreview({ project }: ProjectPreviewProps) {
  const fundingProgress = (project.current_funding / project.funding_goal) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle>{project.title}</CardTitle>
            <Badge variant="outline">{project.category}</Badge>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(project.start_date)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-semibold">About</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span>${project.current_funding.toLocaleString()}</span>
            </div>
            <span className="text-muted-foreground">
              ${project.funding_goal.toLocaleString()} goal
            </span>
          </div>
          <Progress value={fundingProgress} className="h-2" />
          <p className="text-sm text-muted-foreground text-right">
            {Math.round(fundingProgress)}% funded
          </p>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Team Members</span>
            </div>
            <p className="text-2xl font-bold">{project.skills?.length || 0}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <BarChart className="h-4 w-4" />
              <span>Progress</span>
            </div>
            <p className="text-2xl font-bold">{project.progress}%</p>
          </div>
        </div>

        {/* Required Skills */}
        <div className="space-y-2">
          <h3 className="font-semibold">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {project.skills?.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
