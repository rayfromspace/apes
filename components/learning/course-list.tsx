"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const courses = [
  {
    id: 1,
    title: "Project Management Fundamentals",
    progress: 75,
    lastAccessed: "2 hours ago",
    nextLesson: "Risk Management",
  },
  {
    id: 2,
    title: "Digital Marketing Essentials",
    progress: 45,
    lastAccessed: "1 day ago",
    nextLesson: "Social Media Strategy",
  },
  {
    id: 3,
    title: "Business Development",
    progress: 90,
    lastAccessed: "3 hours ago",
    nextLesson: "Client Relationships",
  },
  {
    id: 4,
    title: "Financial Planning",
    progress: 30,
    lastAccessed: "5 hours ago",
    nextLesson: "Investment Basics",
  },
]

export function CourseList() {
  return (
    <div className="space-y-6">
      {courses.map((course) => (
        <div key={course.id} className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{course.title}</h3>
            <Button variant="outline" size="sm">Resume</Button>
          </div>
          <Progress value={course.progress} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Last accessed: {course.lastAccessed}</span>
            <span>Next: {course.nextLesson}</span>
          </div>
        </div>
      ))}
    </div>
  )
}