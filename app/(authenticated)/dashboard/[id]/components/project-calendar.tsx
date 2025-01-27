'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  visibility: 'public' | 'private';
  status: 'active' | 'completed' | 'archived';
  founder_id: string;
  created_at: string;
  updated_at: string;
}

interface ProjectCalendarProps {
  project: Project;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'milestone' | 'deadline' | 'meeting';
  description: string;
}

export function ProjectCalendar({ project }: ProjectCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Demo events
  const events: Event[] = [
    {
      id: '1',
      title: 'Project Kickoff',
      date: new Date(),
      type: 'meeting',
      description: 'Initial team meeting',
    },
    {
      id: '2',
      title: 'Phase 1 Deadline',
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      type: 'deadline',
      description: 'Complete initial phase',
    },
    {
      id: '3',
      title: 'First Milestone',
      date: new Date(new Date().setDate(new Date().getDate() + 14)),
      type: 'milestone',
      description: 'Release first version',
    },
  ];

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'milestone':
        return 'bg-green-100 text-green-800';
      case 'deadline':
        return 'bg-red-100 text-red-800';
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const selectedDateEvents = events.filter(
    event => event.date.toDateString() === date?.toDateString()
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calendar</CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            Events for {date?.toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No events scheduled for this date
            </p>
          ) : (
            <div className="space-y-6">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="mt-1">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge 
                        variant="secondary"
                        className={getEventTypeColor(event.type)}
                      >
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.date.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
