"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { AddEventDialog } from "./add-event-dialog"

const events = [
  {
    date: new Date(2024, 2, 15),
    type: "deadline",
    title: "Project MVP Deadline",
    project: "E-commerce Platform"
  },
  {
    date: new Date(2024, 2, 20),
    type: "milestone",
    title: "Frontend Release",
    project: "Mobile App"
  },
  {
    date: new Date(2024, 2, 25),
    type: "meeting",
    title: "Team Sprint Planning",
    project: "Marketing Website"
  }
]

const eventStyles = {
  deadline: "bg-red-500/10 text-red-500",
  milestone: "bg-blue-500/10 text-blue-500",
  meeting: "bg-green-500/10 text-green-500"
}

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showAddEvent, setShowAddEvent] = useState(false)

  // Get events for selected date
  const selectedDateEvents = events.filter(
    event => date && event.date.toDateString() === date.toDateString()
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendar</CardTitle>
        <Button size="sm" onClick={() => setShowAddEvent(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />

        {date && selectedDateEvents.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Events for {date.toLocaleDateString()}</h4>
            {selectedDateEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={eventStyles[event.type as keyof typeof eventStyles]}
                    >
                      {event.type}
                    </Badge>
                    <span className="font-medium">{event.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {event.project}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddEventDialog 
          open={showAddEvent} 
          onOpenChange={setShowAddEvent}
          selectedDate={date}
        />
      </CardContent>
    </Card>
  )
}