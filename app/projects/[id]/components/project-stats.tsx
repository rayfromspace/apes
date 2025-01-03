'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle2, RotateCcw, Users2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/shared/user-avatar"

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  className?: string
  hoverContent: React.ReactNode
  onClick?: () => void
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  className, 
  hoverContent,
  onClick 
}: MetricCardProps) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Card 
          className={cn(
            "cursor-pointer transition-all duration-200", 
            "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
            className
          )}
          onClick={onClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              {icon}
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent 
        align="start" 
        className="w-80 p-0"
        side="bottom"
      >
        {hoverContent}
      </HoverCardContent>
    </HoverCard>
  )
}

// Demo data for hover states
const TASKS = [
  {
    id: "1",
    title: "Update API Documentation",
    status: "In Progress",
    assignee: {
      id: "1",
      name: "Sarah Chen",
      avatar: "https://avatar.vercel.sh/sarah",
      role: "Developer"
    },
    dueDate: "Today",
    priority: "high"
  },
  {
    id: "2",
    title: "Fix Authentication Bug",
    status: "In Progress",
    assignee: {
      id: "2",
      name: "Alex Thompson",
      avatar: "https://avatar.vercel.sh/alex",
      role: "Engineer"
    },
    dueDate: "Tomorrow",
    priority: "medium"
  }
]

const TEAM_MEMBERS = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://avatar.vercel.sh/sarah",
    role: "Developer",
    status: "online"
  },
  {
    id: "2",
    name: "Alex Thompson",
    avatar: "https://avatar.vercel.sh/alex",
    role: "Engineer",
    status: "offline"
  }
]

function TasksHoverContent() {
  return (
    <div className="space-y-3 p-4">
      <h4 className="font-semibold text-sm">Current Tasks</h4>
      {TASKS.map((task) => (
        <div key={task.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium text-sm">{task.title}</p>
            <div className="flex items-center gap-2">
              <UserAvatar 
                user={task.assignee}
                showHoverCard={true}
                size="sm"
              />
              <span className="text-xs text-muted-foreground">
                Due {task.dueDate}
              </span>
            </div>
          </div>
          <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
            {task.priority}
          </Badge>
        </div>
      ))}
    </div>
  )
}

function TeamMembersHoverContent() {
  return (
    <div className="space-y-3 p-4">
      <h4 className="font-semibold text-sm">Team Members</h4>
      {TEAM_MEMBERS.map((member) => (
        <div key={member.id} className="flex items-center gap-3">
          <UserAvatar 
            user={member}
            showHoverCard={true}
            size="md"
          />
          <div>
            <p className="text-sm font-medium">{member.name}</p>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </div>
          <Badge 
            variant={member.status === 'online' ? 'success' : 'secondary'}
            className="ml-auto"
          >
            {member.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}

export function ProjectStats() {
  const [showTasksDialog, setShowTasksDialog] = useState(false)
  const [showTeamDialog, setShowTeamDialog] = useState(false)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        icon={<Clock className="h-4 w-4 text-blue-600" />}
        label="Total Tasks"
        value="24"
        className="bg-blue-50/50 dark:bg-blue-950/50"
        hoverContent={<TasksHoverContent />}
        onClick={() => setShowTasksDialog(true)}
      />
      <MetricCard
        icon={<RotateCcw className="h-4 w-4 text-yellow-600" />}
        label="In Progress"
        value="8"
        className="bg-yellow-50/50 dark:bg-yellow-950/50"
        hoverContent={<TasksHoverContent />}
        onClick={() => setShowTasksDialog(true)}
      />
      <MetricCard
        icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
        label="Completed"
        value="16"
        className="bg-green-50/50 dark:bg-green-950/50"
        hoverContent={<TasksHoverContent />}
        onClick={() => setShowTasksDialog(true)}
      />
      <MetricCard
        icon={<Users2 className="h-4 w-4 text-purple-600" />}
        label="Team Members"
        value="12"
        className="bg-purple-50/50 dark:bg-purple-950/50"
        hoverContent={<TeamMembersHoverContent />}
        onClick={() => setShowTeamDialog(true)}
      />
    </div>
  )
}
