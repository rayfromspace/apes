import { ProjectMemberDashboard } from "@/components/projects/member/project-member-dashboard"

// Generate static params for all project IDs
export function generateStaticParams() {
  // In a real app, this would fetch from your data source
  // For now, we'll pre-render paths for projects 1-10
  return Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
  }))
}

// This is the internal project dashboard for team members
// Accessed through user dashboard -> active projects
export default function ProjectMemberPage({ params }: { params: { id: string } }) {
  return <ProjectMemberDashboard id={params.id} />
}