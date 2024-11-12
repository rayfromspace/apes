import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Video } from "lucide-react"

interface ProjectTimelineProps {
  id: string
}

const timelineItems = [
  {
    date: "2024-03-15",
    events: [
      {
        time: "9:00 AM",
        title: "Project Kickoff",
        description: "Initial team meeting and project overview",
        type: "meeting",
        icon: Users,
      },
      {
        time: "2:00 PM",
        title: "Client Presentation",
        description: "Present project roadmap to stakeholders",
        type: "virtual",
        icon: Video,
      },
    ],
  },
  {
    date: "2024-03-16",
    events: [
      {
        time: "10:00 AM",
        title: "Design Review",
        description: "Review and approve initial designs",
        type: "meeting",
        icon: Users,
      },
      {
        time: "3:00 PM",
        title: "Sprint Planning",
        description: "Plan tasks for the first sprint",
        type: "virtual",
        icon: Clock,
      },
    ],
  },
]

const typeColors = {
  meeting: "bg-blue-500/10 text-blue-500",
  virtual: "bg-purple-500/10 text-purple-500",
  deadline: "bg-red-500/10 text-red-500",
}

export function ProjectTimeline({ id }: ProjectTimelineProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Project Timeline</h3>
      
      {timelineItems.map((day, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-medium">
              {new Date(day.date).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {day.events.map((event, eventIndex) => (
              <div key={eventIndex} className="flex space-x-4">
                <Badge
                  variant="secondary"
                  className={typeColors[event.type as keyof typeof typeColors]}
                >
                  {event.time}
                </Badge>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <event.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{event.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}