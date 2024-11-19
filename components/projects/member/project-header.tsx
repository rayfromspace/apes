"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Star, MessageSquare } from "lucide-react"
import { toast } from "sonner"

interface ProjectHeaderProps {
  id: string
}

export function ProjectHeader({ id }: ProjectHeaderProps) {
  const handleShare = () => {
    toast.success("Project link copied to clipboard")
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">E-commerce Platform</h1>
          <Badge variant="secondary">In Progress</Badge>
        </div>
        <p className="text-muted-foreground">
          Building a modern e-commerce solution with advanced features
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <Star className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}