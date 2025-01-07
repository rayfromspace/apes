"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus, ChevronLeft, ChevronRight, Code, Clock } from 'lucide-react';
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useEventStore } from "@/lib/stores/events"; 
import { Event } from "@/types/events";
import { format, isSameDay, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserAvatar } from "@/components/shared/user-avatar";

const getDaysForCurrentWeek = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

  return [
    { name: "Sunday", short: "Sun", initial: "S", date: format(startOfWeek, 'd') },
    { name: "Monday", short: "Mon", initial: "M", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
    { name: "Tuesday", short: "Tue", initial: "T", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
    { name: "Wednesday", short: "Wed", initial: "W", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
    { name: "Thursday", short: "Thu", initial: "T", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
    { name: "Friday", short: "Fri", initial: "F", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
    { name: "Saturday", short: "Sat", initial: "S", date: format(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)), 'd') },
  ];
};

export interface CreateEventDialogProps {
  onClose: () => void;
}

export function CreateEventDialog({ onClose }: CreateEventDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: format(new Date(), 'HH:mm'),
    duration: "60", // default 60 minutes
    type: "meeting" as Event["type"],
    isVirtual: true,
    meetingLink: "",
    projectId: "project-1", // TODO: Allow selecting project
    projectName: "DeFi Platform",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const event = await createEvent({
        ...formData,
        createdBy: {
          id: user.id,
          name: user.email || "Unknown",
        },
        attendees: [
          {
            id: user.id,
            name: user.email || "Unknown",
          }
        ],
      });

      if (event) {
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        onClose();
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) =>
                setFormData({ ...formData, duration: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="180">3 hours</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as Event["type"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add event description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meetingLink">Meeting Link</Label>
            <Input
              id="meetingLink"
              placeholder="Add meeting link (optional)"
              value={formData.meetingLink}
              onChange={(e) =>
                setFormData({ ...formData, meetingLink: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function Schedule() {
  const { user } = useAuth();
  const { events, isLoading, error, fetchEvents } = useEventStore();
  const [view, setView] = useState<'week' | 'day'>('week');
  const [startDayIndex, setStartDayIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const weekContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [days] = useState(getDaysForCurrentWeek());
  const today = new Date();

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  const handleCreateEvent = () => {
    setShowCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
  };

  const handlePreviousWeek = () => {
    setStartDayIndex(prev => Math.max(0, prev - 7));
  };

  const handleNextWeek = () => {
    setStartDayIndex(prev => prev + 7);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getEventsForDay = (day: string) => {
    return events.filter(event => 
      isSameDay(parseISO(event.date), new Date(2024, 0, parseInt(day)))
    ).sort((a, b) => 
      parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime()
    );
  };

  return (
    <Card className="p-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">{format(new Date(), 'MMMM, yyyy')}</h1>
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              asChild
            >
              <Link href="/calendar">Calendar</Link>
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <CreateEventDialog onClose={() => setShowCreateDialog(false)} />
            </Dialog>
          </div>
        </div>
      </div>
      
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
              onClick={handlePreviousWeek}
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
                        event.type === 'call' ? "bg-orange-100 dark:bg-orange-900/50" :
                        event.type === 'deadline' ? "bg-red-100 dark:bg-red-900/50" :
                        "bg-purple-100 dark:bg-purple-900/50"
                      )}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.startTime}
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
              onClick={handleNextWeek}
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
                const hour = i;
                const formattedHour = hour.toString().padStart(2, '0');
                const isPastNoon = hour >= 12;
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                const amPm = isPastNoon ? 'PM' : 'AM';
                
                return (
                  <Card 
                    key={hour} 
                    className={cn(
                      "p-4 hover:shadow-md cursor-pointer transition-all hover:bg-accent",
                      hour >= 9 && hour <= 17 ? "bg-accent/5" : "" // Highlight working hours
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
                      {getEventsForDay("Monday").filter(event => event.startTime === `${formattedHour}:00`).map(event => (
                        <div 
                          key={event.id}
                          className={cn(
                            "rounded-md p-2 text-xs",
                            event.type === 'meeting' ? "bg-blue-100 dark:bg-blue-900/50" :
                            event.type === 'review' ? "bg-green-100 dark:bg-green-900/50" :
                            event.type === 'call' ? "bg-orange-100 dark:bg-orange-900/50" :
                            event.type === 'deadline' ? "bg-red-100 dark:bg-red-900/50" :
                            "bg-purple-100 dark:bg-purple-900/50"
                          )}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.startTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
