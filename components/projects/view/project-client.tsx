"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectHeader } from "./project-header"
import { ProjectDetails } from "./project-details"
import { ProjectTeam } from "./project-team"
import { ProjectTimeline } from "./project-timeline"
import { ProjectDocuments } from "./project-documents"
import { ProjectInvestment } from "./project-investment"

export function ProjectClient({ id }: { id: string }) {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <ProjectHeader id={id} />
      
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <ProjectDetails id={id} />
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
        
        <TabsContent value="investment">
          <ProjectInvestment id={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}