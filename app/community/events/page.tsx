"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Globe,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  type: "online" | "in-person" | "hybrid";
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  image: string;
  tags: string[];
  isRegistered?: boolean;
}

const events: Event[] = [
  {
    id: "1",
    title: "Web3 Developer Summit 2024",
    description: "Join us for a day of learning and networking with top Web3 developers",
    type: "hybrid",
    category: "Conference",
    date: "2024-01-15",
    time: "09:00",
    location: "San Francisco, CA + Virtual",
    organizer: "Web3 Community",
    attendees: 250,
    maxAttendees: 500,
    image: "/events/summit.jpg",
    tags: ["Web3", "Development", "Networking"],
  },
  // Add more events as needed
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleRegister = (eventId: string) => {
    // Add registration logic here
    toast.success("Successfully registered for the event!");
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "online":
        return <Video className="h-4 w-4" />;
      case "in-person":
        return <MapPin className="h-4 w-4" />;
      case "hybrid":
        return <Globe className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Community Events</h1>
          <p className="text-muted-foreground">
            Discover and join upcoming events
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Plan and schedule a new community event
              </DialogDescription>
            </DialogHeader>
            {/* Add event creation form here */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="in-person">In Person</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Conference">Conference</SelectItem>
            <SelectItem value="Workshop">Workshop</SelectItem>
            <SelectItem value="Meetup">Meetup</SelectItem>
            <SelectItem value="Hackathon">Hackathon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="flex flex-col">
            <div className="relative aspect-video">
              <img
                src={event.image}
                alt={event.title}
                className="object-cover w-full h-full rounded-t-lg"
              />
              <Badge
                className="absolute top-4 right-4 flex items-center gap-1"
                variant={
                  event.type === "online"
                    ? "default"
                    : event.type === "in-person"
                    ? "destructive"
                    : "secondary"
                }
              >
                {getEventTypeIcon(event.type)}
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
            </div>
            <CardHeader>
              <div className="space-y-1">
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {event.attendees}{" "}
                    {event.maxAttendees && `/ ${event.maxAttendees}`} attendees
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                className="w-full"
                variant={event.isRegistered ? "secondary" : "default"}
                onClick={() => handleRegister(event.id)}
              >
                {event.isRegistered ? "Registered" : "Register Now"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
