"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus, ChevronLeft, ChevronRight, Code, Clock } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const DAYS = [
  { name: "Sunday", short: "Sun", initial: "S", date: "16" },
  { name: "Monday", short: "Mon", initial: "M", date: "17" },
  { name: "Tuesday", short: "Tue", initial: "T", date: "18" },
  { name: "Wednesday", short: "Wed", initial: "W", date: "19" },
  { name: "Thursday", short: "Thu", initial: "T", date: "20" },
  { name: "Friday", short: "Fri", initial: "F", date: "21" },
  { name: "Saturday", short: "Sat", initial: "S", date: "22" },
];

const DEMO_EVENTS = [
  {
    id: "1",
    title: "Team Meeting",
    time: "10:00 AM",
    day: "Monday",
    type: "meeting",
  },
  {
    id: "2",
    title: "Project Review",
    time: "2:00 PM",
    day: "Wednesday",
    type: "review",
  },
  {
    id: "3",
    title: "Client Call",
    time: "11:30 AM",
    day: "Thursday",
    type: "call",
  },
];

function CreateEventDialog() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Event</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input id="title" placeholder="Enter event title" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" placeholder="Add event description" />
        </div>
      </div>
    </DialogContent>
  );
}

export function Schedule() {
  const [view, setView] = useState<'week' | 'day'>('week');
  const router = useRouter();

  return (
    <Card className="p-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">December, 2023</h1>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <CreateEventDialog />
            </Dialog>
          </div>
        </div>
      </div>
      
      <div className={cn(
        "transition-all duration-300",
        view === 'week' ? 'opacity-100' : 'opacity-0 absolute'
      )}>
        {view === 'week' && (
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map((day) => (
              <Card 
                key={day.date}
                className={cn(
                  "p-4 transition-all hover:shadow-md cursor-pointer",
                  day.name === "Monday" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"
                )}
              >
                <div className="hidden md:block text-sm font-medium mb-1">{day.name}</div>
                <div className="hidden sm:block md:hidden text-sm font-medium mb-1">{day.short}</div>
                <div className="sm:hidden text-sm font-medium mb-1">{day.initial}</div>
                <div className="text-2xl font-bold">{day.date}</div>
                {DEMO_EVENTS.filter(event => event.day === day.name).map(event => (
                  <div 
                    key={event.id}
                    className={cn(
                      "mt-2 p-2 rounded text-xs",
                      event.type === 'meeting' ? "bg-blue-100 dark:bg-blue-900/50" :
                      event.type === 'review' ? "bg-green-100 dark:bg-green-900/50" :
                      "bg-orange-100 dark:bg-orange-900/50"
                    )}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                  </div>
                ))}
              </Card>
            ))}
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
                      {hour === 8 && (
                        <div className="bg-primary/20 text-primary rounded-md px-3 py-1">
                          <span className="text-sm font-medium">Team Meeting</span>
                        </div>
                      )}
                      {hour === 14 && (
                        <div className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-md px-3 py-1">
                          <span className="text-sm font-medium">Project Review</span>
                        </div>
                      )}
                      {hour === 11 && (
                        <div className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-md px-3 py-1">
                          <span className="text-sm font-medium">Client Call</span>
                        </div>
                      )}
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