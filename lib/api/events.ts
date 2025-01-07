import { supabase } from "@/lib/supabase/client";
import { Event, CreateEventInput } from "@/types/events";
import { format, parseISO } from "date-fns";

// Demo events for testing
const DEMO_EVENTS: Event[] = [
  {
    id: "1",
    title: "Weekly Team Sync",
    description: "Review progress and discuss blockers",
    startTime: "10:00",
    duration: 60,
    date: "2024-01-02",
    type: "meeting",
    projectId: "project-1",
    projectName: "DeFi Platform",
    attendees: [
      { id: "user-1", name: "John Doe", avatar: "/avatars/john.jpg" },
      { id: "user-2", name: "Jane Smith", avatar: "/avatars/jane.jpg" },
    ],
    isVirtual: true,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    createdBy: { id: "user-1", name: "John Doe" },
  },
  {
    id: "2",
    title: "Code Review",
    description: "Review new authentication implementation",
    startTime: "14:00",
    duration: 60,
    date: "2024-01-03",
    type: "review",
    projectId: "project-1",
    projectName: "DeFi Platform",
    attendees: [
      { id: "user-1", name: "John Doe", avatar: "/avatars/john.jpg" },
      { id: "user-3", name: "Mike Johnson", avatar: "/avatars/mike.jpg" },
    ],
    isVirtual: true,
    meetingLink: "https://meet.google.com/xyz-abcd-efg",
    createdBy: { id: "user-3", name: "Mike Johnson" },
  },
  {
    id: "3",
    title: "Client Presentation",
    description: "Present MVP to stakeholders",
    startTime: "11:30",
    duration: 60,
    date: "2024-01-04",
    type: "call",
    projectId: "project-2",
    projectName: "NFT Marketplace",
    attendees: [
      { id: "user-1", name: "John Doe", avatar: "/avatars/john.jpg" },
      { id: "user-2", name: "Jane Smith", avatar: "/avatars/jane.jpg" },
      { id: "user-4", name: "Sarah Wilson", avatar: "/avatars/sarah.jpg" },
    ],
    location: "Conference Room A",
    createdBy: { id: "user-2", name: "Jane Smith" },
  },
  {
    id: "4",
    title: "Sprint Deadline",
    description: "Complete all sprint tasks",
    startTime: "17:00",
    duration: 60,
    date: "2024-01-05",
    type: "deadline",
    projectId: "project-1",
    projectName: "DeFi Platform",
    createdBy: { id: "user-1", name: "John Doe" },
  },
];

export async function getUserEvents(userId: string): Promise<Event[]> {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        creator:creator_id (
          id,
          email
        ),
        attendees:event_attendees (
          user:user_id (
            id,
            email
          )
        )
      `)
      .or(`creator_id.eq.${userId},event_attendees.user_id.eq.${userId})`)
      .order('date', { ascending: true });

    if (error) throw error;

    return events.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: format(parseISO(event.date), 'yyyy-MM-dd'),
      startTime: format(parseISO(event.start_time), 'HH:mm'),
      duration: event.duration,
      type: event.type,
      projectId: event.project_id,
      projectName: event.project_name || 'Unknown Project',
      location: event.location,
      isVirtual: event.is_virtual,
      meetingLink: event.meeting_link,
      createdBy: {
        id: event.creator?.id,
        name: event.creator?.email || 'Unknown',
      },
      attendees: event.attendees?.map((attendee: any) => ({
        id: attendee.user?.id,
        name: attendee.user?.email || 'Unknown',
      })) || [],
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function createEvent(eventData: CreateEventInput): Promise<Event | null> {
  try {
    // First, create the event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        start_time: eventData.startTime,
        duration: eventData.duration,
        type: eventData.type,
        project_id: eventData.projectId,
        project_name: eventData.projectName,
        location: eventData.location,
        is_virtual: eventData.isVirtual,
        meeting_link: eventData.meetingLink,
        creator_id: eventData.createdBy.id,
      })
      .select()
      .single();

    if (eventError) throw eventError;

    // Then, add attendees
    if (event && eventData.attendees?.length) {
      const attendeePromises = eventData.attendees.map(attendee =>
        supabase.from('event_attendees').insert({
          event_id: event.id,
          user_id: attendee.id,
          status: 'accepted',
        })
      );

      await Promise.all(attendeePromises);
    }

    // Return the created event
    return {
      ...eventData,
      id: event.id,
    };
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
}

export async function updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event | null> {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .update({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        start_time: eventData.startTime,
        duration: eventData.duration,
        type: eventData.type,
        project_id: eventData.projectId,
        location: eventData.location,
        is_virtual: eventData.isVirtual,
        meeting_link: eventData.meetingLink,
      })
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;

    return event as Event;
  } catch (error) {
    console.error('Error updating event:', error);
    return null;
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
}
