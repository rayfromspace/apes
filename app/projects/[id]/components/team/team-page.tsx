"use client"

import { useState } from "react"
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TeamTable } from "./team-table"
import { InviteMemberDialog } from "./invite-member-dialog"

export interface TeamMember {
  id: string
  name: string
  email: string
  lastActive: string
  assignedTasks: number
  role: string
  permission: "Project Admin" | "Editor" | "Viewer"
}

const initialMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoe@gmail.com",
    lastActive: "6 hours ago",
    assignedTasks: 4,
    role: "CEO",
    permission: "Project Admin",
  },
  {
    id: "2",
    name: "Mary Lee",
    email: "marylee@gmail.com",
    lastActive: "1 hour ago",
    assignedTasks: 5,
    role: "CTO",
    permission: "Project Admin",
  },
  {
    id: "3",
    name: "Alice Harper",
    email: "aliceharper@gmail.com",
    lastActive: "2 hours ago",
    assignedTasks: 1,
    role: "Senior Dev",
    permission: "Editor",
  },
  {
    id: "4",
    name: "Emma Smith",
    email: "emmasmith@gmail.com",
    lastActive: "1 day ago",
    assignedTasks: 3,
    role: "Senior designer",
    permission: "Viewer",
  },
  {
    id: "5",
    name: "Tom Green",
    email: "tomgreen@gmail.com",
    lastActive: "1 week ago",
    assignedTasks: 2,
    role: "Junior designer",
    permission: "Viewer",
  },
]

export function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredMembers = members.filter(
    member =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Members</h1>
        <Button onClick={() => setIsInviteOpen(true)}>Add member</Button>
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members"
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <TeamTable members={filteredMembers} />
      <InviteMemberDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} />
    </div>
  )
}
