import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Event, CreateEventInput } from '@/types/events';
import { format, parseISO } from 'date-fns';

interface EventStore {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (event: CreateEventInput) => Promise<Event | null>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<Event | null>;
  deleteEvent: (id: string) => Promise<boolean>;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
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
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedEvents: Event[] = events.map((event) => ({
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
          id: event.creator.id,
          name: event.creator.email,
        },
        attendees: event.attendees.map((attendee: any) => ({
          id: attendee.user.id,
          name: attendee.user.email,
        })),
      }));

      set({ events: formattedEvents, isLoading: false });
    } catch (error) {
      console.error('Error fetching events:', error);
      set({ error: 'Failed to fetch events', isLoading: false });
    }
  },

  createEvent: async (eventInput: CreateEventInput) => {
    set({ isLoading: true, error: null });
    try {
      // Format the event data for Supabase
      const { data: event, error } = await supabase
        .from('events')
        .insert({
          title: eventInput.title,
          description: eventInput.description,
          date: eventInput.date,
          start_time: eventInput.startTime,
          duration: eventInput.duration,
          type: eventInput.type,
          project_id: eventInput.projectId,
          project_name: eventInput.projectName,
          location: eventInput.location,
          is_virtual: eventInput.isVirtual,
          meeting_link: eventInput.meetingLink,
          creator_id: eventInput.createdBy.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (event && eventInput.attendees) {
        // Add attendees
        const attendeePromises = eventInput.attendees.map((attendee) =>
          supabase.from('event_attendees').insert({
            event_id: event.id,
            user_id: attendee.id,
            status: 'accepted',
          })
        );

        await Promise.all(attendeePromises);
      }

      // Fetch updated events
      await get().fetchEvents();

      const newEvent: Event = {
        ...eventInput,
        id: event.id,
      };

      set({ isLoading: false });
      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      set({ error: 'Failed to create event', isLoading: false });
      return null;
    }
  },

  updateEvent: async (id: string, eventUpdate: Partial<Event>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: event, error } = await supabase
        .from('events')
        .update({
          title: eventUpdate.title,
          description: eventUpdate.description,
          date: eventUpdate.date,
          start_time: eventUpdate.startTime,
          duration: eventUpdate.duration,
          type: eventUpdate.type,
          project_id: eventUpdate.projectId,
          location: eventUpdate.location,
          is_virtual: eventUpdate.isVirtual,
          meeting_link: eventUpdate.meetingLink,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Fetch updated events
      await get().fetchEvents();

      set({ isLoading: false });
      return event as Event;
    } catch (error) {
      console.error('Error updating event:', error);
      set({ error: 'Failed to update event', isLoading: false });
      return null;
    }
  },

  deleteEvent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      set({ error: 'Failed to delete event', isLoading: false });
      return false;
    }
  },
}));
