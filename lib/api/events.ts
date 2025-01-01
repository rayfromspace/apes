import { supabase } from "@/lib/supabase/client";
import { Event } from "@/types/events";

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
    date: "2024-01-05",
    type: "deadline",
    projectId: "project-1",
    projectName: "DeFi Platform",
    createdBy: { id: "user-1", name: "John Doe" },
  },
];

export async function getUserEvents(userId: string): Promise<Event[]> {
  try {
    console.log('Fetching events for user:', userId);

    // Get all events where the user is either the creator or an attendee
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select(`
        *,
        project:projects(id, name),
        attendees:event_attendees(
          user:profiles(id, full_name, avatar_url)
        ),
        created_by:profiles(id, full_name)
      `)
      .or(`created_by.eq.${userId},attendees.user.id.eq.${userId}`)
      .order('date', { ascending: true });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      throw eventsError;
    }

    console.log('Raw events data:', events);

    // Transform the data to match our Event type
    return events?.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startTime: event.start_time,
      duration: event.duration.replace(' minutes', ''),
      date: event.date,
      type: event.type,
      projectId: event.project?.id || event.project_id,
      projectName: event.project?.name || 'Default Project',
      attendees: event.attendees?.map(a => ({
        id: a.user.id,
        name: a.user.full_name,
        avatar: a.user.avatar_url,
      })) || [],
      location: event.location,
      isVirtual: event.is_virtual,
      meetingLink: event.meeting_link,
      createdBy: {
        id: event.created_by?.id || userId,
        name: event.created_by?.full_name || 'Unknown',
      },
    })) || [];

  } catch (error) {
    console.error('Error fetching user events:', error);
    return [];
  }
}

export async function createEvent(eventData: Omit<Event, 'id'>): Promise<Event | null> {
  try {
    console.log('Creating event with data:', eventData);

    // First, insert the event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert([{
        title: eventData.title,
        description: eventData.description,
        start_time: eventData.startTime,
        duration: `${eventData.duration} minutes`,
        date: eventData.date,
        type: eventData.type,
        project_id: eventData.projectId,
        is_virtual: eventData.isVirtual,
        meeting_link: eventData.meetingLink,
        created_by: eventData.createdBy.id,
      }])
      .select()
      .single();

    if (eventError) {
      console.error('Error creating event:', eventError);
      throw eventError;
    }

    console.log('Created event:', event);

    // If there are attendees, insert them
    if (eventData.attendees?.length) {
      const { error: attendeesError } = await supabase
        .from('event_attendees')
        .insert(
          eventData.attendees.map(attendee => ({
            event_id: event.id,
            user_id: attendee.id,
          }))
        );

      if (attendeesError) {
        console.error('Error adding attendees:', attendeesError);
        throw attendeesError;
      }
    }

    // Return the created event with the correct structure
    return {
      ...eventData,
      id: event.id,
    };

  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
}

export async function updateEvent(event: Event): Promise<Event | null> {
  try {
    // Update the event
    const { error: eventError } = await supabase
      .from('events')
      .update({
        title: event.title,
        description: event.description,
        start_time: event.startTime,
        duration: `${event.duration} minutes`,
        date: event.date,
        type: event.type,
        project_id: event.projectId,
        location: event.location,
        is_virtual: event.isVirtual,
        meeting_link: event.meetingLink,
      })
      .eq('id', event.id);

    if (eventError) throw eventError;

    // Update attendees
    if (event.attendees) {
      // First, remove all existing attendees
      const { error: deleteError } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', event.id);

      if (deleteError) throw deleteError;

      // Then insert new attendees
      const { error: attendeesError } = await supabase
        .from('event_attendees')
        .insert(
          event.attendees.map(attendee => ({
            event_id: event.id,
            user_id: attendee.id,
          }))
        );

      if (attendeesError) throw attendeesError;
    }

    return event;

  } catch (error) {
    console.error('Error updating event:', error);
    return null;
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    // Delete event attendees first (due to foreign key constraint)
    const { error: attendeesError } = await supabase
      .from('event_attendees')
      .delete()
      .eq('event_id', eventId);

    if (attendeesError) throw attendeesError;

    // Then delete the event
    const { error: eventError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (eventError) throw eventError;

    return true;

  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
}
