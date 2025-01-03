import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { TeamMember } from "./team-page"

interface TeamTableProps {
  members: TeamMember[]
}

export function TeamTable({ members }: TeamTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Last Active</TableHead>
          <TableHead>Assigned tasks</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Team Permission</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {member.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{member.lastActive}</TableCell>
            <TableCell>{member.assignedTasks}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>{member.permission}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
