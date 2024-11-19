import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { MessageSquare, Users } from "lucide-react"

const projects = [
  {
    id: "1",
    name: "E-commerce Platform",
    progress: 75,
    status: "In Progress",
    dueDate: "2024-04-15",
    collaborators: [
      { name: "Sarah C.", avatar: "/avatars/01.png" },
      { name: "Mike J.", avatar: "/avatars/02.png" },
      { name: "Lisa B.", avatar: "/avatars/03.png" },
    ],
    unreadMessages: 3,
    openPositions: 2,
    lastMessage: "Updated the frontend designs",
  },
  {
    id: "2",
    name: "Mobile App MVP",
    progress: 30,
    status: "Planning",
    dueDate: "2024-05-01",
    collaborators: [
      { name: "Alex T.", avatar: "/avatars/04.png" },
      { name: "Emma S.", avatar: "/avatars/05.png" },
    ],
    unreadMessages: 1,
    openPositions: 3,
    lastMessage: "Backend API documentation ready",
  },
  {
    id: "3",
    name: "Marketing Website",
    progress: 90,
    status: "Review",
    dueDate: "2024-04-10",
    collaborators: [
      { name: "David W.", avatar: "/avatars/06.png" },
      { name: "John D.", avatar: "/avatars/07.png" },
    ],
    unreadMessages: 0,
    openPositions: 1,
    lastMessage: "Content review completed",
  },
]

export function ProjectsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Projects</CardTitle>
        <CardDescription>Overview of your current projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <Link 
              key={project.name} 
              href={`/dashboard/projects/${project.id}`} // Links to member dashboard
              className="block"
            >
              <div className="space-y-2 hover:bg-accent/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Due {new Date(project.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {project.collaborators.map((collaborator, i) => (
                      <Avatar key={i} className="border-2 border-background h-8 w-8">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{project.status}</span>
                    <span className="text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      {project.unreadMessages > 0 && (
                        <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          {project.unreadMessages}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground line-clamp-1">
                      {project.lastMessage}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {project.openPositions} open
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}