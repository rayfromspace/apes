import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
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
}

interface ProjectTableProps {
  projects: Project[]
}

const statusColors = {
  "Planning": "bg-blue-500/10 text-blue-500",
  "In Progress": "bg-yellow-500/10 text-yellow-500",
  "Review": "bg-purple-500/10 text-purple-500",
  "Completed": "bg-green-500/10 text-green-500",
}

export function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Team Size</TableHead>
          <TableHead>Funding Goal</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>{project.category}</TableCell>
            <TableCell>
              <div className="w-[100px]">
                <div className="flex justify-between text-sm mb-1">
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={
                  statusColors[project.status as keyof typeof statusColors]
                }
              >
                {project.status}
              </Badge>
            </TableCell>
            <TableCell>{project.teamSize}</TableCell>
            <TableCell>${project.fundingGoal.toLocaleString()}</TableCell>
            <TableCell>
              {new Date(project.dueDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button asChild size="sm">
                <Link href={`/dashboard/projects/${project.id}`}>
                  View
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}