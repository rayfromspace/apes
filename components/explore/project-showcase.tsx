"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const projects = [
  {
    id: "1",
    name: "AI-Powered Marketing Platform",
    description: "Revolutionizing digital marketing with artificial intelligence and machine learning.",
    category: "Software",
    stage: "Development",
    progress: 65,
    fundingGoal: 100000,
    teamSize: 8,
    deadline: "2024-06-30",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    name: "Virtual Event Platform",
    description: "Next-generation platform for hosting immersive virtual events and conferences.",
    category: "Entertainment",
    stage: "Beta",
    progress: 80,
    fundingGoal: 150000,
    teamSize: 12,
    deadline: "2024-07-15",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    name: "E-Learning Marketplace",
    description: "Connecting expert instructors with students through interactive online courses.",
    category: "Education",
    stage: "Launch",
    progress: 90,
    fundingGoal: 75000,
    teamSize: 6,
    deadline: "2024-05-30",
    image: "https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&auto=format&fit=crop&q=60",
  },
]

export function ProjectShowcase() {
  return (
    <div className="grid gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 md:h-auto md:w-1/3">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge>{project.category}</Badge>
                    <Badge variant="outline">{project.stage}</Badge>
                  </div>
                </div>
                <Button asChild>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>

              <p className="text-muted-foreground mb-4">
                {project.description}
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      ${project.fundingGoal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{project.teamSize} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Due {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}