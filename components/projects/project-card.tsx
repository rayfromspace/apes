import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Project {
  id: string
  name: string
  type: string
  category: string
  description: string
  progress: number
  status: string
  teamSize: number
  fundingGoal: number
  equity: number
  dueDate: string
  image: string
}

interface ProjectCardProps {
  project: Project
}

const statusColors = {
  "Planning": "bg-blue-500/10 text-blue-500",
  "In Progress": "bg-yellow-500/10 text-yellow-500",
  "Review": "bg-purple-500/10 text-purple-500",
  "Completed": "bg-green-500/10 text-green-500",
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover"
        />
        <Badge
          variant="secondary"
          className={`absolute top-4 right-4 ${
            statusColors[project.status as keyof typeof statusColors]
          }`}
        >
          {project.status}
        </Badge>
      </div>
      <CardHeader>
        <div className="space-y-1">
          <h3 className="font-semibold text-xl leading-none">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {project.category}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-2">{project.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{project.teamSize}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>${project.fundingGoal.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(project.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/dashboard/projects/${project.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}