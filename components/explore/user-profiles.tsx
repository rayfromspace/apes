"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const users = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    skills: ["UI/UX", "Design Systems", "Prototyping"],
    projects: 8,
    connections: 245,
  },
  {
    id: "2",
    name: "Alex Rivera",
    role: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    skills: ["React", "Node.js", "TypeScript"],
    projects: 12,
    connections: 189,
  },
  {
    id: "3",
    name: "Emma Wilson",
    role: "Marketing Strategist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    skills: ["Digital Marketing", "Content Strategy", "Analytics"],
    projects: 6,
    connections: 312,
  },
]

export function UserProfiles() {
  const handleConnect = (userId: string) => {
    toast.success("Connection request sent!")
  }

  return (
    <div className="grid gap-6">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="flex items-start gap-6 p-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
                <Button onClick={() => handleConnect(user.id)}>Connect</Button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{user.projects} Projects</span>
                  <span>{user.connections} Connections</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}