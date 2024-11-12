"use client"

import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Star } from "lucide-react"

const achievements = [
  {
    id: 1,
    title: "Project Management Certified",
    description: "Completed advanced project management course",
    date: "Oct 2023",
    icon: Trophy,
  },
  {
    id: 2,
    title: "Digital Marketing Expert",
    description: "Mastered digital marketing fundamentals",
    date: "Sep 2023",
    icon: Award,
  },
  {
    id: 3,
    title: "Business Development Pro",
    description: "Completed business development track",
    date: "Aug 2023",
    icon: Star,
  },
]

export function Achievements() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {achievements.map((achievement) => {
        const Icon = achievement.icon
        return (
          <div
            key={achievement.id}
            className="flex flex-col items-center p-4 border rounded-lg space-y-2"
          >
            <Icon className="h-8 w-8 text-primary" />
            <h3 className="font-semibold text-center">{achievement.title}</h3>
            <p className="text-sm text-center text-muted-foreground">
              {achievement.description}
            </p>
            <Badge variant="secondary">{achievement.date}</Badge>
          </div>
        )
      })}
    </div>
  )
}