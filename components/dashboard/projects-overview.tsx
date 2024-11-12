import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const projects = [
  {
    name: "E-commerce Platform",
    progress: 75,
    status: "In Progress",
    dueDate: "2024-04-15",
    collaborators: [
      { name: "Sarah C.", avatar: "/avatars/01.png" },
      { name: "Mike J.", avatar: "/avatars/02.png" },
      { name: "Lisa B.", avatar: "/avatars/03.png" },
    ],
  },
  {
    name: "Mobile App MVP",
    progress: 30,
    status: "Planning",
    dueDate: "2024-05-01",
    collaborators: [
      { name: "Alex T.", avatar: "/avatars/04.png" },
      { name: "Emma S.", avatar: "/avatars/05.png" },
    ],
  },
  {
    name: "Marketing Website",
    progress: 90,
    status: "Review",
    dueDate: "2024-04-10",
    collaborators: [
      { name: "David W.", avatar: "/avatars/06.png" },
      { name: "John D.", avatar: "/avatars/07.png" },
    ],
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
            <div key={project.name} className="space-y-2">
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
              <Progress value={project.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}