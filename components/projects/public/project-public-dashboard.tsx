"use client"

import { ProjectHeader } from "./project-header"
import { ProjectOverview } from "./project-overview"
import { ProjectTeam } from "./project-team"
import { ProjectInvestment } from "./project-investment"
import { ProjectJoinTeam } from "./project-join-team"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProjectPublicDashboardProps {
  id: string
}

export function ProjectPublicDashboard({ id }: ProjectPublicDashboardProps) {
  return (
    <div className="container py-6 space-y-8">
      <ProjectHeader id={id} />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="invest">Invest</TabsTrigger>
          <TabsTrigger value="join">Join Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ProjectOverview id={id} />
        </TabsContent>

        <TabsContent value="team">
          <ProjectTeam id={id} />
        </TabsContent>

        <TabsContent value="invest">
          <ProjectInvestment id={id} />
        </TabsContent>

        <TabsContent value="join">
          <ProjectJoinTeam id={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}