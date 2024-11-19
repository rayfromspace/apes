"use client"

import { ProjectViewHeader } from "@/components/projects/view/project-view-header"
import { ProjectDetails } from "@/components/projects/view/project-details"
import { ProjectTeam } from "@/components/projects/view/project-team"
import { ProjectTimeline } from "@/components/projects/view/project-timeline"
import { ProjectDocuments } from "@/components/projects/view/project-documents"
import { ProjectInvestment } from "@/components/projects/view/project-investment"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectViewPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-6 space-y-6">
      <ProjectViewHeader id={params.id} />
      
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <ProjectDetails id={params.id} />
        </TabsContent>

        <TabsContent value="team">
          <ProjectTeam id={params.id} />
        </TabsContent>

        <TabsContent value="timeline">
          <ProjectTimeline id={params.id} />
        </TabsContent>

        <TabsContent value="documents">
          <ProjectDocuments id={params.id} />
        </TabsContent>

        <TabsContent value="investment">
          <ProjectInvestment id={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )