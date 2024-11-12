"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { toast } from "sonner"
import { Share2, MoreVertical, Star, Flag } from "lucide-react"

interface ProjectHeaderProps {
  id: string
}

export function ProjectHeader({ id }: ProjectHeaderProps) {
  const [isStarred, setIsStarred] = useState(false)

  const handleStar = () => {
    setIsStarred(!isStarred)
    toast.success(isStarred ? "Removed from favorites" : "Added to favorites")
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleReport = () => {
    toast.success("Report submitted")
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Marketing Platform</h1>
          <Badge>Software</Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          Revolutionizing digital marketing with artificial intelligence
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={isStarred ? "default" : "outline"}
          size="icon"
          onClick={handleStar}
        >
          <Star className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleReport}>
              <Flag className="mr-2 h-4 w-4" />
              Report Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}