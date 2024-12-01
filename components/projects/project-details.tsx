"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectContributors } from "./project-contributors";
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  GitBranch,
  Users,
} from "lucide-react";

interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
}

interface Task {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "completed";
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate: string;
}

interface ProjectDetailsProps {
  project: {
    id: string;
    title: string;
    description: string;
    image?: string;
    category: string;
    progress: number;
    fundingGoal: number;
    currentFunding: number;
    founder: string;
    startDate: string;
    endDate?: string;
    updates: Update[];
    tasks: Task[];
    team: Array<{
      id: string;
      name: string;
      role: string;
      avatar?: string;
    }>;
  };
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <Badge variant="secondary">{project.category}</Badge>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(project.startDate)}
            </span>
          </div>
        </div>
        <Button onClick={() => router.push(`/projects/${project.id}/edit`)}>
          Edit Project
        </Button>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-6 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Funding Goal</p>
              <p className="text-xl font-bold">
                {formatCurrency(project.fundingGoal)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Timeline</p>
              <p className="text-muted-foreground">
                {formatDate(project.startDate)} -{" "}
                {project.endDate ? formatDate(project.endDate) : "Ongoing"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Team Members</p>
              <p className="text-muted-foreground">{project.team.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>
            Current funding: {formatCurrency(project.currentFunding)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={project.progress} className="h-2" />
          <p className="mt-2 text-sm text-muted-foreground">
            {project.progress}% of goal reached
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{project.description}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="updates" className="space-y-4">
          {project.updates.map((update) => (
            <Card key={update.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{update.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(update.date)}
                  </span>
                </div>
                <CardDescription>By {update.author.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{update.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4">
          {project.tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <Badge
                    variant={
                      task.status === "completed"
                        ? "default"
                        : task.status === "in_progress"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {task.status.replace("_", " ")}
                  </Badge>
                </div>
                <CardDescription>
                  Due: {formatDate(task.dueDate)}
                  {task.assignee && ` • Assigned to ${task.assignee.name}`}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="team">
          <ProjectContributors team={project.team} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
