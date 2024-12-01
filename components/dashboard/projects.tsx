"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CalendarWeekView from "./schedule";

const DEMO_PROJECTS = [
  {
    id: "1",
    title: "DeFi Trading Platform",
    description: "Web Application",
    date: "3/13/2024",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=60",
    progress: 75,
    budget: 100000,
    team: [
      { name: "Sarah Chen", avatar: "https://avatar.vercel.sh/sarah" },
      { name: "Alex Thompson", avatar: "https://avatar.vercel.sh/alex" },
      { name: "Michael Lee", avatar: "https://avatar.vercel.sh/michael" },
    ],
  },
  {
    id: "2",
    title: "AI Content Creator",
    description: "Machine Learning",
    date: "3/12/2024",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    progress: 45,
    budget: 75000,
    team: [
      { name: "Elena Martinez", avatar: "https://avatar.vercel.sh/elena" },
      { name: "James Wilson", avatar: "https://avatar.vercel.sh/james" },
    ],
  },
];

function CreateProjectCard() {
  return (
    <Link href="/projects/create">
      <Card className="col-span-1 h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
        <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Create New Project</h3>
            <p className="text-sm text-muted-foreground">
              Start a new project (max 3 active projects)
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProjectCard({ project }: { project: typeof DEMO_PROJECTS[0] }) {
  const router = useRouter();

  return (
    <Card 
      className="col-span-1 cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <CardContent className="p-6 space-y-4">
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{project.title}</h3>
          <p className="text-sm text-muted-foreground">
            {project.description} • {project.date}
          </p>
        </div>
        <Progress value={project.progress} className="h-2" />
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.team.map((member, i) => (
              <Avatar key={i} className="border-2 border-background">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              ${project.budget.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardProjects() {
  const showCreateCard = DEMO_PROJECTS.length < 3;

  return (
    <div className="space-y-6">
      <CalendarWeekView />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMO_PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {showCreateCard && <CreateProjectCard />}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ProjectsList />
        <TasksList />
      </div>
    </div>
  );
}

function ProjectsList() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Posts & Mentions</h3>
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {DEMO_PROJECTS.map((project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {project.team.map((member, i) => (
                    <Avatar key={i} className="border-2 border-background">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TasksList() {
  const tasks = [
    {
      title: "Design new landing page",
      project: "Mobile app MVP",
      priority: "Low",
      team: [
        { name: "Sarah Chen", avatar: "https://avatar.vercel.sh/sarah" },
        { name: "Alex Thompson", avatar: "https://avatar.vercel.sh/alex" },
      ],
    },
    {
      title: "Implement authentication",
      project: "Web Platform",
      priority: "High",
      team: [
        { name: "Elena Martinez", avatar: "https://avatar.vercel.sh/elena" },
        { name: "James Wilson", avatar: "https://avatar.vercel.sh/james" },
      ],
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Today's Tasks</h3>
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {tasks.map((task, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">{task.project}</p>
                </div>
                <span className={`px-2 py-1 text-xs ${
                  task.priority === "Low" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                } rounded`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center justify-end">
                <div className="flex -space-x-2">
                  {task.team.map((member, j) => (
                    <Avatar key={j} className="border-2 border-background">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}