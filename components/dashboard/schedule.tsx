"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
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

const DAYS = [
  { name: "Sunday", short: "Sun", initial: "S", date: "16" },
  { name: "Monday", short: "Mon", initial: "M", date: "17" },
  { name: "Tuesday", short: "Tue", initial: "T", date: "18" },
  { name: "Wednesday", short: "Wed", initial: "W", date: "19" },
  { name: "Thursday", short: "Thu", initial: "T", date: "20" },
  { name: "Friday", short: "Fri", initial: "F", date: "21" },
  { name: "Saturday", short: "Sat", initial: "S", date: "22" },
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
          <Input id="description" placeholder="Add description" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Create Event</Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function CalendarView() {
  const [view, setView] = useState<'week' | 'day'>('week');

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
          <div className="h-[300px] overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {Array.from({ length: 6 }).map((_, i) => {
                const hour = i + 6;
                return (
                  <Card 
                    key={hour} 
                    className="p-4 hover:shadow-md cursor-pointer transition-all hover:bg-accent"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {hour.toString().padStart(2, '0')}:00
                      </span>
                      {hour === 8 && (
                        <div className="bg-primary/20 text-primary rounded-md px-3 py-1">
                          <span className="text-sm font-medium">Team Meeting</span>
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