"use client"

import { useEffect, useState } from "react"
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TeamTable } from "./team-table"
import { InviteMemberDialog } from "./invite-member-dialog"
import { useTeamStore } from "@/lib/stores/team-store"
import { useParams } from "next/navigation"

export interface TeamMember {
  id: string
  name: string
  email: string
  lastActive: string
  assignedTasks: number
  role: string
  permission: "Project Admin" | "Editor" | "Viewer"
}

export function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const params = useParams()
  const projectId = params.id as string
  
  const { members, loading, error, fetchMembers, subscribeToTeamChanges } = useTeamStore()
  
  useEffect(() => {
    // Fetch initial data
    fetchMembers(projectId)
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToTeamChanges(projectId)
    
    return () => {
      unsubscribe()
    }
  }, [projectId, fetchMembers, subscribeToTeamChanges])

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div>Loading team members...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            className="h-8 w-[150px] lg:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setInviteDialogOpen(true)}>
          Invite member
        </Button>
      </div>
      <TeamTable members={filteredMembers} />
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        projectId={projectId}
      />
    </div>
  )
}
