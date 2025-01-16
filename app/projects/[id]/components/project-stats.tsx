'use client'

import { useState, useEffect } from "react"
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
import { useTaskStore, Task } from "@/lib/stores/tasks"
import { useTeamStore, TeamMember } from "@/lib/stores/team-store"
import { useParams, useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/types/database'

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
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

function TasksHoverContent({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-3 p-4">
      <h4 className="font-semibold text-sm">Current Tasks</h4>
      {tasks.slice(0, 3).map((task) => (
        <div key={task.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium text-sm">{task.title}</p>
            <div className="flex items-center gap-2">
              {task.assignee && (
                <UserAvatar 
                  user={task.assignee}
                  showHoverCard={true}
                  size="sm"
                />
              )}
              <span className="text-xs text-muted-foreground">
                Due {new Date(task.due_date).toLocaleDateString()}
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

function TeamMembersHoverContent({ members }: { members: TeamMember[] }) {
  return (
    <div className="space-y-3 p-4">
      <h4 className="font-semibold text-sm">Team Members</h4>
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-3">
          <UserAvatar 
            user={{
              id: member.userId,
              name: member.name,
              email: member.email,
              image: null
            }}
            showHoverCard={true}
            size="md"
          />
          <div>
            <p className="text-sm font-medium">{member.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
          </div>
          <Badge 
            variant={member.permission === 'Project Admin' ? 'default' : 
                    member.permission === 'Editor' ? 'secondary' : 'outline'}
            className="ml-auto"
          >
            {member.permission}
          </Badge>
        </div>
      ))}
    </div>
  )
}

export function ProjectStats() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { tasks, fetchTasks } = useTaskStore()
  const { members, fetchMembers } = useTeamStore()
  const [project, setProject] = useState<Database['public']['Tables']['projects']['Row'] | null>(null)

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId)
      fetchMembers(projectId)
      loadProject()
    }
  }, [projectId])

  async function loadProject() {
    const supabase = createClientComponentClient<Database>()
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()
    
    if (project) {
      setProject(project)
    }
  }

  const activeTasks = tasks.filter(t => !t.completed).length
  const completedTasks = tasks.filter(t => t.completed).length
  const activeMembers = members.filter(m => m.status === 'active').length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        icon={<Clock className="h-4 w-4 text-blue-500" />}
        label="Active Tasks"
        value={project?.active_tasks || 0}
        className="bg-blue-50/50"
        hoverContent={
          <TasksHoverContent
            tasks={tasks.filter(t => !t.completed)}
          />
        }
        onClick={() => router.push(`/projects/${projectId}/tasks`)}
      />

      <MetricCard
        icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
        label="Completed Tasks"
        value={project?.completed_tasks || 0}
        className="bg-green-50/50"
        hoverContent={
          <TasksHoverContent
            tasks={tasks.filter(t => t.completed)}
          />
        }
        onClick={() => router.push(`/projects/${projectId}/tasks?filter=completed`)}
      />

      <MetricCard
        icon={<Users2 className="h-4 w-4 text-purple-500" />}
        label="Team Size"
        value={project?.team_size || 0}
        className="bg-purple-50/50"
        hoverContent={
          <TeamMembersHoverContent members={members} />
        }
        onClick={() => router.push(`/projects/${projectId}/team`)}
      />

      <MetricCard
        icon={<RotateCcw className="h-4 w-4 text-orange-500" />}
        label="Treasury Balance"
        value={`$${project?.treasury_balance?.toLocaleString() || 0}`}
        className="bg-orange-50/50"
        hoverContent={
          <div className="space-y-2">
            <p className="font-semibold">Project Budget</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total Budget:</span>
                <span>${project?.total_budget?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Treasury Balance:</span>
                <span>${project?.treasury_balance?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        }
        onClick={() => router.push(`/projects/${projectId}/budget`)}
      />
    </div>
  )
}
