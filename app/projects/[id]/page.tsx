import { ProjectPublicDashboard } from "@/components/projects/public/project-public-dashboard"

// Generate static params for all project IDs
export function generateStaticParams() {
  // In a real app, this would fetch from your data source
  // For now, we'll pre-render paths for projects 1-10
  return Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
  }))
}

// This is the public project dashboard for potential investors/team members
// Accessed through explore page or direct project links
export default function ProjectPublicPage({ params }: { params: { id: string } }) {
  return <ProjectPublicDashboard id={params.id} />
}