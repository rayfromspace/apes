"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Share2,
  Star,
  MessageSquare,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface ProjectViewHeaderProps {
  id: string
}

export function ProjectViewHeader({ id }: ProjectViewHeaderProps) {
  const handleShare = (platform: string) => {
    toast.success(`Shared to ${platform}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">E-commerce Platform</h1>
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
              In Progress
            </Badge>
          </div>
          <p className="text-muted-foreground">
            A modern e-commerce platform with advanced features and AI-powered recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleShare("explore")}>
                Share to Explore Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                Share to LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("twitter")}>
                Share to Twitter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>Invest Now</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Team Size</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Timeline</p>
            <p className="text-2xl font-bold">6 months</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Funding Goal</p>
            <p className="text-2xl font-bold">$50,000</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Star className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rating</p>
            <p className="text-2xl font-bold">4.8/5</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Overall Progress</span>
          <span>75%</span>
        </div>
        <Progress value={75} className="h-2" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {[...Array(5)].map((_, i) => (
            <Avatar key={i} className="border-2 border-background">
              <AvatarImage src={`/avatars/0${i + 1}.png`} />
              <AvatarFallback>U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm">
            +8
          </div>
        </div>
        <Button variant="outline">View Team</Button>
      </div>
    </div>
  )