import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Video } from "lucide-react"

const timelineItems = [
  {
    time: "9:00 AM",
    title: "Project Review",
    description: "Review progress with collaborators",
    type: "meeting",
    participants: ["Sarah C.", "Mike J."],
    icon: Users,
  },
  {
    time: "11:00 AM",
    title: "Client Meeting",
    description: "Project progress review with stakeholders",
    type: "virtual",
    participants: ["Lisa B.", "David W."],
    icon: Video,
  },
  {
    time: "2:00 PM",
    title: "Design Review",
    description: "Review new UI components",
    type: "meeting",
    participants: ["Emma S.", "Alex T."],
    icon: Users,
  },
  {
    time: "4:00 PM",
    title: "Sprint Planning",
    description: "Plan next sprint tasks and objectives",
    type: "virtual",
    participants: ["Project Team"],
    icon: Clock,
  },
]

const typeColors = {
  meeting: "bg-blue-500/10 text-blue-500",
  virtual: "bg-purple-500/10 text-purple-500",
  deadline: "bg-red-500/10 text-red-500",
}

export function Timeline() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Your upcoming meetings and events</CardDescription>
        </div>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {timelineItems.map((item, index) => (
            <div key={index} className="flex space-x-4">
              <div className="flex-none">
                <Badge
                  variant="secondary"
                  className={typeColors[item.type as keyof typeof typeColors]}
                >
                  {item.time}
                </Badge>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{item.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {item.participants.map((participant) => (
                    <Badge
                      key={participant}
                      variant="secondary"
                      className="text-xs"
                    >
                      {participant}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}