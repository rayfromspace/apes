"use client"

import { Button } from "@/components/ui/button"
import { Share2, Star } from "lucide-react"

interface ProjectHeaderProps {
  id: string
}

export function ProjectHeader({ id }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Digital Marketing Platform</h1>
        <p className="text-muted-foreground">AI-powered marketing automation solution</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Star className="mr-2 h-4 w-4" />
          Follow
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  )
}