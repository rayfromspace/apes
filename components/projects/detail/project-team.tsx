"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ProjectTeamProps {
  id: string
}

const team = [
  {
    name: "Sarah Chen",
    role: "Project Lead",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    status: "online",
  },
  {
    name: "Alex Rivera",
    role: "Lead Developer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    status: "offline",
  },
  {
    name: "Emma Wilson",
    role: "Marketing Lead",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    status: "online",
  },
]

export function ProjectTeam({ id }: ProjectTeamProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {team.map((member) => (
            <div key={member.name} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{member.name}</p>
                  <Badge variant={member.status === "online" ? "default" : "secondary"} className="h-1.5 w-1.5 rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}