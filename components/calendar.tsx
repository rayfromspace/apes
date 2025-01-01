"use client";

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserAvatar } from "@/components/shared/user-avatar";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addMinutes } from 'date-fns';
import { getUserEvents } from '@/lib/api/events';
import { Event } from '@/types/events';
import { useAuth } from '@/lib/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateEventDialog } from "@/components/dashboard/schedule";

export default function Calendar() {
  const [view, setView] = useState<'Month' | 'Week' | 'Day'>('Week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const fetchEvents = useCallback(async () => {
    if (!user?.id || authLoading) return;
    
    try {
      setLoading(true);
      const fetchedEvents = await getUserEvents(user.id);
      console.log('Fetched events:', fetchedEvents);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, authLoading]);

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
    parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime()
  );

  // Get the next upcoming event
  const nextEvent = todayEvents.find(event => 
    parseISO(event.startTime).getTime() > new Date().getTime()
  );

  // Get events for selected date
  const selectedDateEvents = events.filter(event => 
    isSameDay(parseISO(event.date), selectedDate)
  );

  // Group events by project
  const eventsByProject = events.reduce((acc, event) => {
    const projectId = event.projectId;
    if (!acc[projectId]) {
      acc[projectId] = [];
    }
    acc[projectId].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Calculate end time based on start time and duration
  const getEventEndTime = (event: Event) => {
    const startTime = parseISO(`${event.date}T${event.startTime}`);
    return addMinutes(startTime, parseInt(event.duration));
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/10 p-6 flex flex-col gap-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

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
                  {format(parseISO(nextEvent.startTime), 'HH:mm')} - {format(getEventEndTime(nextEvent), 'HH:mm')}
                </p>
                <h3 className="font-semibold mt-1">{nextEvent.title}</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                {differenceInMinutes(parseISO(nextEvent.startTime), new Date())} min
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

        {/* Projects Calendar Section */}
        <div>
          <h3 className="font-semibold mb-3">My Calendars</h3>
          <div className="space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </>
            ) : Object.entries(eventsByProject).map(([projectId, projectEvents]) => (
              <div key={projectId} className="flex items-center gap-2">
                <input type="checkbox" className="rounded-sm" defaultChecked />
                <span>{projectEvents[0]?.projectName || 'Unknown Project'}</span>
                <Badge variant="secondary" className="ml-auto">
                  {projectEvents.length}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{format(selectedDate, 'MMMM d, yyyy')}</h1>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(prev => subMonths(prev, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(prev => addMonths(prev, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <CreateEventDialog onClose={() => {
                setIsDialogOpen(false);
                fetchEvents();
              }} />
            </Dialog>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 mb-6">
          {(['Month', 'Week', 'Day'] as const).map((viewOption) => (
            <Button
              key={viewOption}
              variant={view === viewOption ? "default" : "ghost"}
              size="sm"
              onClick={() => setView(viewOption)}
            >
              {viewOption}
            </Button>
          ))}
        </div>

        {/* Calendar Grid */}
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {view === 'Month' ? (
            <div className="grid grid-cols-7 gap-4">
              {/* Month view headers */}
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <div key={day} className="text-center p-2 font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              
              {/* Month view days */}
              {Array.from({ length: 35 }).map((_, index) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index - new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() + 1);
                const dayEvents = events.filter(event => isSameDay(parseISO(event.date), date));
                const isCurrentMonth = isSameMonth(date, currentDate);
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[100px] p-2 border rounded-lg",
                      !isCurrentMonth && "bg-muted/50",
                      isSameDay(date, new Date()) && "border-primary"
                    )}
                  >
                    <div className="font-medium text-sm mb-1">
                      {format(date, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded-md bg-primary/10 truncate cursor-pointer hover:bg-primary/20"
                          title={event.title}
                        >
                          {format(parseISO(event.startTime), 'HH:mm')} - {format(getEventEndTime(event), 'HH:mm')} - {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : view === 'Week' ? (
            <div className="space-y-4">
              {/* Time column headers */}
              <div className="grid grid-cols-8 gap-4">
                <div className="w-20" /> {/* Empty space for time column */}
                {Array.from({ length: 7 }).map((_, index) => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() - date.getDay() + index);
                  return (
                    <div key={index} className="text-center">
                      <div className="font-medium">{format(date, 'EEE')}</div>
                      <div className={cn(
                        "text-sm",
                        isSameDay(date, new Date()) && "text-primary font-bold"
                      )}>
                        {format(date, 'd')}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time slots */}
              <div className="grid grid-cols-8 gap-4">
                <div className="space-y-8">
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <div key={hour} className="text-sm text-muted-foreground h-20 relative">
                      {format(new Date().setHours(hour), 'HH:mm')}
                    </div>
                  ))}
                </div>

                {/* Week days */}
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() - date.getDay() + dayIndex);
                  const dayEvents = events.filter(event => isSameDay(parseISO(event.date), date));

                  return (
                    <div key={dayIndex} className="relative min-h-[1200px]">
                      {/* Time grid lines */}
                      {Array.from({ length: 24 }).map((_, hour) => (
                        <div
                          key={hour}
                          className="absolute w-full h-20 border-t border-dashed border-muted"
                          style={{ top: `${hour * 80}px` }}
                        />
                      ))}

                      {/* Events */}
                      {dayEvents.map((event) => {
                        const startHour = parseISO(event.startTime).getHours();
                        const startMinute = parseISO(event.startTime).getMinutes();
                        const endHour = getEventEndTime(event).getHours();
                        const endMinute = getEventEndTime(event).getMinutes();
                        const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
                        const top = startHour * 80 + (startMinute / 60) * 80;
                        const height = (duration / 60) * 80;

                        return (
                          <div
                            key={event.id}
                            className="absolute left-1 right-1 rounded-md bg-primary/10 p-1 truncate text-xs"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                            }}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Day view
            <div className="space-y-4">
              {/* Current day header */}
              <div className="text-center mb-4">
                <h2 className="text-lg font-medium">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h2>
              </div>

              {/* Time slots with events */}
              <div className="grid grid-cols-[100px_1fr] gap-4">
                {/* Time labels */}
                <div className="space-y-8">
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <div key={hour} className="text-sm text-muted-foreground h-20">
                      {format(new Date().setHours(hour), 'HH:mm')}
                    </div>
                  ))}
                </div>

                {/* Events container */}
                <div className="relative min-h-[1200px]">
                  {/* Time grid lines */}
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <div
                      key={hour}
                      className="absolute w-full h-20 border-t border-dashed border-muted"
                      style={{ top: `${hour * 80}px` }}
                    />
                  ))}

                  {/* Current time indicator */}
                  <div
                    className="absolute w-full h-px bg-primary"
                    style={{
                      top: `${(new Date().getHours() * 60 + new Date().getMinutes()) * (80 / 60)}px`,
                    }}
                  >
                    <div className="absolute -left-2 -top-1 w-2 h-2 rounded-full bg-primary" />
                  </div>

                  {/* Events */}
                  {selectedDateEvents.map((event) => {
                    const startHour = parseISO(event.startTime).getHours();
                    const startMinute = parseISO(event.startTime).getMinutes();
                    const endHour = getEventEndTime(event).getHours();
                    const endMinute = getEventEndTime(event).getMinutes();
                    const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
                    const top = startHour * 80 + (startMinute / 60) * 80;
                    const height = (duration / 60) * 80;

                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded-md bg-primary/10 p-2"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          minHeight: '20px',
                        }}
                      >
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(parseISO(event.startTime), 'HH:mm')} - {format(getEventEndTime(event), 'HH:mm')}
                        </div>
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex -space-x-2 mt-1">
                            {event.attendees.map((attendee) => (
                              <UserAvatar
                                key={attendee.id}
                                user={{
                                  id: attendee.id,
                                  name: attendee.name,
                                  avatar: attendee.avatar,
                                }}
                                showHoverCard={true}
                                size="sm"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

      </div>
    </div>
  );
}
