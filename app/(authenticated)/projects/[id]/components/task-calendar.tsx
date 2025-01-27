'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { format, parseISO } from "date-fns"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useCalendarStore } from "@/lib/stores/calendar-store"
import { CreateEventDialog } from "./calendar/create-event-dialog"

interface TaskCalendarProps {
  projectId: string
}

const getDaysForCurrentWeek = () => {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay()) // Start from Sunday

  return [
    { name: "Sunday", short: "Sun", initial: "S", date: format(startOfWeek, 'd') },
    { name: "Monday", short: "Mon", initial: "M", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
    { name: "Tuesday", short: "Tue", initial: "T", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
    { name: "Wednesday", short: "Wed", initial: "W", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
    { name: "Thursday", short: "Thu", initial: "T", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
    { name: "Friday", short: "Fri", initial: "F", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
    { name: "Saturday", short: "Sat", initial: "S", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
  ]
}

export function TaskCalendar({ projectId }: TaskCalendarProps) {
  const { events, loading, fetchEvents, subscribeToEvents } = useCalendarStore()
  const [view, setView] = useState<'week' | 'day'>('week')
  const [startDayIndex, setStartDayIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const weekContainerRef = useRef<HTMLDivElement>(null)
  const [days] = useState(getDaysForCurrentWeek())
  const today = new Date()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (projectId) {
      fetchEvents(projectId)
      const unsubscribe = subscribeToEvents(projectId)
      return () => {
        unsubscribe()
      }
    }
  }, [projectId, fetchEvents, subscribeToEvents])

  const getEventsForDay = (day: string) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      const dayName = format(eventDate, 'EEEE')
      return dayName === day
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendar</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex bg-muted rounded-lg">
            <Button 
              variant={view === 'week' ? 'secondary' : 'ghost'} 
              className="rounded-r-none hover:bg-secondary/80"
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button 
              variant={view === 'day' ? 'secondary' : 'ghost'} 
              className="rounded-l-none hover:bg-secondary/80"
              onClick={() => setView('day')}
            >
              Day
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <CreateEventDialog
              projectId={projectId}
              onClose={() => setShowCreateDialog(false)}
              open={showCreateDialog}
            />
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "transition-all duration-300",
          view === 'week' ? 'opacity-100' : 'opacity-0 absolute'
        )}>
          {view === 'week' && (
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 md:hidden"
                onClick={() => setStartDayIndex(prev => Math.max(0, prev - 1))}
                disabled={startDayIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div 
                ref={weekContainerRef}
                className="grid grid-cols-3 md:grid-cols-7 gap-2 overflow-x-auto md:overflow-x-visible"
              >
                {(isMobile ? days.slice(startDayIndex, startDayIndex + 3) : days).map((day) => (
                  <Card 
                    key={day.date}
                    className={cn(
                      "p-4 transition-all hover:shadow-md cursor-pointer min-w-[120px]",
                      format(today, 'EEEE') === day.name ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"
                    )}
                  >
                    <div className="hidden md:block text-sm font-medium mb-1">{day.name}</div>
                    <div className="hidden sm:block md:hidden text-sm font-medium mb-1">{day.short}</div>
                    <div className="sm:hidden text-sm font-medium mb-1">{day.initial}</div>
                    <div className="text-2xl font-bold">{day.date}</div>
                    {getEventsForDay(day.name).map(event => (
                      <div 
                        key={event.id}
                        className={cn(
                          "mt-2 p-2 rounded text-xs",
                          event.type === 'meeting' ? "bg-blue-100 dark:bg-blue-900/50" :
                          event.type === 'review' ? "bg-green-100 dark:bg-green-900/50" :
                          event.type === 'deadline' ? "bg-red-100 dark:bg-red-900/50" :
                          "bg-purple-100 dark:bg-purple-900/50"
                        )}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(parseISO(event.startTime), 'HH:mm')}
                        </div>
                      </div>
                    ))}
                  </Card>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 md:hidden"
                onClick={() => setStartDayIndex(prev => Math.min(days.length - 3, prev + 1))}
                disabled={startDayIndex === days.length - 3}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className={cn(
          "transition-all duration-300",
          view === 'day' ? 'opacity-100' : 'opacity-0 absolute'
        )}>
          {view === 'day' && (
            <div className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <div className="grid grid-cols-1 gap-2">
                {Array.from({ length: 24 }).map((_, i) => {
                  const hour = i
                  const formattedHour = hour.toString().padStart(2, '0')
                  const isPastNoon = hour >= 12
                  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                  const amPm = isPastNoon ? 'PM' : 'AM'
                  
                  const hourEvents = events.filter(event => {
                    const eventHour = parseInt(event.startTime.split(':')[0])
                    return format(parseISO(event.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') && eventHour === hour
                  })
                  
                  return (
                    <Card 
                      key={hour} 
                      className={cn(
                        "p-4 hover:shadow-md cursor-pointer transition-all hover:bg-accent",
                        hour >= 9 && hour <= 17 ? "bg-accent/5" : ""
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium w-16">
                            {`${displayHour}:00 ${amPm}`}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formattedHour}:00
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {hourEvents.map(event => (
                            <div 
                              key={event.id}
                              className={cn(
                                "rounded-md p-2 text-xs",
                                event.type === 'meeting' ? "bg-blue-100 dark:bg-blue-900/50" :
                                event.type === 'review' ? "bg-green-100 dark:bg-green-900/50" :
                                event.type === 'deadline' ? "bg-red-100 dark:bg-red-900/50" :
                                "bg-purple-100 dark:bg-purple-900/50"
                              )}
                            >
                              <div className="font-medium">{event.title}</div>
                              <div className="text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(parseISO(event.startTime), 'HH:mm')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
