import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus } from "lucide-react"

interface ProjectTeamProps {
  id: string
}

const teamMembers = [
  {
    name: "John Doe",
    role: "Project Lead",
    avatar: "/avatars/01.png",
    status: "online",
    tasks: 12,
    completed: 8,
  },
  {
    name: "Sarah Smith",
    role: "Developer",
    avatar: "/avatars/02.png",
    status: "offline",
    tasks: 15,
    completed: 13,
  },
  {
    name: "Mike Johnson",
    role: "Designer",
    avatar: "/avatars/03.png",
    status: "online",
    tasks: 8,
    completed: 5,
  },
]

export function ProjectTeam({ id }: ProjectTeamProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Project Team</h3>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {teamMembers.map((member, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="font-medium">{member.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {member.role}
                    </span>
                    <Badge
                      variant={member.status === "online" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Tasks Assigned</span>
                  <span className="font-medium">{member.tasks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Tasks Completed</span>
                  <span className="font-medium">{member.completed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}