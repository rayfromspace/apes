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
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="overview" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="task-board"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Task Board
          </TabsTrigger>
          <TabsTrigger 
            value="calendar"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Calendar
          </TabsTrigger>
          <TabsTrigger 
            value="message"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Message
          </TabsTrigger>
          <TabsTrigger 
            value="team"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Team
          </TabsTrigger>
          <TabsTrigger 
            value="budget"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Budget
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex-1 space-y-4 p-4 m-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <TaskCalendar />
              <ProjectStats />
              <RecentRequests />
            </div>
            <div className="md:w-[300px]">
              <ProjectMilestones />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="task-board" className="flex-1 m-0 p-4">
          <div className="text-sm text-muted-foreground">Task board coming soon...</div>
        </TabsContent>
        <TabsContent value="calendar" className="flex-1 m-0 p-4">
          <div className="text-sm text-muted-foreground">Calendar view coming soon...</div>
        </TabsContent>
        <TabsContent value="message" className="flex-1 m-0 p-4">
          <div className="text-sm text-muted-foreground">Messages coming soon...</div>
        </TabsContent>
        <TabsContent value="team" className="flex-1 m-0 p-4">
          <div className="text-sm text-muted-foreground">Team management coming soon...</div>
        </TabsContent>
        <TabsContent value="budget" className="flex-1 m-0 p-4">
          <div className="text-sm text-muted-foreground">Budget overview coming soon...</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
