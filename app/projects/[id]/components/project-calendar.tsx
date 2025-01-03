"use client";

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserAvatar } from "@/components/shared/user-avatar";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addMinutes, differenceInMinutes } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateEventDialog } from "@/components/dashboard/schedule";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  duration: string;
  projectId: string;
  type: 'meeting' | 'deadline' | 'milestone' | 'other';
}

export function ProjectCalendar() {
  const [view, setView] = useState<'Month' | 'Week' | 'Day'>('Week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Implement event fetching from your backend
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Team Meeting',
          description: 'Weekly sync',
          date: '2025-01-03',
          startTime: '10:00:00',  // Added seconds to match ISO format
          duration: '60',
          projectId: '1',
          type: 'meeting'
        },
        // Add more mock events as needed
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Get today's events
  const todayEvents = events.filter(event => 
    isSameDay(parseISO(event.date), new Date())
  ).sort((a, b) => 
    new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime()
  );

  // Get the next upcoming event
  const nextEvent = todayEvents.find(event => 
    new Date(`${event.date}T${event.startTime}`).getTime() > new Date().getTime()
  );

  // Get events for selected date
  const selectedDateEvents = events.filter(event => 
    isSameDay(parseISO(event.date), selectedDate)
  );

  // Calculate end time based on start time and duration
  const getEventEndTime = (event: Event) => {
    const startTime = new Date(`${event.date}T${event.startTime}`);
    return addMinutes(startTime, parseInt(event.duration));
  };

  // Format time string to display
  const formatEventTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/10 p-6 flex flex-col gap-6">
        {/* Mini Calendar */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
              <div key={day} className="text-muted-foreground">{day}</div>
            ))}
            {monthDays.map((date, i) => {
              const dayEvents = events.filter(event => 
                isSameDay(parseISO(event.date), date)
              );
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-sm cursor-pointer relative",
                    !isSameMonth(date, currentDate) && "text-muted-foreground opacity-50",
                    isSameDay(date, selectedDate) && "bg-primary text-primary-foreground",
                    !isSameDay(date, selectedDate) && "hover:bg-accent"
                  )}
                  onClick={() => handleDateSelect(date)}
                >
                  {format(date, 'd')}
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Current/Next Event Card */}
        {loading ? (
          <Card className="p-4 bg-muted/50">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </Card>
        ) : nextEvent ? (
          <Card className="p-4 bg-muted/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {formatEventTime(nextEvent.startTime)} - {format(getEventEndTime(nextEvent), 'HH:mm')}
                </p>
                <h3 className="font-semibold mt-1">{nextEvent.title}</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                {differenceInMinutes(new Date(`${nextEvent.date}T${nextEvent.startTime}`), new Date())} min
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Later</Button>
              <Button variant="secondary" size="sm">Details</Button>
            </div>
          </Card>
        ) : (
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">No upcoming events today</p>
          </Card>
        )}
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Calendar</h1>
            <div className="flex bg-muted rounded-lg p-1">
              {(['Month', 'Week', 'Day'] as const).map((v) => (
                <Button
                  key={v}
                  variant={view === v ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setView(v)}
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <CreateEventDialog 
              onClose={() => setIsDialogOpen(false)}
              onEventCreated={fetchEvents}
            />
          </Dialog>
        </div>

        {/* Selected Date Events */}
        <ScrollArea className="h-[calc(100vh-15rem)]">
          <div className="space-y-4">
            {selectedDateEvents.map((event) => (
              <Card key={event.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatEventTime(event.startTime)} - {format(getEventEndTime(event), 'HH:mm')}
                    </p>
                  </div>
                  <Badge variant="secondary">{event.type}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
