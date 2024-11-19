"use client"

import { useState } from "react"
import { ProjectCard } from "./project-card"
import { ProjectTable } from "./project-table"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"

const projects = [
  {
    id: "1",
    name: "E-commerce Platform",
    type: "product",
    category: "Web Application",
    description: "A modern e-commerce platform with advanced features",
    progress: 75,
    status: "In Progress",
    teamSize: 5,
    fundingGoal: 50000,
    equity: 15,
    dueDate: "2024-06-30",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    name: "AI Learning Assistant",
    type: "service",
    category: "AI/ML",
    description: "Personalized learning assistant powered by AI",
    progress: 30,
    status: "Planning",
    teamSize: 3,
    fundingGoal: 75000,
    equity: 20,
    dueDate: "2024-08-15",
    image: "https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    name: "Social Trading App",
    type: "product",
    category: "Mobile App",
    description: "Social network for traders and investors",
    progress: 90,
    status: "Review",
    teamSize: 4,
    fundingGoal: 100000,
    equity: 25,
    dueDate: "2024-05-20",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
  },
]

export function ProjectList() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <ProjectTable projects={projects} />
      )}
    </div>
  )
}