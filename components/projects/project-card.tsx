"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  progress: number;
  fundingGoal: number;
  currentFunding: number;
  founder: string;
  skills: string[];
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  return (
    <Card 
      className="overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-lg"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <div className="relative h-48 w-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="flex-1 p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{project.category}</Badge>
          <span className="text-sm text-muted-foreground">
            ${project.currentFunding.toLocaleString()} / ${project.fundingGoal.toLocaleString()}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <Progress value={project.progress} className="mb-4" />
        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-6 border-t">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://avatar.vercel.sh/${project.founder}`} />
            <AvatarFallback>{project.founder[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{project.founder}</span>
        </div>
        <Button variant="ghost" size="sm">
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}