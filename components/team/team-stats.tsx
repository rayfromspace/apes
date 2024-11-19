import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, Target, Zap } from "lucide-react"

const stats = [
  {
    title: "Total Members",
    value: "12",
    icon: Users,
    description: "Active team members",
  },
  {
    title: "Hours Logged",
    value: "164",
    icon: Clock,
    description: "This week",
  },
  {
    title: "Tasks Completed",
    value: "24",
    icon: Target,
    description: "Last 7 days",
  },
  {
    title: "Team Efficiency",
    value: "92%",
    icon: Zap,
    description: "Above target",
  },
]

export function TeamStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}