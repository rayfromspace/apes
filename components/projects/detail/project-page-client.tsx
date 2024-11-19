"use client"

import { ProjectHeader } from "./project-header"
import { ProjectDetails } from "./project-details"
import { ProjectTeam } from "./project-team"
import { ProjectTimeline } from "./project-timeline"
import { ProjectDocuments } from "./project-documents"
import { ProjectInvestment } from "./project-investment"

interface ProjectPageClientProps {
  id: string
}

export function ProjectPageClient({ id }: ProjectPageClientProps) {
  return (
    <div className="container py-6 space-y-8">
      <ProjectHeader id={id} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <ProjectDetails id={id} />
        <ProjectInvestment id={id} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ProjectTeam id={id} />
        <ProjectDocuments id={id} />
      </div>
      
      <ProjectTimeline id={id} />
    </div>
  )
}