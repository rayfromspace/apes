"use client"

import { ProjectHeader } from "./project-header"
import { ProjectDetails } from "./project-details"
import { ProjectTeam } from "./project-team"
import { ProjectTimeline } from "./project-timeline"
import { ProjectDocuments } from "./project-documents"
import { ProjectTasks } from "./project-tasks"
import { ProjectMessages } from "./project-messages"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProjectMemberDashboardProps {
  id: string
}

export function ProjectMemberDashboard({ id }: ProjectMemberDashboardProps) {
  return (
    <div className="container py-6 space-y-8">
      <ProjectHeader id={id} />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <ProjectDetails id={id} />
            <ProjectTasks id={id} />
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <ProjectTasks id={id} fullView />
        </TabsContent>

        <TabsContent value="team">
          <ProjectTeam id={id} />
        </TabsContent>

        <TabsContent value="timeline">
          <ProjectTimeline id={id} />
        </TabsContent>

        <TabsContent value="documents">
          <ProjectDocuments id={id} />
        </TabsContent>

        <TabsContent value="messages">
          <ProjectMessages id={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}