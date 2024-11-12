import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

interface ProjectMilestonesProps {
  id: string
}

const milestones = [
  {
    title: "Project Setup & Planning",
    description: "Initial setup, team formation, and detailed planning",
    deadline: "2024-04-15",
    progress: 100,
    status: "Completed",
  },
  {
    title: "MVP Development",
    description: "Core features implementation and testing",
    deadline: "2024-05-30",
    progress: 60,
    status: "In Progress",
  },
  {
    title: "Beta Testing",
    description: "User testing and feedback collection",
    deadline: "2024-06-15",
    progress: 0,
    status: "Pending",
  },
  {
    title: "Launch Preparation",
    description: "Final optimizations and launch planning",
    deadline: "2024-06-30",
    progress: 0,
    status: "Pending",
  },
]

const statusColors = {
  "Completed": "bg-green-500/10 text-green-500",
  "In Progress": "bg-yellow-500/10 text-yellow-500",
  "Pending": "bg-blue-500/10 text-blue-500",
}

export function ProjectMilestones({ id }: ProjectMilestonesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Milestones</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Milestone
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <Badge
                      variant="secondary"
                      className={
                        statusColors[
                          milestone.status as keyof typeof statusColors
                        ]
                      }
                    >
                      {milestone.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Due: {new Date(milestone.deadline).toLocaleDateString()}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{milestone.progress}%</span>
                </div>
                <Progress value={milestone.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}