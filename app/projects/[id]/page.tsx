'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectHeader } from "./components/project-header"
import { ProjectStats } from "./components/project-stats"
import { RecentRequests } from "./components/recent-requests"
import { TaskCalendar } from "./components/task-calendar"
import { ProjectMilestones } from "./components/project-milestones"
import { TaskBoard } from "./components/task-board"
import { TeamPage } from "./components/team"
import { BudgetPage } from "./components/budget"
import { QuickActions } from "./components/quick-actions"
import { ProjectCalendar } from "./components/project-calendar"
import { ProjectMessages } from "./components/project-messages"
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Calendar, 
  MessageSquare, 
  Users2, 
  Wallet 
} from 'lucide-react'

interface Project {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  status: string;
  visibility: string;
  founder_id: string;
  team_size: number;
  funding_goal: number;
  current_funding: number;
  image_url?: string;
  created_at: string;
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadProject() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }

        const { data: project, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) {
          console.error('Error loading project:', error)
          throw error
        }

        if (!project) {
          router.push('/dashboard')
          return
        }

        setProject(project)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [params.id, router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ProjectHeader title={project.title} status={project.status} />
      <Tabs defaultValue="overview" className="flex-1">
        <TabsList className="w-full justify-center sm:justify-start border-b rounded-none h-auto px-6 sm:px-4 py-0 bg-transparent flex gap-2 sm:gap-0">
          <TabsTrigger 
            value="overview" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <LayoutDashboard className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="task-board"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <KanbanSquare className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Task Board</span>
          </TabsTrigger>
          <TabsTrigger 
            value="calendar"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <Calendar className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger 
            value="message"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <MessageSquare className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Message</span>
          </TabsTrigger>
          <TabsTrigger 
            value="team"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <Users2 className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger 
            value="budget"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex items-center gap-2 px-4 sm:px-6"
          >
            <Wallet className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Budget</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex-1 space-y-4 p-4 m-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <TaskCalendar />
              <ProjectStats />
              <RecentRequests />
            </div>
            <div className="md:w-[300px] relative">
              <div className="sticky top-4">
                <ProjectMilestones />
              </div>
            </div>
          </div>
          <QuickActions />
        </TabsContent>
        <TabsContent value="task-board" className="flex-1 m-0 p-0">
          <TaskBoard />
        </TabsContent>
        <TabsContent value="calendar" className="flex-1 m-0 p-4">
          <ProjectCalendar />
        </TabsContent>
        <TabsContent value="message" className="flex-1 m-0 p-4">
          <ProjectMessages projectId={params.id} />
        </TabsContent>
        <TabsContent value="team" className="flex-1 m-0 p-0">
          <TeamPage />
        </TabsContent>
        <TabsContent value="budget" className="flex-1 m-0 p-0">
          <BudgetPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
