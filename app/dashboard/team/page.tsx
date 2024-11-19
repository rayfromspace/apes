import { TeamMembers } from "@/components/team/team-members"
import { TeamStats } from "@/components/team/team-stats"
import { TeamActivity } from "@/components/team/team-activity"

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <TeamStats />
      <TeamMembers />
      <TeamActivity />
    </div>
  )
}