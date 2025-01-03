'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from 'lucide-react'

interface ProjectHeaderProps {
  title: string;
  status: string;
}

export function ProjectHeader({ title, status }: ProjectHeaderProps) {
  return (
    <header className="flex h-16 items-center border-b px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
          {title[0]?.toUpperCase() || 'P'}
        </div>
        <h1 className="text-lg font-semibold">{title}</h1>
        <Badge variant="outline" className="ml-2">
          {status}
        </Badge>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="flex -space-x-2">
          <Avatar className="border-2 border-background">
            <AvatarFallback>DA</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        <Button>Share</Button>
      </div>
    </header>
  )
}
