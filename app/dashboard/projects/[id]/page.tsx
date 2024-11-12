import { ProjectPageClient } from "@/components/projects/detail/project-page-client"

// Generate static params for all project IDs
export function generateStaticParams() {
  // In a real app, this would fetch from your data source
  // For now, we'll pre-render paths for projects 1-10
  return Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
  }))
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <ProjectPageClient id={params.id} />
}